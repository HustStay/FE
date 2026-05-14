<template>
    <div class="profile-container">
        <Navbar />

        <div class="profile-content">
            <div class="profile-header">
                <div class="profile-identity">
                    <div class="avatar-circle">{{ userInitials }}</div>
                    <div>
                        <h1 class="user-name">{{ userProfile.fullName || 'Tài khoản của bạn' }}</h1>
                        <p class="user-meta-line">
                            <span class="user-badge">Thành viên</span>
                            <span class="dot">·</span>
                            <span>Tham gia {{ userProfile.created || '--' }}</span>
                        </p>
                    </div>
                </div>
                <button class="edit-profile-btn" type="button">
                    Chỉnh sửa hồ sơ
                </button>
            </div>

            <div class="profile-grid">
                <section class="profile-card">
                    <div class="card-header">Thông tin cá nhân</div>
                    <p class="card-subtitle">Cập nhật thông tin liên hệ của bạn.</p>

                    <div class="info-grid">
                        <div class="form-group">
                            <label class="form-label">Họ</label>
                            <input type="text" class="form-input" v-model="lastName" placeholder="Nguyễn" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Tên</label>
                            <input type="text" class="form-input" v-model="firstName" placeholder="Minh Anh" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" v-model="userProfile.email"
                                placeholder="minhanh@email.com" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Số điện thoại</label>
                            <input type="tel" class="form-input" v-model="userProfile.phone" placeholder="0901234567" />
                        </div>
                        <div class="form-group full-width">
                            <label class="form-label">Địa chỉ</label>
                            <input type="text" class="form-input" v-model="userProfile.address"
                                placeholder="123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Ngày sinh</label>
                            <input type="date" class="form-input" v-model="userProfile.birth" />
                        </div>
                    </div>

                    <div class="card-actions">
                        <button class="btn-secondary" type="button">Hủy</button>
                        <button class="btn-primary" type="button">Lưu thay đổi</button>
                    </div>
                </section>

                <aside class="profile-side">
                    <section class="side-card security-card">
                        <div class="security-header">
                            <div class="security-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.82 0 5.39.95 7 2a1 1 0 0 1 1 1z" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="security-title">Bảo mật</h3>
                                <p class="security-text">Mật khẩu cập nhật lần cuối 2 tháng trước.</p>
                            </div>
                        </div>

                        <button class="outline-btn" type="button" @click="showPasswordForm = !showPasswordForm">
                            Đổi mật khẩu
                        </button>

                        <div v-if="showPasswordForm" class="password-form">
                            <div class="form-group">
                                <label class="form-label">Mật khẩu hiện tại</label>
                                <input type="password" class="form-input" v-model="passwordForm.oldPassword"
                                    placeholder="Nhập mật khẩu hiện tại" />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Mật khẩu mới</label>
                                <input type="password" class="form-input" v-model="passwordForm.newPassword"
                                    placeholder="Nhập mật khẩu mới" />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Xác nhận mật khẩu mới</label>
                                <input type="password" class="form-input" v-model="passwordForm.confirmPassword"
                                    placeholder="Nhập lại mật khẩu mới" />
                            </div>
                            <button class="btn-primary" type="button" @click="changePassword">
                                Cập nhật mật khẩu
                            </button>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { apiFetch } from '../utils/apiClient.js'

const userProfile = ref({
    email: '',
    fullName: '',
    phone: '',
    birth: '',
    address: '',
    created: ''
})

const showPasswordForm = ref(false)

const passwordForm = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const getNameParts = () => {
    return userProfile.value.fullName.trim().split(/\s+/).filter(Boolean)
}

const lastName = computed({
    get: () => {
        const parts = getNameParts()
        if (parts.length <= 1) {
            return ''
        }
        return parts.slice(0, -1).join(' ')
    },
    set: (value) => {
        const parts = getNameParts()
        const first = parts.length ? parts[parts.length - 1] : ''
        userProfile.value.fullName = [value, first].filter(Boolean).join(' ').trim()
    }
})

const firstName = computed({
    get: () => {
        const parts = getNameParts()
        return parts.length ? parts[parts.length - 1] : ''
    },
    set: (value) => {
        const parts = getNameParts()
        const last = parts.slice(0, -1).join(' ')
        userProfile.value.fullName = [last, value].filter(Boolean).join(' ').trim()
    }
})

const userInitials = computed(() => {
    const parts = getNameParts()
    if (!parts.length) {
        return 'NA'
    }
    return parts.slice(-2).map(part => part[0]).join('').toUpperCase()
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

        const response = await apiFetch('/api/user-service/profile', {
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
        const response = await apiFetch('/api/user-service/password', {
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.profile-container {
    min-height: 100vh;
    background: #FBF7F2;
    font-family: 'Inter', sans-serif;
    color: #3a2a20;
}

.profile-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 6.5rem 1.5rem 3rem;
}

.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.profile-identity {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.avatar-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #6b4a3a;
    color: white;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
}

.user-name {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.user-meta-line {
    color: #8c7b70;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.user-badge {
    font-weight: 600;
    color: #6b4a3a;
}

.dot {
    color: #c4b6ad;
}

.edit-profile-btn {
    border: 1px solid #e2d3c8;
    background: white;
    color: #3a2a20;
    border-radius: 999px;
    padding: 0.6rem 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.edit-profile-btn:hover {
    border-color: #6b4a3a;
    color: #6b4a3a;
}

.profile-grid {
    display: grid;
    grid-template-columns: minmax(0, 2.2fr) minmax(0, 1fr);
    gap: 1.5rem;
    align-items: start;
}

.profile-card,
.side-card {
    background: #FFF9F4;
    border: 1px solid #eee2d8;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
}

.card-header {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 4px;
}

.card-subtitle {
    color: #8c7b70;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem 1.25rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #6d5b50;
}

.form-input {
    padding: 0.85rem 1rem;
    border: 1px solid #e7dacf;
    border-radius: 12px;
    font-size: 0.95rem;
    background: white;
    transition: all 0.2s;
}

.form-input:focus {
    outline: none;
    border-color: #6b4a3a;
    box-shadow: 0 0 0 3px rgba(107, 74, 58, 0.12);
}

.card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
}

.btn-secondary {
    border: 1px solid #e2d3c8;
    background: white;
    color: #6d5b50;
    padding: 0.6rem 1.2rem;
    border-radius: 999px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-secondary:hover {
    border-color: #6b4a3a;
    color: #6b4a3a;
}

.btn-primary {
    border: none;
    background: #6b4a3a;
    color: white;
    padding: 0.6rem 1.2rem;
    border-radius: 999px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary:hover {
    background: #543628;
}

.security-header {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.security-icon {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: #F2E6DC;
    color: #6b4a3a;
    display: flex;
    align-items: center;
    justify-content: center;
}

.security-title {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.security-text {
    color: #8c7b70;
    font-size: 0.85rem;
}

.outline-btn {
    width: 100%;
    border: 1px solid #e2d3c8;
    background: white;
    color: #3a2a20;
    border-radius: 999px;
    padding: 0.65rem 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.outline-btn:hover {
    border-color: #6b4a3a;
    color: #6b4a3a;
}

.password-form {
    margin-top: 1rem;
    display: grid;
    gap: 0.75rem;
}

@media (max-width: 1024px) {
    .profile-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .profile-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .profile-content {
        padding: 6rem 1rem 2.5rem;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .profile-content {
        padding: 5.5rem 0.75rem 2rem;
    }

    .avatar-circle {
        width: 56px;
        height: 56px;
    }

    .user-name {
        font-size: 1.5rem;
    }
}
</style>
