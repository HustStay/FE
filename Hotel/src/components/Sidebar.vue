<template>
  <div>
    <!-- Mobile Hamburger Button -->
    <button class="sidebar-toggle" @click="toggleSidebar" :class="{ active: isOpen }">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
    
    <!-- Overlay for mobile -->
    <div class="sidebar-overlay" v-if="isOpen" @click="closeSidebar"></div>
    
    <aside class="sidebar" :class="{ open: isOpen }">
      <div class="sidebar-header">
        <div class="logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 7h-1V2H6v5H5C3.346 7 2 8.346 2 10v12h20V10c0-1.654-1.346-3-3-3zM8 4h8v3H8V4zm-4 6c0-.551.449-1 1-1h14c.551 0 1 .449 1 1v2H4v-2zm0 10v-6h16v6H4z"/>
            <path d="M6 14h2v4H6zM10 14h2v4h-2zM14 14h2v4h-2z"/>
          </svg>
        </div>
        <div class="brand">
          <h2>HotelMS</h2>
          <p>Quản lý khách sạn</p>
        </div>
        <!-- Mobile close button -->
        <button class="sidebar-close" @click="closeSidebar">×</button>
      </div>

      <nav class="sidebar-nav">
        <h3 class="nav-title">Menu chính</h3>
        <router-link to="/home" class="nav-item" :class="{ active: isActive('/home') }" @click="closeSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
          <span>Tổng quan</span>
        </router-link>
        <router-link to="/rooms" class="nav-item" :class="{ active: isActive('/rooms') }" @click="closeSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 7h-1V2H6v5H5C3.346 7 2 8.346 2 10v12h20V10c0-1.654-1.346-3-3-3zM8 4h8v3H8V4zm-4 6c0-.551.449-1 1-1h14c.551 0 1 .449 1 1v2H4v-2zm0 10v-6h16v6H4z"/>
          </svg>
          <span>Quản lý phòng</span>
        </router-link>
        <router-link to="/bookings" class="nav-item" :class="{ active: isActive('/bookings') }" @click="closeSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.346 4 2 5.346 2 7v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3V7c0-1.654-1.346-3-3-3zm1 17c0 .551-.449 1-1 1H5c-.551 0-1-.449-1-1V10h16v11zm0-13H4V7c0-.551.449-1 1-1h14c.551 0 1 .449 1 1v1z"/>
          </svg>
          <span>Đặt phòng</span>
        </router-link>
        <router-link to="/comments" class="nav-item" :class="{ active: isActive('/comments') }" @click="closeSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
          <span>Bình luận</span>
        </router-link>
        <router-link to="/staff" class="nav-item" :class="{ active: isActive('/staff') }" @click="closeSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          <span>Nhân viên</span>
        </router-link>
        <router-link to="/chat" class="nav-item" :class="{ active: isActive('/chat') }" @click="closeSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>Tin nhắn</span>
        </router-link>
        <a href="#" class="nav-item" @click.prevent="handleLogout">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          <span>Đăng xuất</span>
        </a>
      </nav>
    </aside>
  </div>
</template>

<script setup>
defineOptions({
  name: 'HotelSidebar'
})

import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isOpen = ref(false)

const isActive = (path) => {
  return route.path === path
}

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeSidebar = () => {
  isOpen.value = false
  document.body.style.overflow = ''
}

const handleLogout = () => {
  closeSidebar()
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/')
}

const handleResize = () => {
  if (window.innerWidth > 1024) {
    closeSidebar()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Sidebar Toggle Button (Hamburger) */
.sidebar-toggle {
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1001;
  width: 44px;
  height: 44px;
  background: #1e293b;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.sidebar-toggle.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.sidebar-toggle.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.sidebar-toggle.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Sidebar Overlay */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Close button (mobile) */
.sidebar-close {
  display: none;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  line-height: 1;
}

.sidebar-close:hover {
  color: white;
}

.sidebar {
  width: 270px;
  background: #1e293b;
  color: #fff;
  padding: 24px 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
  transition: transform 0.3s ease;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px 24px;
}

.logo {
  width: 48px;
  height: 48px;
  background: #3b82f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo svg {
  width: 28px;
  height: 28px;
  color: white;
}

.brand h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 2px;
}

.brand p {
  font-size: 13px;
  color: #94a3b8;
}

.sidebar-nav {
  padding: 0 16px;
}

.nav-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #64748b;
  margin: 24px 8px 12px;
  letter-spacing: 0.5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 4px;
  color: #cbd5e1;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 14px;
}

.nav-item svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-item:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #fff;
}

.nav-item.active {
  background: #3b82f6;
  color: #fff;
}

/* ==================== RESPONSIVE STYLES ==================== */

@media (max-width: 1024px) {
  .sidebar-toggle {
    display: flex;
  }
  
  .sidebar-overlay {
    display: block;
  }
  
  .sidebar-close {
    display: block;
  }
  
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .sidebar-toggle {
    top: 12px;
    left: 12px;
    width: 40px;
    height: 40px;
    padding: 10px;
  }
  
  .hamburger-line {
    width: 18px;
  }
  
  .sidebar {
    width: 260px;
    padding: 20px 0;
  }
  
  .sidebar-header {
    padding: 0 20px 20px;
  }
  
  .logo {
    width: 42px;
    height: 42px;
  }
  
  .logo svg {
    width: 24px;
    height: 24px;
  }
  
  .brand h2 {
    font-size: 18px;
  }
  
  .brand p {
    font-size: 12px;
  }
  
  .sidebar-nav {
    padding: 0 12px;
  }
  
  .nav-item {
    padding: 10px 14px;
    font-size: 13px;
  }
  
  .nav-item svg {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 480px) {
  .sidebar-toggle {
    top: 10px;
    left: 10px;
    width: 36px;
    height: 36px;
    padding: 8px;
    border-radius: 8px;
  }
  
  .hamburger-line {
    width: 16px;
    height: 2px;
  }
  
  .sidebar-toggle.active .hamburger-line:nth-child(1) {
    transform: rotate(45deg) translate(4px, 4px);
  }
  
  .sidebar-toggle.active .hamburger-line:nth-child(3) {
    transform: rotate(-45deg) translate(4px, -4px);
  }
  
  .sidebar {
    width: 100%;
    max-width: 280px;
    padding: 16px 0;
  }
  
  .sidebar-header {
    padding: 0 16px 16px;
    gap: 10px;
  }
  
  .logo {
    width: 38px;
    height: 38px;
    border-radius: 10px;
  }
  
  .logo svg {
    width: 22px;
    height: 22px;
  }
  
  .brand h2 {
    font-size: 16px;
  }
  
  .brand p {
    font-size: 11px;
  }
  
  .sidebar-close {
    font-size: 24px;
  }
  
  .nav-title {
    font-size: 10px;
    margin: 16px 8px 10px;
  }
  
  .nav-item {
    padding: 10px 12px;
    font-size: 13px;
    gap: 10px;
  }
}
</style>
