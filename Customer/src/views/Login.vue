<template>
    <div class="auth-container">
        <!-- Left side with branding -->
        <div class="auth-left">
            <div class="auth-left-overlay"></div>
            <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200" 
                alt="Luxury resort" 
                class="auth-left-bg"
            />
            <div class="brand-content">
                <h1 class="brand-welcome">Chào mừng đến với</h1>
                <h1 class="brand-name">
                    <span class="brand-travel">Travel</span><span class="brand-stay">Stay</span>
                </h1>
                <p class="brand-tagline">Khám phá và đặt phòng tại những khách sạn tuyệt vời nhất trên thế giới</p>
            </div>
        </div>

        <!-- Right side with form -->
        <div class="auth-right">
            <div class="auth-tabs">
                <button :class="['tab-button', { active: activeTab === 'login' }]" @click="activeTab = 'login'">
                    Đăng nhập
                </button>
                <button :class="['tab-button', { active: activeTab === 'register' }]" @click="activeTab = 'register'">
                    Đăng ký
                </button>
            </div>

            <!-- Login Form -->
            <div v-if="activeTab === 'login'" class="auth-form">
                <h2 class="form-title">Đăng nhập</h2>
                <p class="form-subtitle">Nhập thông tin để truy cập tài khoản của bạn</p>

                <form @submit.prevent="handleLogin">
                    <div class="form-group">
                        <label for="login-username">Tên đăng nhập</label>
                        <input id="login-username" v-model="loginForm.username" type="text" placeholder="Tên đăng nhập"
                            required />
                    </div>

                    <div class="form-group">
                        <label for="login-password">Mật khẩu</label>
                        <input id="login-password" v-model="loginForm.password" type="password" placeholder="••••••••"
                            required />
                    </div>

                    <button type="submit" class="submit-button">Đăng nhập</button>

                    <a href="#" class="forgot-password">Quên mật khẩu?</a>

                    <p class="terms-text">
                        Bằng việc tiếp tục, bạn đồng ý với
                        <a href="#">Điều khoản dịch vụ</a> và
                        <a href="#">Chính sách bảo mật</a>
                    </p>
                </form>
            </div>

            <!-- Register Form -->
            <div v-else class="auth-form">
                <h2 class="form-title">Đăng ký</h2>
                <p class="form-subtitle">Tạo tài khoản mới để bắt đầu đặt phòng</p>

                <form @submit.prevent="handleRegister">
                    <div class="form-group">
                        <label for="register-name">Họ và tên</label>
                        <input id="register-name" v-model="registerForm.name" type="text" placeholder="Nguyễn Văn A"
                            required />
                    </div>

                    <div class="form-group">
                        <label for="register-phone">Số điện thoại</label>
                        <input id="register-phone" v-model="registerForm.phone" type="text" placeholder="0123456789"
                            required />
                    </div>

                    <div class="form-group">
                        <label for="register-email">Email</label>
                        <input id="register-email" v-model="registerForm.email" type="email"
                            placeholder="example@email.com" required />
                    </div>

                    <div class="form-group">
                        <label for="register-birthdate">Ngày sinh</label>
                        <input id="register-birthdate" v-model="registerForm.birthdate" type="date"
                            placeholder="Ngày sinh" required />
                    </div>

                    <div class="form-group">
                        <label for="register-address">Địa chỉ</label>
                        <input id="register-address" v-model="registerForm.address" type="text"
                            placeholder="Hà Nội, Việt Nam" required />
                    </div>

                    <div class="form-group">
                        <label for="register-username">Tên đăng nhập</label>
                        <input id="register-username" v-model="registerForm.username" type="text"
                            placeholder="Tên đăng nhập" required />
                    </div>

                    <div class="form-group">
                        <label for="register-password">Mật khẩu</label>
                        <input id="register-password" v-model="registerForm.password" type="password"
                            placeholder="••••••••" required />
                    </div>

                    <button type="submit" class="submit-button">Đăng ký</button>

                    <p class="terms-text">
                        Bằng việc tiếp tục, bạn đồng ý với
                        <a href="#">Điều khoản dịch vụ</a> và
                        <a href="#">Chính sách bảo mật</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('login')

const loginForm = ref({
    username: '',
    password: ''
})

const registerForm = ref({
    fullName: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    birth: '',
    address: '',
    role: 1
})

const handleLogin = async () => {
    try {
        const response = await fetch('/api/user-service/auth/login', {
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
        const response = await fetch('/api/user-service/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName: registerForm.value.name,
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
                    name: '',
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
.auth-container {
    display: flex;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
}

/* Left side - Branding */
.auth-left {
    flex: 1;
    position: fixed;
    left: 0;
    top: 0;
    width: 45%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: white;
    overflow: hidden;
}

.auth-left-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
}

.auth-left-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(34, 166, 214, 0.9) 0%, rgba(61, 124, 145, 0.85) 100%);
    z-index: 2;
}

.brand-content {
    max-width: 500px;
    position: relative;
    z-index: 3;
}

.brand-welcome {
    font-size: 3rem;
    font-weight: 400;
    margin-bottom: 0;
    line-height: 1.2;
}

.brand-name {
    font-size: 4rem;
    font-weight: 700;
    margin: 10px 0 30px 0;
    line-height: 1.2;
}

.brand-travel {
    color: white;
}

.brand-stay {
    color: #ff8c42;
}

.brand-tagline {
    font-size: 1.1rem;
    line-height: 1.6;
    opacity: 0.95;
}

/* Right side - Form */
.auth-right {
    flex: 1;
    margin-left: 50%;
    background: #f5f7fa;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 40px;
    min-height: 100vh;
}

.auth-tabs {
    display: flex;
    gap: 0;
    margin-bottom: 40px;
    background: #e8ecf0;
    padding: 6px;
    border-radius: 50px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab-button {
    background: transparent;
    border: none;
    color: #6b7280;
    font-size: 0.95rem;
    font-weight: 400;
    padding: 12px 40px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 50px;
    white-space: nowrap;
}

.tab-button.active {
    background: white;
    color: #1f2937;
    font-weight: 500;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.auth-form {
    background: white;
    border-radius: 16px;
    padding: 50px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-title {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 10px;
}

.form-subtitle {
    color: #666;
    margin-bottom: 30px;
    font-size: 0.95rem;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    color: #333;
    font-weight: 500;
    margin-bottom: 8px;
    font-size: 0.95rem;
}

.form-group input {
    width: 100%;
    padding: 14px 18px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.form-group input:focus {
    outline: none;
    border-color: #22a6d6;
    box-shadow: 0 0 0 3px rgba(34, 166, 214, 0.1);
}

.form-group input::placeholder {
    color: #aaa;
}

.submit-button {
    width: 100%;
    background: #22a6d6;
    color: white;
    border: none;
    padding: 16px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
}

.submit-button:hover {
    background: #1a8bb5;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(34, 166, 214, 0.3);
}

.forgot-password {
    display: block;
    text-align: center;
    color: #22a6d6;
    text-decoration: none;
    margin-top: 20px;
    font-size: 0.95rem;
    font-weight: 500;
}

.forgot-password:hover {
    text-decoration: underline;
}

.terms-text {
    text-align: center;
    color: #666;
    font-size: 0.85rem;
    margin-top: 30px;
    line-height: 1.5;
}

.terms-text a {
    color: #22a6d6;
    text-decoration: none;
}

.terms-text a:hover {
    text-decoration: underline;
}

/* Responsive */
@media (max-width: 968px) {
    .auth-container {
        flex-direction: column;
    }

    .auth-left {
        position: relative;
        width: 100%;
        height: auto;
        min-height: 300px;
    }

    .auth-right {
        margin-left: 0;
    }

    .brand-welcome {
        font-size: 2rem;
    }

    .brand-name {
        font-size: 3rem;
    }

    .brand-tagline {
        font-size: 1rem;
    }

    .auth-form {
        padding: 30px;
    }
}
</style>
