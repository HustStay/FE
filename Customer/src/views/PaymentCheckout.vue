<template>
  <div class="payment-checkout-page">
    <Navbar />

    <div class="container">
      <div class="checkout-card">
        <h1 class="title">Quét QR để thanh toán</h1>
        <p class="subtitle">Vui lòng dùng app ngân hàng hỗ trợ VietQR hoặc mở trang PayOS để hoàn tất thanh toán.</p>

        <div v-if="loading" class="loading">Đang tải thông tin thanh toán...</div>
        <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

        <template v-else>
          <div class="qr-wrapper">
            <img :src="qrUrl" alt="PayOS QR" class="qr-image" />
          </div>

          <div class="info">
            <div class="row"><span>Mã booking:</span><strong>#{{ paymentInfo.bookingId }}</strong></div>
            <div class="row"><span>Order code:</span><strong>{{ paymentInfo.orderCode }}</strong></div>
            <div class="row"><span>Số tiền:</span><strong>{{ formatPrice(paymentInfo.amount) }}</strong></div>
          </div>

          <div class="actions">
            <button class="primary-btn" @click="openPayOSPage">Mở trang thanh toán PayOS</button>
            <button class="secondary-btn" @click="goToBookings">Xem booking của tôi</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const errorMessage = ref('')
const paymentInfo = ref({
  bookingId: null,
  orderCode: null,
  amount: 0,
  checkoutUrl: ''
})

const qrUrl = computed(() => {
  if (!paymentInfo.value.checkoutUrl) return ''
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(paymentInfo.value.checkoutUrl)}`
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0).replace('₫', 'đ')
}

const openPayOSPage = () => {
  if (!paymentInfo.value.checkoutUrl) return
  window.location.href = paymentInfo.value.checkoutUrl
}

const goToBookings = () => {
  router.push('/bookings')
}

const loadPaymentInfo = async () => {
  try {
    const savedPayment = sessionStorage.getItem('pendingPayment')
    const orderCode = route.query.orderCode

    if (savedPayment) {
      const parsed = JSON.parse(savedPayment)
      paymentInfo.value = {
        bookingId: parsed.bookingId,
        orderCode: parsed.orderCode,
        amount: parsed.amount,
        checkoutUrl: parsed.checkoutUrl
      }
      return
    }

    if (!orderCode) {
      errorMessage.value = 'Không tìm thấy thông tin phiên thanh toán.'
      return
    }

    const token = localStorage.getItem('token')
    const response = await fetch(`/api/payment-service/payos/payment/${orderCode}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      errorMessage.value = 'Không thể tải thông tin phiên thanh toán.'
      return
    }

    const payment = await response.json()
    paymentInfo.value = {
      bookingId: payment.bookingId,
      orderCode: payment.sessionId || orderCode,
      amount: payment.amount,
      checkoutUrl: payment.sessionUrl
    }
  } catch (error) {
    console.error('❌ Error loading payment info:', error)
    errorMessage.value = 'Đã xảy ra lỗi khi tải thông tin thanh toán.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPaymentInfo()
})
</script>

<style scoped>
.container {
  max-width: 760px;
  margin: 0 auto;
  padding: 6rem 1rem 3rem;
}

.checkout-card {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.title {
  margin: 0 0 0.5rem;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.loading,
.error {
  margin: 2rem 0;
}

.error {
  color: #dc2626;
}

.qr-wrapper {
  display: flex;
  justify-content: center;
}

.qr-image {
  width: 320px;
  height: 320px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  background: #fff;
}

.info {
  margin: 1.5rem auto;
  max-width: 420px;
  text-align: left;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn,
.secondary-btn {
  border: none;
  border-radius: 10px;
  padding: 0.85rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
}

.primary-btn {
  background: linear-gradient(135deg, #22a6d6, #1a8bb5);
  color: #fff;
}

.secondary-btn {
  background: #f3f4f6;
  color: #111827;
}
</style>
