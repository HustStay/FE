<template>
    <div class="profile-container">
        <Navbar />

        <div class="profile-content">
            <!-- Profile Header Card -->
            <div class="profile-header-card">
                <div class="avatar-section">
                    <div class="avatar-wrapper">
                        <img src="https://img.icons8.com/color/96/000000/user-female-circle--v1.png" alt="Avatar"
                            class="avatar">
                    </div>
                </div>
                <div class="user-info">
                    <h1 class="user-name">{{ userProfile.fullName }}</h1>
                    <p class="user-email">{{ userProfile.email }}</p>
                    <div class="user-meta">
                        <span class="meta-item">
                            <img width="20" height="20" src="https://img.icons8.com/windows/32/calendar-minus.png"
                                alt="calendar-minus" />
                            Tham gia từ {{ userProfile.created }}
                        </span>
                        <span class="meta-item">
                            <img width="20" height="20" src="https://img.icons8.com/windows/32/marker.png"
                                alt="marker" />
                            {{ userProfile.address }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="tabs-container">
                <button :class="['tab-btn', { active: activeTab === 'info' }]" @click="activeTab = 'info'">
                    Thông tin cá nhân
                </button>
                <button :class="['tab-btn', { active: activeTab === 'security' }]" @click="activeTab = 'security'">
                    Bảo mật
                </button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
                <!-- Personal Info Tab -->
                <div v-if="activeTab === 'info'" class="info-section">
                    <div class="section-header">
                        <h2 class="section-title">Thông tin cá nhân</h2>
                        <p class="section-subtitle">Cập nhật thông tin cá nhân của bạn</p>
                    </div>

                    <button class="edit-btn">Chỉnh sửa</button>

                    <div class="form-grid">
                        <div class="form-group full-width">
                            <label class="form-label">
                                <img width="20" height="20"
                                    src="https://img.icons8.com/windows/32/gender-neutral-user.png"
                                    alt="gender-neutral-user" />
                                Họ và tên
                            </label>
                            <input type="text" class="form-input" v-model="userProfile.fullName"
                                placeholder="Nguyễn Văn A">
                        </div>

                        <div class="form-group full-width">
                            <label class="form-label">
                                <img width="20" height="20"
                                    src="https://img.icons8.com/windows/32/secured-letter--v1.png"
                                    alt="secured-letter--v1" />
                                Email
                            </label>
                            <input type="email" class="form-input" v-model="userProfile.email"
                                placeholder="nguyenvana@email.com">
                        </div>

                        <div class="form-group">
                            <label class="form-label">
                                <img width="20" height="20" src="https://img.icons8.com/windows/32/smartphone--v1.png"
                                    alt="smartphone--v1" />
                                Số điện thoại
                            </label>
                            <input type="tel" class="form-input" v-model="userProfile.phone" placeholder="0901234567">
                        </div>

                        <div class="form-group">
                            <label class="form-label">
                                <img width="20" height="20" src="https://img.icons8.com/windows/32/gift.png"
                                    alt="gift" />
                                Ngày sinh
                            </label>
                            <input type="date" class="form-input" v-model="userProfile.birth">
                        </div>

                        <div class="form-group full-width">
                            <label class="form-label">
                                <img width="20" height="20" src="https://img.icons8.com/windows/32/marker.png"
                                    alt="marker" />
                                Địa chỉ
                            </label>
                            <input type="text" class="form-input" v-model="userProfile.address"
                                placeholder="Hà Nội, Việt Nam">
                        </div>
                    </div>
                </div>

                <!-- Security Tab -->
                <div v-if="activeTab === 'security'" class="security-section">
                    <div class="section-header">
                        <h2 class="section-title">Bảo mật</h2>
                        <p class="section-subtitle">Quản lý mật khẩu và cài đặt bảo mật</p>
                    </div>

                    <div class="form-container">
                        <div class="form-group">
                            <label class="form-label">
                                <img width="20" height="20" src="https://img.icons8.com/windows/32/lock.png"
                                    alt="lock" />
                                Mật khẩu hiện tại
                            </label>
                            <input type="password" class="form-input" v-model="passwordForm.oldPassword"
                                placeholder="Nhập mật khẩu hiện tại">
                        </div>

                        <div class="form-group">
                            <label class="form-label">
                                <img width="20" height="20" src="https://img.icons8.com/windows/32/lock.png"
                                    alt="lock" />
                                Mật khẩu mới
                            </label>
                            <input type="password" class="form-input" v-model="passwordForm.newPassword"
                                placeholder="Nhập mật khẩu mới">
                        </div>

                        <div class="form-group">
                            <label class="form-label">
                                <img width="20" height="20" src="https://img.icons8.com/windows/32/lock.png"
                                    alt="lock" />
                                Xác nhận mật khẩu mới
                            </label>
                            <input type="password" class="form-input" v-model="passwordForm.confirmPassword"
                                placeholder="Nhập lại mật khẩu mới">
                        </div>

                        <button class="submit-btn" @click="changePassword">
                            Đổi mật khẩu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'

const activeTab = ref('info')

const userProfile = ref({
    email: '',
    fullName: '',
    phone: '',
    birth: '',
    address: '',
    created: ''
})

const passwordForm = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${year}`
}

const fetchProfile = async () => {
    try {
        const token = localStorage.getItem('token')
        if (!token) {
            window.location.href = '/'
            return
        }

        const response = await fetch('/api/user-service/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()

        if (response.ok) {
            if (data.message === "User found") {
                userProfile.value = {
                    email: data.profile.email || '',
                    fullName: data.profile.fullName || '',
                    phone: data.profile.phone || '',
                    birth: data.profile.birth || '',
                    address: data.profile.address || '',
                    created: formatDate(data.profile.created) || ''
                }
            }
            else if (data.message === "User not found") {
                alert('Người dùng không tồn tại!')
            }
        }
    } catch (error) {
        console.error('Error fetching profile:', error)
        alert('Có lỗi xảy ra khi tải thông tin!')
    }
}

const changePassword = async () => {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        alert('Mật khẩu mới không khớp!')
        return
    }

    try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/user-service/password', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                oldPassword: passwordForm.value.oldPassword,
                newPassword: passwordForm.value.newPassword
            })
        })
        
        const data = await response.json()
        if (response.ok) {
            if (data.message === "Password updated successfully") {
                alert('Đổi mật khẩu thành công!')
                passwordForm.value.oldPassword = ''
                passwordForm.value.newPassword = ''
                passwordForm.value.confirmPassword = ''
            } else if (data.message === "Password updated failed") {
                alert('Đổi mật khẩu thất bại!')
            }
        }
    } catch (error) {
        console.error('Error changing password:', error)
        alert('Có lỗi xảy ra!')
    }
}

onMounted(() => {
    fetchProfile()
})
</script>

<style scoped>
.profile-container {
    min-height: 100vh;
    background: #f5f7fa;
}

.profile-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 6rem 2rem 3rem;
}

/* Profile Header Card */
.profile-header-card {
    background: white;
    border-radius: 16px;
    padding: 2.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
}

.avatar-section {
    flex-shrink: 0;
}

.avatar-wrapper {
    position: relative;
    width: 120px;
    height: 120px;
}

.avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.avatar-edit-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: white;
    border: 2px solid #22a6d6;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all 0.3s;
}

.avatar-edit-btn:hover {
    background: #22a6d6;
    transform: scale(1.05);
}

.user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.user-name {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.5px;
}

.user-email {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 1rem;
}

.user-meta {
    display: flex;
    gap: 2rem;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
    font-size: 0.95rem;
}

/* Tabs */
.tabs-container {
    display: flex;
    gap: 1rem;
    border-bottom: 2px solid #e0e0e0;
    margin-bottom: 2rem;
}

.tab-btn {
    padding: 1rem 2rem;
    background: none;
    border: none;
    color: #666;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    transition: color 0.3s;
}

.tab-btn:hover {
    color: #22a6d6;
}

.tab-btn.active {
    color: #22a6d6;
}

.tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: #22a6d6;
}

/* Tab Content */
.tab-content {
    background: white;
    border-radius: 16px;
    padding: 2.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.5rem;
}

.section-subtitle {
    color: #666;
    font-size: 0.95rem;
}

/* Info Section */
.info-section {
    position: relative;
}

.edit-btn {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.75rem 1.5rem;
    background: #22a6d6;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.edit-btn:hover {
    background: #1a8bb5;
    transform: translateY(-2px);
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-top: 5px;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    color: #333;
    font-weight: 600;
    font-size: 0.95rem;
}

.form-input {
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s;
    background: #f9f9f9;
}

.form-input:focus {
    outline: none;
    border-color: #22a6d6;
    background: white;
}

.form-input::placeholder {
    color: #999;
}

/* Security Section */
.security-section {
    position: relative;
}

.form-container {
    max-width: 600px;
}

.submit-btn {
    width: 100%;
    padding: 1rem 2rem;
    background: #22a6d6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1rem;
    transition: all 0.3s;
}

.submit-btn:hover {
    background: #1a8bb5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 166, 214, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
    .profile-header-card {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .user-meta {
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .form-group.full-width {
        grid-column: 1;
    }

    .edit-btn {
        position: static;
        width: 100%;
        margin-bottom: 1.5rem;
    }

    .tabs-container {
        overflow-x: auto;
    }
}
</style>
