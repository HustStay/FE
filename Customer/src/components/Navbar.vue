<template>
    <nav class="navbar">
        <div class="nav-content">
            <div class="logo">
                <span class="logo-text" @click.prevent="goToHome">TravelStay</span>
            </div>
            <div class="nav-links">
                <a href="#" class="nav-link" @click.prevent="goToBookings">
                    <img width="25" height="25" src="https://img.icons8.com/windows/32/calendar-minus.png" alt="calendar-minus"/>
                    Đặt phòng của tôi
                </a>
                <div class="user-menu">
                    <a href="#" class="nav-link user-icon" @click.prevent="toggleMenu">
                        <img width="25" height="25" src="https://img.icons8.com/windows/32/gender-neutral-user.png"
                            alt="gender-neutral-user" />
                    </a>
                    <div v-if="showMenu" class="dropdown-menu">
                        <div class="dropdown-header">
                            Tài khoản của tôi
                        </div>
                        <a href="#" class="dropdown-item" @click.prevent="goToProfile">
                            <img width="25" height="25" src="https://img.icons8.com/windows/32/gender-neutral-user.png"
                            alt="gender-neutral-user" />
                            Hồ sơ
                        </a>
                        <a href="#" class="dropdown-item" @click.prevent="goToBookings">
                            <img width="25" height="25" src="https://img.icons8.com/windows/32/calendar-minus.png" alt="calendar-minus"/>
                            Đặt phòng
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item logout" @click.prevent="logout">
                            Đăng xuất
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showMenu = ref(false)

const goToHome = () => {
    router.push('/home')
}
const toggleMenu = () => {
    showMenu.value = !showMenu.value
}

const closeMenu = (e) => {
    if (!e.target.closest('.user-menu')) {
        showMenu.value = false
    }
}

const goToProfile = () => {
    showMenu.value = false
    router.push('/profile')
}

const goToBookings = () => {
    showMenu.value = false
    router.push('/bookings')
}

onMounted(() => {
    document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
    document.removeEventListener('click', closeMenu)
})

const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    window.location.href = '/'
}
</script>

<style scoped>
/* Navigation */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: hsl(0 0% 100% / 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    z-index: 100;
}

@supports (backdrop-filter: blur(12px)) {
    .navbar {
        background: hsl(0 0% 100% / 0.6);
    }
}

.nav-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: #22a6d6;
}

.logo:hover{
    cursor: pointer;
}

.nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s;
}

.nav-link:hover {
    color: #22a6d6;
}

/* User Menu */
.user-menu {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    top: calc(100% + 1rem);
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    min-width: 200px;
    overflow: hidden;
    animation: slideDown 0.2s ease;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dropdown-header {
    padding: 1rem 1.25rem;
    font-weight: 600;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.95rem;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    color: #333;
    text-decoration: none;
    transition: background 0.2s;
    font-size: 0.95rem;
}

.dropdown-item:hover {
    background: #f5f7fa;
}

.dropdown-item.logout {
    color: #e74c3c;
    font-weight: 500;
}

.dropdown-item.logout:hover {
    background: #ffebee;
}

.dropdown-divider {
    height: 1px;
    background: #f0f0f0;
    margin: 0.5rem 0;
}
</style>