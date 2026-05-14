<template>
  <div class="payment-result-page">
    <Navbar />

    <div class="result-shell">
      <div v-if="paymentStatus === 'success'" class="result-card success-state">
        <div class="status-icon success-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#22c55e" />
            <path d="M8 12.5l2.5 2.5L16 9.5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>

        <h1 class="result-title">Thanh toán thành công</h1>
        <p class="result-message">Booking của bạn đã được xác nhận. Chúng tôi đã ghi nhận thanh toán thành công.</p>

        <div v-if="bookingInfo" class="detail-box">
          <h3>Thông tin giao dịch</h3>
          <div class="detail-row">
            <span>Mã booking</span>
            <strong>#{{ bookingInfo.bookingId }}</strong>
          </div>
          <div class="detail-row">
            <span>Số tiền đã thanh toán</span>
            <strong>{{ formatPrice(bookingInfo.amount) }}</strong>
          </div>
          <div class="detail-row">
            <span>Trạng thái</span>
            <strong class="status-chip paid">Đã thanh toán</strong>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="goToBookings" class="primary-btn">Xem booking của tôi</button>
          <button @click="goHome" class="secondary-btn">Về trang chủ</button>
        </div>
      </div>

      <div v-else-if="paymentStatus === 'loading'" class="result-card loading-state">
        <div class="status-icon loading-icon">
          <div class="spinner"></div>
        </div>
        <h1 class="result-title">Đang xác nhận thanh toán...</h1>
        <p class="result-message">Vui lòng chờ trong giây lát, hệ thống đang đối soát kết quả từ PayOS.</p>
      </div>

      <div v-else-if="paymentStatus === 'error'" class="result-card error-state">
        <div class="status-icon error-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#ef4444" />
            <path d="M15 9L9 15M9 9l6 6" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>

        <h1 class="result-title">Không thể xác nhận thanh toán</h1>
        <p class="result-message">{{ errorMessage }}</p>

        <div class="note-box">
          <p><strong>Lưu ý:</strong></p>
          <ul>
            <li>Nếu bạn đã trừ tiền, vui lòng chờ vài phút rồi kiểm tra lại booking.</li>
            <li>Nếu thanh toán chưa hoàn tất, bạn có thể thực hiện lại giao dịch.</li>
          </ul>
        </div>

        <div class="action-buttons">
          <button @click="goToBookings" class="primary-btn">Xem booking của tôi</button>
          <button @click="goHome" class="secondary-btn">Về trang chủ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { apiFetch } from '../utils/apiClient.js'

const router = useRouter()
const route = useRoute()

const paymentStatus = ref('loading') // 'loading', 'success', 'error'
const bookingInfo = ref(null)
const errorMessage = ref('')

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price) || 0).replace('₫', 'đ')
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
    const response = await apiFetch(`/api/payment-service/payos/success?${query.toString()}`, {
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
.payment-result-page {
  min-height: 100vh;
  background: #f8f5ef;
}

.result-shell {
  max-width: 920px;
  margin: 0 auto;
  padding: 6rem 1rem 2rem;
}

.result-card {
  text-align: center;
  background: #f8f6f2;
  border-radius: 24px;
  border: 1px solid #e2dcd3;
  padding: 2.2rem 1.8rem;
}

.status-icon {
  width: 104px;
  height: 104px;
  margin: 0 auto 1.35rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon svg {
  width: 100%;
  height: 100%;
}

.loading-icon {
  border-radius: 50%;
  background: #f4ecdf;
}

.spinner {
  width: 58px;
  height: 58px;
  border: 5px solid #e3dbce;
  border-top-color: #75553c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.result-title {
  margin: 0;
  color: #2f2418;
  font-size: clamp(1.8rem, 2.8vw, 2.9rem);
  font-weight: 700;
}

.result-message {
  margin: 0.9rem auto 0;
  max-width: 760px;
  color: #6f6457;
  font-size: 1.15rem;
  line-height: 1.65;
}

.detail-box,
.note-box {
  margin: 1.8rem auto 0;
  max-width: 820px;
  text-align: left;
  background: #f2ede5;
  border: 1px solid #ddd4c7;
  border-radius: 18px;
  padding: 1.2rem 1.25rem;
}

.detail-box h3 {
  margin: 0 0 0.75rem;
  color: #3c2f23;
  font-size: 1.28rem;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.78rem 0;
  border-top: 1px dashed #d3c7b8;
}

.detail-row:first-of-type {
  border-top: none;
}

.detail-row span {
  color: #6f6357;
  font-size: 1rem;
}

.detail-row strong {
  color: #2d2217;
  font-size: 1.02rem;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.25rem 0.8rem;
  font-size: 0.86rem;
  border: 1px solid transparent;
}

.status-chip.paid {
  color: #0f6a3d;
  background: #dcfce7;
  border-color: #b7ebca;
}

.note-box p {
  margin: 0 0 0.5rem;
  color: #3f3326;
}

.note-box ul {
  margin: 0;
  padding-left: 1rem;
  color: #5f5245;
  display: grid;
  gap: 0.4rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1.8rem;
}

.primary-btn,
.secondary-btn {
  min-width: 220px;
  padding: 0.85rem 1.4rem;
  border-radius: 14px;
  border: 1px solid transparent;
  font-weight: 700;
  font-size: 1.06rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-btn {
  background: #75553c;
  color: #fff;
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(117, 85, 60, 0.25);
}

.secondary-btn {
  background: #ebe6dd;
  color: #3d2f22;
  border-color: #d6ccbe;
}

.secondary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 14px rgba(61, 47, 34, 0.12);
}

@media (max-width: 640px) {
  .result-shell {
    padding: 5rem 0.85rem 1.3rem;
  }

  .result-card {
    padding: 1.6rem 1rem;
    border-radius: 18px;
  }

  .result-title {
    font-size: 1.8rem;
  }

  .result-message {
    font-size: 1rem;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }
}
</style>
