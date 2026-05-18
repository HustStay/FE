<template>
  <div class="auth-page">
    <div class="auth-container" :class="{ 'reverse-layout': activeTab === 'register' }">

      <!-- Image Side -->
      <div class="auth-image-side">
        <img v-if="activeTab === 'login'" src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"
          alt="Login background" class="auth-bg" />
        <img v-else src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200" alt="Register background"
          class="auth-bg" />

        <div class="image-overlay"></div>

        <div v-if="activeTab === 'login'" class="image-content">
          <h1 class="image-title">Chào mừng trở lại.</h1>
          <p class="image-desc">Tiếp tục hành trình khám phá những khách sạn trên khắp Việt Nam.</p>
        </div>

        <div v-else class="image-content">
          <h1 class="image-title">Tận hưởng kỳ nghỉ không chút âu lo.</h1>
          <p class="image-desc">Tiếp tục hành trình khám phá những khách sạn trên khắp Việt Nam.</p>
          <ul class="image-features">
            <li>✓ Dịch vụ khách hàng 24/7</li>
            <li>✓ Miễn phí hủy phòng</li>
            <li>✓ Wi-Fi miễn phí</li>
            <li>✓ Parking miễn phí</li>
          </ul>
        </div>
      </div>

      <!-- Form Side -->
      <div class="auth-form-side">
        <!-- Login Form -->
        <div v-if="activeTab === 'login'" class="auth-form">
          <h2 class="form-title">Đăng nhập</h2>
          <p class="form-subtitle">
            Chưa có tài khoản? <a href="#" @click.prevent="activeTab = 'register'">Đăng ký miễn phí</a>
          </p>

          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label>Tên đăng nhập</label>
              <div class="input-wrapper">
                <svg class="input-icon left user-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg> <input v-model="loginForm.username" type="text" placeholder="Tên đăng nhập" required />
              </div>
            </div>

            <div class="form-group">
              <div class="label-row">
                <label>Mật khẩu</label>
                <a href="#" class="forgot-link">Quên mật khẩu?</a>
              </div>
              <div class="input-wrapper">
                <svg class="input-icon left" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                  required />
                <svg @click="showPassword = !showPassword" class="input-icon right" xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path v-if="!showPassword" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle v-if="!showPassword" cx="12" cy="12" r="3" />
                  <path v-if="showPassword" d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path v-if="showPassword"
                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path v-if="showPassword"
                    d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line v-if="showPassword" x1="2" x2="22" y1="2" y2="22" />
                </svg>
              </div>
            </div>

            <button type="submit" class="submit-button">Đăng nhập</button>

          </form>
        </div>

        <!-- Register Form -->
        <div v-else class="auth-form register-form-container">
          <h2 class="form-title">Tạo tài khoản</h2>
          <p class="form-subtitle">
            Đã có tài khoản? <a href="#" @click.prevent="activeTab = 'login'">Đăng nhập</a>
          </p>

          <form @submit.prevent="handleRegister">
            <div class="form-row">
              <div class="form-group half">
                <label>Họ</label>
                <div class="input-wrapper no-icon">
                  <svg class="input-icon left user-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input v-model="registerForm.firstName" type="text" placeholder="Nguyễn" required
                    style="padding-left: 40px;" />
                </div>
              </div>
              <div class="form-group half">
                <label>Tên</label>
                <div class="input-wrapper no-icon">
                  <input v-model="registerForm.lastName" type="text" placeholder="An" required />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Email</label>
              <div class="input-wrapper">
                <svg class="input-icon left" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input v-model="registerForm.email" type="email" placeholder="ban@vidu.com" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group half">
                <label>Tên đăng nhập</label>
                <div class="input-wrapper no-icon">
                  <input v-model="registerForm.username" type="text" placeholder="Username" required />
                </div>
              </div>
              <div class="form-group half">
                <label>Số điện thoại</label>
                <div class="input-wrapper no-icon">
                  <input v-model="registerForm.phone" type="text" placeholder="0123456789" required />
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group half">
                <label>Ngày sinh</label>
                <div class="input-wrapper no-icon">
                  <input v-model="registerForm.birthdate" type="date" required />
                </div>
              </div>
              <div class="form-group half">
                <label>Địa chỉ</label>
                <div class="input-wrapper no-icon">
                  <input v-model="registerForm.address" type="text" placeholder="Địa chỉ của bạn" required />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Mật khẩu</label>
              <div class="input-wrapper">
                <svg class="input-icon left" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input v-model="registerForm.password" :type="showRegisterPassword ? 'text' : 'password'"
                  placeholder="Tối thiểu 8 ký tự" required />
                <svg @click="showRegisterPassword = !showRegisterPassword" class="input-icon right"
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path v-if="!showRegisterPassword" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle v-if="!showRegisterPassword" cx="12" cy="12" r="3" />
                  <path v-if="showRegisterPassword" d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path v-if="showRegisterPassword"
                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path v-if="showRegisterPassword"
                    d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line v-if="showRegisterPassword" x1="2" x2="22" y1="2" y2="22" />
                </svg>
              </div>
              <p class="input-hint">Bao gồm chữ hoa, chữ thường và số để bảo mật tốt hơn.</p>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" required />
                <span>Tôi đồng ý với <a href="#">Điều khoản</a> và <a href="#">Chính sách bảo mật</a> của
                  Sandstay.</span>
              </label>
            </div>

            <button type="submit" class="submit-button">Tạo tài khoản</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiFetch } from '../utils/apiClient.js'

const router = useRouter()
const route = useRoute()
const activeTab = ref('login')

const resolveTab = (tab) => (tab === 'register' ? 'register' : 'login')

watch(
  () => route.query.tab,
  (tab) => {
    activeTab.value = resolveTab(tab)
  },
  { immediate: true }
)

const showPassword = ref(false)
const showRegisterPassword = ref(false)

const loginForm = ref({
  username: '',
  password: ''
})

const registerForm = ref({
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  phone: '',
  email: '',
  birthdate: '',
  address: '',
  role: 1
})

const handleLogin = async () => {
  try {
    const response = await apiFetch('/api/user-service/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: loginForm.value.username,
        password: loginForm.value.password
      })
    })

    const data = await response.json()

    if (response.ok) {
      if (data.message === "Login successful") {
        if (data.role === 1) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          localStorage.setItem("userId", data.userId);
          router.push("/home");
        } else {
          alert("Bạn không có quyền truy cập vào hệ thống!");
        }
      } else if (data.message === "Invalid username or password") {
        alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!')
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    alert('Có lỗi xảy ra. Vui lòng thử lại sau!')
  }
}

const handleRegister = async () => {
  try {
    const fullName = `${registerForm.value.firstName} ${registerForm.value.lastName}`.trim();

    const response = await apiFetch('/api/user-service/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: fullName,
        username: registerForm.value.username,
        password: registerForm.value.password,
        phone: registerForm.value.phone,
        email: registerForm.value.email,
        birth: registerForm.value.birthdate,
        address: registerForm.value.address,
        role: 1
      })
    })

    const data = await response.json()

    if (response.ok) {
      if (data.message === "User registered successfully") {
        alert('Đăng ký thành công! Vui lòng đăng nhập.')
        // Chuyển về tab đăng nhập
        activeTab.value = 'login'
        // Reset form
        registerForm.value = {
          firstName: '',
          lastName: '',
          username: '',
          password: '',
          phone: '',
          email: '',
          birthdate: '',
          address: ''
        }
      } else if (data.message === "Username already exists") {
        alert('Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác!')
      } else {
        alert('Đăng ký thất bại. Vui lòng thử lại!')
      }
    }
  } catch (error) {
    console.error('Register error:', error)
    alert('Có lỗi xảy ra. Vui lòng thử lại sau!')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.auth-page {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background-color: #FCFBF7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.auth-container {
  display: flex;
  width: 100%;
  max-width: 1000px;
  background: transparent;
  gap: 60px;
  align-items: stretch;
}

.auth-container.reverse-layout {
  flex-direction: row-reverse;
}

/* Image Side */
.auth-image-side {
  flex: 1;
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  min-height: 600px;
}

.auth-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.6) 100%);
}

.image-content {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 40px;
  color: white;
  width: 100%;
  box-sizing: border-box;
}

.image-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.image-desc {
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.5;
  margin-bottom: 24px;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefits-list li {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: #e5e5e5;
}

.benefits-list li .check-icon {
  margin-right: 12px;
  color: white;
  min-width: 20px;
}

/* Form Side */
.auth-form-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px 0;
}

.auth-form {
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
}

.register-form-container {
  max-width: 460px;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 8px;
}

.form-subtitle {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 30px;
}

.form-subtitle a {
  color: #1A1A1A;
  font-weight: 600;
  text-decoration: none;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-group.half {
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.register-form-container .form-group {
  margin-bottom: 16px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 8px;
}

.forgot-link {
  font-size: 0.85rem;
  color: #666;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px;
  padding-left: 44px;
  border: 1px solid #E5E5E5;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.input-wrapper.no-icon input {
  padding-left: 16px;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #614638;
}

.input-icon {
  position: absolute;
  color: #999;
}

.input-icon.left {
  left: 14px;
}

.input-icon.right {
  right: 14px;
  cursor: pointer;
}

.user-icon {
  z-index: 10;
}

.input-hint {
  font-size: 0.8rem;
  color: #666;
  margin-top: 8px;
}

.form-options {
  margin: 24px 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
  line-height: 1.4;
}

.checkbox-label input {
  margin-right: 12px;
  margin-top: 2px;
  width: 18px;
  height: 18px;
  accent-color: #614638;
  cursor: pointer;
}

.checkbox-label a {
  color: #1A1A1A;
  text-decoration: underline;
}

.submit-button {
  width: 100%;
  background-color: #614638;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #4A352A;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
  color: #999;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #E5E5E5;
}

.divider span {
  padding: 0 16px;
}

.social-buttons {
  display: flex;
  gap: 16px;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: white;
  border: 1px solid #E5E5E5;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1A1A1A;
  cursor: pointer;
  transition: background-color 0.2s;
}

.social-btn:hover {
  background-color: #F9F9F9;
}

/* Responsive */
@media (max-width: 1024px) {
  .auth-container {
    gap: 40px;
  }

  .auth-image-side {
    min-height: 480px;
  }
}

@media (max-width: 768px) {
  .auth-container {
    flex-direction: column !important;
    gap: 40px;
    align-items: center;
  }

  .auth-image-side {
    width: 100%;
    min-height: 300px;
  }

  .auth-form-side {
    width: 100%;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }
}

@media (max-width: 640px) {
  .auth-page {
    padding: 24px 16px;
  }

  .auth-image-side {
    min-height: 220px;
  }

  .image-content {
    padding: 24px;
  }

  .image-title {
    font-size: 1.5rem;
  }

  .form-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 16px 12px;
  }

  .auth-image-side {
    min-height: 180px;
  }

  .image-title {
    font-size: 1.3rem;
  }

  .submit-button {
    padding: 12px;
    font-size: 0.95rem;
  }
}
</style>
