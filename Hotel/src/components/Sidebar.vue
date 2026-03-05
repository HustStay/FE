<template>
  <aside class="sidebar">
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
    </div>

    <nav class="sidebar-nav">
      <h3 class="nav-title">Menu chính</h3>
      <router-link to="/home" class="nav-item" :class="{ active: isActive('/home') }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
        <span>Tổng quan</span>
      </router-link>
      <router-link to="/rooms" class="nav-item" :class="{ active: isActive('/rooms') }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 7h-1V2H6v5H5C3.346 7 2 8.346 2 10v12h20V10c0-1.654-1.346-3-3-3zM8 4h8v3H8V4zm-4 6c0-.551.449-1 1-1h14c.551 0 1 .449 1 1v2H4v-2zm0 10v-6h16v6H4z"/>
        </svg>
        <span>Quản lý phòng</span>
      </router-link>
      <router-link to="/bookings" class="nav-item" :class="{ active: isActive('/bookings') }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.346 4 2 5.346 2 7v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3V7c0-1.654-1.346-3-3-3zm1 17c0 .551-.449 1-1 1H5c-.551 0-1-.449-1-1V10h16v11zm0-13H4V7c0-.551.449-1 1-1h14c.551 0 1 .449 1 1v1z"/>
        </svg>
        <span>Đặt phòng</span>
      </router-link>
      <router-link to="/comments" class="nav-item" :class="{ active: isActive('/comments') }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
        <span>Bình luận</span>
      </router-link>
      <a href="#" class="nav-item" @click.prevent="handleLogout">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
        </svg>
        <span>Đăng xuất</span>
      </a>
    </nav>
  </aside>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isActive = (path) => {
  return route.path === path
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/')
}
</script>

<style scoped>
.sidebar {
  width: 270px;
  background: #1e293b;
  color: #fff;
  padding: 24px 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
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

@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s;
    z-index: 1000;
  }
}
</style>
