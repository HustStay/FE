<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

// State
const activeTab = ref('users')
const accounts = ref([])
const reviews = ref([])
const loading = ref(false)
const reviewsLoading = ref(false)
const error = ref(null)
const reviewsError = ref(null)

// Role mapping
const roleLabels = {
  customer: 'Khách hàng',
  hotelier: 'Chủ khách sạn',
  admin: 'Quản trị viên'
}

// Fetch accounts from API
const fetchAccounts = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await axios.get('/api/user-service/accounts')
    if (response.data.accounts) {
      accounts.value = response.data.accounts.map(account => ({
        ...account,
        status: account.active ? 'active' : 'locked'
      }))
    } else {
      error.value = response.data.message || 'Không tìm thấy tài khoản'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu'
  } finally {
    loading.value = false
  }
}

// Toggle user status
const toggleStatus = async (account) => {
  const newStatus = account.status === 'active' ? 'locked' : 'active'
  const isActive = newStatus === 'active'
  
  try {
    await axios.put('/api/user-service/lockAccount', {
      userId: String(account.id),
      active: isActive
    })
    account.status = newStatus
  } catch (err) {
    alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái')
  }
}

// Fetch reviews from API
const fetchReviews = async () => {
  reviewsLoading.value = true
  reviewsError.value = null
  
  try {
    const response = await axios.get('/api/review-service/comment/all')
    if (response.data.comments) {
      reviews.value = response.data.comments.map((comment) => ({
        ...comment,
        rating: comment.star,
        isReported: false
      }))
    } else {
      reviewsError.value = response.data.message || 'Không tìm thấy đánh giá'
    }
  } catch (err) {
    reviewsError.value = err.response?.data?.message || 'Có lỗi xảy ra khi tải đánh giá'
  } finally {
    reviewsLoading.value = false
  }
}

// Remove review
const removeReview = async (review) => {
  try {
    const response = await axios.delete('/api/review-service/comment', {
      params: { commentId: review.commentId }
    })
    if (response.data.message === 'Comment deleted successfully') {
      reviews.value = reviews.value.filter(r => r.commentId !== review.commentId)
    } else {
      alert(response.data.message || 'Không thể xóa đánh giá')
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa đánh giá')
  }
}

// Keep review (remove reported flag)
const keepReview = (review) => {
  review.isReported = false
}

// Handle logout
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Fetch data on mount
onMounted(() => {
  fetchAccounts()
  fetchReviews()
})
</script>

<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"/>
              <path d="M1 21h22"/>
              <path d="M9 7h1"/>
              <path d="M9 11h1"/>
              <path d="M9 15h1"/>
              <path d="M14 7h1"/>
              <path d="M14 11h1"/>
              <path d="M14 15h1"/>
            </svg>
          </div>
          <h1>Hotel Booking Admin</h1>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" x2="9" y1="12" y2="12"/>
          </svg>
          Đăng xuất
        </button>
      </div>
    </header>

    <main class="dashboard-main">
      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'users' }"
          @click="activeTab = 'users'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Quản lý người dùng
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'reviews' }"
          @click="activeTab = 'reviews'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Kiểm duyệt Đánh giá
        </button>
      </div>

      <!-- User Management Tab Content -->
      <div v-if="activeTab === 'users'" class="content-card">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button @click="fetchAccounts" class="retry-btn">Thử lại</button>
        </div>

        <!-- Users Table -->
        <div v-else class="table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th>NGƯỜI DÙNG</th>
                <th>VAI TRÒ</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="account in accounts" :key="account.id">
                <td class="user-cell">
                  <div class="user-info">
                    <span class="user-name">{{ account.fullName }}</span>
                    <span class="user-email">{{ account.email }}</span>
                  </div>
                </td>
                <td>
                  <span class="role-badge" :class="account.role">
                    {{ roleLabels[account.role] || account.role }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="account.status">
                    {{ account.status === 'active' ? 'Active' : 'Locked' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <div class="dropdown">
                    <button class="action-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="12" cy="5" r="1"/>
                        <circle cx="12" cy="19" r="1"/>
                      </svg>
                    </button>
                    <div class="dropdown-menu">
                      <button @click="toggleStatus(account)">
                        {{ account.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa' }}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div v-if="accounts.length === 0" class="empty-state">
            <p>Không có người dùng nào</p>
          </div>
        </div>
      </div>

      <!-- Reviews Tab Content -->
      <div v-if="activeTab === 'reviews'" class="content-card">
        <!-- Loading State -->
        <div v-if="reviewsLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải đánh giá...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="reviewsError" class="error-state">
          <p>{{ reviewsError }}</p>
          <button @click="fetchReviews" class="retry-btn">Thử lại</button>
        </div>

        <!-- Reviews List -->
        <div v-else class="reviews-list">
          <div v-for="review in reviews" :key="review.commentId" class="review-card">
            <div class="review-header">
              <div class="review-info">
                <span class="reviewer-name">{{ review.customerName }}</span>
                <span class="review-at">tại</span>
                <span class="hotel-name">{{ review.hotelName }}</span>
                <span v-if="review.isReported" class="reported-badge">Bị báo cáo</span>
              </div>
              <div class="review-actions">
                <button class="btn-remove" @click="removeReview(review)">Gỡ bỏ</button>
              </div>
            </div>
            <p class="review-comment">"{{ review.comment }}"</p>
            <div class="review-rating">
              <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= review.rating }">★</span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="reviews.length === 0" class="empty-state">
            <p>Không có đánh giá nào</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: #f5f7fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.dashboard-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 16px 24px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-section h1 {
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #fecaca;
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: white;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.tab-btn.active {
  background: #f3f4f6;
  color: #1f2937;
  font-weight: 600;
}

/* Content Card */
.content-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #dc2626;
}

.retry-btn {
  margin-top: 16px;
  padding: 10px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #5a67d8;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  text-align: left;
  padding: 16px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

.users-table td {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.users-table tbody tr:hover {
  background: #f9fafb;
}

/* User Cell */
.user-cell .user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
}

.user-email {
  font-size: 13px;
  color: #10b981;
}

/* Role Badge */
.role-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.role-badge.customer {
  background: #e0f2fe;
  color: #0369a1;
}

.role-badge.hotelier {
  background: #fef3c7;
  color: #92400e;
}

.role-badge.admin {
  background: #ede9fe;
  color: #6d28d9;
}

/* Status Badge */
.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.locked {
  background: #fee2e2;
  color: #dc2626;
}

/* Actions */
.actions-cell {
  text-align: right;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.action-btn {
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu button {
  display: block;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  background: none;
  border: none;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-menu button:hover {
  background: #f3f4f6;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

/* Placeholder Content */
.placeholder-content {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.placeholder-content h3 {
  font-size: 18px;
  color: #374151;
  margin-bottom: 8px;
}

/* Reviews Styles */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px 24px;
  border: 1px solid #e5e7eb;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.review-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.reviewer-name {
  font-weight: 700;
  color: #1f2937;
  font-size: 15px;
}

.review-at {
  color: #6b7280;
  font-size: 14px;
}

.hotel-name {
  color: #10b981;
  font-weight: 600;
  font-size: 15px;
}

.reported-badge {
  background: #fef2f2;
  color: #ef4444;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
}

.review-actions {
  display: flex;
  gap: 8px;
}

.btn-remove,
.btn-keep {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-remove:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.btn-keep {
  background: white;
  color: #10b981;
  border: 1px solid #10b981;
}

.btn-keep:hover {
  background: #ecfdf5;
}

.review-comment {
  color: #4b5563;
  font-style: italic;
  font-size: 15px;
  margin-bottom: 12px;
  line-height: 1.5;
}

.review-rating {
  display: flex;
  gap: 2px;
}

.star {
  color: #d1d5db;
  font-size: 18px;
}

.star.filled {
  color: #f59e0b;
}
</style>
