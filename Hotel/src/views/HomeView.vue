<template>
  <div class="dashboard">
    <Sidebar />

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-header">
        <div>
          <h1>Tổng quan</h1>
          <p>Xem tổng quan về hoạt động khách sạn</p>
        </div>
        <button class="menu-toggle">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Tổng số phòng</p>
              <h2 class="stat-value">120</h2>
              <p class="stat-change positive">+5% so với tháng trước</p>
            </div>
            <div class="stat-icon blue">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 7h-1V2H6v5H5C3.346 7 2 8.346 2 10v12h20V10c0-1.654-1.346-3-3-3zM8 4h8v3H8V4zm-4 6c0-.551.449-1 1-1h14c.551 0 1 .449 1 1v2H4v-2zm0 10v-6h16v6H4z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Phòng đã đặt</p>
              <h2 class="stat-value">87</h2>
              <p class="stat-change positive">+12% so với tháng trước</p>
            </div>
            <div class="stat-icon green">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Doanh thu tháng</p>
              <h2 class="stat-value">245M VNĐ</h2>
              <p class="stat-change positive">+8% so với tháng trước</p>
            </div>
            <div class="stat-icon yellow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Tỷ lệ lấp đầy</p>
              <h2 class="stat-value">72.5%</h2>
              <p class="stat-change positive">+3% so với tháng trước</p>
            </div>
            <div class="stat-icon orange">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <!-- Room Status Chart -->
        <div class="chart-card">
          <h3>Phòng theo trạng thái</h3>
          <div class="room-status-list">
            <div class="status-item">
              <div class="status-info">
                <span class="status-label">Trống</span>
                <span class="status-count">33 phòng</span>
              </div>
              <div class="status-bar-container">
                <div class="status-bar green" style="width: 27.5%"></div>
              </div>
            </div>
            <div class="status-item">
              <div class="status-info">
                <span class="status-label">Đang sử dụng</span>
                <span class="status-count">87 phòng</span>
              </div>
              <div class="status-bar-container">
                <div class="status-bar red" style="width: 72.5%"></div>
              </div>
            </div>
            <div class="status-item">
              <div class="status-info">
                <span class="status-label">Đang dọn</span>
                <span class="status-count">12 phòng</span>
              </div>
              <div class="status-bar-container">
                <div class="status-bar orange" style="width: 10%"></div>
              </div>
            </div>
            <div class="status-item">
              <div class="status-info">
                <span class="status-label">Bảo trì</span>
                <span class="status-count">8 phòng</span>
              </div>
              <div class="status-bar-container">
                <div class="status-bar gray" style="width: 6.7%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Bookings -->
        <div class="chart-card">
          <h3>Đặt phòng gần đây</h3>
          <div class="bookings-list">
            <div class="booking-item">
              <div class="booking-info">
                <h4>Phòng 101</h4>
                <p>Nguyễn Văn A</p>
              </div>
              <div class="booking-time">
                <span class="time-label">Hôm nay</span>
                <span class="time-value">14:00</span>
              </div>
            </div>
            <div class="booking-item">
              <div class="booking-info">
                <h4>Phòng 205</h4>
                <p>Trần Thị B</p>
              </div>
              <div class="booking-time">
                <span class="time-label">Hôm nay</span>
                <span class="time-value">15:30</span>
              </div>
            </div>
            <div class="booking-item">
              <div class="booking-info">
                <h4>Phòng 312</h4>
                <p>Lê Văn C</p>
              </div>
              <div class="booking-time">
                <span class="time-label">Ngày mai</span>
                <span class="time-value">10:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
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

.menu-toggle {
  display: none;
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.menu-toggle svg {
  width: 24px;
  height: 24px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 13px;
  font-weight: 500;
}

.stat-change.positive {
  color: #10b981;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
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

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 24px;
}

/* Room Status */
.room-status-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  font-size: 14px;
  color: #64748b;
}

.status-count {
  font-size: 14px;
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
  transition: width 0.3s ease;
}

.status-bar.green {
  background: #10b981;
}

.status-bar.red {
  background: #ef4444;
}

.status-bar.orange {
  background: #f97316;
}

.status-bar.gray {
  background: #94a3b8;
}

/* Bookings List */
.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.booking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.booking-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.booking-info p {
  font-size: 13px;
  color: #64748b;
}

.booking-time {
  text-align: right;
}

.time-label {
  display: block;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 4px;
}

.time-value {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
  }

  .menu-toggle {
    display: flex;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 20px;
  }

  .content-header h1 {
    font-size: 24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-value {
    font-size: 28px;
  }
}
</style>
