<template>
  <div class="dashboard">
    <Sidebar />
    <main class="main-content">

      <!-- Header Banner with Hotel Image -->
      <div class="hotel-banner" v-if="hotelImage">
        <img :src="hotelImage" alt="Ảnh khách sạn" class="banner-img" />
        <div class="banner-overlay">
          <div class="banner-text">
            <h1>Tổng quan</h1>
            <p>Xem tổng quan về hoạt động khách sạn</p>
          </div>
          <div class="banner-date">{{ todayLabel }}</div>
        </div>
      </div>
      <div v-else class="content-header">
        <div>
          <h1>Tổng quan</h1>
          <p>Xem tổng quan về hoạt động khách sạn</p>
        </div>
        <div class="banner-date-plain">{{ todayLabel }}</div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>

      <template v-else>
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Tổng số phòng</p>
                <h2 class="stat-value">{{ stats.totalRooms }}</h2>
                <p class="stat-change positive">{{ stats.totalRooms }} phòng đang hoạt động</p>
              </div>
              <div class="stat-icon blue">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M19 7h-1V2H6v5H5C3.346 7 2 8.346 2 10v12h20V10c0-1.654-1.346-3-3-3zM8 4h8v3H8V4zm-4 6c0-.551.449-1 1-1h14c.551 0 1 .449 1 1v2H4v-2zm0 10v-6h16v6H4z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Phòng đã đặt</p>
                <h2 class="stat-value">{{ stats.bookedRooms }}</h2>
                <p class="stat-change positive">{{ stats.confirmedBookings }} đặt mới hôm nay</p>
              </div>
              <div class="stat-icon green">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Doanh thu tháng</p>
                <h2 class="stat-value">{{ formatRevenue(stats.monthRevenue) }}</h2>
                <p class="stat-change positive">{{ stats.totalBookings }} booking tháng này</p>
              </div>
              <div class="stat-icon yellow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Tỷ lệ lấp đầy</p>
                <h2 class="stat-value">{{ stats.occupancyRate }}%</h2>
                <p :class="['stat-change', stats.occupancyRate >= 50 ? 'positive' : 'negative']">
                  {{ stats.availableRooms }} phòng đang trống
                </p>
              </div>
              <div class="stat-icon orange">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-grid">
          <!-- Room Status -->
          <div class="chart-card">
            <h3>Phòng theo trạng thái</h3>
            <div class="room-status-list">
              <div class="status-item">
                <div class="status-info">
                  <span class="status-label">Trống</span>
                  <span class="status-count">{{ stats.availableRooms }} phòng</span>
                </div>
                <div class="status-bar-container">
                  <div class="status-bar green"
                    :style="{ width: stats.totalRooms ? (stats.availableRooms / stats.totalRooms * 100) + '%' : '0%' }">
                  </div>
                </div>
              </div>
              <div class="status-item">
                <div class="status-info">
                  <span class="status-label">Đang sử dụng</span>
                  <span class="status-count">{{ stats.occupiedRooms }} phòng</span>
                </div>
                <div class="status-bar-container">
                  <div class="status-bar red"
                    :style="{ width: stats.totalRooms ? (stats.occupiedRooms / stats.totalRooms * 100) + '%' : '0%' }">
                  </div>
                </div>
              </div>
            </div>

            <!-- Room Image Grid -->
            <div v-if="roomImages.length > 0" class="room-images-preview">
              <h4>Ảnh phòng</h4>
              <div class="images-grid">
                <div v-for="(img, idx) in roomImages.slice(0, 4)" :key="idx" class="img-thumb">
                  <img :src="img.url" :alt="img.name" />
                  <span class="img-label">{{ img.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Bookings -->
          <div class="chart-card">
            <h3>Đặt phòng gần đây</h3>
            <div class="bookings-list" v-if="recentBookings.length > 0">
              <div class="booking-item" v-for="b in recentBookings" :key="b.id">
                <div class="booking-avatar">
                  {{ b.customerName?.charAt(0)?.toUpperCase() || '?' }}
                </div>
                <div class="booking-info">
                  <h4>{{ b.roomInfo }}</h4>
                  <p>{{ b.customerName }}</p>
                </div>
                <div class="booking-right">
                  <span :class="['booking-status', b.statusClass]">{{ b.statusLabel }}</span>
                  <span class="booking-fee">{{ Number(b.fee).toLocaleString() }} VNĐ</span>
                </div>
              </div>
            </div>
            <div v-else class="empty-bookings">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M19 4h-1V2h-2v2H8V2H6v2H5C3.346 4 2 5.346 2 7v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3V7c0-1.654-1.346-3-3-3zm1 17c0 .551-.449 1-1 1H5c-.551 0-1-.449-1-1V10h16v11zm0-13H4V7c0-.551.449-1 1-1h14c.551 0 1 .449 1 1v1z" />
              </svg>
              <p>Chưa có đặt phòng nào</p>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import { apiFetch } from '../utils/apiClient.js'

const loading = ref(true)
const rooms = ref([])
const bookings = ref([])

const todayLabel = computed(() => {
  return new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

// Hotel image from first room
const hotelImage = computed(() => {
  const r = rooms.value.find(r => r.image)
  return r?.image || null
})

// Room images for preview grid
const roomImages = computed(() => {
  const seen = new Set()
  return rooms.value
    .filter(r => r.image && !seen.has(r.image) && seen.add(r.image))
    .map(r => ({ url: r.image, name: r.name }))
})

const stats = computed(() => {
  const totalRooms = rooms.value.length
  const availableRooms = rooms.value.filter(r => r.status === 'available').length
  const occupiedRooms = rooms.value.filter(r => r.status === 'occupied').length
  const occupancyRate = totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0

  const now = new Date()
  const thisMonth = bookings.value.filter(b => {
    const d = new Date(b.checkInDate?.split('/').reverse().join('-') || b.checkInDate)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const monthRevenue = thisMonth.reduce((sum, b) => sum + (Number(b.fee) || 0), 0)
  const bookedRooms = bookings.value.filter(b => ['confirmed', 'checkedin'].includes(b.status)).length
  const confirmedBookings = bookings.value.filter(b => b.status === 'confirmed').length

  return {
    totalRooms,
    availableRooms,
    occupiedRooms,
    occupancyRate,
    monthRevenue,
    totalBookings: bookings.value.length,
    bookedRooms,
    confirmedBookings
  }
})

const recentBookings = computed(() => {
  const statusMap = {
    confirmed: { label: 'Đã xác nhận', cls: 'status-confirmed' },
    checkedin: { label: 'Đang ở', cls: 'status-checkedin' },
    checkedout: { label: 'Đã trả', cls: 'status-checkedout' },
    cancelled: { label: 'Đã hủy', cls: 'status-cancelled' }
  }
  return bookings.value.slice(0, 5).map(b => ({
    ...b,
    roomInfo: b.roomName || b.roomType || 'N/A',
    statusLabel: statusMap[b.status]?.label || b.status,
    statusClass: statusMap[b.status]?.cls || ''
  }))
})

const formatRevenue = (val) => {
  if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1) + ' Tỷ VNĐ'
  if (val >= 1_000_000) return Math.round(val / 1_000_000) + 'M VNĐ'
  return val.toLocaleString() + ' VNĐ'
}

const handleUnauth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  window.location.href = '/'
}

const fetchRooms = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await apiFetch('/api/room-service/rooms/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.status === 401) return handleUnauth()
    const data = await res.json()
    if (res.ok && data.rooms) {
      rooms.value = data.rooms.map(r => ({
        id: r.roomId,
        name: `Phòng ${r.roomNumber}`,
        type: r.roomType,
        status: r.isAvailable ? 'available' : 'occupied',
        image: r.image || r.imageUrl || r.images?.[0] || null,
        price: r.pricePerNight
      }))
    }
  } catch (e) { console.error(e) }
}

const fetchBookings = async () => {
  try {
    const token = localStorage.getItem('token')
    const hotelId = localStorage.getItem('hotelId')
    const res = await apiFetch('/api/booking-service/owner/bookings', {
      headers: { 'Authorization': `Bearer ${token}` },
      params: hotelId ? { hotelId } : {}
    })
    if (res.status === 401) return handleUnauth()
    const data = await res.json()
    if (res.ok && data.bookings) {
      const statusMap = { 'CONFIRMED': 'confirmed', 'CHECKED_IN': 'checkedin', 'CHECKED_OUT': 'checkedout', 'COMPLETED': 'checkedout', 'CANCELLED': 'cancelled' }
      bookings.value = data.bookings.map(b => ({
        id: b.id,
        roomName: `${b.totalRooms} phòng`,
        roomType: b.roomType,
        customerName: b.customerName,
        checkInDate: b.checkInDate,
        checkOutDate: b.checkOutDate,
        fee: b.fee || 0,
        status: statusMap[b.status] || 'confirmed'
      }))
    }
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  await Promise.all([fetchRooms(), fetchBookings()])
  loading.value = false
})
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

.main-content {
  flex: 1;
  margin-left: 270px;
  padding: 0 32px 32px;
}

/* Banner */
.hotel-banner {
  position: relative;
  height: 200px;
  margin: 0 -32px 32px;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(15, 23, 42, 0.75) 40%, transparent);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
}

.banner-text h1 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.banner-text p {
  font-size: 14px;
  color: #cbd5e1;
}

.banner-date {
  font-size: 13px;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 14px;
  border-radius: 20px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 32px 0;
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

.banner-date-plain {
  font-size: 13px;
  color: #64748b;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: #64748b;
  font-size: 14px;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
}

.stat-card {
  background: white;
  padding: 22px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 30px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #f59e0b;
}

.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 22px;
  height: 22px;
  color: white;
}

.stat-icon.blue {
  background: #3b82f6;
}

.stat-icon.green {
  background: #10b981;
}

.stat-icon.yellow {
  background: #f59e0b;
}

.stat-icon.orange {
  background: #f97316;
}

/* Charts */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 24px;
}

.chart-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.chart-card h3 {
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
}

/* Room Status */
.room-status-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 24px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-info {
  display: flex;
  justify-content: space-between;
}

.status-label {
  font-size: 13px;
  color: #64748b;
}

.status-count {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.status-bar-container {
  width: 100%;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.status-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.status-bar.green {
  background: #10b981;
}

.status-bar.red {
  background: #ef4444;
}

/* Room image preview */
.room-images-preview h4 {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 12px;
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.img-thumb {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 4/3;
}

.img-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}

.img-thumb:hover img {
  transform: scale(1.05);
}

.img-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
  color: #fff;
  font-size: 11px;
  padding: 6px 8px;
}

/* Bookings */
.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.booking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #f8fafc;
  border-radius: 10px;
  transition: background 0.2s;
}

.booking-item:hover {
  background: #f1f5f9;
}

.booking-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.booking-info {
  flex: 1;
  min-width: 0;
}

.booking-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.booking-info p {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.booking-right {
  text-align: right;
  flex-shrink: 0;
}

.booking-status {
  display: block;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
  margin-bottom: 4px;
}

.status-confirmed {
  background: #fef3c7;
  color: #d97706;
}

.status-checkedin {
  background: #dbeafe;
  color: #2563eb;
}

.status-checkedout {
  background: #d1fae5;
  color: #059669;
}

.status-cancelled {
  background: #fee2e2;
  color: #dc2626;
}

.booking-fee {
  font-size: 12px;
  font-weight: 600;
  color: #3b82f6;
}

.empty-bookings {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 0;
  color: #94a3b8;
}

.empty-bookings svg {
  width: 40px;
  height: 40px;
}

.empty-bookings p {
  font-size: 14px;
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
  }

  .hotel-banner {
    margin: 0 -32px 24px;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 0 20px 20px;
  }

  .hotel-banner {
    margin: 0 -20px 20px;
    height: 150px;
  }

  .banner-text h1 {
    font-size: 22px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .images-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
