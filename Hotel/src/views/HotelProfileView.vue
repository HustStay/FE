<template>
  <div class="dashboard">
    <Sidebar />

    <main class="main-content">
      <div class="content-header">
        <div>
          <h1>Hồ sơ Khách sạn</h1>
          <p>Quản lý thông tin, tiện nghi và hình ảnh của khách sạn</p>
        </div>
        <button class="save-button" @click="saveChanges" :disabled="isSaving">
          <svg v-if="!isSaving" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
          </svg>
          <svg v-else class="spinner-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="4" stroke-dasharray="32" stroke-linecap="round"></circle>
          </svg>
          {{ isSaving ? 'Đang lưu...' : 'Lưu' }}
        </button>
      </div>

      <div class="profile-grid">
        <!-- Left Column: Hotel Info & Amenities -->
        <div class="left-col">
          
          <!-- Basic Info Card -->
          <div class="card">
            <h3>Thông tin chung</h3>
            <div class="form-group">
              <label>Tên khách sạn</label>
              <input type="text" v-model="hotelData.name" placeholder="Nhập tên khách sạn..." />
            </div>
            <div class="form-group">
              <label>Địa chỉ</label>
              <input type="text" v-model="hotelData.address" placeholder="Nhập địa chỉ..." />
            </div>
            <div class="form-group">
              <label>Mô tả ngắn</label>
              <textarea v-model="hotelData.description" rows="4" placeholder="Giới thiệu về khách sạn của bạn..."></textarea>
            </div>
          </div>

          <!-- Amenities Card -->
          <div class="card">
            <h3>Tiện nghi khách sạn</h3>
            <p class="subtitle">Thêm các tiện nghi chung mà khách sạn cung cấp (ví dụ: Hồ bơi, Spa, Gym...)</p>
            
            <div class="amenities-container">
              <div class="amenity-tags">
                <span v-for="(amenity, index) in hotelData.amenities" :key="index" class="amenity-tag">
                  {{ amenity }}
                  <button class="remove-tag" @click="removeAmenity(index)" title="Xóa tiện nghi">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </span>
              </div>
              
              <div class="add-amenity-form">
                <input 
                  type="text" 
                  v-model="newAmenity" 
                  placeholder="Nhập tên tiện nghi..." 
                  @keyup.enter="addAmenity"
                />
                <button class="add-btn" @click="addAmenity">Thêm</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Images -->
        <div class="right-col">
          <div class="card h-full">
            <div class="card-header">
              <h3>Thư viện ảnh</h3>
              <button class="upload-btn" @click="triggerFileInput">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Tải ảnh lên
              </button>
              <input type="file" ref="fileInput" hidden multiple accept="image/*" @change="handleFileUpload" />
            </div>
            
            <p class="subtitle">Quản lý hình ảnh tổng quan của khách sạn.</p>

            <div v-if="hotelData.images.length === 0" class="empty-images">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              <p>Chưa có hình ảnh nào được tải lên</p>
            </div>

            <div class="images-grid" v-else>
              <div v-for="(image, index) in hotelData.images" :key="index" class="image-item">
                <img :src="image.url" alt="Hotel image" />
                <div class="image-overlay">
                  <span v-if="image.isCover" class="cover-badge">Ảnh bìa</span>
                  <div class="image-actions">
                    <button v-if="!image.isCover" class="action-btn set-cover" @click="setCoverImage(index)" title="Đặt làm ảnh bìa">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    </button>
                    <button class="action-btn delete" @click="removeImage(index)" title="Xóa ảnh">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import { apiFetch } from '../utils/apiClient.js'
import cloudinaryService from '../services/cloudinaryService.js'

const isSaving = ref(false)
const newAmenity = ref('')
const fileInput = ref(null)

const hotelData = ref({
  name: '',
  address: '',
  description: '',
  amenities: [],
  images: []
})

const addAmenity = () => {
  const amenity = newAmenity.value.trim()
  if (amenity && !hotelData.value.amenities.includes(amenity)) {
    hotelData.value.amenities.push(amenity)
  }
  newAmenity.value = ''
}

const removeAmenity = (index) => {
  hotelData.value.amenities.splice(index, 1)
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = (event) => {
  const files = event.target.files
  if (!files.length) return

  // Mock uploading by creating object URLs
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const url = URL.createObjectURL(file)
    hotelData.value.images.push({
      url: url,
      file: file,
      isCover: hotelData.value.images.length === 0 // Make first uploaded image cover if none exists
    })
  }
  
  // Reset input
  event.target.value = ''
}

const removeImage = (index) => {
  const removed = hotelData.value.images.splice(index, 1)[0]
  // If we removed the cover, make the first one the cover (if exists)
  if (removed.isCover && hotelData.value.images.length > 0) {
    hotelData.value.images[0].isCover = true
  }
}

const setCoverImage = (index) => {
  hotelData.value.images.forEach((img, i) => {
    img.isCover = (i === index)
  })
}

const saveChanges = async () => {
  if (isSaving.value) return;
  isSaving.value = true;
  
  try {
    const token = localStorage.getItem('token')
    const hotelId = localStorage.getItem('hotelId')
    
    if (!hotelId) {
       alert("Lỗi: Không tìm thấy hotelId");
       isSaving.value = false;
       return;
    }

    // 1. Upload new images to Cloudinary
    const finalImageUrls = [];
    
    const sortedImages = [...hotelData.value.images].sort((a, b) => {
      if (a.isCover) return -1;
      if (b.isCover) return 1;
      return 0;
    });

    for (const img of sortedImages) {
      if (img.file) {
        // This is a new file, upload it
        const uploadResult = await cloudinaryService.uploadFile(img.file);
        if (uploadResult.success) {
          finalImageUrls.push(uploadResult.url);
        } else {
          console.error("Upload failed for a file:", uploadResult.error);
          alert("Có lỗi xảy ra khi upload ảnh!");
          isSaving.value = false;
          return;
        }
      } else {
        // This is an existing image URL from backend
        finalImageUrls.push(img.url);
      }
    }

    // Parse address back into components
    const addressParts = hotelData.value.address.split(',').map(s => s.trim());
    const street = addressParts[0] || '';
    const district = addressParts[1] || '';
    const city = addressParts[2] || '';
    const country = addressParts[3] || 'Việt Nam';

    // 2. Prepare payload
    const payload = {
      hotelName: hotelData.value.name,
      description: hotelData.value.description,
      street: street,
      district: district,
      city: city,
      country: country,
      amenities: hotelData.value.amenities,
      imageUrls: finalImageUrls
    };

    // 3. Send to backend
    const res = await apiFetch('/api/hotel-service/hotel-profile', {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: { hotelId },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert('Đã lưu thông tin hồ sơ khách sạn thành công!');
      await fetchHotelProfile(); // Refresh
    } else {
      const err = await res.json();
      alert('Lỗi: ' + (err.message || 'Không thể lưu hồ sơ'));
    }

  } catch (error) {
    console.error(error);
    alert('Có lỗi xảy ra khi lưu thay đổi!');
  } finally {
    isSaving.value = false;
  }
}

const fetchHotelProfile = async () => {
  try {
    const token = localStorage.getItem('token')
    const hotelId = localStorage.getItem('hotelId')
    
    if (!hotelId) return;

    const res = await apiFetch('/api/hotel-service/hotel-profile', {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { hotelId }
    })
    
    if (res.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      window.location.href = '/'
      return
    }
    
    const data = await res.json()
    if (res.ok && data.hotelProfile) {
      const profile = data.hotelProfile;
      hotelData.value.name = profile.hotelName || '';
      hotelData.value.address = [profile.street, profile.district, profile.city, profile.country].filter(Boolean).join(', ');
      hotelData.value.description = profile.description || '';
      hotelData.value.amenities = profile.aminities || [];
      
      if (profile.imageUrl && profile.imageUrl.length > 0) {
        hotelData.value.images = profile.imageUrl.map((url, index) => ({
          url: url,
          isCover: index === 0
        }));
      } else {
        hotelData.value.images = [];
      }
    }
  } catch (e) {
    console.error('Error fetching hotel profile:', e);
  }
}

onMounted(() => {
  fetchHotelProfile()
})
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

.main-content {
  flex: 1;
  margin-left: 270px;
  padding: 32px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
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

.save-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.save-button:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.save-button:disabled {
  background: #a7f3d0;
  cursor: not-allowed;
}

.spinner-icon {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 24px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  margin-bottom: 24px;
}

.card.h-full {
  height: 100%;
  margin-bottom: 0;
}

.card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-header h3 {
  margin-bottom: 0;
}

/* Forms */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Amenities */
.amenities-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.amenity-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.amenity-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f1f5f9;
  color: #334155;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
}

.remove-tag {
  background: none;
  border: none;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: all 0.2s;
}

.remove-tag svg {
  width: 14px;
  height: 14px;
}

.remove-tag:hover {
  color: #ef4444;
  background: #fee2e2;
}

.add-amenity-form {
  display: flex;
  gap: 10px;
}

.add-amenity-form input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}

.add-amenity-form input:focus {
  outline: none;
  border-color: #3b82f6;
}

.add-btn {
  padding: 0 20px;
  background: #f8fafc;
  color: #3b82f6;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

/* Images */
.upload-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #eff6ff;
  color: #3b82f6;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-btn svg {
  width: 16px;
  height: 16px;
}

.upload-btn:hover {
  background: #dbeafe;
}

.empty-images {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #94a3b8;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  margin-top: 10px;
}

.empty-images svg {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  color: #cbd5e1;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.image-item {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 4/3;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  group: true;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.6) 100%);
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.cover-badge {
  align-self: flex-start;
  background: #f59e0b;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.image-actions {
  display: flex;
  gap: 8px;
  align-self: flex-end;
  margin-top: auto;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.2s;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.set-cover {
  color: #f59e0b;
}

.action-btn.set-cover:hover {
  background: #f59e0b;
  color: white;
}

.action-btn.delete {
  color: #ef4444;
}

.action-btn.delete:hover {
  background: #ef4444;
  color: white;
}

/* Ensure existing cover badge shows even when not hovering */
.image-item:has(.cover-badge) .image-overlay {
  opacity: 1;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%);
}
.image-item:has(.cover-badge):hover .image-overlay {
  background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.6) 100%);
}


@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
  }
  .profile-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 20px;
  }
  .images-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
