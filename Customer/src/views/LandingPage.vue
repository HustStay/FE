<template>
  <div class="landing-page">
    <!-- Header -->
    <header class="header">
      <div class="header-container">
        <div class="logo">
          <div class="logo-icon">T</div>
          <span class="logo-text">Travelstay</span>
        </div>
        <nav class="nav-links">
          <a href="#">Khám phá</a>
          <a href="#">Khách sạn</a>
        </nav>
        <div class="nav-actions">
          <RouterLink class="login-btn" to="/login?tab=login">Đăng nhập</RouterLink>
          <RouterLink class="register-btn" to="/login?tab=register">Đăng ký</RouterLink>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-card">
          <img 
            src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200" 
            alt="Hero Background" 
            class="hero-img"
          />
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <span class="badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              BỘ SƯU TẬP MÙA HÈ 2026
            </span>
            <h1 class="hero-title">Tìm chốn ấm áp cho hành<br>trình tiếp theo của bạn.</h1>
            <p class="hero-subtitle">Hơn 12,000 khách sạn boutique và resort được tuyển chọn — từ vịnh<br>ngọc Phú Quốc đến rừng thông Sa Pa.</p>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="search-bar-wrapper">
          <div class="search-bar">
            <div class="search-item">
              <span class="search-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                ĐIỂM ĐẾN
              </span>
              <input type="text" placeholder="Đà Nẵng, Hội An, Phú Quốc..." />
            </div>
            <div class="search-divider"></div>
            <div class="search-item">
              <span class="search-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                NHẬN - TRẢ PHÒNG
              </span>
              <input type="text" placeholder="12/05 - 16/05" />
            </div>
            <div class="search-divider"></div>
            <div class="search-item">
              <span class="search-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                KHÁCH & PHÒNG
              </span>
              <input type="text" placeholder="2 khách - 1 phòng" />
            </div>
            <button class="search-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Links -->
    <section class="quick-links">
      <div class="container">
        <span class="quick-label">Tìm nhanh:</span>
        <div class="tags">
          <button class="tag" v-for="tag in ['Đà Nẵng', 'Hội An', 'Phú Quốc', 'Sa Pa', 'TP.HCM', 'Hà Nội', 'Nha Trang', 'Đà Lạt']" :key="tag">
            {{ tag }}
          </button>
        </div>
      </div>
    </section>

    <!-- Featured Hotels -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Những chốn dừng chân được yêu mến</h2>
          </div>
        </div>

        <div class="hotel-grid">
          <div class="hotel-card bestseller">
            <div class="card-img-wrapper">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600" alt="Azure Cliff Resort" />
              <div class="card-rating">
                ★ 4.8
              </div>
            </div>
            <div class="card-info">
              <p class="hotel-location">ĐÀ NẴNG</p>
              <h3 class="hotel-name">Azure Cliff Resort & Spa</h3>
              <div class="hotel-meta">1.284 đánh giá<br>Hồ bơi vô cực · Spa · Bữa sáng</div>
              <div class="hotel-price">
                <span>2.890.000 ₫</span> / đêm
              </div>
            </div>
          </div>

          <div class="hotel-card medium">
            <div class="card-img-wrapper">
              <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600" alt="Linen Suite Boutique" />
              <div class="card-rating">
                ★ 4.7
              </div>
            </div>
            <div class="card-info">
              <p class="hotel-location">HỘI AN</p>
              <h3 class="hotel-name">Linen Suite Boutique</h3>
              <div class="hotel-meta">842 đánh giá<br>Bữa sáng · WiFi miễn phí · Lễ tân 24/7</div>
              <div class="hotel-price">
                <span>1.450.000 ₫</span> / đêm
              </div>
            </div>
          </div>

          <div class="hotel-card small">
            <div class="card-img-wrapper">
              <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400" alt="Meldia Villas" />
              <div class="card-rating">
                ★ 4.9
              </div>
            </div>
            <div class="card-info">
              <p class="hotel-location">NHA TRANG</p>
              <h3 class="hotel-name">Meldia Villas</h3>
              <div class="hotel-meta">612 đánh giá<br>Hồ bơi riêng · Bữa sáng</div>
              <div class="hotel-price">
                <span>3.250.000 ₫</span> / đêm
              </div>
            </div>
          </div>
          
          <div class="hotel-card small">
            <div class="card-img-wrapper">
              <img src="https://cdn.xanhsm.com/2025/03/4777981c-melia-ba-vi-mountain-retreat-2.jpg" alt="Pinewood Mountain Lodge" />
              <div class="card-rating">
                ★ 4.6
              </div>
            </div>
            <div class="card-info">
              <p class="hotel-location">ĐÀ LẠT</p>
              <h3 class="hotel-name">Pinewood Mountain Lodge</h3>
              <div class="hotel-meta">421 đánh giá<br>Lò sưởi · Bữa sáng · Rừng thông</div>
              <div class="hotel-price">
                <span>1.090.000 ₫</span> / đêm
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    <!-- Why Us Section -->
    <section class="why-section">
      <div class="container why-container">
        <div class="why-header">
          <p class="why-kicker">Tại sao Travelstay</p>
          <h2 class="why-title">Đặt phòng nhẹ nhàng, nghỉ ngơi trọn vẹn.</h2>
        </div>
        <div class="why-grid">
          <div class="why-card">
            <div class="why-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.82 0 5.39.95 7 2a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h3 class="why-card-title">Giá tốt nhất</h3>
            <p class="why-card-desc">Cam kết hoàn tiền nếu bạn tìm thấy giá thấp hơn ở nơi khác.</p>
          </div>
          <div class="why-card">
            <div class="why-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
            </div>
            <h3 class="why-card-title">Tuyển chọn kỹ</h3>
            <p class="why-card-desc">Mỗi khách sạn đều được đội ngũ biên tập ghé thăm và xác minh.</p>
          </div>
          <div class="why-card">
            <div class="why-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
            </div>
            <h3 class="why-card-title">Hỗ trợ 24/7</h3>
            <p class="why-card-desc">Trợ giúp bằng tiếng Việt mọi lúc, từ đặt phòng đến check-in.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.landing-page {
  font-family: 'Inter', sans-serif;
  background-color: #FCFBF7;
  min-height: 100vh;
  color: #1A1A1A;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.header {
  padding: 20px 0;
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

.icon-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1A1A1A;
  cursor: pointer;
}
.login-btn {
  background-color: transparent;
  color:  #614638;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background-color 0.2s, color 0.2s;
}

.register-btn {
  background-color: #614638;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.register-btn:hover {
  background-color: #4A352A;
}

/* Hero Section */
.hero-section {
  padding: 20px 0 0;
}

.hero-card {
  position: relative;
  border-radius: 32px;
  overflow: hidden;
  height: 600px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%);
}

.hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 60px 80px 100px; /* Leave space for search bar */
  color: white;
  box-sizing: border-box;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.85);
  color: #1A1A1A;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
  margin-bottom: 20px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 600;
  line-height: 1.1;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.hero-subtitle {
  font-size: 1.1rem;
  line-height: 1.5;
  opacity: 0.95;
  max-width: 600px;
}

/* Search Bar */
.search-bar-wrapper {
  position: relative;
  margin-top: -45px;
  display: flex;
  justify-content: center;
  z-index: 10;
  padding: 0 40px;
}

.search-bar {
  background: white;
  border-radius: 50px;
  display: flex;
  align-items: center;
  padding: 12px 16px 12px 32px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.06);
  width: 100%;
  max-width: 1000px;
}

.search-item {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.search-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #666;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.search-item input {
  border: none;
  font-size: 1rem;
  color: #1A1A1A;
  font-weight: 500;
  outline: none;
  background: transparent;
  width: 100%;
}

.search-item input::placeholder {
  color: #999;
}

.search-divider {
  width: 1px;
  height: 40px;
  background: #E5E5E5;
  margin: 0 24px;
}

.search-btn {
  background: #614638;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background: #4A352A;
}

/* Quick Links */
.quick-links {
  padding: 30px 0;
}

.quick-links .container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quick-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
}

.tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tag {
  background: white;
  border: 1px solid #E5E5E5;
  border-radius: 50px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1A1A1A;
  cursor: pointer;
  transition: all 0.2s;
}

.tag:hover {
  border-color: #614638;
  color: #614638;
}

/* Featured Section */
.featured-section {
  padding: 60px 0 100px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

.section-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #999;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 600;
  color: #1A1A1A;
}

.view-all {
  color: #1A1A1A;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: opacity 0.2s;
}

.view-all:hover {
  opacity: 0.7;
}

.hotel-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: auto;
  gap: 24px;
}

.hotel-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
}

.hotel-card:hover {
  transform: translateY(-4px);
}

.hotel-card.bestseller {
  grid-column: span 2;
  grid-row: span 2;
}

.hotel-card.medium {
  grid-column: span 2;
}

.hotel-card.small {
  grid-column: span 1;
}

.card-img-wrapper {
  position: relative;
  width: 100%;
}

.hotel-card.bestseller .card-img-wrapper {
  height: 400px;
}

.hotel-card.medium .card-img-wrapper {
  height: 220px;
}

.hotel-card.small .card-img-wrapper {
  height: 180px;
}

.card-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: white;
  color: #1A1A1A;
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.fav-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1A1A1A;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.fav-btn:hover {
  transform: scale(1.1);
}

.card-rating {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: white;
  color: #1A1A1A;
  padding: 6px 10px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-info {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.hotel-location {
  font-size: 0.75rem;
  font-weight: 700;
  color: #999;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.hotel-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.bestseller .hotel-name {
  font-size: 1.5rem;
}

.hotel-meta {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
  flex: 1;
}

.hotel-price {
  font-size: 0.9rem;
  color: #666;
  margin-top: auto;
}

.hotel-price span {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1A1A1A;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .hotel-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .nav-links, .nav-actions button {
    display: none;
  }
  
  .hero-card {
    height: 500px;
  }
  
  .hero-content {
    padding: 40px 20px 80px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .search-bar {
    flex-direction: column;
    border-radius: 24px;
    padding: 20px;
    gap: 16px;
  }
  
  .search-divider {
    width: 100%;
    height: 1px;
    margin: 8px 0;
  }
  
  .search-bar-wrapper {
    margin-top: -30px;
  }
  
  .hotel-grid {
    grid-template-columns: 1fr;
  }
  
  .hotel-card.bestseller, .hotel-card.medium, .hotel-card.small {
    grid-column: span 1;
  }
  
  .why-grid {
    grid-template-columns: 1fr;
  }
}

/* Why Us Section */
.why-section {
  background-color: #F7F5F2;
  padding: 80px 0;
  margin-top: 40px;
}

.why-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 48px;
}

.why-kicker {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #999;
  margin-bottom: 8px;
}

.why-title {
  font-size: 2.2rem;
  font-weight: 600;
  color: #1A1A1A;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.why-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}

.why-icon {
  width: 56px;
  height: 56px;
  background-color: #F7F5F2;
  color: #614638;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.why-icon svg {
  width: 28px;
  height: 28px;
}

.why-card-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 24px 0 12px;
  color: #1A1A1A;
}

.why-card-desc {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
}
</style>
