<template>
    <nav class="navbar">
        <div class="nav-content">
            <div class="logo">
                <span class="logo-text" @click.prevent="goToHome">TravelStay</span>
            </div>
            
            <!-- Hamburger Menu Button (Mobile) -->
            <button class="hamburger" @click="toggleMobileMenu" :class="{ active: showMobileMenu }">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
            
            <!-- Desktop Navigation -->
            <div class="nav-links" :class="{ 'mobile-open': showMobileMenu }">
                <a href="#" class="nav-link" @click.prevent="goToBookings">
                    <img width="25" height="25" src="https://img.icons8.com/windows/32/calendar-minus.png" alt="calendar-minus"/>
                    Đặt phòng của tôi
                </a>
                <div class="user-menu">
                    <a href="#" class="nav-link user-icon" @click.prevent="toggleMenu">
                        <img width="25" height="25" src="https://img.icons8.com/windows/32/gender-neutral-user.png"
                            alt="gender-neutral-user" />
                        <span class="mobile-only">Tài khoản</span>
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
            
            <!-- Mobile Menu Overlay -->
            <div class="mobile-overlay" v-if="showMobileMenu" @click="closeMobileMenu"></div>
        </div>
    </nav>
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

/* Hamburger Menu Button */
.hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 28px;
    height: 24px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 110;
}

.hamburger-line {
    width: 100%;
    height: 3px;
    background: #333;
    border-radius: 2px;
    transition: all 0.3s ease;
}

.hamburger.active .hamburger-line:nth-child(1) {
    transform: rotate(45deg) translate(6px, 6px);
}

.hamburger.active .hamburger-line:nth-child(2) {
    opacity: 0;
}

.hamburger.active .hamburger-line:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
}

/* Mobile Overlay */
.mobile-overlay {
    display: none;
}

/* Mobile Only Text */
.mobile-only {
    display: none;
}

/* ==================== RESPONSIVE STYLES ==================== */

/* Tablet (1024px) */
@media (max-width: 1024px) {
    .nav-content {
        padding: 1rem 1.5rem;
    }
    
    .nav-links {
        gap: 1.5rem;
    }
}

/* Tablet Portrait (768px) */
@media (max-width: 768px) {
    .hamburger {
        display: flex;
    }
    
    .nav-content {
        padding: 0.875rem 1rem;
    }
    
    .logo {
        font-size: 1.25rem;
    }
    
    .nav-links {
        position: fixed;
        top: 0;
        right: 0;
        width: 280px;
        height: 100vh;
        background: white;
        flex-direction: column;
        padding: 80px 24px 24px;
        gap: 0;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s ease;
        z-index: 105;
        align-items: stretch;
        transform: translateX(100%);
        visibility: hidden;
    }
    
    .nav-links.mobile-open {
        transform: translateX(0);
        visibility: visible;
    }
    
    .nav-link {
        padding: 16px 0;
        border-bottom: 1px solid #f0f0f0;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .nav-link img {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
    }
    
    .nav-link:last-child {
        border-bottom: none;
    }
    
    .mobile-only {
        display: inline;
    }
    
    .user-menu {
        width: 100%;
    }
    
    .user-menu .nav-link {
        width: 100%;
        justify-content: flex-start;
    }
    
    .dropdown-menu {
        position: static;
        box-shadow: none;
        border: 1px solid #e5e7eb;
        margin-top: 8px;
        animation: none;
    }
    
    .mobile-overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100;
    }
}

/* Mobile (640px) */
@media (max-width: 640px) {
    .nav-content {
        padding: 0.75rem 1rem;
    }
    
    .logo {
        font-size: 1.125rem;
    }
    
    .nav-links {
        width: 100%;
        transform: translateX(100%);
        padding: 70px 20px 20px;
    }
    
    .nav-links.mobile-open {
        transform: translateX(0);
    }
    
    .nav-link {
        padding: 14px 0;
        font-size: 0.95rem;
    }
    
    .dropdown-header {
        padding: 0.875rem 1rem;
        font-size: 0.9rem;
    }
    
    .dropdown-item {
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
    }
}

/* Small Mobile (480px) */
@media (max-width: 480px) {
    .hamburger {
        width: 24px;
        height: 20px;
    }
    
    .hamburger-line {
        height: 2px;
    }
    
    .hamburger.active .hamburger-line:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active .hamburger-line:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
    }
    
    .nav-link img {
        width: 22px;
        height: 22px;
    }
}
</style>