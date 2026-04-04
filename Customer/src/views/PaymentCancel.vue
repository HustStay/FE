<template>
  <div class="payment-cancel-page">
    <Navbar />

    <div class="container">
      <div class="cancel-content">
        <div class="cancel-icon">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#f59e0b"/>
            <path d="M12 8v4M12 16h.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h1 class="cancel-title">Thanh toán đã bị hủy</h1>
        <p class="cancel-message">
          Bạn đã hủy quá trình thanh toán. Booking của bạn chưa được xác nhận và sẽ không được giữ phòng.
        </p>

        <div class="info-box">
          <h3>Thông tin</h3>
          <ul>
            <li>Không có khoản phí nào được thu từ tài khoản của bạn</li>
            <li>Bạn có thể thực hiện lại việc đặt phòng bất cứ lúc nào</li>
            <li>Nếu cần hỗ trợ, vui lòng liên hệ với chúng tôi</li>
          </ul>
        </div>

        <div class="action-buttons">
          <button @click="backToHotel" class="primary-btn">
            <span class="btn-icon">🏨</span>
            Quay lại đặt phòng
          </button>
          <button @click="goHome" class="secondary-btn">
            <span class="btn-icon">🏠</span>
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

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
  console.log('💳 Payment cancelled - User redirected from Stripe checkout')
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 6rem 1rem 3rem;
}

.cancel-content {
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.cancel-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.cancel-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
}

.cancel-message {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.info-box {
  background: #fffbeb;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
  text-align: left;
}

.info-box h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #92400e;
  text-align: center;
}

.info-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-box li {
  padding: 0.5rem 0;
  color: #78350f;
  position: relative;
  padding-left: 1.5rem;
}

.info-box li::before {
  content: "•";
  color: #f59e0b;
  font-weight: bold;
  position: absolute;
  left: 0;
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

  .cancel-content {
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
}
</style>