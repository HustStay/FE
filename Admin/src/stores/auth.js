import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_URL = '/api/user-service'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const role = ref(localStorage.getItem('role') || null)
  const isAuthenticated = ref(!!token.value)
  const loading = ref(false)
  const error = ref(null)

  async function login(username, password) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      })
      
      const data = response.data
      
      if (data.token) {
        // Kiểm tra role = 3 (Admin) mới cho đăng nhập
        if (data.role !== 3) {
          error.value = 'Bạn không có quyền truy cập hệ thống quản trị'
          return { success: false, message: error.value }
        }
        
        token.value = data.token
        role.value = data.role
        isAuthenticated.value = true
        
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
        
        // Set default axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        
        return { success: true, message: data.message }
      } else {
        error.value = data.message || 'Đăng nhập thất bại'
        return { success: false, message: error.value }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    role.value = null
    isAuthenticated.value = false
    
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    
    delete axios.defaults.headers.common['Authorization']
  }

  // Initialize axios header if token exists
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return {
    token,
    role,
    isAuthenticated,
    loading,
    error,
    login,
    logout
  }
})
