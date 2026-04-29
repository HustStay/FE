<template>
  <div class="dashboard">
    <Sidebar />

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-header">
        <div>
          <h1>Quản lý phòng</h1>
          <p>Quản lý tất cả phòng trong khách sạn</p>
        </div>
        <button class="add-button" @click="showAddModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Thêm phòng mới
        </button>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" placeholder="Tìm kiếm theo số phòng..." v-model="searchQuery" />
        </div>
        <select class="filter-select" v-model="statusFilter">
          <option value="">Tất cả trạng thái</option>
          <option value="available">Trống</option>
          <option value="occupied">Đang sử dụng</option>
          <option value="cleaning">Đang dọn</option>
          <option value="maintenance">Bảo trì</option>
        </select>
        <select class="filter-select" v-model="typeFilter">
          <option value="">Tất cả loại phòng</option>
          <option value="standard">Standard</option>
          <option value="deluxe">Deluxe</option>
          <option value="suite">Suite</option>
        </select>
      </div>

      <!-- Rooms By Type -->
      <div class="rooms-by-type">
        <div v-for="(rooms, roomType) in roomsGroupedByType" :key="roomType" class="room-type-section">
          <div class="room-type-header">
            <div class="room-type-title">
              <span :class="['room-type-icon', getRoomTypeClass(roomType)]">
                <svg v-if="roomType === 'Standard'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
                </svg>
                <svg v-else-if="roomType === 'Deluxe'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <svg v-else-if="roomType === 'Suite'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                </svg>
              </span>
              <div>
                <h2>{{ roomType }}</h2>
                <span class="room-count">{{ rooms.length }} phòng</span>
              </div>
            </div>
            <div class="room-type-stats">
              <div class="stat-item available">
                <span class="stat-value">{{ getStatusCount(rooms, 'available') }}</span>
                <span class="stat-label">Trống</span>
              </div>
              <div class="stat-item occupied">
                <span class="stat-value">{{ getStatusCount(rooms, 'occupied') }}</span>
                <span class="stat-label">Đang sử dụng</span>
              </div>
              <div class="stat-item cleaning">
                <span class="stat-value">{{ getStatusCount(rooms, 'cleaning') }}</span>
                <span class="stat-label">Đang dọn</span>
              </div>
              <div class="stat-item maintenance">
                <span class="stat-value">{{ getStatusCount(rooms, 'maintenance') }}</span>
                <span class="stat-label">Bảo trì</span>
              </div>
            </div>
          </div>
          
          <div class="rooms-grid">
            <div v-for="room in rooms" :key="room.id" class="room-card">
              <div class="room-image-container">
                <img :src="room.image" :alt="room.name" class="room-image" />
                <span :class="['room-status-badge', room.status]">
                  {{ getStatusText(room.status) }}
                </span>
                <span v-if="!room.isActive" class="room-inactive-badge">Vô hiệu hóa</span>
              </div>
              <div class="room-content">
                <div class="room-header">
                  <h3 class="room-name">{{ room.name }}</h3>
                  <span class="room-floor">{{ room.floor }}</span>
                </div>
                <div class="room-details">
                  <div class="room-detail-item">
                    <img width="20" height="20" src="https://img.icons8.com/windows/32/user.png" alt="user"/>
                    <span>{{ room.capacity }} người</span>
                  </div>
                </div>
                <div class="room-price">{{ room.price.toLocaleString() }} VNĐ/đêm</div>
                <div class="room-amenities">
                  <span v-for="amenity in room.amenities.slice(0, 3)" :key="amenity" class="amenity-tag">
                    <svg v-if="amenity === 'WiFi'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                    </svg>
                    <svg v-else-if="amenity === 'TV'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    {{ amenity }}
                  </span>
                  <span v-if="room.amenities.length > 3" class="amenity-tag more">
                    +{{ room.amenities.length - 3 }}
                  </span>
                </div>
                <div class="room-actions">
                  <button class="edit-button" @click="openEditModal(room)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    Sửa
                  </button>
                  <button 
                    :class="['toggle-button', room.isActive ? 'deactivate' : 'activate']"
                    @click="handleToggleActive(room)"
                    :title="room.isActive ? 'Vô hiệu hóa phòng' : 'Kích hoạt phòng'"
                  >
                    <svg v-if="room.isActive" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty state when no rooms match filters -->
        <div v-if="Object.keys(roomsGroupedByType).length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2l3-4 3 4h-2v8z"/>
          </svg>
          <h3>Không tìm thấy phòng nào</h3>
          <p>Thử thay đổi bộ lọc hoặc thêm phòng mới</p>
        </div>
      </div>
    </main>

    <!-- Add Room Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Thêm phòng mới</h2>
          <button class="close-button" @click="showAddModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleAddRoom" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label for="roomNumber">Số phòng</label>
              <input
                id="roomNumber"
                v-model="newRoom.number"
                type="text"
                placeholder="101"
                required
              />
            </div>
            <div class="form-group">
              <label for="roomType">Loại phòng</label>
              <select id="roomType" v-model="newRoom.type" required>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="roomStatus">Trạng thái</label>
              <select id="roomStatus" v-model="newRoom.status" required>
                <option value="available">Trống</option>
                <option value="occupied">Đang sử dụng</option>
                <option value="cleaning">Đang dọn</option>
                <option value="maintenance">Bảo trì</option>
              </select>
            </div>
            <div class="form-group">
              <label for="roomPrice">Giá/đêm (VNĐ)</label>
              <input
                id="roomPrice"
                v-model.number="newRoom.price"
                type="number"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="roomCapacity">Sức chứa (người)</label>
              <input
                id="roomCapacity"
                v-model.number="newRoom.capacity"
                type="number"
                placeholder="2"
                required
              />
            </div>
          </div>

          <div class="form-group full-width">
            <label for="roomAmenities">Tiện nghi (phân cách bằng dấu phẩy)</label>
            <input
              id="roomAmenities"
              v-model="newRoom.amenitiesText"
              type="text"
              placeholder="WiFi, TV, Điều hòa, Minibar"
            />
          </div>

          <div class="form-group full-width">
            <label for="roomDescription">Mô tả</label>
            <textarea
              id="roomDescription"
              v-model="newRoom.description"
              rows="4"
              placeholder="Mô tả về phòng..."
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="cancel-button" @click="showAddModal = false">
              Hủy
            </button>
            <button type="submit" class="submit-button">
              Thêm mới
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Room Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Sửa thông tin phòng</h2>
          <button class="close-button" @click="showEditModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleUpdateRoom" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label for="editRoomType">Loại phòng</label>
              <select id="editRoomType" v-model="editRoom.type">
                <option value="">Không thay đổi</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Family">Family</option>
              </select>
            </div>
            <div class="form-group">
              <label for="editRoomPrice">Giá/đêm (VNĐ)</label>
              <input
                id="editRoomPrice"
                v-model.number="editRoom.price"
                type="number"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="editRoomCapacity">Sức chứa (người)</label>
              <input
                id="editRoomCapacity"
                v-model.number="editRoom.capacity"
                type="number"
                placeholder="2"
                required
              />
            </div>
          </div>

          <div class="form-group full-width">
            <label for="editRoomDescription">Mô tả</label>
            <textarea
              id="editRoomDescription"
              v-model="editRoom.description"
              rows="4"
              placeholder="Mô tả về phòng..."
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="cancel-button" @click="showEditModal = false">
              Hủy
            </button>
            <button type="submit" class="submit-button">
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import { apiFetch } from '../utils/apiClient.js'


const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)

const newRoom = ref({
  number: '',
  type: 'Standard',
  status: 'available',
  price: 0,
  capacity: 2,
  floor: '1',
  amenitiesText: 'WiFi, TV, Điều hòa',
  description: ''
})

const editRoom = ref({
  id: null,
  type: '',
  price: 0,
  capacity: 0,
  description: ''
})

const rooms = ref([])

// Fetch rooms from API
const fetchRooms = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await apiFetch('/api/room-service/rooms/all', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 401) {
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      window.location.href = '/'
      return
    }

    const data = await response.json()

    if (response.ok && data.message === "Lấy tất cả phòng thành công") {
      // Convert API data to UI format
      const roomsList = data.rooms.map(room => ({
        id: room.roomId,
        name: `Phòng ${room.roomNumber}`,
        type: room.roomType,
        status: room.isAvailable ? 'available' : 'occupied',
        capacity: room.capacity,
        floor: `Tầng ${Math.floor(parseInt(room.roomNumber) / 100)}`,
        price: room.pricePerNight,
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500',
        amenities: room.amenities ? room.amenities.split(', ').map(a => a.trim()) : [],
        description: room.description,
        isActive: room.isActive
      }))

      rooms.value = roomsList
    } else if (data.message === "Không có phòng nào") {
      console.log('Không có phòng nào')
      rooms.value = []
    } else {
      console.log('Lỗi khi tải danh sách phòng')
      rooms.value = []
    }
  } catch (error) {
    console.error('Fetch rooms error:', error)
    alert('Có lỗi xảy ra khi tải danh sách phòng!')
  }
}

// Call API when component mounts
onMounted(() => {
  fetchRooms()
})

const filteredRooms = computed(() => {
  return rooms.value.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || room.status === statusFilter.value
    const matchesType = !typeFilter.value || room.type.toLowerCase() === typeFilter.value.toLowerCase()
    return matchesSearch && matchesStatus && matchesType
  })
})

// Group rooms by type
const roomsGroupedByType = computed(() => {
  const grouped = {}
  const typeOrder = ['Standard', 'Deluxe', 'Suite', 'Family']
  
  filteredRooms.value.forEach(room => {
    const type = room.type || 'Khác'
    if (!grouped[type]) {
      grouped[type] = []
    }
    grouped[type].push(room)
  })
  
  // Sort groups by predefined order
  const sortedGrouped = {}
  typeOrder.forEach(type => {
    if (grouped[type]) {
      sortedGrouped[type] = grouped[type]
    }
  })
  
  // Add any remaining types not in the predefined order
  Object.keys(grouped).forEach(type => {
    if (!sortedGrouped[type]) {
      sortedGrouped[type] = grouped[type]
    }
  })
  
  return sortedGrouped
})

// Get status count for a group of rooms
const getStatusCount = (rooms, status) => {
  return rooms.filter(room => room.status === status).length
}

// Get room type class for styling
const getRoomTypeClass = (type) => {
  const typeMap = {
    'Standard': 'standard',
    'Deluxe': 'deluxe',
    'Suite': 'suite',
    'Family': 'family'
  }
  return typeMap[type] || 'other'
}

const getStatusText = (status) => {
  const statusMap = {
    available: 'Trống',
    occupied: 'Đang sử dụng',
    cleaning: 'Đang dọn',
    maintenance: 'Bảo trì'
  }
  return statusMap[status] || status
}

const openEditModal = (room) => {
  editRoom.value = {
    id: room.id,
    type: '',
    price: room.price,
    capacity: room.capacity,
    description: room.description || ''
  }
  showEditModal.value = true
}

const handleUpdateRoom = async () => {
  try {
    const token = localStorage.getItem('token')
    const requestBody = {
      roomId: editRoom.value.id,
      roomType: editRoom.value.type || null,
      roomPrice: editRoom.value.price,
      roomCapacity: editRoom.value.capacity,
      roomDescription: editRoom.value.description || null
    }

    const response = await apiFetch('/api/room-service/room/update', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (response.status === 401) {
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      window.location.href = '/'
      return
    }

    const data = await response.json()

    if (response.ok) {
      if (data.message === "Cập nhật phòng thành công") {
        showEditModal.value = false
        alert('Cập nhật phòng thành công!')
        // Reload rooms list
        fetchRooms()
      } else if (data.message === "Cập nhật phòng thất bại") {
        alert('Cập nhật phòng thất bại. Vui lòng thử lại!')
      }
    } else {
      alert('Có lỗi xảy ra. Vui lòng thử lại!')
    }
  } catch (error) {
    console.error('Update room error:', error)
    alert('Có lỗi xảy ra. Vui lòng thử lại sau!')
  }
}

const handleToggleActive = async (room) => {
  try {
    const token = localStorage.getItem('token')
    const newActiveStatus = !room.isActive
    
    const requestBody = {
      roomId: room.id,
      isActive: newActiveStatus
    }

    const response = await apiFetch('/api/room-service/room/active', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (response.status === 401) {
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      window.location.href = '/'
      return
    }

    const data = await response.json()

    if (response.ok && data.message === "Cập nhật hoạt động phòng thành công") {
      alert(newActiveStatus ? 'Kích hoạt phòng thành công!' : 'Vô hiệu hóa phòng thành công!')
      // Reload rooms list to reflect changes
      fetchRooms()
    } else if (data.message === "Cập nhật hoạt động phòng thất bại") {
      alert('Cập nhật hoạt động phòng thất bại. Vui lòng thử lại!')
    } else {
      alert('Có lỗi xảy ra. Vui lòng thử lại!')
    }
  } catch (error) {
    console.error('Toggle active error:', error)
    alert('Có lỗi xảy ra. Vui lòng thử lại sau!')
  }
}

const handleAddRoom = async () => {
  try {
    const amenitiesArray = newRoom.value.amenitiesText
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0)

    const requestBody = {
      hotelId: 1,
      roomNumber: newRoom.value.number,
      roomType: newRoom.value.type,
      price: newRoom.value.price,
      capacity: newRoom.value.capacity,
      description: newRoom.value.description,
      amenities: amenitiesArray
    }

    const token = localStorage.getItem('token')
    const response = await apiFetch('/api/room-service/room/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (response.status === 401) {
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      window.location.href = '/'
      return
    }

    const data = await response.json()

    if (response.ok) {
      if (data.message === "Thêm phòng thành công") {
        // Thêm phòng vào danh sách hiển thị
        const room = {
          id: rooms.value.length + 1,
          name: `Phòng ${newRoom.value.number}`,
          type: newRoom.value.type,
          status: newRoom.value.status,
          capacity: newRoom.value.capacity,
          floor: `Tầng ${newRoom.value.floor}`,
          price: newRoom.value.price,
          image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500',
          amenities: amenitiesArray,
          description: newRoom.value.description
        }
        rooms.value.push(room)
        
        showAddModal.value = false

        // Reset form
        newRoom.value = {
          number: '',
          type: 'Standard',
          status: 'available',
          price: 0,
          capacity: 2,
          floor: '1',
          amenitiesText: 'WiFi, TV, Điều hòa',
          description: ''
        }

        alert('Thêm phòng thành công!')
        
        // Reload rooms list
        fetchRooms()
      } else if (data.message === "Phòng đã tồn tại") {
        alert('Phòng đã tồn tại. Vui lòng chọn số phòng khác!')
      }
    } else {
      alert('Có lỗi xảy ra. Vui lòng thử lại!')
    }
  } catch (error) {
    console.error('Add room error:', error)
    alert('Có lỗi xảy ra. Vui lòng thử lại sau!')
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 270px;
  padding: 32px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.content-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.content-header p {
  font-size: 14px;
  color: #64748b;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-button svg {
  width: 20px;
  height: 20px;
}

.add-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Filters */
.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.search-box {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: #94a3b8;
}

.search-box input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 180px;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Rooms By Type Section */
.rooms-by-type {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.room-type-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.room-type-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.room-type-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.room-type-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.room-type-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.room-type-icon.standard {
  background: linear-gradient(135deg, #64748b, #475569);
}

.room-type-icon.deluxe {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.room-type-icon.suite {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.room-type-icon.family {
  background: linear-gradient(135deg, #10b981, #059669);
}

.room-type-icon.other {
  background: linear-gradient(135deg, #94a3b8, #64748b);
}

.room-type-title h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.room-count {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.room-type-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  background: #f8fafc;
}

.stat-item .stat-value {
  font-size: 20px;
  font-weight: 700;
}

.stat-item .stat-label {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-item.available .stat-value {
  color: #3b82f6;
}

.stat-item.available .stat-label {
  color: #64748b;
}

.stat-item.occupied .stat-value {
  color: #ef4444;
}

.stat-item.occupied .stat-label {
  color: #64748b;
}

.stat-item.cleaning .stat-value {
  color: #f97316;
}

.stat-item.cleaning .stat-label {
  color: #64748b;
}

.stat-item.maintenance .stat-value {
  color: #94a3b8;
}

.stat-item.maintenance .stat-label {
  color: #64748b;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-state svg {
  width: 64px;
  height: 64px;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
  color: #64748b;
}

/* Rooms Grid */
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.room-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.room-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.room-image-container {
  position: relative;
  width: 100%;
  height: 120px;
  overflow: hidden;
}

.room-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-status-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: white;
}

.room-status-badge.available {
  background: #3b82f6;
}

.room-status-badge.occupied {
  background: #ef4444;
}

.room-status-badge.cleaning {
  background: #f97316;
}

.room-status-badge.maintenance {
  background: #94a3b8;
}

.room-inactive-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  color: white;
  background: rgba(0, 0, 0, 0.7);
}

.room-content {
  padding: 12px;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.room-name {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.room-floor {
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 8px;
}

.room-details {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.room-detail-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.room-detail-item svg {
  width: 14px;
  height: 14px;
}

.room-detail-item img {
  width: 14px;
  height: 14px;
}

.room-price {
  font-size: 15px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 10px;
}

.room-amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;
}

.amenity-tag {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 6px;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 4px;
  font-size: 10px;
}

.amenity-tag svg {
  width: 10px;
  height: 10px;
}

.amenity-tag.more {
  background: #e2e8f0;
  color: #475569;
  font-weight: 600;
}

.room-actions {
  display: flex;
  gap: 8px;
}

.edit-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 8px;
  background: white;
  border: 1px solid #e2e8f0;
  color: #1e293b;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-button svg {
  width: 12px;
  height: 12px;
}

.edit-button:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}

.toggle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-button svg {
  width: 14px;
  height: 14px;
}

.toggle-button.deactivate {
  background: #ef4444;
}

.toggle-button.deactivate:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.toggle-button.activate {
  background: #10b981;
}

.toggle-button.activate:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.close-button {
  width: 36px;
  height: 36px;
  border: none;
  background: #f1f5f9;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-button svg {
  width: 20px;
  height: 20px;
  color: #64748b;
}

.close-button:hover {
  background: #e2e8f0;
}

.modal-form {
  padding: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  margin-bottom: 16px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  transition: all 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.cancel-button {
  flex: 1;
  padding: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.submit-button {
  flex: 1;
  padding: 12px;
  background: #3b82f6;
  border: none;
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
  }

  .rooms-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }

  .room-type-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .room-type-stats {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 20px;
  }

  .content-header {
    flex-direction: column;
    gap: 16px;
  }

  .add-button {
    width: 100%;
  }

  .filters {
    flex-direction: column;
  }

  .rooms-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-content {
    max-height: 95vh;
  }

  .room-type-stats {
    flex-wrap: wrap;
    gap: 8px;
  }

  .stat-item {
    flex: 1;
    min-width: 70px;
    padding: 6px 8px;
  }

  .stat-item .stat-value {
    font-size: 16px;
  }

  .stat-item .stat-label {
    font-size: 9px;
  }

  .room-type-section {
    padding: 16px;
  }
}
</style>
