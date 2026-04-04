<template>
  <div class="dashboard">
    <Sidebar />

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-header">
        <div>
          <h1>Quản lý nhân viên</h1>
          <p>Tạo tài khoản, phân quyền và quản lý nhân viên khách sạn</p>
        </div>
        <button class="add-staff-btn" @click="showAddModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          Thêm nhân viên
        </button>
      </div>

      <!-- Stats Cards
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Tổng nhân viên</p>
              <h2 class="stat-value">{{ accounts.length }}</h2>
            </div>
            <div class="stat-icon blue">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Lễ tân</p>
              <h2 class="stat-value">{{ countByRole('receptionist') }}</h2>
            </div>
            <div class="stat-icon green">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">CSKH</p>
              <h2 class="stat-value">{{ countByRole('customer_support') }}</h2>
            </div>
            <div class="stat-icon yellow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Nội dung</p>
              <h2 class="stat-value">{{ countByRole('content_staff') }}</h2>
            </div>
            <div class="stat-icon orange">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Filters -->
      <div class="filters">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" placeholder="Tìm kiếm theo tên, email, username..." v-model="searchQuery" />
        </div>
        <select class="filter-select" v-model="roleFilter">
          <option value="">Tất cả vai trò</option>
          <option value="receptionist">Lễ tân</option>
          <option value="customer_support">CSKH</option>
          <option value="content_staff">Nội dung</option>
        </select>
      </div>

      <!-- Staff Table -->
      <div class="table-container">
        <div class="table-header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          <h3>Danh sách nhân viên ({{ filteredAccounts.length }})</h3>
        </div>

        <div class="table-wrapper">
          <table class="staff-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredAccounts.length === 0">
                <td colspan="7" class="empty-row">
                  <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <p>Chưa có nhân viên nào</p>
                  </div>
                </td>
              </tr>
              <tr v-for="account in filteredAccounts" :key="account.id">
                <td class="id-cell">#{{ account.id }}</td>
                <td>
                  <div class="user-info">
                    <div class="user-avatar">{{ getInitials(account.fullName) }}</div>
                    <span>{{ account.username }}</span>
                  </div>
                </td>
                <td class="name-cell">{{ account.fullName }}</td>
                <td class="email-cell">{{ account.email }}</td>
                <td>
                  <div class="role-cell">
                    <select
                      :class="['role-select', getRoleClass(account.role)]"
                      :value="account.role"
                      @change="handleRoleChange(account, $event)"
                    >
                      <option value="receptionist">Lễ tân</option>
                      <option value="customer_support">CSKH</option>
                      <option value="content_staff">Nội dung</option>
                    </select>
                  </div>
                </td>
                <td>
                  <span :class="['status-badge', account.active ? 'active' : 'inactive']">
                    {{ account.active ? 'Hoạt động' : 'Bị khóa' }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button
                      class="action-button lock-button"
                      @click="toggleLockAccount(account)"
                      :title="account.active ? 'Khóa tài khoản' : 'Mở khóa'"
                    >
                      <svg v-if="account.active" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>
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

    <!-- Add Staff Modal -->
    <div class="modal-overlay" v-if="showAddModal" @click.self="closeAddModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Thêm nhân viên mới</h2>
          <button class="modal-close" @click="closeAddModal">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleAddStaff" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Họ tên <span class="required">*</span></label>
              <input type="text" v-model="newStaff.fullName" placeholder="Nhập họ tên" required />
            </div>
            <div class="form-group">
              <label>Email <span class="required">*</span></label>
              <input type="email" v-model="newStaff.email" placeholder="Nhập email" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Username <span class="required">*</span></label>
              <input type="text" v-model="newStaff.username" placeholder="Nhập username" required />
            </div>
            <div class="form-group">
              <label>Mật khẩu <span class="required">*</span></label>
              <input type="password" v-model="newStaff.password" placeholder="Nhập mật khẩu" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Số điện thoại</label>
              <input type="text" v-model="newStaff.phone" placeholder="Nhập số điện thoại" />
            </div>
            <div class="form-group">
              <label>Vai trò <span class="required">*</span></label>
              <select v-model="newStaff.role" required>
                <option value="" disabled>Chọn vai trò</option>
                <option value="receptionist">Lễ tân</option>
                <option value="customer_support">CSKH</option>
                <option value="content_staff">Nội dung</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Ngày sinh</label>
              <input type="date" v-model="newStaff.birth" />
            </div>
            <div class="form-group">
              <label>Địa chỉ</label>
              <input type="text" v-model="newStaff.address" placeholder="Nhập địa chỉ" />
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeAddModal">Hủy</button>
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner"></span>
              {{ isSubmitting ? 'Đang tạo...' : 'Tạo tài khoản' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast notification -->
    <div class="toast" :class="{ show: toast.show, success: toast.type === 'success', error: toast.type === 'error' }">
      <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
      </svg>
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'

// Role name -> roleId mapping (must match DB roles table)
const ROLE_MAP = {
  'receptionist': 4,
  'customer_support': 5,
  'content_staff': 6
}

const ROLE_LABELS = {
  'receptionist': 'Lễ tân',
  'customer_support': 'CSKH',
  'content_staff': 'Nội dung'
}

const searchQuery = ref('')
const roleFilter = ref('')
const accounts = ref([])
const showAddModal = ref(false)
const isSubmitting = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })

const newStaff = ref({
  fullName: '',
  username: '',
  password: '',
  email: '',
  phone: '',
  birth: '',
  address: '',
  role: ''
})

const getToken = () => localStorage.getItem('token')

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name[0].toUpperCase()
}

const getRoleClass = (role) => {
  const roleClasses = {
    'receptionist': 'role-receptionist',
    'customer_support': 'role-support',
    'content_staff': 'role-content'
  }
  return roleClasses[role] || ''
}

const countByRole = (roleName) => {
  return accounts.value.filter(a => a.role === roleName).length
}

const filteredAccounts = computed(() => {
  return accounts.value.filter(account => {
    const searchLower = searchQuery.value.toLowerCase()
    const matchesSearch =
      (account.fullName || '').toLowerCase().includes(searchLower) ||
      (account.email || '').toLowerCase().includes(searchLower) ||
      (account.username || '').toLowerCase().includes(searchLower)

    const matchesRole = !roleFilter.value || account.role === roleFilter.value

    return matchesSearch && matchesRole
  })
})

// Fetch staff accounts
const fetchAccounts = async () => {
  try {
    const token = getToken()
    const hotelId = localStorage.getItem('hotelId')
    const response = await fetch(`/api/user-service/accountsByHotel?hotelId=${hotelId}`, {
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

    if (response.ok && data.accounts) {
      accounts.value = data.accounts
    } else {
      accounts.value = []
    }
  } catch (error) {
    console.error('Fetch accounts error:', error)
    showToast('Có lỗi xảy ra khi tải danh sách nhân viên!', 'error')
  }
}

// Add new staff account
const handleAddStaff = async () => {
  isSubmitting.value = true
  try {
    const token = getToken()
    const hotelId = localStorage.getItem('hotelId')
    const roleId = ROLE_MAP[newStaff.value.role]

    if (!roleId) {
      showToast('Vui lòng chọn vai trò!', 'error')
      isSubmitting.value = false
      return
    }

    const body = {
      fullName: newStaff.value.fullName,
      username: newStaff.value.username,
      password: newStaff.value.password,
      email: newStaff.value.email,
      phone: newStaff.value.phone || '',
      birth: newStaff.value.birth || null,
      address: newStaff.value.address || '',
      role: roleId
    }

    const response = await fetch(`/api/user-service/addAccountHotel?hotelId=${hotelId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (response.ok && data.message === 'Account added successfully') {
      showToast('Tạo tài khoản nhân viên thành công!')
      closeAddModal()
      fetchAccounts()
    } else {
      showToast(data.message || 'Tạo tài khoản thất bại!', 'error')
    }
  } catch (error) {
    console.error('Add staff error:', error)
    showToast('Có lỗi xảy ra khi tạo tài khoản!', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Update role
const handleRoleChange = async (account, event) => {
  const newRole = event.target.value
  const newRoleId = ROLE_MAP[newRole]

  if (!newRoleId) return

  const oldRole = account.role

  if (confirm(`Xác nhận đổi vai trò nhân viên "${account.fullName}" thành "${ROLE_LABELS[newRole]}"?`)) {
    try {
      const token = getToken()
      const response = await fetch('/api/user-service/updateRole', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: account.id,
          roleId: newRoleId
        })
      })

      const data = await response.json()

      if (response.ok && data.message === 'Update role successfully') {
        account.role = newRole
        showToast(`Đã cập nhật vai trò thành "${ROLE_LABELS[newRole]}"`)
      } else {
        event.target.value = oldRole
        showToast(data.message || 'Cập nhật vai trò thất bại!', 'error')
      }
    } catch (error) {
      event.target.value = oldRole
      console.error('Update role error:', error)
      showToast('Có lỗi xảy ra khi cập nhật vai trò!', 'error')
    }
  } else {
    event.target.value = oldRole
  }
}

// Toggle lock account
const toggleLockAccount = async (account) => {
  const action = account.active ? 'khóa' : 'mở khóa'
  if (confirm(`Xác nhận ${action} tài khoản "${account.fullName}"?`)) {
    try {
      const token = getToken()
      const response = await fetch('/api/user-service/lockAccount', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: account.id,
          active: !account.active
        })
      })

      const data = await response.json()

      if (response.ok && data.message === 'Update account active successfully') {
        account.active = !account.active
        showToast(`Đã ${action} tài khoản thành công!`)
      } else {
        showToast(data.message || `${action} tài khoản thất bại!`, 'error')
      }
    } catch (error) {
      console.error('Toggle lock error:', error)
      showToast('Có lỗi xảy ra!', 'error')
    }
  }
}

const closeAddModal = () => {
  showAddModal.value = false
  newStaff.value = {
    fullName: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    birth: '',
    address: '',
    role: ''
  }
}

onMounted(() => {
  fetchAccounts()
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

.add-staff-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
}

.add-staff-btn svg {
  width: 20px;
  height: 20px;
}

.add-staff-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.45);
}

/* Stats Grid */
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
  align-items: center;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 6px;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
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

.stat-icon.blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.stat-icon.green { background: linear-gradient(135deg, #10b981, #059669); }
.stat-icon.yellow { background: linear-gradient(135deg, #f59e0b, #d97706); }
.stat-icon.orange { background: linear-gradient(135deg, #f97316, #ea580c); }

/* Filters */
.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
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
  border-radius: 10px;
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
  border-radius: 10px;
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
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

.staff-table {
  width: 100%;
  border-collapse: collapse;
}

.staff-table thead {
  background: #f8fafc;
}

.staff-table th {
  padding: 14px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.staff-table td {
  padding: 16px 20px;
  border-top: 1px solid #f1f5f9;
  font-size: 14px;
  color: #1e293b;
}

.staff-table tbody tr {
  transition: background 0.15s;
}

.staff-table tbody tr:hover {
  background: #f8fafc;
}

.id-cell {
  font-weight: 600;
  color: #64748b;
  font-size: 13px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.name-cell {
  font-weight: 500;
}

.email-cell {
  color: #64748b;
  font-size: 13px;
}

/* Role Select */
.role-cell {
  position: relative;
}

.role-select {
  padding: 6px 28px 6px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  appearance: none;
  background-color: white;
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  transition: all 0.2s;
}

.role-select:hover {
  border-color: #94a3b8;
}

.role-receptionist {
  color: #059669;
  border-color: #a7f3d0;
  background-color: #ecfdf5;
}

.role-support {
  color: #d97706;
  border-color: #fde68a;
  background-color: #fffbeb;
}

.role-content {
  color: #7c3aed;
  border-color: #c4b5fd;
  background-color: #f5f3ff;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background: #ecfdf5;
  color: #059669;
}

.status-badge.inactive {
  background: #fef2f2;
  color: #dc2626;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 36px;
  min-height: 36px;
}

.action-button svg {
  width: 18px;
  height: 18px;
}

.lock-button {
  background: #fef3c7;
  color: #d97706;
}

.lock-button:hover {
  background: #f59e0b;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

/* Empty State */
.empty-row {
  text-align: center;
  padding: 60px 20px !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
}

.empty-state svg {
  width: 48px;
  height: 48px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 15px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px 0;
}

.modal-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
}

.modal-close {
  width: 36px;
  height: 36px;
  border: none;
  background: #f1f5f9;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close svg {
  width: 20px;
  height: 20px;
  color: #64748b;
}

.modal-close:hover {
  background: #e2e8f0;
}

.modal-form {
  padding: 24px 28px 28px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group select {
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  transition: all 0.2s;
  background: white;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input::placeholder {
  color: #94a3b8;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.btn-cancel {
  padding: 10px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.btn-submit {
  padding: 10px 28px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Toast */
.toast {
  position: fixed;
  bottom: 32px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 2000;
}

.toast.show {
  transform: translateY(0);
  opacity: 1;
}

.toast svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.toast.success {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.toast.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
  }

  .table-wrapper {
    overflow-x: scroll;
  }

  .staff-table {
    min-width: 900px;
  }
}

@media (max-width: 768px) {
  .content-header {
    flex-direction: column;
    gap: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal {
    margin: 16px;
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

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
