<template>
    <header class="header">
        <div class="header-container">
            <div class="logo" @click.prevent="goToHome">
                <div class="logo-icon">T</div>
                <span class="logo-text">Travelstay</span>
            </div>
            
            <nav class="nav-links">
                <a href="#" @click.prevent="goToHome">Khám phá</a>
                <a href="#" @click.prevent="goToAllHotels">Khách sạn</a>
                <a href="#" @click.prevent="goToBookings">Đặt phòng của tôi</a>
            </nav>

            <div class="nav-actions">
                <div class="user-menu">
                    <a href="#" class="user-icon-link" @click.prevent="toggleMenu">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <span class="user-label">Tài khoản</span>
                    </a>
                    <div v-if="showMenu" class="dropdown-menu">
                        <div class="dropdown-header">Tài khoản của tôi</div>
                        <a href="#" class="dropdown-item" @click.prevent="goToProfile">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            Hồ sơ
                        </a>
                        <a href="#" class="dropdown-item" @click.prevent="goToBookings">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            Đặt phòng
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item logout" @click.prevent="logout">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            Đăng xuất
                        </a>
                    </div>
                </div>
            </div>

            <!-- Hamburger Menu Button (Mobile) -->
            <button class="hamburger" @click="toggleMobileMenu" :class="{ active: showMobileMenu }">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
        </div>

        <!-- Mobile Menu Overlay -->
        <div class="mobile-overlay" v-if="showMobileMenu" @click="closeMobileMenu"></div>
        
        <!-- Mobile Drawer -->
        <div class="mobile-drawer" :class="{ 'open': showMobileMenu }">
            <div class="drawer-header">
                <div class="logo">
                    <div class="logo-icon">T</div>
                    <span class="logo-text">Travelstay</span>
                </div>
                <button class="close-btn" @click="closeMobileMenu">&times;</button>
            </div>
            <div class="drawer-content">
                <a href="#" class="drawer-link" @click.prevent="goToHome">Khám phá</a>
                <a href="#" class="drawer-link" @click.prevent="goToAllHotels">Khách sạn</a>
                <a href="#" class="drawer-link" @click.prevent="goToBookings">Đặt phòng của tôi</a>
                <div class="drawer-divider"></div>
                <a href="#" class="drawer-link" @click.prevent="goToProfile">Hồ sơ của tôi</a>
                <a href="#" class="drawer-link logout" @click.prevent="logout">Đăng xuất</a>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showMenu = ref(false)
const showMobileMenu = ref(false)

const goToHome = () => {
    closeMobileMenu()
    router.push('/home')
}

const goToAllHotels = () => {
    closeMobileMenu()
    router.push('/hotels')
}

const toggleMenu = () => {
    showMenu.value = !showMenu.value
}

const toggleMobileMenu = () => {
    showMobileMenu.value = !showMobileMenu.value
    if (showMobileMenu.value) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
}

const closeMobileMenu = () => {
    showMobileMenu.value = false
    document.body.style.overflow = ''
}

const closeMenu = (e) => {
    if (!e.target.closest('.user-menu')) {
        showMenu.value = false
    }
}

const goToProfile = () => {
    showMenu.value = false
    closeMobileMenu()
    router.push('/profile')
}

const goToBookings = () => {
    showMenu.value = false
    closeMobileMenu()
    router.push('/bookings')
}

onMounted(() => {
    document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
    document.removeEventListener('click', closeMenu)
    document.body.style.overflow = ''
})

const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    window.location.href = '/'
}
</script>

<style scoped>
/* Navigation */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #FCFBF7;
    padding: 20px 0;
    z-index: 1000;
    border-bottom: 1px solid rgba(0,0,0,0.05);
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 1.1rem;
    cursor: pointer;
}

.logo-icon {
    background-color: #614638;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}

.logo-text {
    font-size: 1.25rem;
    color: #1A1A1A;
}

.nav-links {
    display: flex;
    gap: 32px;
}

.nav-links a {
    text-decoration: none;
    color: #1A1A1A;
    font-size: 0.95rem;
    font-weight: 500;
    transition: color 0.2s;
}

.nav-links a:hover {
    color: #614638;
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 20px;
}

.user-menu {
    position: relative;
}

.user-icon-link {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: #1A1A1A;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    padding: 10px 22px;
    border-radius: 50px;
    background-color: #F7F5F2;
    border: 1px solid rgba(97, 70, 56, 0.12);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-icon {
    stroke-width: 2.25px;
    color: #433427;
}

.user-icon-link:hover {
    background-color: #EFEDE8;
    border-color: rgba(97, 70, 56, 0.25);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(97, 70, 56, 0.08);
}

.dropdown-menu {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    min-width: 220px;
    overflow: hidden;
    animation: fadeIn 0.2s ease-out;
    border: 1px solid rgba(0,0,0,0.05);
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.dropdown-header {
    padding: 18px 20px 12px;
    font-size: 0.72rem;
    font-weight: 700;
    color: #8A7A6A;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    border-bottom: 1px solid #F0ECE7;
    font-family: 'Inter', sans-serif;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    color: #433427;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
}

.dropdown-item svg {
    stroke-width: 2px;
    opacity: 0.7;
    transition: all 0.2s;
}

.dropdown-item:hover {
    background-color: #F7F5F2;
    color: #614638;
}

.dropdown-item:hover svg {
    opacity: 1;
    transform: scale(1.05);
}

.dropdown-divider {
    height: 1px;
    background-color: #F0ECE7;
    margin: 4px 0;
}

.dropdown-item.logout {
    color: #E74C3C;
}

.dropdown-item.logout:hover {
    background-color: #FFF5F5;
}

/* Mobile styles */
.hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 24px;
    height: 18px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 1100;
}

.hamburger-line {
    width: 100%;
    height: 2px;
    background-color: #1A1A1A;
    border-radius: 2px;
    transition: 0.3s;
}

.hamburger.active .hamburger-line:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
}

.hamburger.active .hamburger-line:nth-child(2) {
    opacity: 0;
}

.hamburger.active .hamburger-line:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
}

.mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(4px);
    z-index: 1050;
}

.mobile-drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100vh;
    background: #FCFBF7;
    z-index: 1100;
    padding: 32px;
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.3s ease-out;
}

.mobile-drawer.open {
    transform: translateX(0);
}

.drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
}

.close-btn {
    font-size: 2rem;
    background: none;
    border: none;
    cursor: pointer;
}

.drawer-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.drawer-link {
    text-decoration: none;
    color: #1A1A1A;
    font-size: 1.1rem;
    font-weight: 500;
}

.drawer-divider {
    height: 1px;
    background-color: rgba(0,0,0,0.05);
    margin: 8px 0;
}

.drawer-link.logout {
    color: #E74C3C;
}

@media (max-width: 768px) {
    .nav-links, .nav-actions .user-label {
        display: none;
    }
    
    .hamburger {
        display: flex;
    }

    .header-container {
        padding: 0 16px;
    }
}
</style>