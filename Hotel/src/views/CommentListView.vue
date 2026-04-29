<template>
  <div class="dashboard">
    <Sidebar />

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-header">
        <div>
          <h1>Danh sách bình luận</h1>
          <p>Xem tất cả đánh giá của khách hàng</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" placeholder="Tìm kiếm theo tên khách hàng hoặc nội dung bình luận..." v-model="searchQuery" />
        </div>
        <select class="filter-select" v-model="starFilter">
          <option value="">Tất cả đánh giá</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <p>{{ error }}</p>
        <button @click="fetchComments" class="retry-button">Thử lại</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredComments.length === 0" class="empty-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
        <p>Chưa có bình luận nào</p>
      </div>

      <!-- Comments List -->
      <div v-else class="comments-container">
        <div class="table-header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
          <h3>Danh sách bình luận ({{ filteredComments.length }})</h3>
        </div>

        <div class="comments-list">
          <div v-for="comment in filteredComments" :key="comment.commentId" class="comment-card">
            <div class="comment-header">
              <div class="customer-avatar">
                {{ getInitials(comment.customerName) }}
              </div>
              <div class="customer-info">
                <div class="customer-name">{{ comment.customerName }}</div>
                <div class="comment-date">{{ formatDate(comment.createdAt) }}</div>
              </div>
              <div class="star-rating">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= comment.star }">
                  ★
                </span>
                <span class="star-count">({{ comment.star }}/5)</span>
              </div>
            </div>
            <div class="comment-body">
              <p>{{ comment.comment }}</p>
            </div>
            <div v-if="comment.hotelName" class="comment-footer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 7h-1V2H6v5H5C3.346 7 2 8.346 2 10v12h20V10c0-1.654-1.346-3-3-3zM8 4h8v3H8V4zm-4 6c0-.551.449-1 1-1h14c.551 0 1 .449 1 1v2H4v-2zm0 10v-6h16v6H4z"/>
              </svg>
              <span>{{ comment.hotelName }}</span>
            </div>
          </div>
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
const starFilter = ref('')
const comments = ref([])
const loading = ref(false)
const error = ref('')

// Fetch comments from API
const fetchComments = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const token = localStorage.getItem('token')
    const response = await apiFetch('/api/review-service/comments', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 401) {
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      window.location.href = '/'
      return
    }

    const data = await response.json()

    if (response.ok && data.message === "Comments retrieved successfully") {
      comments.value = data.comments || []
    } else if (data.message === "No comments found for this hotel") {
      comments.value = []
    } else {
      error.value = data.message || 'Có lỗi xảy ra khi tải danh sách bình luận'
    }
  } catch (err) {
    console.error('Fetch comments error:', err)
    error.value = 'Có lỗi xảy ra khi tải danh sách bình luận!'
  } finally {
    loading.value = false
  }
}

// Call API when component mounts
onMounted(() => {
  fetchComments()
})

const filteredComments = computed(() => {
  return comments.value.filter(comment => {
    const searchLower = searchQuery.value.toLowerCase()
    const matchesSearch = 
      comment.customerName.toLowerCase().includes(searchLower) ||
      comment.comment.toLowerCase().includes(searchLower)
    
    const matchesStar = !starFilter.value || comment.star === parseInt(starFilter.value)
    
    return matchesSearch && matchesStar
  })
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
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

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-container p {
  color: #64748b;
  font-size: 14px;
}

/* Error State */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error-container svg {
  width: 64px;
  height: 64px;
  color: #ef4444;
  margin-bottom: 16px;
}

.error-container p {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 16px;
}

.retry-button {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-button:hover {
  background: #2563eb;
}

/* Empty State */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-container svg {
  width: 64px;
  height: 64px;
  color: #94a3b8;
  margin-bottom: 16px;
}

.empty-container p {
  color: #64748b;
  font-size: 14px;
}

/* Comments Container */
.comments-container {
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

/* Comments List */
.comments-list {
  padding: 16px;
}

.comment-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.comment-card:last-child {
  margin-bottom: 0;
}

.comment-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.customer-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.customer-info {
  flex: 1;
}

.customer-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.comment-date {
  font-size: 13px;
  color: #64748b;
}

.star-rating {
  display: flex;
  align-items: center;
  gap: 2px;
}

.star {
  font-size: 20px;
  color: #e2e8f0;
}

.star.filled {
  color: #fbbf24;
}

.star-count {
  font-size: 13px;
  color: #64748b;
  margin-left: 8px;
}

.comment-body {
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.comment-body p {
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
}

.comment-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.comment-footer svg {
  width: 18px;
  height: 18px;
  color: #64748b;
}

.comment-footer span {
  font-size: 13px;
  color: #64748b;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 16px;
  }

  .filters {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .comment-header {
    flex-wrap: wrap;
  }

  .star-rating {
    width: 100%;
    margin-top: 8px;
  }
}
</style>
