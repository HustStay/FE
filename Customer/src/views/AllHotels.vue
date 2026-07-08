<template>
  <div class="all-hotels-page">
    <Navbar />

    <main class="all-hotels-main">
      <section class="search-shell">
        <div class="search-bar">
          <div class="search-item">
            <span class="search-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              ĐIỂM ĐẾN
            </span>
            <input v-model="searchForm.location" type="text" placeholder="Đà Nẵng, Hội An, Phú Quốc..." />
          </div>

          <div class="search-divider"></div>

          <div class="search-item">
            <span class="search-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              NHẬN - TRẢ PHÒNG
            </span>
            <div class="date-range">
              <input v-model="searchForm.checkIn" type="date" :min="today" />
              <span>—</span>
              <input v-model="searchForm.checkOut" type="date" :min="searchForm.checkIn || today" />
            </div>
          </div>

          <div class="search-divider"></div>

          <div class="search-item">
            <span class="search-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              KHÁCH & PHÒNG
            </span>
            <div class="guest-room">
              <input v-model.number="searchForm.guests" type="number" min="1" />
              <span>khách</span>
              <span class="dot">·</span>
              <input v-model.number="searchForm.rooms" type="number" min="1" />
              <span>phòng</span>
            </div>
          </div>

          <button class="search-btn" @click="applySearch">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Tìm kiếm
          </button>
        </div>
      </section>

      <section class="results-shell">
        <div class="results-layout">
          <aside class="filters-panel">
            <h3 class="filters-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="8" x2="16" y1="12" y2="12" />
                <line x1="10" x2="14" y1="18" y2="18" />
              </svg>
              Bộ lọc
            </h3>

            <div class="filter-group">
              <h4>Giá tối đa / đêm</h4>
              <input v-model.number="maxPriceFilter" class="price-range" type="range" :min="0" :max="priceUpperBound"
                :step="100000" />
              <p class="filter-note">Tối {{ formatPrice(maxPriceFilter) }}</p>
            </div>

            <div class="filter-group">
              <h4>Điểm đánh giá</h4>
              <div class="rating-chips">
                <button v-for="option in ratingOptions" :key="option.value" class="rating-chip"
                  :class="{ active: ratingFilter === option.value }" @click="ratingFilter = option.value">
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div class="filter-group">
              <h4>Tiện nghi</h4>
              <label v-for="amenity in amenityOptions" :key="amenity" class="amenity-option">
                <input v-model="selectedAmenities" type="checkbox" :value="amenity" />
                <span>{{ amenity }}</span>
              </label>
            </div>
          </aside>

          <div class="results-main">
            <div class="results-head">
              <h2>{{ filteredHotels.length }} khách sạn phù hợp</h2>
              <div class="sort-wrap">
                <label for="sort-by">Sắp xếp:</label>
                <select id="sort-by" v-model="sortBy">
                  <option value="recommended">Đề xuất</option>
                  <option value="rating-desc">Đánh giá cao nhất</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                </select>
              </div>
            </div>

            <div v-if="isLoading" class="state-box">
              <p>Đang tải danh sách khách sạn...</p>
            </div>

            <div v-else-if="errorMessage" class="state-box error">
              <p>{{ errorMessage }}</p>
            </div>

            <div v-else-if="filteredHotels.length === 0" class="state-box">
              <p>Không tìm thấy khách sạn phù hợp với bộ lọc hiện tại.</p>
            </div>

            <div v-else class="hotel-grid">
              <article v-for="hotel in paginatedHotels" :key="hotel.id" class="hotel-card" @click="goToHotelDetail(hotel.id)">
                <div class="hotel-image">
                  <img :src="hotel.image" :alt="hotel.name" />
                  <span v-if="hotel.badge" class="hotel-badge">{{ hotel.badge }}</span>
                  

                  <div class="hotel-overlay">
                    <p>{{ hotel.city }}</p>
                    <h3>{{ hotel.name }}</h3>
                  </div>
                </div>

                <div class="hotel-content">
                  <div class="hotel-meta">
                    <p>{{ hotel.reviewCount|| 0 }} đánh giá</p>
                    <div class="hotel-score">★ {{ hotel.rating.toFixed(1) }}</div>
                  </div>

                  <p class="hotel-amenities">{{ formatAmenities(hotel.amenities) }}</p>

                  <div class="hotel-price" @click="goToHotelDetail(hotel.id)">
                    <div>
                      <span class="old-price">{{ formatPrice(hotel.originalPrice) }}</span>
                      <strong>{{ formatPrice(hotel.pricePerNight) }}</strong>
                      <small>/ đêm</small>
                    </div>
                    
                  </div>
                </div>
              </article>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="pagination">
              <button class="page-btn prev-next" :disabled="currentPage === 1" @click="currentPage--">
                ‹ Trước
              </button>
              <div class="page-numbers">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  class="page-btn page-num"
                  :class="{ active: page === currentPage }"
                  @click="currentPage = page"
                >
                  {{ page }}
                </button>
              </div>
              <button class="page-btn prev-next" :disabled="currentPage === totalPages" @click="currentPage++">
                Sau ›
              </button>
            </div>

          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { apiFetch } from '../utils/apiClient.js'

const router = useRouter()

const fallbackImage = 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200'

const today = new Date().toISOString().split('T')[0]

const searchForm = ref({
  location: '',
  checkIn: '',
  checkOut: '',
  guests: 2,
  rooms: 1
})

const appliedSearch = ref({
  location: ''
})

const hotels = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const sortBy = ref('recommended')
const ratingFilter = ref('all')
const selectedAmenities = ref([])
const maxPriceFilter = ref(6000000)
const priceUpperBound = ref(6000000)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 6

const ratingOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: '5', label: '5' },
  { value: '4', label: '≥ 4' },
  { value: '4', label: '< 4' }
]

const amenityOptions = [
  'Hồ bơi vô cực',
  'Spa',
  'Bữa sáng',
  'WiFi',
  'Đưa đón sân bay',
  'Lễ tân 24/7',
  'Phòng gia đình',
  'Hồ bơi riêng',
  'Xe đạp miễn phí',
  'Bãi biển riêng',
  'Lò sưởi',
  'Trekking tour',
  'Spa thảo mộc',
  'Phòng gym',
  'Rooftop bar',
  'Bungalow trên biển',
  'Lặn biển'
]

const normalizeAmenities = (amenities) => {
  if (Array.isArray(amenities)) {
    return amenities.filter(Boolean)
  }
  if (typeof amenities === 'string') {
    return amenities
      .split(/,|·|\|/)
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

const mapHotel = (hotel, index) => {
  const amenities = normalizeAmenities(hotel.amenities ?? hotel.aminities)
  const rating = Number(hotel.rating) || 0
  const pricePerNight = Number(hotel.pricePerNight) || 0
  const city = hotel.city || ''
  const location = [hotel.street, hotel.district, hotel.city, hotel.country].filter(Boolean).join(', ')

  return {
    id: hotel.hotelId ?? hotel.id ?? `${index}`,
    name: hotel.hotelName,
    city: city.toUpperCase() || 'VIỆT NAM',
    location,
    rating,
    image: hotel.imageUrl || fallbackImage,
    pricePerNight,
    originalPrice: Math.round(pricePerNight * 1.15),
    reviewCount: hotel.reviewCount || 0,
    amenities,
    badge: index === 0 ? 'BESTSELLER' : index === 2 ? "EDITOR'S PICK" : ''
  }
}

const fetchAllHotels = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const token = localStorage.getItem('token')
    const response = await apiFetch('/api/hotel-service/allHotel', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    if (response.ok && Array.isArray(data.hotels)) {
      hotels.value = data.hotels.map((hotel, index) => mapHotel(hotel, index))
      const maxPriceFromData = hotels.value.reduce((max, hotel) => Math.max(max, hotel.pricePerNight), 0)
      const boundedMax = Math.max(6000000, Math.ceil(maxPriceFromData / 100000) * 100000)
      priceUpperBound.value = boundedMax
      maxPriceFilter.value = boundedMax
      return
    }
    hotels.value = []
    errorMessage.value = data.message || 'Không thể tải danh sách khách sạn.'
  } catch (error) {
    console.error('Error fetching all hotels:', error)
    hotels.value = []
    errorMessage.value = 'Không thể tải danh sách khách sạn.'
  } finally {
    isLoading.value = false
  }
}

const applySearch = () => {
  appliedSearch.value.location = searchForm.value.location.trim()
}

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
    .format(price)
    .replace('₫', 'đ')

const formatAmenities = (amenities) => {
  if (!amenities.length) return 'Tiện nghi đang cập nhật'
  return amenities.slice(0, 3).join(' · ')
}

const filteredHotels = computed(() => {
  const keyword = appliedSearch.value.location.toLowerCase()
  const threshold = ratingFilter.value === 'all' ? 0 : Number(ratingFilter.value)

  const filtered = hotels.value.filter((hotel) => {
    if (keyword) {
      const searchable = `${hotel.name} ${hotel.location}`.toLowerCase()
      if (!searchable.includes(keyword)) {
        return false
      }
    }

    if (hotel.pricePerNight > maxPriceFilter.value) {
      return false
    }

    if (hotel.rating < threshold) {
      return false
    }

    if (selectedAmenities.value.length > 0) {
      const lowerAmenities = hotel.amenities.map((item) => item.toLowerCase())
      const hasAllAmenities = selectedAmenities.value.every((selected) =>
        lowerAmenities.some((amenity) => amenity.includes(selected.toLowerCase()))
      )
      if (!hasAllAmenities) {
        return false
      }
    }

    return true
  })

  if (sortBy.value === 'rating-desc') {
    return [...filtered].sort((a, b) => b.rating - a.rating)
  }
  if (sortBy.value === 'price-asc') {
    return [...filtered].sort((a, b) => a.pricePerNight - b.pricePerNight)
  }
  if (sortBy.value === 'price-desc') {
    return [...filtered].sort((a, b) => b.pricePerNight - a.pricePerNight)
  }

  return [...filtered].sort((a, b) => b.rating - a.rating || a.pricePerNight - b.pricePerNight)
})

const totalPages = computed(() => Math.ceil(filteredHotels.value.length / itemsPerPage))

const paginatedHotels = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredHotels.value.slice(start, start + itemsPerPage)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  if (end - start < 4) {
    if (start === 1) end = Math.min(total, start + 4)
    else start = Math.max(1, end - 4)
  }
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

// Reset về trang 1 khi filter thay đổi
watch(filteredHotels, () => { currentPage.value = 1 })

const goToHotelDetail = (hotelId) => {
  router.push(`/hotel/${hotelId}`)
}

onMounted(() => {
  fetchAllHotels()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

.all-hotels-page {
  min-height: 100vh;
  background: #f8f4ef;
  font-family: 'Inter', sans-serif;
  color: #1f1f1f;
}

.all-hotels-main {
  padding-top: 84px;
}

.search-shell {
  border-top: 1px solid #ece3da;
  border-bottom: 1px solid #ece3da;
  background: #faf7f3;
  padding: 18px 0;
}

.search-bar {
  width: min(1240px, calc(100% - 40px));
  margin: 0 auto;
  background: #fff;
  border: 1px solid #e5d8cb;
  border-radius: 24px;
  padding: 10px;
  display: grid;
  grid-template-columns: 1.4fr 1px 1.2fr 1px 1fr auto;
  align-items: center;
  gap: 10px;
}

.search-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  padding: 0 8px;
}

.search-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.74rem;
  font-weight: 700;
  color: #8a7a6a;
  letter-spacing: 0.4px;
}

.search-item input {
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #433427;
  outline: none;
}

.search-item input::placeholder {
  color: #a69382;
}

.date-range,
.guest-room {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b5a4b;
}

.date-range input {
  width: 100%;
}

.guest-room input {
  width: 56px;
  border: none;
  border-bottom: 1px solid #e2d7cc;
  text-align: center;
}

.dot {
  color: #b9a897;
}

.search-divider {
  width: 1px;
  height: 42px;
  background: #ece3da;
}

.search-btn {
  height: 52px;
  border: none;
  border-radius: 18px;
  padding: 0 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #6b4a3a;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.results-shell {
  padding: 26px 20px 40px;
}

.results-layout {
  width: min(1240px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  gap: 24px;
}

.filters-panel {
  background: #fff;
  border: 1px solid #eadfce;
  border-radius: 22px;
  padding: 22px 20px;
  align-self: start;
  position: sticky;
  top: 106px;
  max-height: calc(100vh - 130px);
  overflow: auto;
}

.filters-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group {
  margin-top: 22px;
}

.filter-group h4 {
  margin: 0 0 10px;
  font-size: 1rem;
  font-weight: 700;
}

.price-range {
  width: 100%;
  accent-color: #6b4a3a;
}

.filter-note {
  margin: 6px 0 0;
  color: #6f5c4b;
  font-size: 0.95rem;
}

.rating-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.rating-chip {
  border: 1px solid #dccab6;
  border-radius: 999px;
  background: #fff;
  color: #6b4a3a;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 6px 12px;
  cursor: pointer;
}

.rating-chip.active {
  background: #6b4a3a;
  border-color: #6b4a3a;
  color: #fff;
}

.amenity-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.92rem;
  color: #534435;
  margin-bottom: 8px;
}

.amenity-option input {
  accent-color: #6b4a3a;
}

.results-main {
  min-width: 0;
}

.results-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.results-head h2 {
  margin: 0;
  font-size: 2.1rem;
  font-weight: 700;
}

.sort-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #7a6857;
}

.sort-wrap select {
  border: 2px solid #8e6f57;
  border-radius: 999px;
  min-width: 170px;
  padding: 8px 14px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #4a3829;
  background: #fff;
  outline: none;
}

.state-box {
  background: #fff;
  border: 1px solid #eadfce;
  border-radius: 20px;
  padding: 26px;
  text-align: center;
  color: #695746;
}

.state-box.error {
  color: #b42318;
}

.hotel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

/* ── Pagination ── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 32px;
  padding-bottom: 8px;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
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
  padding: 0 20px;
  gap: 4px;
  white-space: nowrap;
}

.prev-next:not(:disabled):hover {
  border-color: #6b4a3a;
  color: #6b4a3a;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-num {
  width: 42px;
}

.page-num:not(.active):hover {
  border-color: #6b4a3a;
  color: #6b4a3a;
}

.page-num.active {
  background: #5c3d2e;
  border-color: #5c3d2e;
  color: #fff;
  box-shadow: 0 2px 8px rgba(92, 61, 46, 0.3);
}

.hotel-card {
  background: #fff;
  border: 1px solid #eadfce;
  border-radius: 24px;
  overflow: hidden;
}

.hotel-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.hotel-image {
  position: relative;
  height: 270px;
}

.hotel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hotel-badge {
  position: absolute;
  left: 14px;
  top: 14px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.9);
  color: #5f4a39;
}

.favorite-btn {
  position: absolute;
  right: 14px;
  top: 14px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  color: #7a614d;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.hotel-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 18px 16px 14px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(13, 13, 13, 0.72) 100%);
  color: #fff;
}

.hotel-overlay p {
  margin: 0 0 4px;
  font-size: 0.82rem;
  letter-spacing: 0.8px;
  font-weight: 600;
  opacity: 0.9;
}

.hotel-overlay h3 {
  margin: 0;
  font-size: 2rem;
  line-height: 1.05;
  font-weight: 700;
}

.hotel-content {
  padding: 14px 16px 16px;
}

.hotel-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.hotel-meta p {
  margin: 0;
  color: #766353;
  font-size: 0.88rem;
}

.hotel-score {
  border-radius: 999px;
  padding: 4px 10px;
  background: #f6ede4;
  color: #664634;
  font-size: 0.86rem;
  font-weight: 700;
}

.hotel-amenities {
  margin: 8px 0 12px;
  color: #534435;
  font-size: 0.95rem;
}

.hotel-price {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;
}

.old-price {
  display: block;
  text-decoration: line-through;
  color: #9d8c7d;
  font-size: 0.84rem;
}

.hotel-price strong {
  color: #2e241b;
  font-size: 1.9rem;
  line-height: 1;
}

.hotel-price small {
  color: #837162;
  font-size: 0.9rem;
  margin-left: 4px;
}

.detail-btn {
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  background: #6b4a3a;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

@media (max-width: 1280px) {
  .search-bar {
    grid-template-columns: 1fr 1px 1fr;
    row-gap: 10px;
  }

  .search-bar .search-divider:nth-of-type(2) {
    display: none;
  }

  .search-btn {
    grid-column: 1 / -1;
    justify-content: center;
  }
}

@media (max-width: 1024px) {
  .results-layout {
    grid-template-columns: 1fr;
  }

  .filters-panel {
    position: static;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .all-hotels-main {
    padding-top: 76px;
  }

  .hotel-grid {
    grid-template-columns: 1fr;
  }

  .results-head h2 {
    font-size: 1.8rem;
  }

  .hotel-overlay h3 {
    font-size: 1.6rem;
  }

  .search-bar {
    grid-template-columns: 1fr;
    border-radius: 18px;
  }

  .search-divider {
    display: none;
  }

  .results-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .hotel-price strong {
    font-size: 1.5rem;
  }
}

@media (max-width: 640px) {
  .results-shell {
    padding: 16px 12px 32px;
  }

  .filters-title {
    font-size: 1.4rem;
  }

  .hotel-image {
    height: 220px;
  }

  .hotel-overlay h3 {
    font-size: 1.3rem;
  }

  .hotel-content {
    padding: 10px 12px 12px;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 6px;
  }
}

@media (max-width: 480px) {
  .search-bar {
    padding: 8px;
  }

  .search-item input {
    font-size: 0.9rem;
  }

  .search-btn {
    height: 44px;
    font-size: 0.9rem;
  }

  .hotel-price strong {
    font-size: 1.3rem;
  }

  .detail-btn {
    padding: 8px 14px;
    font-size: 0.85rem;
  }
}
</style>
