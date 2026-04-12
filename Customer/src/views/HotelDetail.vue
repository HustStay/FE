<template>
  <div class="hotel-detail-page">
    <Navbar />

    <div class="container">
      <a class="back-link" @click.prevent="goBack">‹ Quay lại</a>

      <div class="detail-grid">
        <!-- Left: Images + Info -->
        <div class="left-col">
          <div class="gallery">
            <div v-if="images.length > 0">
              <img :src="selectedImage" alt="Main" class="main-image" />
              <div class="thumbs">
                <img v-for="(img, idx) in images" :key="idx" :src="img" :class="{active: selectedImage===img}" @click="selectedImage = img" />
              </div>
            </div>
            <div v-else class="no-images">
              <div class="no-images-content">
                <span class="no-images-icon">🖼️</span>
                <p class="no-images-text">Chưa có hình ảnh</p>
                <p class="no-images-subtext">Khách sạn chưa cập nhật hình ảnh</p>
              </div>
            </div>
          </div>

          <div class="title-row">
            <div>
              <h2 class="hotel-name">{{hotel.hotelName}}</h2>
              <div class="hotel-meta">
                <span class="hotel-location">
                  <img width="20" height="20" src="https://img.icons8.com/windows/32/marker.png"
                                    alt="marker" />
                   {{hotel.street}}, {{hotel.district}}, {{hotel.city}}, {{hotel.country}}</span>
                <span class="hotel-rating">
                  <span class="rating-star">★</span>{{hotel.rating}}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Mô tả</h3>
            <p class="description">Khách sạn nằm tại {{hotel.street}}, {{hotel.district}}, {{hotel.city}}, {{hotel.country}}.</p>
          </div>

          <!-- <div class="section">
            <h3>Tiện nghi</h3>
            <div class="amenities">
              <div class="amenity">
                <span class="amenity-icon">📶</span>
                <span>WiFi miễn phí</span>
              </div>
              <div class="amenity">
                <span class="amenity-icon">🚗</span>
                <span>Bãi đỗ xe</span>
              </div>
              <div class="amenity">
                <span class="amenity-icon">☕</span>
                <span>Quầy bar</span>
              </div>
              <div class="amenity">
                <span class="amenity-icon">🍽️</span>
                <span>Nhà hàng</span>
              </div>
            </div>
          </div> -->

          <div class="section">
            <h3>Các loại phòng</h3>
            <div class="room-types">
              <div v-for="room in roomTypes" :key="room.id" class="room-card">
                <div class="room-details">
                  <div class="room-header">
                    <h4 class="room-name">{{ room.name }}</h4>
                    <span class="room-count" :class="{ 'out-of-stock': room.available === 0 }">
                      {{ room.available === 0 ? 'Hết phòng' : `Còn ${room.available} phòng` }}
                    </span>
                  </div>
                  <div class="room-specs">
                    <span class="room-spec">
                      <img width="20" height="20" src="https://img.icons8.com/windows/32/gender-neutral-user.png" alt="gender-neutral-user"/>
                      Tối đa {{ room.capacity }} người</span>
                  </div>
                  <p class="room-description">{{ room.description }}</p>
                  <div class="room-amenities">
                    <span v-for="(amenity, idx) in room.amenities.split(',')" :key="idx" class="room-amenity">
                      {{ amenity.trim() }}
                    </span>
                  </div>
                  <div class="room-footer">
                    <div class="room-price">
                      <span class="price-value">{{ formatPrice(room.pricePerNight) }}</span>
                      <span class="price-label">/đêm</span>
                    </div>
                    <div v-if="isRoomSelected(room.id)" class="room-quantity-section">
                      <span class="quantity-label">Số lượng phòng:</span>
                      <div class="room-quantity">
                        <button class="qty-btn" @click="decreaseQuantity(room.id)">-</button>
                        <input type="number" min="1" :max="room.available" :value="getRoomQuantity(room.id)" class="qty-input" @input="updateQuantity(room.id, $event)" readonly>
                        <button class="qty-btn" @click="increaseQuantity(room.id, room.available)">+</button>
                      </div>
                      <span class="max-label">(Tối đa {{ room.available }})</span>
                    </div>
                    <button class="btn-select-room" @click="toggleRoom(room)" :disabled="room.available === 0">
                      {{ room.available === 0 ? 'Hết phòng' : (isRoomSelected(room.id) ? 'Đã chọn' : 'Chọn phòng') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="reviews-header">
              <h3>Đánh giá từ khách hàng</h3>
              <div class="rating-summary">
                <span class="rating-star">★</span>
                <span class="rating-score">{{ overallRating }}</span>
                <span class="rating-count">({{ reviews.length }} đánh giá)</span>
              </div>
            </div>

            <!-- Comment Form -->
            <div class="comment-form">
              <h4>Viết đánh giá của bạn</h4>
              <div class="star-rating-input">
                <label>Đánh giá:</label>
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
              <div class="comment-input-group">
                <textarea 
                  v-model="newComment.comment" 
                  placeholder="Nhập nhận xét của bạn về khách sạn..."
                  rows="4"
                  class="comment-textarea"
                ></textarea>
              </div>
              <button 
                class="submit-comment-btn" 
                @click="submitComment"
                :disabled="isSubmittingComment"
              >
                {{ isSubmittingComment ? 'Đang gửi...' : 'Gửi đánh giá' }}
              </button>
            </div>
            
            <div class="reviews-list">
              <div v-for="review in reviews" :key="review.id" class="review-card">
                <div class="review-header">
                  <div class="reviewer-avatar">{{ review.avatar }}</div>
                  <div class="reviewer-info">
                    <h4 class="reviewer-name">{{ review.name }}</h4>
                    <div class="review-meta">
                      <div class="review-stars">
                        <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">⭐</span>
                      </div>
                      <span class="review-date">{{ review.date }}</span>
                    </div>
                  </div>
                </div>
                <p class="review-text">{{ review.comment }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Booking Sidebar -->
        <aside class="right-col">
          <div class="booking-card">
            <div class="date-field">
              <label>Ngày nhận phòng</label>
              <div class="calendar-input" @click="showCheckInCal = !showCheckInCal">
                <span class="calendar-icon">
                  <img width="20" height="20" src="https://img.icons8.com/windows/32/planner.png" alt="planner"/>
                </span>
                <input type="text" readonly :value="formatDisplayDate(booking.checkIn)" placeholder="Chọn ngày">
              </div>
              <div v-if="showCheckInCal" class="calendar-popup">
                <div class="calendar-header">
                  <button @click="prevMonth('checkIn')" class="nav-btn">‹</button>
                  <span class="month-year">{{ getMonthYear(calendarMonth.checkIn) }}</span>
                  <button @click="nextMonth('checkIn')" class="nav-btn">›</button>
                </div>
                <div class="calendar-grid">
                  <div class="day-header" v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d">{{d}}</div>
                  <div v-for="day in getCalendarDays(calendarMonth.checkIn)" :key="day.key"
                    :class="['calendar-day', {selected: isSelected(day.date, booking.checkIn), disabled: day.disabled, today: isToday(day.date)}]"
                    @click="selectDate(day, 'checkIn')">
                    {{day.label}}
                  </div>
                </div>
              </div>
            </div>

            <div class="date-field">
              <label>Ngày trả phòng</label>
              <div class="calendar-input" @click="showCheckOutCal = !showCheckOutCal">
                <span class="calendar-icon">
                  <img width="20" height="20" src="https://img.icons8.com/windows/32/planner.png" alt="planner"/>
                </span>
                <input type="text" readonly :value="formatDisplayDate(booking.checkOut)" placeholder="Chọn ngày">
              </div>
              <div v-if="showCheckOutCal" class="calendar-popup">
                <div class="calendar-header">
                  <button @click="prevMonth('checkOut')" class="nav-btn">‹</button>
                  <span class="month-year">{{ getMonthYear(calendarMonth.checkOut) }}</span>
                  <button @click="nextMonth('checkOut')" class="nav-btn">›</button>
                </div>
                <div class="calendar-grid">
                  <div class="day-header" v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d">{{d}}</div>
                  <div v-for="day in getCalendarDays(calendarMonth.checkOut)" :key="day.key"
                    :class="['calendar-day', {selected: isSelected(day.date, booking.checkOut), disabled: day.disabled, today: isToday(day.date)}]"
                    @click="selectDate(day, 'checkOut')">
                    {{day.label}}
                  </div>
                </div>
              </div>
            </div>

            <label>Số khách</label>
            <input type="number" min="1" v-model.number="booking.guests" />

            <!-- 💰 NEW: Booking Summary -->
            <div v-if="selectedRooms.length > 0 && booking.checkIn && booking.checkOut" class="booking-summary">
              <h4>Chi tiết đặt phòng</h4>
              <div class="summary-details">
                <div class="summary-nights">
                  <span class="nights-count">{{ calculateNights() }} đêm</span>
                  <span class="nights-dates">{{ formatDisplayDate(booking.checkIn) }} - {{ formatDisplayDate(booking.checkOut) }}</span>
                </div>

                <div class="summary-rooms">
                  <div v-for="room in selectedRooms" :key="room.id" class="summary-room">
                    <span class="room-summary">{{ room.quantity }}x {{ room.name }}</span>
                    <span class="room-total">{{ formatPrice(room.pricePerNight * room.quantity) }}/đêm</span>
                  </div>
                </div>

                <div class="summary-total">
                  <div class="total-breakdown">
                    <span>Tổng tiền phòng ({{ calculateNights() }} đêm):</span>
                    <span class="total-amount">{{ formatPrice(calculateTotalAmount()) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <button class="book-btn" @click="bookNow" :disabled="selectedRooms.length === 0">
              {{ selectedRooms.length === 0 ? 'Chọn phòng để đặt' : 'Đặt phòng ngay' }}
            </button>
          </div>

          <p class="note">🔒 Thanh toán an toàn qua PayOS</p>
        </aside>
      </div>
    </div>

    <!-- Chat Widget -->
    <ChatWidget
      v-if="hotel.hotelName"
      :hotelId="parseInt(hotelId)"
      :hotelName="hotel.hotelName"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import ChatWidget from '@/components/ChatWidget.vue'

const router = useRouter()
const hotelId = router.currentRoute.value.params.id

const hotel = ref({
  hotelName: '',
  street: '',
  district: '',
  city: '',
  country: '',
  rating: 0,
  aminities: '',
  imageUrl: []
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
    const response = await fetch(`/api/hotel-service/hotel-detail?hotelId=${hotelId}`, {
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
    const response = await fetch(`/api/room-service/rooms?hotelId=${hotelId}`, {
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
    const response = await fetch(`/api/review-service/comment?hotelId=${hotelId}`, {
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
    const response = await fetch('/api/review-service/comment', {
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
  fetchHotelDetail()
  fetchRooms()
  fetchComments()
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
    const bookingResponse = await fetch('/api/booking-service/booking', {
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

      const paymentResponse = await fetch('/api/payment-service/payos/create-payment-link', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      const paymentResult = await paymentResponse.json()

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
        alert(`Đặt phòng thành công nhưng không thể tạo phiên thanh toán. Mã booking: ${createdBookingId}`)
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
  if (room && room.quantity > 1) {
    room.quantity--
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
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 1rem 3rem;
}

.back-link {
  display: inline-block;
  color: #1a8bb5;
  margin-bottom: 1rem;
  cursor: pointer;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 2rem;
}

.left-col {
  background: transparent;
}

.gallery {
  border-radius: 12px;
}

.main-image {
  width: 100%;
  height: 360px;
  object-fit: cover;
  border-radius: 12px;
  display: block;
}

.thumbs {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: #22a6d6 #f0f0f0;
}

.thumbs::-webkit-scrollbar {
  height: 6px;
}

.thumbs::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 3px;
}

.thumbs::-webkit-scrollbar-thumb {
  background: #22a6d6;
  border-radius: 3px;
}

.thumbs::-webkit-scrollbar-thumb:hover {
  background: #1a8bb5;
}

.thumbs img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.8;
  border: 2px solid transparent;
  flex-shrink: 0;
}

.thumbs img.active {
  opacity: 1;
  border-color: #22a6d6;
}

.no-images {
  width: 100%;
  height: 360px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d0d0d0;
}

.no-images-content {
  text-align: center;
  padding: 2rem;
}

.no-images-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-images-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.5rem;
}

.no-images-subtext {
  font-size: 0.95rem;
  color: #999;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
}

.hotel-name {
  font-size: 1.4rem;
  font-weight: 700;
}

.hotel-meta {
  color: #666;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.hotel-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  white-space: nowrap;
}

.hotel-rating .rating-star {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}

.amenities {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.amenity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  background: white;
  border: 1px solid #e7eef1;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s;
}

.amenity:hover {
  border-color: #22a6d6;
  box-shadow: 0 2px 8px rgba(34, 166, 214, 0.1);
}

.amenity-icon {
  font-size: 2rem;
}

/* Room Types Section */
.room-types {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.room-card {
  border: 1px solid #e7eef1;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: all 0.3s;
  position: relative;
}

.room-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  border-color: #22a6d6;
}

.room-card:has(.btn-select-room:disabled) {
  opacity: 0.6;
}

.room-card:has(.btn-select-room:disabled):hover {
  box-shadow: none;
  border-color: #e7eef1;
}

.room-details {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.room-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

.room-count {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.room-count.out-of-stock {
  background: #ffebee;
  color: #c62828;
}

.room-specs {
  display: flex;
  gap: 1.5rem;
}

.room-spec {
  color: #666;
  font-size: 0.9rem;
}

.room-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
}

.room-amenities {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.room-amenity {
  background: #f5f7fa;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #555;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.room-amenity::before {
  content: '✓';
  color: #22a6d6;
  font-weight: 700;
}

.room-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
}

.room-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #22a6d6;
}

.price-label {
  color: #666;
  font-size: 0.9rem;
}

.btn-select-room {
  background: #22a6d6;
  color: white;
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-select-room:hover {
  background: #1a8bb5;
  transform: translateY(-2px);
}

.btn-select-room:disabled {
  background: #e0e0e0;
  color: #999;
  cursor: not-allowed;
  transform: none;
}

.btn-select-room:disabled:hover {
  background: #e0e0e0;
  transform: none;
}

.room-quantity-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-right: 1rem;
}

.quantity-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

.room-quantity {
  display: flex;
  align-items: center;
  gap: 0;
  background: white;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.qty-btn:hover {
  background: #f5f5f5;
  color: #22a6d6;
}

.qty-btn:active {
  transform: scale(0.95);
}

.qty-input {
  width: 50px;
  height: 36px;
  text-align: center;
  border: none;
  background: white;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  cursor: default;
}

.qty-input:focus {
  outline: none;
}

.max-label {
  font-size: 0.9rem;
  color: #999;
  white-space: nowrap;
}

/* Remove number input arrows */
.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.qty-input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Right column */
.right-col {
  position: sticky;
  top: 90px;
  height: fit-content;
}

.price-unit {
  color: #666;
  font-size: 1rem;
  font-weight: 400;
  margin-left: 0.25rem;
}

.booking-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.date-field {
  position: relative;
}

.calendar-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e7eef1;
  border-radius: 8px;
  cursor: pointer;
  background: white;
}

.calendar-input:hover {
  border-color: #22a6d6;
}

.calendar-icon {
  font-size: 1.1rem;
}

.calendar-input input {
  border: none;
  outline: none;
  flex: 1;
  cursor: pointer;
  font-size: 0.95rem;
}

.calendar-popup {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  padding: 1rem;
  z-index: 100;
  min-width: 300px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  color: #22a6d6;
  border-radius: 6px;
}

.nav-btn:hover {
  background: #f0f8fb;
}

.month-year {
  font-weight: 600;
  font-size: 0.95rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
}

.day-header {
  text-align: center;
  font-size: 0.75rem;
  color: #999;
  padding: 0.5rem 0;
  font-weight: 600;
}

.calendar-day {
  text-align: center;
  padding: 0.6rem 0;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.calendar-day:hover:not(.disabled) {
  background: #f0f8fb;
}

.calendar-day.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.calendar-day.selected {
  background: #ffb347;
  color: white;
  font-weight: 600;
}

.calendar-day.today {
  border: 2px solid #22a6d6;
}

.booking-card input[type="date"],
.booking-card input[type="number"] {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e7eef1;
}

.book-btn {
  background: #22a6d6;
  color: white;
  border: none;
  padding: 0.85rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

/* Booking Summary Styles */
.booking-summary {
  background: #f8fafb;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e7eef1;
  margin: 0.75rem 0;
}

.booking-summary h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  border-bottom: 1px solid #e7eef1;
  padding-bottom: 0.5rem;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-nights {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nights-count {
  font-size: 1rem;
  font-weight: 600;
  color: #22a6d6;
}

.nights-dates {
  font-size: 0.85rem;
  color: #666;
}

.summary-rooms {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-room {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e7eef1;
}

.room-summary {
  font-size: 0.9rem;
  color: #333;
}

.room-total {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
}

.summary-total {
  border-top: 1px solid #e7eef1;
  padding-top: 0.75rem;
}

.total-breakdown {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-breakdown span:first-child {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.total-amount {
  font-size: 1.25rem;
  font-weight: 800;
  color: #22a6d6;
}

.book-btn:disabled {
  background: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}

.book-btn:disabled:hover {
  background: #e0e0e0;
  transform: none;
}

.note {
  color: #777;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
}

@media (max-width: 980px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .right-col {
    position: static;
  }
}

/* Reviews Section */
.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.reviews-header h3 {
  margin: 0;
}

.rating-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-star {
  font-size: 1.5rem;
  color: #f59e0b;
}

.rating-score {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.rating-count {
  font-size: 0.95rem;
  color: #666;
}

.hotel-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
    margin-bottom: 0;
    flex: 1;
}

.hotel-location img {
    flex-shrink: 0;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.review-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e7eef1;
  transition: all 0.2s;
}

.review-card:hover {
  border-color: #22a6d6;
  box-shadow: 0 2px 8px rgba(34, 166, 214, 0.1);
}

.review-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.reviewer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22a6d6, #1a8bb5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  flex-shrink: 0;
}

.reviewer-info {
  flex: 1;
}

.reviewer-name {
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.25rem 0;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.review-stars {
  display: flex;
  gap: 0.15rem;
}

.star {
  font-size: 0.9rem;
  filter: grayscale(100%);
  opacity: 0.3;
}

.star.filled {
  filter: none;
  opacity: 1;
}

.review-date {
  font-size: 0.85rem;
  color: #999;
}

.review-text {
  color: #666;
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

/* Comment Form Styles */
.comment-form {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e7eef1;
}

.comment-form h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
}

.star-rating-input {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.star-rating-input label {
  font-size: 0.95rem;
  color: #666;
  font-weight: 600;
}

.stars-input {
  display: flex;
  gap: 0.25rem;
}

.star-btn {
  font-size: 1.75rem;
  cursor: pointer;
  color: transparent;
  transition: all 0.2s;
  -webkit-text-stroke: 2px #9ca3af;
  text-stroke: 2px #9ca3af;
}

.star-btn.active,
.star-btn.hover {
  color: #f59e0b;
  -webkit-text-stroke: 2px #f59e0b;
  text-stroke: 2px #f59e0b;
}

.star-btn:hover {
  transform: scale(1.1);
}

.comment-input-group {
  margin-bottom: 1rem;
}

.comment-textarea {
  width: 95%;
  padding: 0.875rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.comment-textarea:focus {
  outline: none;
  border-color: #22a6d6;
  box-shadow: 0 0 0 3px rgba(34, 166, 214, 0.1);
}

.comment-textarea::placeholder {
  color: #999;
}

.submit-comment-btn {
  background: linear-gradient(135deg, #22a6d6, #1a8bb5);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-comment-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1a8bb5, #157a9e);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 166, 214, 0.3);
}

.submit-comment-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ==================== RESPONSIVE STYLES ==================== */

/* Tablet (1024px) */
@media (max-width: 1024px) {
  .hotel-container {
    padding: 80px 1.5rem 2rem;
  }
  
  .image-grid {
    gap: 0.5rem;
  }
}

/* Tablet Portrait (768px) */
@media (max-width: 768px) {
  .hotel-container {
    padding: 70px 1rem 1.5rem;
  }
  
  .image-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  
  .main-image {
    height: 250px;
  }
  
  .sub-images {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.375rem;
  }
  
  .sub-image {
    height: 80px;
  }
  
  .hotel-title {
    font-size: 1.5rem;
  }
  
  .hotel-location {
    font-size: 0.9rem;
  }
  
  .info-card {
    padding: 1.25rem;
  }
  
  .amenity-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .booking-card {
    padding: 1.25rem;
  }
  
  .room-grid {
    grid-template-columns: 1fr;
  }
  
  .reviews-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .comment-form {
    padding: 1.25rem;
  }
  
  .star-rating-input {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .comment-textarea {
    width: 100%;
  }
}

/* Mobile (640px) */
@media (max-width: 640px) {
  .hotel-container {
    padding: 65px 0.75rem 1rem;
  }
  
  .main-image {
    height: 200px;
    border-radius: 10px;
  }
  
  .sub-images {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .sub-image {
    height: 70px;
    border-radius: 6px;
  }
  
  .more-overlay {
    font-size: 0.9rem;
    border-radius: 6px;
  }
  
  .hotel-header {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .hotel-title {
    font-size: 1.25rem;
  }
  
  .hotel-location {
    font-size: 0.85rem;
  }
  
  .info-card {
    padding: 1rem;
    border-radius: 10px;
    margin-bottom: 1rem;
  }
  
  .info-card h3 {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }
  
  .amenity-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  
  .amenity-item {
    padding: 0.625rem;
    font-size: 0.85rem;
  }
  
  .amenity-item img {
    width: 18px;
    height: 18px;
  }
  
  .room-card {
    padding: 1rem;
    border-radius: 10px;
  }
  
  .room-name {
    font-size: 1rem;
  }
  
  .room-price {
    font-size: 1.25rem;
  }
  
  .booking-card {
    padding: 1rem;
    border-radius: 10px;
    margin-bottom: 1rem;
  }
  
  .booking-card h3 {
    font-size: 1.1rem;
  }
  
  .date-inputs {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .date-input {
    padding: 0.75rem;
  }
  
  .guest-selector {
    padding: 0.75rem;
  }
  
  .btn-book {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  .price-info {
    font-size: 1.25rem;
  }
  
  .reviews-section {
    padding: 1rem;
  }
  
  .rating-star {
    font-size: 1.25rem;
  }
  
  .rating-score {
    font-size: 1.25rem;
  }
  
  .rating-count {
    font-size: 0.85rem;
  }
  
  .review-card {
    padding: 1rem;
  }
  
  .review-header {
    gap: 0.75rem;
  }
  
  .reviewer-avatar {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }
  
  .reviewer-name {
    font-size: 0.95rem;
  }
  
  .review-text {
    font-size: 0.9rem;
  }
  
  .comment-form {
    padding: 1rem;
  }
  
  .comment-form h4 {
    font-size: 1rem;
  }
  
  .star-btn {
    font-size: 1.25rem;
  }
  
  .comment-textarea {
    min-height: 80px;
    font-size: 0.9rem;
  }
  
  .submit-comment-btn {
    width: 100%;
    padding: 0.75rem;
  }
}

/* Small Mobile (480px) */
@media (max-width: 480px) {
  .hotel-container {
    padding: 60px 0.5rem 0.75rem;
  }
  
  .main-image {
    height: 180px;
  }
  
  .sub-images {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .sub-image {
    height: 60px;
  }
  
  .hotel-title {
    font-size: 1.125rem;
  }
  
  .info-card,
  .booking-card,
  .room-card,
  .review-card,
  .comment-form {
    padding: 0.875rem;
  }
  
  .amenity-grid {
    gap: 0.375rem;
  }
  
  .amenity-item {
    padding: 0.5rem;
    font-size: 0.8rem;
    gap: 0.375rem;
  }
  
  .amenity-item img {
    width: 16px;
    height: 16px;
  }
  
  .room-features {
    gap: 0.375rem;
  }
  
  .feature-tag {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
  
  .room-price {
    font-size: 1.125rem;
  }
  
  .btn-select {
    padding: 0.625rem 1rem;
    font-size: 0.85rem;
  }
  
  .date-input,
  .guest-selector {
    font-size: 0.9rem;
  }
  
  .reviewer-avatar {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
}
</style>
