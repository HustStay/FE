<template>
  <div class="payment-result-page">
    <Navbar />

    <div class="result-shell">
      <div class="result-card warning-state">
        <div class="status-icon warning-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#f59e0b" />
            <path d="M12 7v6M12 17h.01" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>

        <h1 class="result-title">Thanh toán đã bị hủy</h1>
        <p class="result-message">Bạn đã hủy quá trình thanh toán. Booking chưa được xác nhận và sẽ không được giữ phòng.</p>

        <div class="info-box">
          <h3>Thông tin</h3>
          <ul>
            <li>Không có khoản phí nào được thu từ tài khoản của bạn</li>
            <li>Bạn có thể thực hiện lại việc đặt phòng bất cứ lúc nào</li>
            <li>Nếu cần hỗ trợ, vui lòng liên hệ với chúng tôi</li>
          </ul>
        </div>

        <div class="action-buttons">
          <button @click="backToHotel" class="primary-btn">Quay lại đặt phòng</button>
          <button @click="goHome" class="secondary-btn">Về trang chủ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { apiFetch } from '../utils/apiClient.js'

const router = useRouter()
const route = useRoute()

const backToHotel = () => {
  // Try to get hotel ID from session storage or route query
  const hotelId = sessionStorage.getItem('lastHotelId') || route.query.hotel_id
  if (hotelId) {
    router.push(`/hotel/${hotelId}`)
  } else {
    router.push('/home')
  }
}

const goHome = () => {
  router.push('/home')
}

onMounted(() => {
  sessionStorage.removeItem('pendingPayment')
  const orderCode = route.query.orderCode
  const token = localStorage.getItem('token')

  if (orderCode) {
    apiFetch(`/api/payment-service/payos/cancel/${orderCode}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch((error) => {
      console.error('❌ Failed to notify cancellation to payment service:', error)
    })
  }

  console.log('💳 Payment cancelled - User redirected from PayOS checkout')
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

.info-box {
  margin: 1.8rem auto 0;
  max-width: 820px;
  background: #f2ede5;
  border: 1px solid #ddd4c7;
  border-radius: 18px;
  padding: 1.2rem 1.25rem;
  text-align: left;
}

.info-box h3 {
  margin: 0 0 0.75rem;
  font-size: 1.28rem;
  font-weight: 700;
  color: #3c2f23;
}

.info-box ul {
  margin: 0;
  padding-left: 1rem;
  color: #5f5245;
  display: grid;
  gap: 0.45rem;
}

.info-box li {
  line-height: 1.5;
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

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .result-shell {
    padding: 4.5rem 0.6rem 1rem;
  }

  .status-icon {
    width: 80px;
    height: 80px;
  }

  .info-box {
    padding: 1rem;
  }
}
</style>
