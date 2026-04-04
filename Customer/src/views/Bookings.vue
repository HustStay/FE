<template>
  <div class="bookings-page">
    <Navbar />
    
    <div class="bookings-container">
      <div class="header">
        <h1 class="title">Đặt phòng của tôi</h1>
        <p class="subtitle">Quản lý và xem lại các đặt phòng của bạn</p>
      </div>

      <div class="tabs">
        <button 
          class="tab" 
          :class="{ active: activeTab === 'upcoming' }"
          @click="activeTab = 'upcoming'"
        >
          <img width="20" height="20" src="https://img.icons8.com/windows/32/calendar-minus.png" alt="calendar"/>
          Sắp đến
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'completed' }"
          @click="activeTab = 'completed'"
        >
          <img width="20" height="20" src="https://img.icons8.com/windows/32/checkmark.png" alt="completed"/>
          Đã hoàn thành
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'cancelled' }"
          @click="activeTab = 'cancelled'"
        >
          <img width="20" height="20" src="https://img.icons8.com/windows/32/cancel.png" alt="cancelled"/>
          Đã hủy
        </button>
      </div>

      <div class="bookings-list">
        <div v-if="loading" class="loading">Đang tải...</div>
        
        <div v-else-if="filteredBookings.length === 0" class="empty-state">
          <p>Không có đặt phòng nào</p>
        </div>

        <div v-else class="booking-cards">
          <div 
            v-for="booking in filteredBookings" 
            :key="booking.id"
            class="booking-card"
          >
            <div class="badge" :class="getStatusClass(booking.status)">
              {{ getStatusText(booking.status) }}
            </div>
            
            <div class="card-image">
              <img :src="booking.hotelImage || 'https://via.placeholder.com/500x300'" :alt="booking.hotelName" />
            </div>
            
            <div class="card-content">
              <h3 class="hotel-name">{{ booking.hotelName }}</h3>
              
              <div class="info-row">
                <img width="16" height="16" src="https://img.icons8.com/windows/32/marker.png" alt="location"/>
                <span>{{ booking.location }}</span>
              </div>
              
              <div class="info-row">
                <img width="16" height="16" src="https://img.icons8.com/windows/32/calendar.png" alt="calendar"/>
                <span>{{ formatDate(booking.checkInDate) }} - {{ formatDate(booking.checkOutDate) }}</span>
              </div>
              
              <div class="info-row">
                <img width="16" height="16" src="https://img.icons8.com/windows/32/user.png" alt="guests"/>
                <span>{{ booking.guests }} khách</span>
              </div>
              
              <div class="card-actions">
                <button class="btn-secondary" @click="showBookingDetail(booking)">Chi tiết</button>
              </div>
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
          <div class="modal-badge" :class="getStatusClass(selectedBooking.status)">
            {{ getStatusText(selectedBooking.status) }}
          </div>
        </div>
        
        <div class="modal-details">
          <div class="detail-row">
            <div class="detail-label">
              <img width="20" height="20" src="https://img.icons8.com/windows/32/marker.png" alt="location"/>
              Địa điểm
            </div>
            <div class="detail-value">{{ selectedBooking.location }}</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">
              <img width="20" height="20" src="https://img.icons8.com/windows/32/calendar.png" alt="calendar"/>
              Thời gian
            </div>
            <div class="detail-value">
              <div>Nhận phòng: {{ formatDate(selectedBooking.checkInDate) }}</div>
              <div>Trả phòng: {{ formatDate(selectedBooking.checkOutDate) }}</div>
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">
              <img width="20" height="20" src="https://img.icons8.com/windows/32/user.png" alt="guests"/>
              Số khách
            </div>
            <div class="detail-value">{{ selectedBooking.guests }} khách</div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button 
            v-if="selectedBooking.status === 'CONFIRMED'"
            class="btn-cancel" 
            :disabled="!canCancelBooking(selectedBooking)"
            @click="cancelBooking(selectedBooking)"
          >
            {{ canCancelBooking(selectedBooking) ? 'Hủy đặt phòng' : 'Không thể hủy (< 7 ngày)' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const activeTab = ref('upcoming')
const bookings = ref([])
const loading = ref(false)
const selectedBooking = ref(null)

// Mock data for bookings
const mockBookings = [
  {
    id: 1,
    hotelId: 1,
    hotelName: 'Sunset Beach Resort & Spa',
    location: 'Đà Nẵng, Việt Nam',
    hotelImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=300&fit=crop',
    checkInDate: '2025-12-15',
    checkOutDate: '2025-12-18',
    guests: 2,
    status: 'PENDING',
    roomType: 'DELUXE',
    totalRooms: 1
  },
  {
    id: 2,
    hotelId: 2,
    hotelName: 'Grand Hotel Central',
    location: 'Hà Nội, Việt Nam',
    hotelImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
    checkInDate: '2025-12-20',
    checkOutDate: '2025-12-23',
    guests: 3,
    status: 'PENDING',
    roomType: 'STANDARD',
    totalRooms: 2
  },
  {
    id: 3,
    hotelId: 3,
    hotelName: 'Paradise Beach Hotel',
    location: 'Nha Trang, Việt Nam',
    hotelImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&h=300&fit=crop',
    checkInDate: '2025-10-10',
    checkOutDate: '2025-10-13',
    guests: 2,
    status: 'COMPLETED',
    roomType: 'SUPERIOR',
    totalRooms: 1
  },
  {
    id: 4,
    hotelId: 4,
    hotelName: 'Luxury City View Hotel',
    location: 'Hồ Chí Minh, Việt Nam',
    hotelImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=300&fit=crop',
    checkInDate: '2025-09-05',
    checkOutDate: '2025-09-08',
    guests: 4,
    status: 'COMPLETED',
    roomType: 'DELUXE',
    totalRooms: 2
  },
  {
    id: 5,
    hotelId: 5,
    hotelName: 'Riverside Resort & Spa',
    location: 'Huế, Việt Nam',
    hotelImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop',
    checkInDate: '2025-11-01',
    checkOutDate: '2025-11-03',
    guests: 2,
    status: 'CANCELLED',
    roomType: 'STANDARD',
    totalRooms: 1
  }
]

// Fetch bookings from API
const fetchBookings = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    console.log('🔍 Fetching bookings from API...')
    console.log('Token exists:', !!token)
    console.log('👤 UserId:', userId)

    if (!token) {
      console.error('❌ No token found! Redirecting to login...')
      router.push('/')
      return
    }

    if (!userId) {
      console.warn('⚠️ No userId found! This might cause issues.')
    }

    const response = await fetch('/api/booking-service/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Auth-UserId': userId || '',
        'Content-Type': 'application/json'
      }
    })

    console.log('📡 Bookings API Response:', response.status, response.statusText)
    console.log('🔗 Request URL:', response.url)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Raw API data:', data)

      // Map API response to UI format
      if (data.bookings && Array.isArray(data.bookings)) {
        bookings.value = data.bookings.map(booking => {
          console.log('📝 Mapping booking:', booking)
          return {
            id: booking.id,
            hotelId: booking.hotelId || booking.id,
            hotelName: booking.hotelName || 'Chưa có tên',
            location: booking.address || 'Chưa có địa chỉ',
            hotelImage: booking.imageUrl || 'https://via.placeholder.com/500x300',
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
            guests: booking.guests,
            status: booking.status
          }
        })
        console.log('Mapped bookings:', bookings.value)
      } else {
        console.log('⚠️ No bookings array in response, using mock data')
        bookings.value = mockBookings
      }
    } else {
      const errorText = await response.text()
      console.error('❌ API Error:', errorText)
      console.log('📋 Falling back to mock data')
      bookings.value = mockBookings
    }
  } catch (error) {
    console.error('❌ Error fetching bookings:', error)
    console.log('📋 Falling back to mock data')
    bookings.value = mockBookings
  } finally {
    loading.value = false
  }
}

// Filter bookings based on active tab
const filteredBookings = computed(() => {
  console.log('🔄 Filtering bookings. Active tab:', activeTab.value)
  console.log('📋 All bookings:', bookings.value)

  const filtered = bookings.value.filter(booking => {
    if (activeTab.value === 'upcoming') {
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
    const userId = localStorage.getItem('userId')

    const response = await fetch('/api/booking-service/bookings/status', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Auth-UserId': userId,
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

const manageBooking = (booking) => {
  // Navigate to booking management or show modal
  console.log('Manage booking:', booking)
}

onMounted(() => {
  fetchBookings()
})
</script>

<style scoped>
.bookings-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.bookings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 24px 48px;
}

.header {
  margin-bottom: 32px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 15px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -1px;
}

.tab:hover {
  color: #1a1a1a;
  background: #f9fafb;
}

.tab.active {
  color: #1a1a1a;
  border-bottom-color: #22a6d6;
}

.tab img {
  filter: grayscale(100%);
  opacity: 0.6;
}

.tab.active img {
  filter: none;
  opacity: 1;
}

.loading {
  text-align: center;
  padding: 48px;
  font-size: 16px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-state p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.booking-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
  gap: 15px;
}

.booking-card {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.booking-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  z-index: 10;
  backdrop-filter: blur(8px);
}

.status-upcoming {
  background: rgba(34, 166, 214, 0.9);
  color: white;
}

.status-completed {
  background: rgba(16, 185, 129, 0.9);
  color: white;
}

.status-cancelled {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.card-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.booking-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 20px;
}

.hotel-name {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.info-row img {
  opacity: 0.6;
}

.card-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-secondary {
  flex: 1;
  padding: 10px 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-primary {
  flex: 1;
  padding: 10px 20px;
  background: #22a6d6;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #1d8bb8;
}

@media (max-width: 768px) {
  .bookings-container {
    padding: 80px 16px 32px;
  }

  .title {
    font-size: 24px;
  }

  .booking-cards {
    grid-template-columns: 1fr;
  }

  .tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tab {
    white-space: nowrap;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  z-index: 10;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #333;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  padding: 24px 24px 16px;
  margin: 0;
}

.modal-image {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.modal-details {
  padding: 24px;
}

.detail-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #333;
  min-width: 120px;
  font-size: 15px;
}

.detail-label img {
  opacity: 0.7;
}

.detail-value {
  flex: 1;
  color: #666;
  font-size: 15px;
}

.detail-value div {
  margin-bottom: 4px;
}

.detail-value div:last-child {
  margin-bottom: 0;
}

.modal-actions {
  padding: 0 24px 24px;
  display: flex;
  gap: 12px;
}

.btn-cancel {
  flex: 1;
  padding: 14px 24px;
  background: #ef4444;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover:not(:disabled) {
  background: #dc2626;
}

.btn-cancel:disabled {
  background: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 100%;
    margin: 0;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-image {
    height: 220px;
  }

  .detail-row {
    flex-direction: column;
    gap: 8px;
  }

  .detail-label {
    min-width: auto;
  }
}
</style>
