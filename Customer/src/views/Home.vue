<template>
    <div class="home-container">
        <!-- Navigation -->
        <Navbar />

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
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path
                                    d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            </svg>
                            BỘ SƯU TẬP MÙA HÈ 2026
                        </span>
                        <h1 class="hero-title">Chào mừng trở lại!</h1>
                        <p class="hero-subtitle">
                            Tìm kiếm và đặt khách sạn mơ ước của bạn với trải nghiệm đặt phòng thanh lịch.
                        </p>
                    </div>
                </div>

                <!-- Search Bar -->
                <div class="search-bar-wrapper">
                    <div class="search-bar">
                        <div class="search-item">
                            <span class="search-label">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                ĐIỂM ĐẾN
                            </span>
                            <input type="text" placeholder="Đà Nẵng, Hội An, Phú Quốc..." v-model="searchForm.location" />
                        </div>
                        <div class="search-divider"></div>
                        <div class="search-item">
                            <span class="search-label">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                    <line x1="16" x2="16" y1="2" y2="6" />
                                    <line x1="8" x2="8" y1="2" y2="6" />
                                    <line x1="3" x2="21" y1="10" y2="10" />
                                </svg>
                                NHẬN PHÒNG
                            </span>
                            <input type="date" v-model="searchForm.checkIn" :min="today" />
                        </div>
                        <div class="search-divider"></div>
                        <div class="search-item">
                            <span class="search-label">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                    <line x1="16" x2="16" y1="2" y2="6" />
                                    <line x1="8" x2="8" y1="2" y2="6" />
                                    <line x1="3" x2="21" y1="10" y2="10" />
                                </svg>
                                TRẢ PHÒNG
                            </span>
                            <input type="date" v-model="searchForm.checkOut" :min="searchForm.checkIn || today" />
                        </div>
                        <div class="search-divider"></div>
                        <div class="search-item">
                            <span class="search-label">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                KHÁCH & PHÒNG
                            </span>
                            <div class="search-multi">
                                <input type="number" min="1" v-model="searchForm.guests" />
                                <span class="search-multi-divider">·</span>
                                <input type="number" min="1" v-model="searchForm.rooms" />
                            </div>
                        </div>
                        <button class="search-btn" @click="handleSearch">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
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
                    <button class="tag" v-for="tag in quickTags" :key="tag">
                        {{ tag }}
                    </button>
                </div>
            </div>
        </section>

        <!-- Search Results Section -->
        <section v-if="isSearching || searchResults.length > 0 || searchMessage" class="section search-results">
            <div class="container">
                <div class="section-header">
                    <div>
                        <p class="section-kicker">Kết quả</p>
                        <h2 class="section-title">{{ searchMessage || 'Kết quả tìm kiếm' }}</h2>
                    </div>
                </div>

                <div v-if="isSearching" class="loading-state">
                    <p>Đang tìm kiếm...</p>
                </div>

                <div v-else-if="searchResults.length === 0 && searchMessage" class="empty-search-state">
                    <h3>Không tìm thấy khách sạn phù hợp</h3>
                    <p>Vui lòng thử thay đổi tiêu chí tìm kiếm của bạn</p>
                </div>

                <div v-else class="hotel-grid">
                    <div v-for="hotel in searchResults" :key="hotel.id" class="hotel-card" @click.prevent="goToHotelDetail(hotel.id)">
                        <div class="card-img-wrapper">
                            <img :src="hotel.image" :alt="hotel.name" />
                            <span class="card-rating">★ {{ hotel.rating }}</span>
                            <span v-if="hotel.availableRooms > 0" class="card-badge">
                                Còn {{ hotel.availableRooms }} phòng
                            </span>
                            <span v-else class="card-badge sold-out">Hết phòng</span>
                        </div>
                        <div class="card-info">
                            <p class="hotel-location">{{ hotel.location }}</p>
                            <h3 class="hotel-name">{{ hotel.name }}</h3>
                            <div v-if="hotel.totalRooms" class="hotel-meta">
                                Tổng {{ hotel.totalRooms }} phòng
                            </div>
                            <!-- <div class="card-actions">
                                <button class="btn-detail" @click.prevent="goToHotelDetail(hotel.id)">Xem chi tiết</button>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured Hotels -->
        <section class="featured-section">
            <div class="container">
                <div class="section-header">
                    <div>
                        <p class="section-kicker">Được yêu thích</p>
                        <h2 class="section-title">Những chốn dừng chân được yêu mến</h2>
                    </div>
                    <button class="view-all" @click="goToAllHotels">
                        Xem tất cả
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </button>
                </div>
                <div class="hotel-grid" >
                    <div
                        v-for="(hotel, index) in paginatedFeaturedHotels"
                        :key="hotel.id"
                        class="hotel-card"
                        :class="getFeaturedCardClass(index)"
                        @click.prevent="goToHotelDetail(hotel.id)"
                    >
                        <div class="card-img-wrapper">
                            <img :src="hotel.image" :alt="hotel.name" />
                            <span class="card-badge">Nổi bật</span>
                            <span class="card-rating">★ {{ hotel.rating }}</span>
                        </div>
                        <div class="card-info" >
                            <p class="hotel-location">{{ hotel.location }}</p>
                            <h3 class="hotel-name">{{ hotel.name }}</h3>
                            <div class="hotel-meta">{{ hotel.reviewCount|| 0}} đánh giá</div>
                            <div class="hotel-price">
                                <span>{{ formatPrice(hotel.pricePerNight) }}</span> / đêm
                            </div>
                            <!-- <div class="card-actions">
                                <button class="btn-detail" @click.prevent="goToHotelDetail(hotel.id)">Xem chi tiết</button>
                            </div> -->
                        </div>
                    </div>
                </div>
                <!-- Pagination for Featured Hotels -->
                <div v-if="featuredTotalPages > 1" class="pagination">
                    <button class="page-btn prev-next" :disabled="featuredCurrentPage === 1" @click="featuredCurrentPage--">
                        ‹ Trước
                    </button>
                    <div class="page-numbers">
                        <button
                            v-for="page in featuredVisiblePages"
                            :key="page"
                            class="page-btn page-num"
                            :class="{ active: page === featuredCurrentPage }"
                            @click="featuredCurrentPage = page"
                        >
                            {{ page }}
                        </button>
                    </div>
                    <button class="page-btn prev-next" :disabled="featuredCurrentPage === featuredTotalPages" @click="featuredCurrentPage++">
                        Sau ›
                    </button>
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.82 0 5.39.95 7 2a1 1 0 0 1 1 1z" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        </div>
                        <h3 class="why-card-title">Giá tốt nhất</h3>
                        <p class="why-card-desc">Cam kết hoàn tiền nếu bạn tìm thấy giá thấp hơn ở nơi khác.</p>
                    </div>
                    <div class="why-card">
                        <div class="why-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="8" r="6" />
                                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                            </svg>
                        </div>
                        <h3 class="why-card-title">Tuyển chọn kỹ</h3>
                        <p class="why-card-desc">Mỗi khách sạn đều được đội ngũ biên tập ghé thăm và xác minh.</p>
                    </div>
                    <div class="why-card">
                        <div class="why-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                            </svg>
                        </div>
                        <h3 class="why-card-title">Hỗ trợ 24/7</h3>
                        <p class="why-card-desc">Trợ giúp bằng tiếng Việt mọi lúc, từ đặt phòng đến check-in.</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { apiFetch } from '../utils/apiClient.js'

const router = useRouter()

const today = new Date().toISOString().split('T')[0]

const searchForm = ref({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
})

const quickTags = [
    'Đà Nẵng',
    'Hội An',
    'Phú Quốc',
    'Sa Pa',
    'TP.HCM',
    'Hà Nội',
    'Nha Trang',
    'Đà Lạt'
]

const featuredHotels = ref([])
const searchResults = ref([])
const isSearching = ref(false)
const searchMessage = ref('')

// Pagination state for Featured Hotels
const featuredCurrentPage = ref(1)
const featuredItemsPerPage = 8

// Computed properties for Featured Hotels pagination
const featuredTotalPages = computed(() => {
    return Math.ceil(featuredHotels.value.length / featuredItemsPerPage)
})

const paginatedFeaturedHotels = computed(() => {
    const start = (featuredCurrentPage.value - 1) * featuredItemsPerPage
    const end = start + featuredItemsPerPage
    return featuredHotels.value.slice(start, end)
})

const featuredVisiblePages = computed(() => {
    const pages = []
    const total = featuredTotalPages.value
    const current = featuredCurrentPage.value
    
    let start = Math.max(1, current - 2)
    let end = Math.min(total, current + 2)
    
    if (end - start < 4) {
        if (start === 1) {
            end = Math.min(total, start + 4)
        } else {
            start = Math.max(1, end - 4)
        }
    }
    
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return pages
})

const getFeaturedCardClass = (index) => {
    if (index === 0) {
        return 'bestseller'
    }
    if (index === 1) {
        return 'medium'
    }
    return 'small'
}

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price).replace('₫', 'đ')
}

const handleSearch = async () => {
    // Validate search form
    if (!searchForm.value.location || !searchForm.value.checkIn || !searchForm.value.checkOut) {
        alert('Vui lòng điền đầy đủ thông tin tìm kiếm')
        return
    }

    // Validate dates
    if (new Date(searchForm.value.checkOut) <= new Date(searchForm.value.checkIn)) {
        alert('Ngày trả phòng phải sau ngày nhận phòng')
        return
    }

    isSearching.value = true
    searchMessage.value = ''
    searchResults.value = []

    try {
        const token = localStorage.getItem('token')
        const requestBody = {
            city: searchForm.value.location,
            checkInDate: searchForm.value.checkIn,
            checkOutDate: searchForm.value.checkOut,
            numberOfGuests: searchForm.value.guests,
            numberOfRooms: searchForm.value.rooms
        }

        const response = await apiFetch('/api/hotel-service/hotels/search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })

        const data = await response.json()
        
        if (response.ok && data.hotels) {
            searchMessage.value = data.message || `Tìm thấy ${data.total} khách sạn phù hợp`
            searchResults.value = data.hotels.map(hotel => ({
                id: hotel.hotelId,
                name: hotel.hotelName,
                location: `${hotel.street}, ${hotel.district}, ${hotel.city}, ${hotel.country}`,
                rating: hotel.rating,
                image: hotel.imageUrl,
                availableRooms: hotel.availableRooms,
                totalRooms: hotel.totalRooms
            }))
            
            // Scroll to search results
            setTimeout(() => {
                document.querySelector('.search-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
        } else {
            searchMessage.value = data.message || 'Không tìm thấy khách sạn phù hợp'
            
            // Scroll to empty state
            setTimeout(() => {
                document.querySelector('.search-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
        }
    } catch (error) {
        console.error('Error searching hotels:', error)
        searchMessage.value = 'Có lỗi xảy ra khi tìm kiếm'
    } finally {
        isSearching.value = false
    }
}

const fetchHotels = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await apiFetch('/api/hotel-service/hotels', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })

        const data = await response.json()
        console.log('Fetched hotels:', data)
        if (response.ok && data.hotels) {
            // Map API data to component format
            featuredHotels.value = data.hotels.map(hotel => ({
                id: hotel.hotelId,
                name: hotel.hotelName,
                location: `${hotel.street},${hotel.district}, ${hotel.city}, ${hotel.country}`,
                rating: hotel.rating,
                reviewCount: hotel.reviewCount || 0,
                image: hotel.imageUrl,
                pricePerNight: hotel.pricePerNight
            }))
        } else {
            console.error('Failed to fetch hotels')
        }
    } catch (error) {
        console.error('Error fetching hotels:', error)
    }
}

onMounted(() => {
    fetchHotels()
})

const goToAllHotels = () => {
    router.push('/hotels')
}

const goToHotelDetail = (hotelId) => {
    router.push(`/hotel/${hotelId}`)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.home-container {
    font-family: 'Inter', sans-serif;
    background-color: #FCFBF7;
    min-height: 100vh;
    color: #1A1A1A;
    padding-top: 84px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
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
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%);
}

.hero-content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 60px 80px 100px;
    color: white;
    box-sizing: border-box;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.85);
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
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
    font-size: 1.1rem;
    line-height: 1.6;
    opacity: 0.95;
    max-width: 640px;
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
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
    width: 100%;
    max-width: 1100px;
    gap: 12px;
}

.search-item {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 120px;
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

.search-multi {
    display: flex;
    align-items: center;
    gap: 8px;
}

.search-multi input {
    width: 70px;
    text-align: center;
}

.search-multi-divider {
    color: #999;
    font-weight: 600;
}

.search-divider {
    width: 1px;
    height: 40px;
    background: #E5E5E5;
    margin: 0 12px;
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
    white-space: nowrap;
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
    flex-wrap: wrap;
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

/* Sections */
.section {
    padding: 60px 0;
}

.featured-section {
    padding: 60px 0 100px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;
    gap: 20px;
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
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: none;
    color: #1A1A1A;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s ease, transform 0.2s ease;
}

.view-all svg {
    transition: transform 0.2s ease;
}

.view-all:hover {
    color: #614638;
}

.view-all:hover svg {
    transform: translateX(4px);
}

/* Hotels Grid */
.hotel-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: auto;
    gap: 24px;
    cursor: pointer;
}


.hotel-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
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
    height: 220px;
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

.card-badge.sold-out {
    background: #ef4444;
    color: white;
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
    text-transform: uppercase;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
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
    font-size: 0.9rem;
    color: #666;
    line-height: 1.5;
    margin-bottom: 16px;
}

.hotel-price {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 16px;
}

.hotel-price span {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1A1A1A;
}

.card-actions {
    margin-top: auto;
}

.btn-detail {
    background: #614638;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 100%;
}

.btn-detail:hover {
    background: #4A352A;
}

/* Loading and Empty States */
.loading-state {
    text-align: center;
    padding: 64px 24px;
}

.loading-state p {
    font-size: 18px;
    color: #666;
}

.empty-search-state {
    text-align: center;
    padding: 64px 24px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-search-state h3 {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
}

.empty-search-state p {
    font-size: 16px;
    color: #666;
}

/* Pagination Styles */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
    padding: 1rem 0;
}

.pagination-btn {
    padding: 0.75rem 1.25rem;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
    background: #614638;
    color: white;
    border-color: #614638;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-numbers {
    display: flex;
    gap: 0.5rem;
}

.pagination-number {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    transition: all 0.3s;
}

.pagination-number:hover {
    background: #f5eee9;
    border-color: #614638;
    color: #614638;
}

.pagination-number.active {
    background: #614638;
    color: white;
    border-color: #614638;
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
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
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

/* ── Pagination ── */
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 40px;
}

.page-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    border: 1.5px solid #ddd;
    border-radius: 999px;
    background: #fff;
    color: #433427;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
}

.page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.prev-next {
    padding: 0 22px;
    white-space: nowrap;
}

.prev-next:not(:disabled):hover {
    border-color: #614638;
    color: #614638;
}

.page-numbers {
    display: flex;
    gap: 8px;
}

.page-num {
    width: 44px;
}

.page-num:not(.active):hover {
    border-color: #614638;
    color: #614638;
}

.page-num.active {
    background: #5c3d2e;
    border-color: #5c3d2e;
    color: #fff;
    box-shadow: 0 2px 8px rgba(92, 61, 46, 0.3);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
    .hotel-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .hero-card {
        height: 520px;
    }
}

@media (max-width: 900px) {
    .hero-content {
        padding: 40px 32px 80px;
    }

    .hero-title {
        font-size: 2.8rem;
    }
}

@media (max-width: 768px) {
    .hero-card {
        height: 480px;
    }

    .hero-content {
        padding: 32px 20px 70px;
    }

    .hero-title {
        font-size: 2.3rem;
    }

    .search-bar {
        flex-direction: column;
        border-radius: 24px;
        padding: 20px;
        gap: 16px;
        align-items: stretch;
    }

    .search-divider {
        width: 100%;
        height: 1px;
        margin: 8px 0;
    }

    .search-bar-wrapper {
        margin-top: -30px;
        padding: 0 20px;
    }

    .search-multi {
        justify-content: space-between;
    }

    .search-multi input {
        width: 100%;
    }

    .hotel-grid {
        grid-template-columns: 1fr;
    }

    .hotel-card.bestseller,
    .hotel-card.medium,
    .hotel-card.small {
        grid-column: span 1;
    }

    .section-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .section-title {
        font-size: 1.8rem;
    }

    .why-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .home-container {
        padding-top: 76px;
    }

    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .hotel-price span {
        font-size: 1.1rem;
    }

    .pagination {
        flex-wrap: wrap;
    }
}

@media (max-width: 480px) {
    .hero-card {
        height: 420px;
    }

    .hero-title {
        font-size: 1.7rem;
    }

    .hero-content {
        padding: 28px 16px 60px;
    }

    .search-btn {
        width: 100%;
        justify-content: center;
    }

    .section {
        padding: 40px 0;
    }
}
</style>
