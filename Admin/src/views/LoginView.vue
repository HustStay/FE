<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = 'Vui lòng nhập đầy đủ thông tin'
    return
  }
  
  errorMessage.value = ''
  
  const result = await authStore.login(username.value, password.value)
  
  if (result.success) {
    router.push('/dashboard')
  } else {
    errorMessage.value = result.message
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="login-container">
    <div class="login-header">
      <div class="logo-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
      <h1 class="title">Hotel Booking</h1>
      <p class="subtitle">Hệ thống quản trị khách sạn toàn diện</p>
    </div>

    <div class="login-card">
      <h2 class="card-title">Đăng nhập</h2>
      <p class="card-subtitle">Nhập thông tin của bạn để truy cập hệ thống quản trị</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Email</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </span>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Tên đăng nhâp"
              autocomplete="username"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
            />
            <button type="button" class="toggle-password" @click="togglePassword">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                <line x1="2" x2="22" y1="2" y2="22"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="login-btn" :disabled="authStore.loading">
          <span v-if="authStore.loading" class="spinner"></span>
          <span v-else>Đăng nhập hệ thống</span>
        </button>
      </form>

      <div class="login-footer">
        <span>Quên mật khẩu?</span>
        <a href="#" class="support-link">Liên hệ hỗ trợ</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
}

.subtitle {
  color: #718096;
  font-size: 16px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  text-align: center;
  margin-bottom: 8px;
}

.card-subtitle {
  color: #718096;
  text-align: center;
  font-size: 14px;
  margin-bottom: 32px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: #9ca3af;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 14px 14px 46px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.2s ease;
  outline: none;
}

.input-wrapper input:focus {
  border-color: #c44a8d;
  box-shadow: 0 0 0 3px rgba(196, 74, 141, 0.1);
}

.input-wrapper input::placeholder {
  color: #9ca3af;
}

.toggle-password {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: #6b7280;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #fecaca;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #c44a8d 0%, #d65db1 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #b03d7d 0%, #c54aa1 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(196, 74, 141, 0.4);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.support-link {
  color: #c44a8d;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
  transition: color 0.2s ease;
}

.support-link:hover {
  color: #a03a73;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-container {
    padding: 16px;
  }
  
  .logo-icon {
    width: 56px;
    height: 56px;
  }
  
  .title {
    font-size: 28px;
  }
  
  .subtitle {
    font-size: 15px;
  }
  
  .login-card {
    padding: 32px 24px;
  }
  
  .card-title {
    font-size: 22px;
  }
}

@media (max-width: 640px) {
  .login-header {
    margin-bottom: 24px;
  }
  
  .logo-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
  }
  
  .logo-icon svg {
    width: 28px;
    height: 28px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 14px;
  }
  
  .login-card {
    padding: 28px 20px;
    border-radius: 14px;
  }
  
  .card-title {
    font-size: 20px;
  }
  
  .card-subtitle {
    font-size: 13px;
    margin-bottom: 24px;
  }
  
  .login-form {
    gap: 16px;
  }
  
  .input-wrapper input {
    padding: 12px 12px 12px 42px;
    font-size: 14px;
  }
  
  .login-btn {
    padding: 12px;
    font-size: 15px;
  }
  
  .login-footer {
    margin-top: 20px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 12px;
  }
  
  .login-card {
    padding: 24px 16px;
  }
  
  .title {
    font-size: 22px;
  }
  
  .card-subtitle {
    margin-bottom: 20px;
  }
  
  .form-group label {
    font-size: 13px;
  }
  
  .input-icon svg {
    width: 18px;
    height: 18px;
  }
  
  .toggle-password svg {
    width: 18px;
    height: 18px;
  }
}
</style>
