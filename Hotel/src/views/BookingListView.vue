<template>
  <div class="dashboard">
    <Sidebar />

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-header">
        <div>
          <h1>Danh sách đặt phòng</h1>
          <p>Quản lý tất cả booking của khách hàng</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" placeholder="Tìm kiếm theo tên khách, email hoặc số phòng..." v-model="searchQuery" />
        </div>
        <select class="filter-select" v-model="statusFilter">
          <option value="">Tất cả trạng thái</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="checkedin">Đã nhận phòng</option>
          <option value="checkedout">Đã trả phòng</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      <!-- Bookings Table -->
      <div class="table-container">
        <div class="table-header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.346 4 2 5.346 2 7v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3V7c0-1.654-1.346-3-3-3zm1 17c0 .551-.449 1-1 1H5c-.551 0-1-.449-1-1V10h16v11zm0-13H4V7c0-.551.449-1 1-1h14c.551 0 1 .449 1 1v1z"/>
          </svg>
          <h3>Danh sách đặt phòng ({{ filteredBookings.length }})</h3>
        </div>

        <div class="table-wrapper">
          <table class="bookings-table">
            <thead>
              <tr>
                <th>Phòng</th>
                <th>Khách hàng</th>
                <th>Ngày nhận</th>
                <th>Ngày trả</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in filteredBookings" :key="booking.id">
                <td>
                  <div class="room-info">
                    <div class="room-name">{{ booking.roomName }}</div>
                    <div class="room-type">{{ booking.roomType }}</div>
                  </div>
                </td>
                <td>
                  <div class="customer-info">
                    <div class="customer-name">{{ booking.customerName }}</div>
                    <div class="customer-phone">{{ booking.customerPhone }}</div>
                  </div>
                </td>
                <td>{{ booking.checkInDate }}</td>
                <td>{{ booking.checkOutDate }}</td>
                <td class="price">{{ booking.fee.toLocaleString() }} VNĐ</td>
                <td>
                  <div class="status-cell">
                    <select 
                      :class="['status-select', booking.status]"
                      v-model="booking.status"
                      @change="updateBookingStatus(booking)"
                    >
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="checkedin">Đã nhận phòng</option>
                      <option value="checkedout">Đã trả phòng</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </td>
                <td>
                  <div class="action-buttons">
                    <button 
                      v-if="booking.status === 'confirmed'"
                      class="action-button checkin-button" 
                      @click="checkInBooking(booking)"
                      title="Check-in"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      Check-in
                    </button>
                    <button 
                      v-if="booking.status === 'checkedin'"
                      class="action-button checkout-button" 
                      @click="checkOutBooking(booking)"
                      title="Check-out"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      Check-out
                    </button>
                    <button class="action-button delete-button" @click="deleteBooking(booking.id)" title="Xóa">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import { apiFetch } from '../utils/apiClient.js'

const searchQuery = ref('')
const statusFilter = ref('')
const bookings = ref([])

// Fetch bookings from API
const fetchBookings = async () => {
  try {
    const token = localStorage.getItem('token')
    const hotelId = localStorage.getItem('hotelId')
    const response = await apiFetch('/api/booking-service/owner/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: hotelId ? { hotelId } : {}
    })

    if (response.status === 401) {
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      window.location.href = '/'
      return
    }

    const data = await response.json()

    if (response.ok && data.message === "Get bookings successfully") {
      // Convert API data to UI format
      const bookingsList = data.bookings.map(booking => {
        // Format dates from YYYY-MM-DD to DD/MM/YYYY
        const formatDate = (dateStr) => {
          const [year, month, day] = dateStr.split('-')
          return `${day}/${month}/${year}`
        }

        // Map API status to UI status
        const statusMap = {
          'CONFIRMED': 'confirmed',
          'CHECKED_IN': 'checkedin',
          'CHECKED_OUT': 'checkedout',
          'COMPLETED': 'checkedout',
          'CANCELLED': 'cancelled'
        }

        return {
          id: booking.id,
          roomName: `${booking.totalRooms} phòng`,
          roomType: booking.roomType,
          customerName: booking.customerName,
          customerEmail: booking.email || 'N/A',
          customerPhone: booking.phone,
          checkInDate: formatDate(booking.checkInDate),
          checkOutDate: formatDate(booking.checkOutDate),
          totalAmount: booking.totalPrice || 0,
          status: statusMap[booking.status] || 'confirmed',
          fee: booking.fee || 0,
          guestCount: booking.guestCount
        }
      })

      bookings.value = bookingsList
    } else if (data.message === "No bookings found") {
      console.log('Không có booking nào')
      bookings.value = []
    } else {
      console.log('Lỗi khi tải danh sách booking')
      bookings.value = []
    }
  } catch (error) {
    console.error('Fetch bookings error:', error)
    alert('Có lỗi xảy ra khi tải danh sách booking!')
  }
}

// Call API when component mounts
onMounted(() => {
  fetchBookings()
})

const filteredBookings = computed(() => {
  return bookings.value.filter(booking => {
    const searchLower = searchQuery.value.toLowerCase()
    const matchesSearch = 
      booking.roomName.toLowerCase().includes(searchLower) ||
      booking.customerName.toLowerCase().includes(searchLower) ||
      booking.customerEmail.toLowerCase().includes(searchLower) ||
      booking.customerPhone.includes(searchQuery.value)
    
    const matchesStatus = !statusFilter.value || booking.status === statusFilter.value
    
    return matchesSearch && matchesStatus
  })
})

const updateBookingStatus = (booking) => {
  console.log('Cập nhật trạng thái:', booking)
  // Có thể gọi API để cập nhật trạng thái
}

const checkInBooking = async (booking) => {
  if (confirm(`Xác nhận check-in cho khách ${booking.customerName}?`)) {
    try {
      const token = localStorage.getItem('token')
      const response = await apiFetch('/api/booking-service/checkInCheckOut', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookingId: booking.id,
          action: 'CHECKED_IN'
        })
      })

      const data = await response.json()

      if (response.ok && data.message === "Check-in/Check-out successful") {
        booking.status = 'checkedin'
        alert('Check-in thành công!')
      } else {
        alert('Check-in thất bại! ' + (data.message || ''))
      }
    } catch (error) {
      console.error('Check-in error:', error)
      alert('Có lỗi xảy ra khi check-in!')
    }
  }
}

const checkOutBooking = async (booking) => {
  if (confirm(`Xác nhận check-out cho khách ${booking.customerName}?`)) {
    try {
      const token = localStorage.getItem('token')
      const response = await apiFetch('/api/booking-service/checkInCheckOut', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookingId: booking.id,
          action: 'CHECKED_OUT'
        })
      })

      const data = await response.json()

      if (response.ok && data.message === "Check-in/Check-out successful") {
        booking.status = 'checkedout'
        alert('Check-out thành công!')
      } else {
        alert('Check-out thất bại! ' + (data.message || ''))
      }
    } catch (error) {
      console.error('Check-out error:', error)
      alert('Có lỗi xảy ra khi check-out!')
    }
  }
}

const deleteBooking = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa booking này?')) {
    const index = bookings.value.findIndex(b => b.id === id)
    if (index !== -1) {
      bookings.value.splice(index, 1)
      alert('Đã xóa booking thành công!')
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 270px;
  padding: 32px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.content-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.content-header p {
  font-size: 14px;
  color: #64748b;
}

/* Filters */
.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.search-box {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: #94a3b8;
}

.search-box input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 180px;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Table */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.table-header svg {
  width: 24px;
  height: 24px;
  color: #3b82f6;
}

.table-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.table-wrapper {
  overflow-x: auto;
}

.bookings-table {
  width: 100%;
  border-collapse: collapse;
}

.bookings-table thead {
  background: #f8fafc;
}

.bookings-table th {
  padding: 16px 20px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.bookings-table td {
  padding: 20px;
  border-top: 1px solid #f1f5f9;
  font-size: 14px;
  color: #1e293b;
}

.room-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.room-name {
  font-weight: 600;
  color: #1e293b;
}

.room-type {
  font-size: 13px;
  color: #64748b;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.customer-name {
  font-weight: 600;
  color: #1e293b;
}

.customer-email,
.customer-phone {
  font-size: 13px;
  color: #64748b;
}

.price {
  font-weight: 700;
  color: #3b82f6;
  white-space: nowrap;
}

.status-cell {
  position: relative;
}

.status-select {
  padding: 8px 32px 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  appearance: none;
  background-color: white;
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
}

.status-select.confirmed {
  color: #f59e0b;
}

.status-select.checkedin {
  color: #3b82f6;
}

.status-select.checkedout {
  color: #10b981;
}

.status-select.cancelled {
  color: #ef4444;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.action-button svg {
  width: 16px;
  height: 16px;
}

.checkin-button {
  background: #dbeafe;
  color: #3b82f6;
}

.checkin-button:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.checkout-button {
  background: #d1fae5;
  color: #10b981;
}

.checkout-button:hover {
  background: #10b981;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.delete-button {
  background: #fef2f2;
  color: #ef4444;
  padding: 8px;
  min-width: 36px;
}

.delete-button:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
  }

  .table-wrapper {
    overflow-x: scroll;
  }

  .bookings-table {
    min-width: 1000px;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 20px;
  }

  .content-header h1 {
    font-size: 24px;
  }

  .filters {
    flex-direction: column;
  }
}
</style>
