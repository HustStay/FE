<template>
  <div class="login-container">
    <div class="login-box">
      <div class="icon-wrapper">
        <div class="hotel-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M19 7h-1V2H6v5H5C3.346 7 2 8.346 2 10v12h20V10c0-1.654-1.346-3-3-3zM8 4h8v3H8V4zm-4 6c0-.551.449-1 1-1h14c.551 0 1 .449 1 1v2H4v-2zm0 10v-6h16v6H4z"
            />
            <path d="M6 14h2v4H6zM10 14h2v4h-2zM14 14h2v4h-2z" />
          </svg>
        </div>
      </div>

      <h1 class="title">Hệ Thống Quản Lý Khách Sạn</h1>
      <p class="subtitle">Đăng nhập để tiếp tục</p>

      <div class="form-container">
        <div class="form-content">
          <h2 class="form-title">Đăng Nhập</h2>
          <p class="form-subtitle">Nhập thông tin đăng nhập của bạn</p>

          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="username">Tên đăng nhập</label>
              <input
                id="username"
                v-model="loginForm.username"
                type="text"
                placeholder="Tên đăng nhập"
                required
              />
            </div>

            <div class="form-group">
              <label for="password">Mật khẩu</label>
              <input
                id="password"
                v-model="loginForm.password"
                type="password"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <button type="submit" class="submit-btn">Đăng Nhập</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { apiFetch } from "../utils/apiClient.js";

const router = useRouter();

const loginForm = ref({
  username: "",
  password: "",
});

const handleLogin = async () => {
  try {
    const response = await apiFetch("/api/user-service/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: loginForm.value.username,
        password: loginForm.value.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.message === "Login successful") {
        if (data.role === 2 || data.role === 4 || data.role === 5 || data.role === 6) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          localStorage.setItem("userId", data.userId);

          // Fetch hotelId for this user (owner/staff) right after login
          try {
            const hotelRes = await apiFetch('/api/hotel-service/login-hotelId', {
              headers: {
                'Authorization': `Bearer ${data.token}`,
                'Content-Type': 'application/json'
              },
              params: {
                userId: data.userId,
                role: data.role
              },
            });
            const hotelData = await hotelRes.json();
            if (hotelData.hotelId) {
              localStorage.setItem("hotelId", hotelData.hotelId);
            } else {
              localStorage.removeItem("hotelId");
            }
          } catch (e) {
            console.error('Failed to fetch hotelId:', e);
          }

          router.push("/home");
        } else {
          alert("Bạn không có quyền truy cập vào hệ thống!");
        }
      } else if (data.message === "Invalid username or password") {
        alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Có lỗi xảy ra. Vui lòng thử lại sau!");
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 520px;
  text-align: center;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.hotel-icon {
  width: 80px;
  height: 80px;
  background: #f5b301;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e293b;
}

.hotel-icon svg {
  width: 40px;
  height: 40px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 16px;
  color: #94a3b8;
  margin: 0 0 32px 0;
}

.form-container {
  background: #f8fafc;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.form-content {
  text-align: left;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.form-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 28px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: #ffffff;
  color: #1e293b;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #f5b301;
  box-shadow: 0 0 0 3px rgba(245, 179, 1, 0.1);
}

.form-group input::placeholder {
  color: #94a3b8;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  background: #f5b301;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.submit-btn:hover {
  background: #d99e01;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 179, 1, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .login-container {
    padding: 12px;
  }

  .form-container {
    padding: 28px 20px;
  }

  .title {
    font-size: 26px;
  }

  .subtitle {
    font-size: 14px;
  }
}
</style>
