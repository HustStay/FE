<template>
  <div class="hotel-detail-page">
    <header class="header">
      <div class="header-container">
        <div class="logo" @click="goToHome" style="cursor: pointer;">
          <div class="logo-icon">T</div>
          <span class="logo-text">Travelstay</span>
        </div>
        <nav class="nav-links">
          <a href="#">Khám phá</a>
          <a href="#">Khách sạn</a>
        </nav>
        <div class="nav-actions">
          <!-- Unauthenticated users -->
          <template v-if="!isAuthenticated">
            <RouterLink class="login-btn" to="/login?tab=login">Đăng nhập</RouterLink>
            <RouterLink class="register-btn" to="/login?tab=register">Đăng ký</RouterLink>
          </template>
          
          <!-- Authenticated users -->
          <template v-else>
            <a href="#" class="nav-link-action" @click.prevent="goToBookings" title="Đặt phòng của tôi">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7M6 11h12v11H6z"/></svg>
            </a>
            <div class="user-menu">
              <button class="user-icon-btn" @click="toggleMenu" title="Tài khoản">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </button>
              <div v-if="showMenu" class="dropdown-menu-header">
                <div class="dropdown-header">
                  Tài khoản của tôi
                </div>
                <a href="#" class="dropdown-item" @click.prevent="goToProfile">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Hồ sơ
                </a>
                <a href="#" class="dropdown-item" @click.prevent="goToBookings">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7M6 11h12v11H6z"/></svg>
                  Đặt phòng
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item logout" @click.prevent="logout">
                  Đăng xuất
                </a>
              </div>
            </div>
          </template>
        </div>
      </div>
    </header>

    <div class="container main-container">
      <div class="title-section">
        <div class="title-left">
          <h1 class="hotel-name">{{ hotel.hotelName }}</h1>
          <div class="hotel-meta">
            <span class="meta-location">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ hotel.street }}, {{ hotel.district }}, {{ hotel.city }}, {{ hotel.country }}
            </span>
            <span class="meta-dot">•</span>
            <span class="meta-rating">
              <span class="star-icon">★</span> {{ hotel.rating }} - {{ reviews.length }} đánh giá
            </span>
          </div>
        </div>
      </div>

      <div class="gallery-grid" v-if="images.length > 0">
        <div class="gallery-main">
          <img :src="images[0]" alt="Main" />
        </div>
        <div class="gallery-sub">
          <img v-if="images[1]" :src="images[1]" alt="Sub 1" class="img-tr" />
          <div v-else class="img-placeholder img-tr"></div>
          <img v-if="images[2]" :src="images[2]" alt="Sub 2" class="img-br-none" />
          <div v-else class="img-placeholder img-br-none"></div>
          <img v-if="images[3]" :src="images[3]" alt="Sub 3" class="img-b-none" />
          <div v-else class="img-placeholder img-b-none"></div>
          <img v-if="images[4]" :src="images[4]" alt="Sub 4" class="img-br" />
          <div v-else class="img-placeholder img-br"></div>
        </div>
      </div>
      <div v-else class="no-images-banner">
         <p>Khách sạn chưa cập nhật hình ảnh</p>
      </div>

      <div class="content-split">
        <div class="left-content">
          <section class="info-section">
            <h2 class="section-title">Về chốn dừng chân này</h2>
            <p class="hotel-desc">{{ hotel.description }}</p>
          </section>

          <section class="amenities-section" v-if="amenitiesList && amenitiesList.length">
            <h2 class="section-title">Tiện nghi nổi bật</h2>
            <div class="amenities-grid">
              <div v-for="(amenity, idx) in amenitiesList.slice(0, 8)" :key="idx" class="amenity-pill">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                {{ amenity }}
              </div>
            </div>
          </section>

          <section class="rooms-section">
            <h2 class="section-title">Phòng nổi bật</h2>
            <div class="room-list">
              <div v-for="room in roomTypes" :key="room.id" class="room-row">
                <div class="room-info">
                  <h3 class="room-name-title">{{ room.name }}</h3>
                  <p class="room-specs">Tối đa {{ room.capacity }} khách</p>
                  <p class="room-specs-sub" v-if="room.description">{{ room.description }}</p>
                </div>
                <div class="room-price-col">
                  <div class="price-val">{{ formatPrice(room.pricePerNight) }}</div>
                  <div class="price-tax">đã bao gồm thuế</div>
                </div>
                <div class="room-action">
                  <button v-if="!isRoomSelected(room.id)" class="select-btn" @click="toggleRoom(room)" :disabled="room.available === 0">
                    {{ room.available === 0 ? 'Hết phòng' : 'Chọn phòng' }}
                  </button>
                  <div v-else class="qty-selector-wrap">
                    <div class="qty-selector">
                      <button class="qty-btn" @click="decreaseQuantity(room.id)">-</button>
                      <span class="qty-val">{{ getRoomQuantity(room.id) }}</span>
                      <button class="qty-btn" @click="increaseQuantity(room.id, room.available)">+</button>
                    </div>
                    <div class="unselect-text" @click="toggleRoom(room)">Bỏ chọn</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="reviews-section">
            <h2 class="section-title">Đánh giá từ khách hàng</h2>
            <div class="reviews-header-modern">
              <div class="rating-badge-large">
                ★ {{ overallRating }}
              </div>
              <div class="rating-text">Dựa trên {{ reviews.length }} đánh giá</div>
            </div>

            <div class="comment-form-modern">
              <h4>Viết đánh giá của bạn</h4>
              <div class="star-rating-input">
                <div class="stars-input">
                  <span 
                    v-for="i in 5" 
                    :key="i" 
                    class="star-btn" 
                    :class="{ active: i <= newComment.star, hover: i <= hoverStar }"
                    @click="newComment.star = i"
                    @mouseenter="hoverStar = i"
                    @mouseleave="hoverStar = 0"
                  >★</span>
                </div>
              </div>
              <textarea 
                v-model="newComment.comment" 
                placeholder="Nhập nhận xét của bạn về khách sạn..."
                rows="3"
                class="comment-textarea-modern"
              ></textarea>
              <button class="submit-comment-btn-modern" @click="submitComment" :disabled="isSubmittingComment">
                {{ isSubmittingComment ? 'Đang gửi...' : 'Gửi đánh giá' }}
              </button>
            </div>
            
            <div class="reviews-list-modern">
              <div v-for="review in reviews" :key="review.id" class="review-card-modern">
                <div class="reviewer-avatar-modern">{{ review.avatar }}</div>
                <div class="review-content">
                  <div class="review-header-top">
                    <h4 class="reviewer-name-modern">{{ review.name }}</h4>
                    <span class="review-date-modern">{{ review.date }}</span>
                  </div>
                  <div class="review-stars-modern">
                    <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
                  </div>
                  <p class="review-text-modern">{{ review.comment }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside class="right-sidebar">
          <div class="booking-card">
            <div class="booking-price-header">
              <div class="price-left">
                <div class="price-main">{{ formatPrice(calculateTotalAmount() > 0 ? (calculateTotalAmount() / calculateNights()) : (roomTypes[0] ? roomTypes[0].pricePerNight : 0)) }}</div>
                <div class="price-sub">/ đêm - đã bao gồm thuế</div>
              </div>
              <div class="rating-badge-small">
                <span class="star">★</span> {{ hotel.rating }}
              </div>
            </div>

            <div class="booking-inputs-wrap">
              <div class="date-picker-row">
                <div class="date-input-wrap" @click="showCheckInCal = !showCheckInCal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  <input type="text" readonly :value="formatDisplayDate(booking.checkIn)" placeholder="Nhận phòng">
                </div>
                <div class="date-sep"></div>
                <div class="date-input-wrap" @click="showCheckOutCal = !showCheckOutCal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  <input type="text" readonly :value="formatDisplayDate(booking.checkOut)" placeholder="Trả phòng">
                </div>
              </div>
              
              <div v-if="showCheckInCal" class="calendar-popup cal-in">
                <div class="calendar-header">
                  <button @click.stop="prevMonth('checkIn')" class="nav-btn">‹</button>
                  <span class="month-year">{{ getMonthYear(calendarMonth.checkIn) }}</span>
                  <button @click.stop="nextMonth('checkIn')" class="nav-btn">›</button>
                </div>
                <div class="calendar-grid">
                  <div class="day-header" v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d">{{d}}</div>
                  <div v-for="day in getCalendarDays(calendarMonth.checkIn)" :key="day.key"
                    :class="['calendar-day', {selected: isSelected(day.date, booking.checkIn), disabled: day.disabled, today: isToday(day.date)}]"
                    @click.stop="selectDate(day, 'checkIn')">
                    {{day.label}}
                  </div>
                </div>
              </div>
              
              <div v-if="showCheckOutCal" class="calendar-popup cal-out">
                <div class="calendar-header">
                  <button @click.stop="prevMonth('checkOut')" class="nav-btn">‹</button>
                  <span class="month-year">{{ getMonthYear(calendarMonth.checkOut) }}</span>
                  <button @click.stop="nextMonth('checkOut')" class="nav-btn">›</button>
                </div>
                <div class="calendar-grid">
                  <div class="day-header" v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d">{{d}}</div>
                  <div v-for="day in getCalendarDays(calendarMonth.checkOut)" :key="day.key"
                    :class="['calendar-day', {selected: isSelected(day.date, booking.checkOut), disabled: day.disabled, today: isToday(day.date)}]"
                    @click.stop="selectDate(day, 'checkOut')">
                    {{day.label}}
                  </div>
                </div>
              </div>

              <div class="guest-input-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <div class="guest-label">Khách:</div>
                <input type="number" min="1" v-model.number="booking.guests" class="guest-input" />
              </div>
            </div>

            <button class="book-action-btn" @click="bookNow" :disabled="selectedRooms.length === 0">
              {{ selectedRooms.length === 0 ? 'Chọn phòng để đặt' : 'Đặt phòng ngay' }}
            </button>
            <div class="cancel-note">Miễn phí hủy trước 48 giờ - Chưa thanh toán</div>

            <div class="summary-breakdown" v-if="selectedRooms.length > 0 && booking.checkIn && booking.checkOut">
              <div class="breakdown-line">
                <span>Giá phòng x {{ calculateNights() }} đêm</span>
                <span>{{ formatPrice(calculateTotalAmount()) }}</span>
              </div>
              <div class="breakdown-line">
                <span>Phí dịch vụ</span>
                <span>0 đ</span>
              </div>
              <div class="breakdown-line total-line">
                <span>Tổng cộng</span>
                <span>{{ formatPrice(calculateTotalAmount()) }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import ChatWidget from '@/components/ChatWidget.vue'
import { apiFetch } from '../utils/apiClient.js'

const router = useRouter()
const hotelId = router.currentRoute.value.params.id

// Authentication state
const showMenu = ref(false)
const isAuthenticated = computed(() => {
  return !!localStorage.getItem('token')
})

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const closeMenu = (e) => {
  if (!e.target.closest('.user-menu')) {
    showMenu.value = false
  }
}

const goToHome = () => {
  router.push('/home')
}

const goToProfile = () => {
  showMenu.value = false
  router.push('/profile')
}

const goToBookings = () => {
  showMenu.value = false
  router.push('/bookings')
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  showMenu.value = false
  window.location.href = '/'
}

const hotel = ref({
  hotelName: '',
  street: '',
  district: '',
  city: '',
  country: '',
  rating: 0,
  aminities: '',
  imageUrl: [],
  description: ''
})

const images = ref([])

const selectedImage = ref('')

const roomTypes = ref([])

const selectedRooms = ref([])

// Reviews data from API
const reviews = ref([])

const overallRating = ref(0)

// Comment form data
const newComment = ref({
  comment: '',
  star: 5
})
const hoverStar = ref(0)
const isSubmittingComment = ref(false)

// normalize amenities into array
const amenitiesList = ref([])

const fetchHotelDetail = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await apiFetch(`/api/hotel-service/hotel-detail?hotelId=${hotelId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      hotel.value = data.hotelDetail
      
      // Update images - imageUrl is a comma-separated string
      if (data.hotelDetail.imageUrl && data.hotelDetail.imageUrl.trim()) {
        // Split by comma and trim whitespace from each URL
        const imageUrls = data.hotelDetail.imageUrl.split(',').map(url => url.trim()).filter(url => url)
        if (imageUrls.length > 0) {
          images.value = imageUrls
          selectedImage.value = images.value[0]
        } else {
          images.value = []
          selectedImage.value = ''
        }
      } else {
        // Clear images if no imageUrl from API
        images.value = []
        selectedImage.value = ''
      }
      
      // Update amenities list
      if (data.hotelDetail.aminities) {
        amenitiesList.value = data.hotelDetail.aminities.split(',').map(s => s.trim())
      }
    }
  } catch (error) {
    console.error('Error fetching hotel detail:', error)
  }
}

const fetchRooms = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await apiFetch(`/api/room-service/rooms?hotelId=${hotelId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      // Map API response to UI format
      roomTypes.value = data.rooms.map((room, index) => ({
        id: index + 1,
        name: `Phòng ${room.roomType}`,
        roomType: room.roomType,
        capacity: room.capacity,
        available: room.availableRooms,
        totalRooms: room.totalRooms,
        description: room.description,
        amenities: room.amenities,
        pricePerNight: room.pricePerNight * 1000000, // Convert to VND (assuming API returns in millions)
      }))
    }
  } catch (error) {
    console.error('Error fetching rooms:', error)
  }
}

const fetchComments = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await apiFetch(`/api/review-service/comment?hotelId=${hotelId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      if (data.comments && data.comments.length > 0) {
        // Map API response to UI format
        reviews.value = data.comments.map(comment => ({
          id: comment.commentId,
          name: comment.customerName || 'Ẩn danh',
          avatar: (comment.customerName || 'A').charAt(0).toUpperCase(),
          rating: comment.star,
          date: formatCommentDate(comment.createdAt),
          comment: comment.comment
        }))
        // Calculate overall rating
        const totalStars = data.comments.reduce((sum, c) => sum + c.star, 0)
        overallRating.value = (totalStars / data.comments.length).toFixed(1)
      } else {
        reviews.value = []
        overallRating.value = 0
      }
    }
  } catch (error) {
    console.error('Error fetching comments:', error)
  }
}

const formatCommentDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

const submitComment = async () => {
  if (!newComment.value.comment.trim()) {
    alert('Vui lòng nhập nội dung đánh giá')
    return
  }

  if (newComment.value.star < 1 || newComment.value.star > 5) {
    alert('Vui lòng chọn số sao từ 1 đến 5')
    return
  }

  isSubmittingComment.value = true

  try {
    const token = localStorage.getItem('token')
    const response = await apiFetch('/api/review-service/comment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comment: newComment.value.comment,
        hotelId: hotelId,
        star: newComment.value.star
      })
    })

    const result = await response.json()

    if (response.ok) {
      alert(result.message || 'Đánh giá đã được gửi thành công!')
      // Reset form
      newComment.value.comment = ''
      newComment.value.star = 5
      // Refresh comments list from API
      await fetchComments()
    } else {
      alert(result.message || 'Không thể gửi đánh giá. Vui lòng thử lại!')
    }
  } catch (error) {
    console.error('Error submitting comment:', error)
    alert('Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại!')
  } finally {
    isSubmittingComment.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
  fetchHotelDetail()
  fetchRooms()
  fetchComments()
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})

const booking = ref({ checkIn: '', checkOut: '', guests: 2 })
const showCheckInCal = ref(false)
const showCheckOutCal = ref(false)
const calendarMonth = ref({
  checkIn: new Date(),
  checkOut: new Date()
})

const goBack = () => router.back()

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price).replace('₫', 'đ')
}

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
}

const getMonthYear = (date) => {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

const prevMonth = (type) => {
  const d = new Date(calendarMonth.value[type])
  d.setMonth(d.getMonth() - 1)
  calendarMonth.value[type] = d
}

const nextMonth = (type) => {
  const d = new Date(calendarMonth.value[type])
  d.setMonth(d.getMonth() + 1)
  calendarMonth.value[type] = d
}

const getCalendarDays = (monthDate) => {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const prevLastDay = new Date(year, month, 0)
  
  const days = []
  const startPad = firstDay.getDay()
  
  // Previous month days
  for (let i = startPad - 1; i >= 0; i--) {
    days.push({
      label: prevLastDay.getDate() - i,
      date: new Date(year, month - 1, prevLastDay.getDate() - i),
      disabled: true,
      key: `prev-${i}`
    })
  }
  
  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      label: i,
      date: new Date(year, month, i),
      disabled: false,
      key: `curr-${i}`
    })
  }
  
  // Next month padding
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({
      label: i,
      date: new Date(year, month + 1, i),
      disabled: true,
      key: `next-${i}`
    })
  }
  
  return days
}

const isSelected = (date, selectedStr) => {
  if (!selectedStr) return false
  const sel = new Date(selectedStr)
  return date.toDateString() === sel.toDateString()
}

const isToday = (date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const selectDate = (day, type) => {
  if (day.disabled) return
  const yyyy = day.date.getFullYear()
  const mm = String(day.date.getMonth() + 1).padStart(2, '0')
  const dd = String(day.date.getDate()).padStart(2, '0')
  booking.value[type] = `${yyyy}-${mm}-${dd}`
  if (type === 'checkIn') showCheckInCal.value = false
  else showCheckOutCal.value = false
}

const bookNow = async () => {
  // Validate inputs
  if (selectedRooms.value.length === 0) {
    alert('Vui lòng chọn ít nhất một loại phòng')
    return
  }

  if (!booking.value.checkIn || !booking.value.checkOut) {
    alert('Vui lòng chọn ngày nhận phòng và trả phòng')
    return
  }

  if (!booking.value.guests || booking.value.guests < 1) {
    alert('Vui lòng nhập số khách hợp lệ')
    return
  }

  // Check if check-out is after check-in
  if (new Date(booking.value.checkOut) <= new Date(booking.value.checkIn)) {
    alert('Ngày trả phòng phải sau ngày nhận phòng')
    return
  }

  try {
    const token = localStorage.getItem('token')

    // Calculate total amount
    const totalAmount = selectedRooms.value.reduce((sum, room) => {
      return sum + (room.pricePerNight * room.quantity)
    }, 0)

    // Calculate number of nights
    const checkInDate = new Date(booking.value.checkIn)
    const checkOutDate = new Date(booking.value.checkOut)
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    const finalAmount = totalAmount * nights

    // Build bookingItems array from selected rooms
    const bookingItems = selectedRooms.value.map(room => ({
      roomType: room.roomType.toUpperCase(),
      totalRoom: room.quantity,
      fee: room.pricePerNight
    }))

    // Create single booking request with all items
    const bookingData = {
      hotelId: parseInt(hotelId),
      checkInDate: booking.value.checkIn,
      checkOutDate: booking.value.checkOut,
      guests: booking.value.guests,
      bookingType: 'CONFIRMED',
      bookingItems: bookingItems
    }

    console.log('🏨 Creating booking with data:', bookingData)

    // Step 1: Create booking
    const bookingResponse = await apiFetch('/api/booking-service/booking', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    })

    const bookingResult = await bookingResponse.json()
    const createdBookingId =
      bookingResult?.bookingId ??
      bookingResult?.id ??
      bookingResult?.data?.bookingId ??
      bookingResult?.data?.id

    if (bookingResponse.ok) {
      console.log('✅ Booking created successfully:', bookingResult)

      if (!createdBookingId) {
        console.error('❌ Booking created but bookingId is missing:', bookingResult)
        alert('Đặt phòng thành công nhưng không nhận được mã booking từ hệ thống.')
        router.push('/bookings')
        return
      }

      // Step 2: Create PayOS payment link
      const paymentData = {
        bookingId: createdBookingId,
        amount: Math.round(finalAmount),
        description: `Thanh toán đặt phòng ${hotel.value.hotelName} - ${nights} đêm`,
        customerName: localStorage.getItem('fullName') || 'Khách hàng',
        customerEmail: localStorage.getItem('email') || '',
        hotelName: hotel.value.hotelName,
        checkInDate: booking.value.checkIn,
        checkOutDate: booking.value.checkOut
      }

      console.log('💳 Creating PayOS payment link with data:', paymentData)

      const paymentResponse = await apiFetch('/api/payment-service/payos/create-payment-link', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      const paymentResult = await paymentResponse.json().catch(() => ({}))

      if (paymentResponse.ok && paymentResult.sessionUrl) {
        console.log('✅ Payment session created:', paymentResult)

        // Save hotel ID for potential cancel page navigation
        sessionStorage.setItem('lastHotelId', hotelId)
        sessionStorage.setItem('pendingPayment', JSON.stringify({
          bookingId: createdBookingId,
          amount: paymentResult.amount ?? Math.round(finalAmount),
          orderCode: paymentResult.sessionId,
          checkoutUrl: paymentResult.sessionUrl
        }))

        // Step 3: Open internal checkout page to render QR from PayOS checkout URL
        router.push({
          path: '/payment/checkout',
          query: { orderCode: paymentResult.sessionId }
        })
      } else {
        console.error('❌ Payment session creation failed:', paymentResult)
        const backendMessage = paymentResult?.message ? `\nChi tiết: ${paymentResult.message}` : ''
        alert(`Đặt phòng thành công nhưng không thể tạo phiên thanh toán. Mã booking: ${createdBookingId}${backendMessage}`)
        router.push('/bookings')
      }
    } else {
      console.error('❌ Booking creation failed:', bookingResult)
      alert(`Đặt phòng thất bại: ${bookingResult.message || 'Vui lòng thử lại'}`)
    }
  } catch (error) {
    console.error('❌ Error in booking/payment flow:', error)
    alert('Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.')
  }
}

const toggleRoom = (room) => {
  const index = selectedRooms.value.findIndex(r => r.id === room.id)
  if (index > -1) {
    selectedRooms.value.splice(index, 1)
  } else {
    selectedRooms.value.push({ ...room, quantity: 1 })
  }
  console.log('Selected rooms:', selectedRooms.value)
}

const isRoomSelected = (roomId) => {
  return selectedRooms.value.some(r => r.id === roomId)
}

const getRoomQuantity = (roomId) => {
  const room = selectedRooms.value.find(r => r.id === roomId)
  return room ? room.quantity : 1
}

const increaseQuantity = (roomId, max) => {
  const room = selectedRooms.value.find(r => r.id === roomId)
  if (room && room.quantity < max) {
    room.quantity++
  }
}

const decreaseQuantity = (roomId) => {
  const room = selectedRooms.value.find(r => r.id === roomId)
  if (room) {
    if (room.quantity > 1) {
      room.quantity--
    } else {
      const idx = selectedRooms.value.findIndex(r => r.id === roomId)
      if (idx > -1) {
        selectedRooms.value.splice(idx, 1)
      }
    }
  }
}

const updateQuantity = (roomId, event) => {
  const room = selectedRooms.value.find(r => r.id === roomId)
  const value = parseInt(event.target.value)
  if (room && value >= 1 && value <= room.available) {
    room.quantity = value
  }
}

// 💰 NEW: Payment calculation helper functions
const calculateNights = () => {
  if (!booking.value.checkIn || !booking.value.checkOut) return 0
  const checkInDate = new Date(booking.value.checkIn)
  const checkOutDate = new Date(booking.value.checkOut)
  return Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
}

const calculateTotalAmount = () => {
  if (selectedRooms.value.length === 0 || !booking.value.checkIn || !booking.value.checkOut) return 0

  const nights = calculateNights()
  const roomTotal = selectedRooms.value.reduce((sum, room) => {
    return sum + (room.pricePerNight * room.quantity)
  }, 0)

  return roomTotal * nights
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.hotel-detail-page {
  font-family: 'Inter', sans-serif;
  background-color: #FCFBF7;
  min-height: 100vh;
  color: #1A1A1A;
}

/* Header */
.header {
  padding: 20px 0;
  background: transparent;
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
}
.logo-icon {
  background-color: #614638;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
}
.logo-text {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1A1A1A;
}
.nav-links {
  display: flex;
  gap: 30px;
}
.nav-links a {
  text-decoration: none;
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;
}
.nav-links a:hover {
  color: #1A1A1A;
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}
.icon-btn {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
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
  padding: 10px 24px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
}

/* User Menu - Authenticated Header */
.nav-link-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  color: #614638;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  text-decoration: none;
}

.nav-link-action:hover {
  background-color: #F5F1EB;
}

.nav-link-action svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}

.user-menu {
  position: relative;
}

.user-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: #614638;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-icon-btn:hover {
  background-color: #F5F1EB;
}

.user-icon-btn svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}

.dropdown-menu-header {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  overflow: hidden;
  animation: slideDown 0.2s ease;
  z-index: 1000;
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

.dropdown-item svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  flex-shrink: 0;
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


/* Container */
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px 80px;
}

/* Title Section */
.title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}
.hotel-name {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
}
.hotel-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.9rem;
}
.meta-location {
  display: flex;
  align-items: center;
  gap: 4px;
}
.meta-dot {
  color: #ccc;
}
.meta-rating {
  font-weight: 600;
}
.star-icon {
  color: #FFB800;
}
.title-right {
  display: flex;
  gap: 12px;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  border: 1px solid #E5E5E5;
  padding: 8px 16px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}
.action-btn:hover {
  background: #f9f9f9;
}

/* Gallery Grid */
.gallery-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  height: 400px;
  margin-bottom: 64px;
}
.gallery-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px 0 0 24px;
}
.gallery-sub {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
}
.gallery-sub img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.img-tr { border-radius: 0 24px 0 0; }
.img-br { border-radius: 0 0 24px 0; }
.img-placeholder {
  background: #eaeaea;
}
.no-images-banner {
  height: 400px;
  border-radius: 24px;
  background: #eaeaea;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 64px;
  color: #666;
  font-weight: 500;
}

/* Content Split */
.content-split {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 48px;
}

/* Left Content */
.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1A1A1A;
}
.info-section {
  margin-bottom: 40px;
}
.hotel-desc {
  color: #444;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Amenities */
.amenities-section {
  margin-bottom: 40px;
}
.amenities-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.amenity-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid #E5E5E5;
  border-radius: 50px;
  font-size: 0.9rem;
  color: #333;
}
.amenity-pill svg {
  color: #1A1A1A;
}

/* Rooms */
.rooms-section {
  margin-bottom: 40px;
}
.room-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.room-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.03);
  border: 1px solid transparent;
  transition: all 0.2s;
}
.room-row:hover {
  border-color: #E5E5E5;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
.room-info {
  flex: 1;
}
.room-name-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}
.room-specs {
  color: #666;
  font-size: 0.85rem;
  margin: 0;
}
.room-specs-sub {
  color: #888;
  font-size: 0.8rem;
  margin: 4px 0 0 0;
}
.room-price-col {
  text-align: right;
  margin-right: 24px;
}
.price-val {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1A1A1A;
}
.price-tax {
  font-size: 0.75rem;
  color: #888;
}
.select-btn {
  background: #614638;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.select-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.qty-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #F7F5F2;
  padding: 6px 12px;
  border-radius: 50px;
}
.qty-btn {
  background: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-weight: 700;
  cursor: pointer;
}
.qty-val {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}
.qty-selector-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.unselect-text {
  font-size: 0.8rem;
  color: #c62828;
  cursor: pointer;
  font-weight: 500;
}
.unselect-text:hover {
  text-decoration: underline;
}

/* Reviews */
.reviews-header-modern {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.rating-badge-large {
  background: #FEF9C3;
  color: #854D0E;
  padding: 6px 16px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
}
.rating-text {
  color: #666;
}
.comment-form-modern {
  background: white;
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.03);
}
.comment-form-modern h4 {
  margin: 0 0 16px 0;
  font-size: 1rem;
}
.stars-input {
  margin-bottom: 16px;
}
.star-btn {
  font-size: 1.5rem;
  color: #E5E5E5;
  cursor: pointer;
  transition: color 0.2s;
}
.star-btn.active, .star-btn.hover {
  color: #FFB800;
}
.comment-textarea-modern {
  width: 100%;
  border: 1px solid #E5E5E5;
  border-radius: 12px;
  padding: 12px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 16px;
}
.submit-comment-btn-modern {
  background: #1A1A1A;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
}
.submit-comment-btn-modern:disabled {
  opacity: 0.5;
}
.reviews-list-modern {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.review-card-modern {
  display: flex;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E5E5E5;
}
.reviewer-avatar-modern {
  width: 48px;
  height: 48px;
  background: #F7F5F2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #614638;
}
.review-content {
  flex: 1;
}
.review-header-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
.reviewer-name-modern {
  margin: 0;
  font-weight: 600;
}
.review-date-modern {
  font-size: 0.8rem;
  color: #888;
}
.review-stars-modern .star {
  color: #E5E5E5;
  font-size: 0.9rem;
}
.review-stars-modern .star.filled {
  color: #FFB800;
}
.review-text-modern {
  color: #444;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 8px 0 0 0;
}

/* Right Sidebar (Booking Card) */
.right-sidebar {
  position: relative;
}
.booking-card {
  position: sticky;
  top: 40px;
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}
.booking-price-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}
.price-main {
  font-size: 1.5rem;
  font-weight: 700;
}
.price-sub {
  font-size: 0.75rem;
  color: #888;
  margin-top: 2px;
}
.rating-badge-small {
  background: #FEF9C3;
  color: #854D0E;
  padding: 4px 10px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 4px;
}
.booking-inputs-wrap {
  border: 1px solid #E5E5E5;
  border-radius: 12px;
  margin-bottom: 20px;
  position: relative;
}
.date-picker-row {
  display: flex;
  border-bottom: 1px solid #E5E5E5;
}
.date-input-wrap {
  flex: 1;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.date-input-wrap svg {
  color: #888;
}
.date-input-wrap input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.9rem;
  cursor: pointer;
  background: transparent;
}
.date-sep {
  width: 1px;
  background: #E5E5E5;
}
.guest-input-wrap {
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.guest-input-wrap svg {
  color: #888;
}
.guest-label {
  font-size: 0.9rem;
  color: #444;
}
.guest-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.9rem;
  font-weight: 500;
}
.book-action-btn {
  width: 100%;
  background: #614638;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
  transition: background 0.2s;
}
.book-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.cancel-note {
  text-align: center;
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 24px;
}
.summary-breakdown {
  border-top: 1px solid #E5E5E5;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.breakdown-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #444;
}
.total-line {
  font-weight: 700;
  color: #1A1A1A;
  font-size: 1rem;
  margin-top: 8px;
  border-top: 1px solid #E5E5E5;
  padding-top: 16px;
}

/* Calendar popups */
.calendar-popup {
  position: absolute;
  top: 60px;
  background: white;
  border: 1px solid #E5E5E5;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  z-index: 100;
  width: calc(100% + 20px);
}
.cal-in { left: -10px; }
.cal-out { right: -10px; }

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.nav-btn {
  background: #F7F5F2;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
}
.month-year {
  font-weight: 600;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  text-align: center;
}
.day-header {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 8px;
}
.calendar-day {
  padding: 8px 0;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 8px;
}
.calendar-day:hover:not(.disabled) {
  background: #F7F5F2;
}
.calendar-day.disabled {
  color: #ccc;
  cursor: not-allowed;
}
.calendar-day.selected {
  background: #614638;
  color: white;
}
.calendar-day.today {
  font-weight: 700;
  color: #614638;
}

@media (max-width: 900px) {
  .content-split {
    grid-template-columns: 1fr;
  }
  .gallery-grid {
    grid-template-columns: 1fr;
    height: auto;
  }
  .gallery-main img {
    border-radius: 24px;
    height: 300px;
  }
  .gallery-sub {
    display: none;
  }
  .booking-card {
    position: static;
  }
  .room-row {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  .room-price-col {
    text-align: left;
    margin: 0;
  }
  .title-section {
    flex-direction: column;
    gap: 16px;
  }
  .calendar-popup {
    left: 0;
    right: 0;
    width: 100%;
  }
}
</style>