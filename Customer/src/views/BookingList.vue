<template>
  <div class="bookings-page">
    <Navbar />
    
    <div class="bookings-container">
      <div class="page-header">
        <div class="breadcrumb">Hồ sơ của tôi</div>
        <div class="header-row">
          <div>
            <h1 class="title">Đặt phòng của tôi</h1>
            <p class="subtitle">Theo dõi mọi chuyến đi từ một nơi duy nhất.</p>
          </div>
          <button class="btn-new-booking">Đặt chuyến mới</button>
        </div>
      </div>

      <div class="tabs">
        <button class="tab" :class="{ active: activeTab === 'upcoming' }" @click="activeTab = 'upcoming'">Sắp tới</button>
        <button class="tab" :class="{ active: activeTab === 'completed' }" @click="activeTab = 'completed'">Đã hoàn tất</button>
        <button class="tab" :class="{ active: activeTab === 'cancelled' }" @click="activeTab = 'cancelled'">Đã huỷ</button>
      </div>

      <div class="bookings-list">
        <div v-if="loading" class="loading"><p>Đang tải...</p></div>
        
        <div v-else-if="filteredBookings.length === 0" class="empty-state">
          <div class="empty-icon">🏨</div>
          <h3>Không có đặt phòng nào</h3>
          <p>Bạn chưa có đặt phòng nào trong mục này.</p>
        </div>

        <div v-else class="booking-cards">
          <div v-for="booking in filteredBookings" :key="booking.id" class="booking-card">
            <div class="card-image-wrap">
              <div class="card-badge" :class="getStatusClass(booking.status)">{{ getStatusText(booking.status) }}</div>
              <img :src="booking.hotelImage" :alt="booking.hotelName" class="card-img" />
            </div>
            
            <div class="card-body">
              <h3 class="hotel-name">{{ booking.hotelName }}</h3>
              <div class="info-row">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{{ booking.location }}</span>
              </div>
              <div class="date-strip">
                <div class="date-item">
                  <div class="date-label">Nhận phòng</div>
                  <div class="date-val">{{ formatDate(booking.checkInDate) }}</div>
                </div>
                <div class="date-arrow">→</div>
                <div class="date-item">
                  <div class="date-label">Trả phòng</div>
                  <div class="date-val">{{ formatDate(booking.checkOutDate) }}</div>
                </div>
                <div class="date-item">
                  <div class="date-label">Khách</div>
                  <div class="date-val">{{ booking.guests }} người</div>
                </div>
              </div>
            </div>

            <div class="card-side">
              <div class="total-label">Tổng tiền</div>
              <div class="total-amount">{{ booking.totalAmount ? booking.totalAmount.toLocaleString('vi-VN') + 'đ' : '—' }}</div>
              <button class="btn-detail" @click="showBookingDetail(booking)">Chi tiết →</button>
              <button
                v-if="canPayBooking(booking)"
                class="btn-pay-inline"
                @click="goToPaymentCheckout(booking)"
              >Thanh toán ngay</button>
              <button 
                v-if="booking.status === 'CONFIRMED' || booking.status === 'PENDING'"
                class="btn-cancel-inline"
                :disabled="!canCancelBooking(booking)"
                @click="cancelBooking(booking)"
              >Huỷ đặt phòng</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Detail Modal -->
    <div v-if="selectedBooking" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">×</button>
        <h2 class="modal-title">{{ selectedBooking.hotelName }}</h2>
        <div class="modal-image">
          <img :src="selectedBooking.hotelImage || 'https://via.placeholder.com/500x300'" :alt="selectedBooking.hotelName" />
          <div class="modal-badge" :class="getStatusClass(selectedBooking.status)">{{ getStatusText(selectedBooking.status) }}</div>
        </div>
        <div class="modal-details">
          <div class="detail-row">
            <div class="detail-label">Địa điểm</div>
            <div class="detail-value">{{ selectedBooking.location }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Thời gian</div>
            <div class="detail-value">
              <div>Nhận phòng: {{ formatDate(selectedBooking.checkInDate) }}</div>
              <div>Trả phòng: {{ formatDate(selectedBooking.checkOutDate) }}</div>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Số khách</div>
            <div class="detail-value">{{ selectedBooking.guests }} khách</div>
          </div>
        </div>
        <div class="modal-actions">
          <button
            v-if="canPayBooking(selectedBooking)"
            class="btn-pay"
            @click="goToPaymentCheckout(selectedBooking)"
          >Thanh toán ngay</button>
          <button 
            v-if="selectedBooking.status === 'CONFIRMED' || selectedBooking.status === 'PENDING'"
            class="btn-cancel" 
            :disabled="!canCancelBooking(selectedBooking)"
            @click="cancelBooking(selectedBooking)"
          >{{ canCancelBooking(selectedBooking) ? 'Hủy đặt phòng' : 'Không thể hủy (< 7 ngày)' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { apiFetch } from '../utils/apiClient.js'

const router = useRouter()
const activeTab = ref('all')
const bookings = ref([])
const loading = ref(false)
const selectedBooking = ref(null)

const pickFirst = (...values) => {
  for (const value of values) {
    if (value === undefined || value === null) continue
    const normalized = String(value).trim()
    if (normalized) return normalized
  }
  return ''
}

const asNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const getNights = (checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate)
  const checkOut = new Date(checkOutDate)
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) return 1
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  return nights > 0 ? nights : 1
}

const getBookingOrderCode = (booking) => {
  return pickFirst(
    booking.orderCode,
    booking.sessionId,
    booking.paymentSessionId,
    booking.payment?.sessionId,
    booking.payment?.orderCode
  )
}

const getBookingCheckoutUrl = (booking) => {
  return pickFirst(
    booking.checkoutUrl,
    booking.paymentUrl,
    booking.sessionUrl,
    booking.payment?.checkoutUrl,
    booking.payment?.sessionUrl
  )
}

// Fetch bookings from API
const fetchBookings = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    console.log('Fetching bookings from API...')
    console.log('Token exists:', !!token)
    console.log(' UserId:', userId)

    if (!token) {
      console.error('No token found! Redirecting to login...')
      router.push('/')
      return
    }

    if (!userId) {
      console.warn('No userId found! This might cause issues.')
    }

    const response = await apiFetch('/api/booking-service/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('Bookings API Response:', response.status, response.statusText)
    console.log('Request URL:', response.url)

    if (response.ok) {
      const data = await response.json()
      console.log('Raw API data:', data)

      // Map API response to UI format
      if (data.bookings && Array.isArray(data.bookings)) {
        bookings.value = data.bookings.map(booking => {
          console.log('Mapping booking:', booking)
          return {
            id: booking.id,
            hotelId: booking.hotelId || booking.id,
            hotelName: booking.hotelName || 'Chưa có tên',
            location: booking.address || 'Chưa có địa chỉ',
            hotelImage: booking.imageUrl || 'https://via.placeholder.com/500x300',
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
            guests: booking.guests,
            status: booking.status,
            totalAmount: asNumber(booking.totalAmount, asNumber(booking.amount)),
            orderCode: getBookingOrderCode(booking),
            checkoutUrl: getBookingCheckoutUrl(booking),
            roomSubtotal: asNumber(booking.roomSubtotal, asNumber(booking.totalAmount, asNumber(booking.amount))),
            taxFee: asNumber(booking.taxFee),
            serviceFee: asNumber(booking.serviceFee)
          }
        })
        console.log('Mapped bookings:', bookings.value)
      } else if (data.message === 'No bookings found') {
        bookings.value = []
      } else {
        console.log('No bookings array in response')
        bookings.value = []
      }
    } else {
      const errorText = await response.text()
      console.error('API Error:', errorText)
      bookings.value = []
    }
  } catch (error) {
    console.error('Error fetching bookings:', error)
    bookings.value = []
  } finally {
    loading.value = false
  }
}

// Filter bookings based on active tab
const filteredBookings = computed(() => {
  console.log(' Filtering bookings. Active tab:', activeTab.value)
  console.log(' All bookings:', bookings.value)

  const filtered = bookings.value.filter(booking => {
    if (activeTab.value === 'all') {
      return true
    } else if (activeTab.value === 'upcoming') {
      return booking.status === 'CONFIRMED' || booking.status === 'PENDING'
    } else if (activeTab.value === 'completed') {
      return booking.status === 'COMPLETED' || booking.status === 'CHECKED_IN'
    } else if (activeTab.value === 'cancelled') {
      return booking.status === 'CANCELLED'
    }

    return false
  })

  console.log('Filtered bookings:', filtered)
  return filtered
})

const getStatusClass = (status) => {
  const statusMap = {
    'PENDING': 'status-upcoming',
    'CONFIRMED': 'status-upcoming',
    'CHECKED_IN': 'status-completed',
    'COMPLETED': 'status-completed',
    'CANCELLED': 'status-cancelled'
  }
  return statusMap[status] || 'status-upcoming'
}

const getStatusText = (status) => {
  const statusMap = {
    'PENDING': 'Chờ xác nhận',
    'CONFIRMED': 'Sắp đến',
    'CHECKED_IN': 'Đã nhận phòng',
    'COMPLETED': 'Đã hoàn thành',
    'CANCELLED': 'Đã hủy'
  }
  return statusMap[status] || 'Chờ xác nhận'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const showBookingDetail = (booking) => {
  selectedBooking.value = booking
}

const closeModal = () => {
  selectedBooking.value = null
}

const canPayBooking = (booking) => {
  if (!booking) return false
  return booking.status === 'PENDING' || booking.status === 'CONFIRMED'
}

const goToPaymentCheckout = (booking) => {
  const orderCode = getBookingOrderCode(booking)
  const checkoutUrl = getBookingCheckoutUrl(booking)

  sessionStorage.setItem('pendingPayment', JSON.stringify({
    bookingId: booking.id,
    orderCode: orderCode || undefined,
    checkoutUrl: checkoutUrl || '',
    amount: asNumber(booking.totalAmount),
    hotelName: booking.hotelName,
    hotelImage: booking.hotelImage,
    location: booking.location,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
    guests: asNumber(booking.guests, 1),
    nights: getNights(booking.checkInDate, booking.checkOutDate),
    roomSubtotal: asNumber(booking.roomSubtotal, asNumber(booking.totalAmount)),
    taxFee: asNumber(booking.taxFee),
    serviceFee: asNumber(booking.serviceFee),
    totalAmount: asNumber(booking.totalAmount)
  }))

  const query = orderCode ? { orderCode } : {}
  closeModal()
  router.push({ path: '/payment/checkout', query })
}

const canCancelBooking = (booking) => {
  const now = new Date()
  const checkInDate = new Date(booking.checkInDate)
  const daysDiff = Math.floor((checkInDate - now) / (1000 * 60 * 60 * 24))
  return daysDiff >= 7
}

const cancelBooking = async (booking) => {
  if (!canCancelBooking(booking)) {
    alert('Không thể hủy đặt phòng trong vòng 7 ngày trước ngày nhận phòng')
    return
  }

  if (!confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) {
    return
  }

  try {
    const token = localStorage.getItem('token')

    const response = await apiFetch('/api/booking-service/bookings/status', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bookingId: booking.id.toString(),
        status: 'CANCELLED'
      })
    })

    const data = await response.json()
    
    if (response.ok && data.message === 'Booking status updated successfully') {
      alert('Hủy đặt phòng thành công')
      closeModal()
      fetchBookings() // Refresh bookings list
    } else {
      alert(data.message || 'Hủy đặt phòng thất bại')
    }
  } catch (error) {
    console.error('Error cancelling booking:', error)
    alert('Có lỗi xảy ra khi hủy đặt phòng')
  }
}

// const manageBooking = (booking) => {
//   // Navigate to booking management or show modal
//   console.log('Manage booking:', booking)
// }

onMounted(() => {
  fetchBookings()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.bookings-page {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: #FCFBF7;
  color: #1A1A1A;
}
.bookings-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 100px 24px 80px;
}

/* Page Header */
.page-header { margin-bottom: 36px; }
.breadcrumb { font-size: 0.8rem; color: #888; margin-bottom: 8px; }
.header-row { display: flex; align-items: flex-start; justify-content: space-between; }
.title { font-size: 2rem; font-weight: 700; margin: 0 0 6px 0; }
.subtitle { font-size: 0.9rem; color: #614638; margin: 0; }
.btn-new-booking {
  background: #614638; color: white; border: none;
  padding: 12px 24px; border-radius: 50px; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; transition: opacity 0.2s;
}
.btn-new-booking:hover { opacity: 0.85; }

/* Tabs */
.tabs { display: flex; margin-bottom: 32px; border-bottom: 1px solid #E5E5E5; }
.tab {
  padding: 12px 24px; background: transparent; border: none;
  border-bottom: 2px solid transparent; font-size: 0.95rem; font-weight: 500;
  color: #888; cursor: pointer; transition: all 0.2s; margin-bottom: -1px;
}
.tab:hover { color: #1A1A1A; }
.tab.active { color: #1A1A1A; font-weight: 700; border-bottom-color: #614638; }

/* Loading / Empty */
.loading { text-align: center; padding: 64px; color: #888; }
.empty-state { text-align: center; padding: 80px 24px; background: white; border-radius: 20px; }
.empty-icon { font-size: 3rem; margin-bottom: 16px; }
.empty-state h3 { font-size: 1.2rem; margin: 0 0 8px; }
.empty-state p { color: #888; margin: 0; }

/* Cards */
.booking-cards { display: flex; flex-direction: column; gap: 16px; }
.booking-card {
  display: flex; align-items: stretch; background: white;
  border-radius: 20px; overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border: 1px solid #E5E5E5; transition: box-shadow 0.2s;
}
.booking-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.09); }

/* Image */
.card-image-wrap { position: relative; width: 220px; flex-shrink: 0; }
.card-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.card-badge {
  position: absolute; top: 12px; left: 12px;
  padding: 4px 12px; border-radius: 50px;
  font-size: 0.75rem; font-weight: 600;
}
.status-upcoming { background: rgba(97,70,56,0.85); color: white; }
.status-completed { background: rgba(16,185,129,0.85); color: white; }
.status-cancelled { background: rgba(239,68,68,0.85); color: white; }

/* Body */
.card-body { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 10px; }
.hotel-name { font-size: 1.2rem; font-weight: 700; margin: 0; }
.info-row { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #666; }
.info-row svg { color: #888; flex-shrink: 0; }

.date-strip {
  display: flex; align-items: center; gap: 12px;
  margin-top: 8px; background: #F7F5F2; border-radius: 12px; padding: 12px 16px;
}
.date-item { display: flex; flex-direction: column; gap: 2px; }
.date-label { font-size: 0.72rem; color: #888; font-weight: 500; }
.date-val { font-size: 0.9rem; font-weight: 600; color: #1A1A1A; }
.date-arrow { color: #aaa; font-size: 1rem; padding: 0 4px; }

/* Side panel */
.card-side {
  width: 200px; flex-shrink: 0;
  padding: 24px 20px; display: flex; flex-direction: column;
  align-items: flex-end; justify-content: center; gap: 10px;
  border-left: 1px solid #F0EDE9;
}
.total-label { font-size: 0.75rem; color: #888; }
.total-amount { font-size: 1.3rem; font-weight: 700; color: #614638; text-align: right; }
.btn-detail {
  background: #614638; color: white; border: none;
  padding: 10px 18px; border-radius: 50px; font-size: 0.85rem; font-weight: 600;
  cursor: pointer; width: 100%; text-align: center; transition: opacity 0.2s;
}
.btn-detail:hover { opacity: 0.85; }
.btn-pay-inline {
  background: #75553c; color: white; border: none;
  padding: 10px 18px; border-radius: 50px; font-size: 0.85rem; font-weight: 600;
  cursor: pointer; width: 100%; text-align: center; transition: opacity 0.2s;
}
.btn-pay-inline:hover { opacity: 0.85; }
.btn-cancel-inline {
  background: transparent; color: #888; border: 1px solid #E5E5E5;
  padding: 8px 18px; border-radius: 50px; font-size: 0.82rem; font-weight: 500;
  cursor: pointer; width: 100%; text-align: center; transition: all 0.2s;
}
.btn-cancel-inline:hover:not(:disabled) { border-color: #c62828; color: #c62828; }
.btn-cancel-inline:disabled { opacity: 0.4; cursor: not-allowed; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.55);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 20px;
}
.modal-content {
  background: white; border-radius: 20px; max-width: 560px; width: 100%;
  max-height: 90vh; overflow-y: auto; position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal-close {
  position: absolute; top: 16px; right: 16px; width: 36px; height: 36px;
  border: none; background: #F7F5F2; border-radius: 50%; font-size: 20px;
  cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10;
}
.modal-title { font-size: 1.4rem; font-weight: 700; padding: 24px 24px 12px; margin: 0; }
.modal-image { position: relative; width: 100%; height: 260px; overflow: hidden; }
.modal-image img { width: 100%; height: 100%; object-fit: cover; }
.modal-badge {
  position: absolute; top: 14px; right: 14px;
  padding: 6px 16px; border-radius: 50px; font-size: 0.8rem; font-weight: 600;
}
.modal-details { padding: 20px 24px; }
.detail-row {
  display: flex; gap: 16px; margin-bottom: 16px;
  padding-bottom: 16px; border-bottom: 1px solid #F0EDE9;
}
.detail-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.detail-label { font-weight: 600; color: #444; min-width: 100px; font-size: 0.9rem; }
.detail-value { flex: 1; color: #666; font-size: 0.9rem; }
.detail-value div { margin-bottom: 4px; }
.modal-actions {
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.btn-pay {
  width: 100%; padding: 14px; background: #614638; border: none;
  border-radius: 12px; font-size: 0.95rem; font-weight: 600;
  color: white; cursor: pointer; transition: background 0.2s;
}
.btn-pay:hover { background: #503a2f; }
.btn-cancel {
  width: 100%; padding: 14px; background: #ef4444; border: none;
  border-radius: 12px; font-size: 0.95rem; font-weight: 600;
  color: white; cursor: pointer; transition: background 0.2s;
}
.btn-cancel:hover:not(:disabled) { background: #dc2626; }
.btn-cancel:disabled { background: #e0e0e0; color: #999; cursor: not-allowed; }

@media (max-width: 768px) {
  .booking-card { flex-direction: column; }
  .card-image-wrap { width: 100%; height: 200px; }
  .card-side { width: 100%; align-items: stretch; border-left: none; border-top: 1px solid #F0EDE9; }
  .total-amount { text-align: left; }
  .header-row { flex-direction: column; gap: 16px; }
  .date-strip { flex-wrap: wrap; }
}
</style>
