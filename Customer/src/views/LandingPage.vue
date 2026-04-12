<template>
    <div class="landing-page">
        <header class="hero">
            <nav class="nav">
                <div class="logo">
                    Travel<span>Stay</span>
                </div>
                <div class="nav-actions">
                    <RouterLink class="nav-link" to="/login?tab=login">Đăng nhập</RouterLink>
                    <RouterLink class="nav-button" to="/login?tab=register">Đăng ký</RouterLink>
                </div>
            </nav>

            <div class="hero-content">
                <div class="hero-text">
                    <p class="hero-kicker">Đặt phòng nhanh chóng, trải nghiệm trọn vẹn</p>
                    <h1>Khám phá khách sạn yêu thích chỉ với vài bước</h1>
                    <p class="hero-subtitle">
                        Tìm kiếm khách sạn phù hợp, xem đánh giá chân thực và đặt phòng an toàn ngay trên nền tảng
                        TravelStay.
                    </p>
                    <div class="hero-actions">
                        <RouterLink class="primary" to="/login?tab=register">Bắt đầu miễn phí</RouterLink>
                        <RouterLink class="secondary" to="/login?tab=login">Tôi đã có tài khoản</RouterLink>
                    </div>
                    <div class="hero-stats">
                        <div class="stat-card">
                            <strong>500+</strong>
                            <span>Khách sạn uy tín</span>
                        </div>
                        <div class="stat-card">
                            <strong>4.8/5</strong>
                            <span>Đánh giá hài lòng</span>
                        </div>
                        <div class="stat-card">
                            <strong>24/7</strong>
                            <span>Hỗ trợ khách hàng</span>
                        </div>
                    </div>
                </div>
                <div class="hero-card">
                    <p class="card-title">Tại sao chọn TravelStay?</p>
                    <ul>
                        <li>Xác nhận đặt phòng tức thì</li>
                        <li>Ưu đãi độc quyền mỗi tuần</li>
                        <li>Thanh toán an toàn, linh hoạt</li>
                    </ul>
                </div>
            </div>
        </header>

        <section class="features">
            <div class="section-header">
                <h2>Trải nghiệm đặt phòng thông minh</h2>
                <p>Giao diện thân thiện giúp bạn chọn được nơi nghỉ dưỡng phù hợp chỉ trong vài phút.</p>
            </div>
            <div class="feature-grid">
                <div class="feature-card">
                    <h3>Tìm kiếm linh hoạt</h3>
                    <p>Lọc theo vị trí, ngân sách, tiện nghi và đánh giá để nhanh chóng ra quyết định.</p>
                </div>
                <div class="feature-card">
                    <h3>Thông tin minh bạch</h3>
                    <p>Hình ảnh thực tế, giá phòng rõ ràng và đánh giá chân thật từ khách hàng.</p>
                </div>
                <div class="feature-card">
                    <h3>Hỗ trợ nhanh chóng</h3>
                    <p>Đội ngũ chăm sóc luôn sẵn sàng giải đáp mọi thắc mắc của bạn 24/7.</p>
                </div>
            </div>
        </section>

        <section class="steps">
            <div class="section-header">
                <h2>Đặt phòng chỉ với 3 bước</h2>
            </div>
            <div class="steps-grid">
                <div class="step-card">
                    <span class="step-number">01</span>
                    <h3>Tạo tài khoản</h3>
                    <p>Đăng ký nhanh để lưu lịch sử và nhận ưu đãi cá nhân hóa.</p>
                </div>
                <div class="step-card">
                    <span class="step-number">02</span>
                    <h3>Chọn khách sạn</h3>
                    <p>Tìm kiếm và xem chi tiết trước khi xác nhận đặt phòng.</p>
                </div>
                <div class="step-card">
                    <span class="step-number">03</span>
                    <h3>Hoàn tất thanh toán</h3>
                    <p>Thanh toán an toàn, nhận xác nhận ngay lập tức.</p>
                </div>
            </div>
        </section>

        <section class="cta">
            <div class="cta-content">
                <h2>Sẵn sàng cho chuyến đi tiếp theo?</h2>
                <p>Đăng ký tài khoản để nhận ưu đãi và quản lý đặt phòng dễ dàng hơn.</p>
                <RouterLink class="primary" to="/login?tab=register">Đăng ký ngay</RouterLink>
            </div>
        </section>
    </div>
</template>

<style scoped>
.landing-page {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    color: #1f2937;
    background: #f8fafc;
    min-height: 100vh;
}

.hero {
    background: linear-gradient(135deg, rgba(34, 166, 214, 0.12), rgba(255, 255, 255, 0.9));
    padding: 40px 80px 80px;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 60px;
}

.logo {
    font-size: 1.8rem;
    font-weight: 700;
    color: #111827;
}

.logo span {
    color: #22a6d6;
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

.nav-link {
    color: #374151;
    text-decoration: none;
    font-weight: 500;
}

.nav-button {
    text-decoration: none;
    background: #22a6d6;
    color: white;
    padding: 10px 22px;
    border-radius: 999px;
    font-weight: 600;
}

.hero-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 40px;
    align-items: center;
}

.hero-text h1 {
    font-size: 2.8rem;
    line-height: 1.2;
    margin: 12px 0 20px;
    color: #111827;
}

.hero-kicker {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 0.8rem;
    color: #22a6d6;
    font-weight: 600;
}

.hero-subtitle {
    font-size: 1.05rem;
    color: #4b5563;
    margin-bottom: 28px;
    line-height: 1.7;
}

.hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 32px;
}

.primary,
.secondary {
    text-decoration: none;
    border-radius: 999px;
    padding: 12px 26px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.primary {
    background: #22a6d6;
    color: white;
    box-shadow: 0 12px 30px rgba(34, 166, 214, 0.25);
}

.secondary {
    background: white;
    color: #111827;
    border: 1px solid #d1d5db;
}

.hero-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.stat-card {
    background: white;
    border-radius: 16px;
    padding: 16px 18px;
    min-width: 140px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.stat-card strong {
    display: block;
    font-size: 1.4rem;
}

.stat-card span {
    color: #6b7280;
    font-size: 0.9rem;
}

.hero-card {
    background: white;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
}

.hero-card ul {
    margin: 16px 0 0;
    padding-left: 18px;
    color: #4b5563;
    line-height: 1.8;
}

.card-title {
    font-weight: 700;
    font-size: 1.2rem;
}

.features,
.steps,
.cta {
    padding: 80px;
    background: white;
}

.steps {
    background: #f8fafc;
}

.section-header {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 48px;
}

.section-header h2 {
    font-size: 2rem;
    margin-bottom: 12px;
}

.feature-grid,
.steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 24px;
}

.feature-card,
.step-card {
    background: white;
    border-radius: 16px;
    padding: 28px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.step-card {
    background: #ffffff;
}

.step-number {
    display: inline-flex;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: rgba(34, 166, 214, 0.12);
    color: #22a6d6;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    margin-bottom: 16px;
}

.cta {
    background: linear-gradient(135deg, rgba(34, 166, 214, 0.12), rgba(255, 255, 255, 0.9));
    text-align: center;
}

.cta-content {
    max-width: 560px;
    margin: 0 auto;
}

.cta-content p {
    color: #4b5563;
    margin: 16px 0 24px;
}

@media (max-width: 900px) {
    .hero,
    .features,
    .steps,
    .cta {
        padding: 40px 24px 60px;
    }

    .nav {
        flex-direction: column;
        gap: 16px;
    }

    .hero-text h1 {
        font-size: 2.2rem;
    }
}
</style>
