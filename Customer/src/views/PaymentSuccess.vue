<template>
  <div class="payment-success-page">
    <Navbar />

    <div class="container">
      <!-- Success State -->
      <div v-if="paymentStatus === 'success'" class="success-content">
        <div class="success-icon">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#4ade80"/>
            <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h1 class="success-title">Thanh toán thành công!</h1>
        <p class="success-message">
          Cảm ơn bạn đã đặt phòng. Booking của bạn đã được xác nhận và thanh toán thành công.
        </p>

        <div v-if="bookingInfo" class="booking-details">
          <h3>Thông tin đặt phòng</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">Mã booking:</span>
              <span class="value">#{{ bookingInfo.bookingId }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Số tiền đã thanh toán:</span>
              <span class="value">{{ formatPrice(bookingInfo.amount) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Trạng thái:</span>
              <span class="value success-status">Đã thanh toán</span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="goToBookings" class="primary-btn">
            Xem booking của tôi
          </button>
          <button @click="goHome" class="secondary-btn">
            Về trang chủ
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="paymentStatus === 'loading'" class="loading-content">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <h2>Đang xác nhận thanh toán...</h2>
        <p>Vui lòng chờ trong giây lát</p>
      </div>

      <!-- Error State -->
      <div v-else-if="paymentStatus === 'error'" class="error-content">
        <div class="error-icon">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#ef4444"/>
            <path d="M15 9l-6 6M9 9l6 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h1 class="error-title">Không thể xác nhận thanh toán</h1>
        <p class="error-message">{{ errorMessage }}</p>

        <div class="action-buttons">
          <button @click="goToBookings" class="primary-btn">
            Xem booking của tôi
          </button>
          <button @click="goHome" class="secondary-btn">
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const route = useRoute()

const paymentStatus = ref('loading') // 'loading', 'success', 'error'
const bookingInfo = ref(null)
const errorMessage = ref('')

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price).replace('₫', 'đ')
}

const goToBookings = () => {
  router.push('/bookings')
}

const goHome = () => {
  router.push('/home')
}

const verifyPayment = async () => {
  try {
    // PayOS trả về orderCode trong URL query params
    const orderCode = route.query.orderCode
    const status = String(route.query.status || '').toUpperCase()
    const code = String(route.query.code || '').toUpperCase()

    if (!orderCode) {
      paymentStatus.value = 'error'
      errorMessage.value = 'Không tìm thấy thông tin phiên thanh toán'
      return
    }

    console.log('🔍 Verifying PayOS payment for orderCode:', orderCode, 'status:', status, 'code:', code)

    const token = localStorage.getItem('token')
    const query = new URLSearchParams({ orderCode: String(orderCode) })
    if (status) query.set('status', status)

    // Gọi endpoint success để BE xác nhận booking ngay khi PayOS redirect về
    const response = await fetch(`/api/payment-service/payos/success?${query.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    console.log('📡 API Response status:', response.status, response.statusText)

    if (response.ok) {
      const paymentData = await response.json()
      console.log('✅ Payment data received:', paymentData)

      const paymentStatusFromApi = String(paymentData.status || '').toUpperCase()
      const isPaid = paymentStatusFromApi === 'PAID' || status === 'PAID' || code === '00'

      if (isPaid) {
        paymentStatus.value = 'success'
        bookingInfo.value = {
          bookingId: paymentData.bookingId || orderCode,
          amount: paymentData.amount || 0
        }
      } else {
        paymentStatus.value = 'error'
        errorMessage.value = `Thanh toán chưa hoàn tất. Trạng thái: ${paymentData.status || 'unknown'}`
      }
    } else {
      const errorData = await response.text()
      console.error('❌ Failed to verify payment. Response:', errorData)
      if (status === 'PAID' || code === '00') {
        paymentStatus.value = 'success'
        bookingInfo.value = {
          bookingId: orderCode,
          amount: 0
        }
      } else {
        paymentStatus.value = 'error'
        errorMessage.value = 'Không thể xác minh trạng thái thanh toán'
      }
    }
  } catch (error) {
    console.error('❌ Error verifying payment:', error)
    paymentStatus.value = 'error'
    errorMessage.value = 'Đã xảy ra lỗi khi xác minh thanh toán'
  }
}

onMounted(() => {
  sessionStorage.removeItem('pendingPayment')
  verifyPayment()
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 6rem 1rem 3rem;
}

.success-content,
.loading-content,
.error-content {
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.success-icon,
.error-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #e0e0e0;
  border-top-color: #22a6d6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-title,
.error-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
}

.success-message,
.error-message {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.loading-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.loading-content p {
  color: #666;
  font-size: 1rem;
}

.booking-details {
  background: #f8fafb;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
  border: 1px solid #e7eef1;
}

.booking-details h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e7eef1;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  font-weight: 700;
  color: #333;
}

.success-status {
  color: #4ade80;
  background: #dcfce7;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn,
.secondary-btn {
  padding: 0.875rem 2rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.primary-btn {
  background: linear-gradient(135deg, #22a6d6, #1a8bb5);
  color: white;
}

.primary-btn:hover {
  background: linear-gradient(135deg, #1a8bb5, #157a9e);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 166, 214, 0.3);
}

.secondary-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e7eef1;
}

.secondary-btn:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 1.1rem;
}

@media (max-width: 640px) {
  .container {
    padding: 4rem 1rem 2rem;
  }

  .success-content,
  .loading-content,
  .error-content {
    padding: 2rem 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
    max-width: 300px;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
