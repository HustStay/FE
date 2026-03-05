<template>
    <div class="home-container">
        <!-- Navigation -->
        <Navbar />

        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-overlay"></div>
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600" alt="Hotel" class="hero-bg">
            <div class="hero-content">
                <h1 class="hero-title">Chào mừng trở lại!</h1>
                <p class="hero-subtitle">Tìm kiếm và đặt khách sạn mơ ước của bạn</p>

                <!-- Search Form -->
                <div class="search-card">
                    <div class="search-grid">
                        <div class="search-field">
                            <img width="25" height="25" src="https://img.icons8.com/windows/32/marker.png"
                                alt="marker" />
                            <input type="text" placeholder="Bạn muốn đi đâu?" v-model="searchForm.location">
                        </div>
                        <div class="search-field">
                            <img width="25" height="25" src="https://img.icons8.com/windows/32/calendar-minus.png"
                                alt="calendar-minus" />
                            <input type="date" v-model="searchForm.checkIn">
                        </div>
                        <div class="search-field">
                            <img width="25" height="25" src="https://img.icons8.com/windows/32/calendar-minus.png"
                                alt="calendar-minus" />
                            <input type="date" v-model="searchForm.checkOut">
                        </div>
                        <div class="search-field">
                            <img width="25" height="25" src="https://img.icons8.com/windows/32/family--v1.png"
                                alt="family--v1" />
                            <input type="number" placeholder="2" v-model="searchForm.guests" min="1">
                        </div>
                        <div class="search-field">
                            <img width="25" height="25" src="https://img.icons8.com/windows/32/bed.png"
                                alt="rooms" />
                            <input type="number" placeholder="1" v-model="searchForm.rooms" min="1">
                        </div>
                    </div>
                    <button class="search-button" @click="handleSearch">
                        Tìm kiếm
                    </button>
                </div>
            </div>
        </section>

        <!-- Search Results Section -->
        <section v-if="isSearching || searchResults.length > 0 || searchMessage" class="section search-results">
            <div class="section-header">
                <h2 class="section-title">{{ searchMessage }}</h2>
            </div>
            
            <div v-if="isSearching" class="loading-state">
                <p>Đang tìm kiếm...</p>
            </div>
            
            <div v-else-if="searchResults.length === 0 && searchMessage" class="empty-search-state">
                <h3>Không tìm thấy khách sạn phù hợp</h3>
                <p>Vui lòng thử thay đổi tiêu chí tìm kiếm của bạn</p>
            </div>
            
            <div v-else class="hotels-grid">
                <div v-for="hotel in searchResults" :key="hotel.id" class="hotel-card">
                    <div class="hotel-image-wrapper">
                        <span v-if="hotel.availableRooms > 0" class="badge-available">
                            Còn {{ hotel.availableRooms }} phòng
                        </span>
                        <span v-else class="badge-sold-out">Hết phòng</span>
                        <img :src="hotel.image" :alt="hotel.name" class="hotel-image">
                    </div>
                    <div class="hotel-info">
                        <h3 class="hotel-name">{{ hotel.name }}</h3>
                        <div class="hotel-location">
                            <img width="20" height="20" src="https://img.icons8.com/windows/32/marker.png"
                                    alt="marker" />
                            {{ hotel.location }}
                        </div>
                        <div class="hotel-footer">
                            <button class="btn-detail" @click.prevent="goToHotelDetail(hotel.id)">Xem chi tiết</button>
                        </div>
                    </div>
                    <div class="hotel-rating">
                        <span>⭐</span>
                        {{ hotel.rating }}
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured Hotels -->
        <section class="section featured-hotels">
            <div class="section-header">
                <h2 class="section-title">Khách sạn nổi bật</h2>
            </div>
            <div class="hotels-grid">
                <div v-for="hotel in paginatedFeaturedHotels" :key="hotel.id" class="hotel-card">
                    <div class="hotel-image-wrapper">
                        <span class="badge-featured">Nổi bật</span>
                        <img :src="hotel.image" :alt="hotel.name" class="hotel-image">
                    </div>
                    <div class="hotel-info">
                        <h3 class="hotel-name">{{ hotel.name }}</h3>
                        <div class="hotel-location">
                            <img width="20" height="20" src="https://img.icons8.com/windows/32/marker.png"
                                    alt="marker" />
                            {{ hotel.location }}
                        </div>
                        <!-- <p class="hotel-reviews">{{ hotel.reviews }} đánh giá</p> -->
                        <div class="hotel-footer">
                            <button class="btn-detail" @click.prevent="goToHotelDetail(hotel.id)">Xem chi tiết</button>
                        </div>
                    </div>
                    <div class="hotel-rating">
                        <span>⭐</span>
                        {{ hotel.rating }}
                    </div>
                </div>
            </div>
            <!-- Pagination for Featured Hotels -->
            <div v-if="featuredTotalPages > 1" class="pagination">
                <button 
                    class="pagination-btn" 
                    :disabled="featuredCurrentPage === 1"
                    @click="featuredCurrentPage--"
                >
                    ‹ Trước
                </button>
                <div class="pagination-numbers">
                    <button 
                        v-for="page in featuredVisiblePages" 
                        :key="page"
                        class="pagination-number"
                        :class="{ active: page === featuredCurrentPage }"
                        @click="featuredCurrentPage = page"
                    >
                        {{ page }}
                    </button>
                </div>
                <button 
                    class="pagination-btn" 
                    :disabled="featuredCurrentPage === featuredTotalPages"
                    @click="featuredCurrentPage++"
                >
                    Sau ›
                </button>
            </div>
        </section>

        <!-- Popular Destinations -->
        <section class="section destinations">
            <!-- <h2 class="section-title">Điểm đến phổ biến</h2>
            <div class="destinations-grid">
                <div v-for="destination in destinations" :key="destination.id" class="destination-card">
                    <img :src="destination.image" :alt="destination.name" class="destination-image">
                    <div class="destination-overlay">
                        <h3 class="destination-name">{{ destination.name }}</h3>
                    </div>
                </div>
            </div> -->

            <h2 class="section-title">Tất cả khách sạn</h2>

            <div v-if="isLoadingAllHotels" class="loading-state">
                <p>Đang tải danh sách khách sạn...</p>
            </div>
            
            <div v-else-if="allHotels.length === 0" class="empty-search-state">
                <h3>Danh sách khách sạn trống</h3>
                <p>Hiện tại chưa có khách sạn nào</p>
            </div>
            
            <div v-else class="hotels-grid">
                <div v-for="hotel in paginatedAllHotels" :key="hotel.id" class="hotel-card">
                    <div class="hotel-image-wrapper">
                        <img :src="hotel.image" :alt="hotel.name" class="hotel-image">
                    </div>
                    <div class="hotel-info">
                        <h3 class="hotel-name">{{ hotel.name }}</h3>
                        <div class="hotel-location">
                            <img width="20" height="20" src="https://img.icons8.com/windows/32/marker.png"
                                    alt="marker" />
                            {{ hotel.location }}
                        </div>
                        <div class="hotel-footer">
                            <button class="btn-detail" @click.prevent="goToHotelDetail(hotel.id)">Xem chi tiết</button>
                        </div>
                    </div>
                    <div class="hotel-rating">
                        <span>⭐</span>
                        {{ hotel.rating }}
                    </div>
                </div>
            </div>
            <!-- Pagination for All Hotels -->
            <div v-if="allHotelsTotalPages > 1" class="pagination">
                <button 
                    class="pagination-btn" 
                    :disabled="allHotelsCurrentPage === 1"
                    @click="allHotelsCurrentPage--"
                >
                    ‹ Trước
                </button>
                <div class="pagination-numbers">
                    <button 
                        v-for="page in allHotelsVisiblePages" 
                        :key="page"
                        class="pagination-number"
                        :class="{ active: page === allHotelsCurrentPage }"
                        @click="allHotelsCurrentPage = page"
                    >
                        {{ page }}
                    </button>
                </div>
                <button 
                    class="pagination-btn" 
                    :disabled="allHotelsCurrentPage === allHotelsTotalPages"
                    @click="allHotelsCurrentPage++"
                >
                    Sau ›
                </button>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()

const searchForm = ref({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
})

const featuredHotels = ref([])
const allHotels = ref([])
const searchResults = ref([])
const isSearching = ref(false)
const isLoadingAllHotels = ref(false)
const searchMessage = ref('')

// Pagination state for Featured Hotels
const featuredCurrentPage = ref(1)
const featuredItemsPerPage = 8

// Pagination state for All Hotels
const allHotelsCurrentPage = ref(1)
const allHotelsItemsPerPage = 8

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

// Computed properties for All Hotels pagination
const allHotelsTotalPages = computed(() => {
    return Math.ceil(allHotels.value.length / allHotelsItemsPerPage)
})

const paginatedAllHotels = computed(() => {
    const start = (allHotelsCurrentPage.value - 1) * allHotelsItemsPerPage
    const end = start + allHotelsItemsPerPage
    return allHotels.value.slice(start, end)
})

const allHotelsVisiblePages = computed(() => {
    const pages = []
    const total = allHotelsTotalPages.value
    const current = allHotelsCurrentPage.value
    
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

const destinations = ref([
    { id: 1, name: 'Đà Nẵng', image: 'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=400' },
    { id: 2, name: 'Hà Nội', image: 'https://images.unsplash.com/photo-1555401009-34f1f0e6e73e?w=400' },
    { id: 3, name: 'Nha Trang', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400' },
    { id: 4, name: 'Phú Quốc', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400' }
])

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

        const response = await fetch('/api/hotel-service/hotels/search', {
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
        const response = await fetch('/api/hotel-service/hotels', {
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
                reviews: '0 đánh giá',
                image:  hotel.imageUrl
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
    fetchAllHotels()
})

const fetchAllHotels = async () => {
    isLoadingAllHotels.value = true
    try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/hotel-service/allHotel', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })

        const data = await response.json()
        console.log('Fetched all hotels:', data)
        if (response.ok && data.hotels) {
            allHotels.value = data.hotels.map(hotel => ({
                id: hotel.hotelId,
                name: hotel.hotelName,
                location: `${hotel.street}, ${hotel.district}, ${hotel.city}, ${hotel.country}`,
                rating: hotel.rating,
                image: hotel.imageUrl,
                pricePerNight: hotel.pricePerNight,
                amenities: hotel.aminities
            }))
        } else {
            console.error('Failed to fetch all hotels:', data.status)
            allHotels.value = []
        }
    } catch (error) {
        console.error('Error fetching all hotels:', error)
        allHotels.value = []
    } finally {
        isLoadingAllHotels.value = false
    }
}

const goToHotelDetail = (hotelId) => {
    router.push(`/hotel/${hotelId}`)
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.home-container {
    min-height: 100vh;
    background: #f5f7fa;
}

/* Hero Section */
.hero-section {
    position: relative;
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-top: 70px;
}

.hero-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
    z-index: 2;
}

.hero-content {
    position: relative;
    z-index: 3;
    text-align: center;
    color: white;
    max-width: 1200px;
    padding: 0 2rem;
}

.hero-title {
    font-size: 4rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 3rem;
    opacity: 0.95;
}

/* Search Card */
.search-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.search-grid {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.search-field {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: white;
}

.field-icon {
    font-size: 1.25rem;
}

.search-field input {
    border: none;
    outline: none;
    font-size: 1rem;
    width: 100%;
    color: #333;
}

.search-field input::placeholder {
    color: #999;
}

.search-button {
    width: 100%;
    padding: 1rem 2rem;
    background: #22a6d6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s;
}

.search-button:hover {
    background: #1a8bb5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 166, 214, 0.3);
}

/* Sections */
.section {
    max-width: 1400px;
    margin: 4rem auto;
    padding: 0 2rem;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.section-title {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
}

.view-all {
    color: #22a6d6;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s;
}

.view-all:hover {
    color: #1a8bb5;
}

/* Hotels Grid */
.hotels-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
}

.hotel-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s, box-shadow 0.3s;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.hotel-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.hotel-image-wrapper {
    position: relative;
    height: 200px;
    overflow: hidden;
}

.badge-featured {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: #ff9500;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    z-index: 2;
}

.badge-available {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(16, 185, 129, 0.9);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    z-index: 2;
}

.badge-sold-out {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    z-index: 2;
}

.hotel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.hotel-card:hover .hotel-image {
    transform: scale(1.05);
}

.hotel-rating {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: white;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.hotel-info {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.hotel-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 3rem;
}

.hotel-location {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    color: #666;
    margin-bottom: 0.5rem;
    min-height: 2.5rem;
    flex: 1;
}

.hotel-location img {
    flex-shrink: 0;
    margin-top: 2px;
}

.hotel-reviews {
    color: #999;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.hotel-amenities {
    color: #666;
    font-size: 0.85rem;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.hotel-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 0.5rem;
}

.hotel-price {
    display: flex;
    flex-direction: column;
}

.price-amount {
    font-size: 1.5rem;
    font-weight: 700;
    color: #22a6d6;
}

.price-unit {
    font-size: 0.85rem;
    color: #999;
}

.btn-detail {
    background: #22a6d6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-detail:hover {
    background: #1a8bb5;
}

/* Destinations */
.destinations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.destination-card {
    position: relative;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s;
}

.destination-card:hover {
    transform: scale(1.02);
}

.destination-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.destination-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7));
    display: flex;
    align-items: flex-end;
    padding: 1.5rem;
}

.destination-name {
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
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

.empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
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
    background: #22a6d6;
    color: white;
    border-color: #22a6d6;
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
    background: #f0f9fc;
    border-color: #22a6d6;
    color: #22a6d6;
}

.pagination-number.active {
    background: #22a6d6;
    color: white;
    border-color: #22a6d6;
}

/* Responsive */
@media (max-width: 1400px) {
    .hotels-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 1100px) {
    .hotels-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 968px) {
    .hero-title {
        font-size: 2.5rem;
    }

    .hero-subtitle {
        font-size: 1.2rem;
    }

    .search-grid {
        grid-template-columns: 1fr;
    }

    .hotels-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .destinations-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .hotels-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .destinations-grid {
        grid-template-columns: 1fr;
    }

    .pagination {
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .pagination-btn {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
    }

    .pagination-number {
        width: 36px;
        height: 36px;
        font-size: 0.85rem;
    }

    .hotel-name {
        font-size: 1.1rem;
        min-height: 2.6rem;
    }
}
</style>
