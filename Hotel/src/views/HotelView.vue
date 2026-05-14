<template>
  <div class="dashboard">
    <Sidebar />

    <main class="main-content">
      <div v-if="coverImage" class="hero-banner">
        <img :src="coverImage.url" :alt="coverImage.title" class="hero-image" />
        <div class="hero-overlay">
          <div>
            <h1>Trang Hotel</h1>
            <p>Đăng, chỉnh sửa ảnh và tiện nghi khách sạn</p>
          </div>
        </div>
      </div>

      <div v-else class="content-header">
        <div>
          <h1>Trang Hotel</h1>
          <p>Đăng, chỉnh sửa ảnh và tiện nghi khách sạn</p>
        </div>
      </div>

      <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>

      <section class="panel">
        <div class="panel-header">
          <h2>Ảnh khách sạn</h2>
          <span>{{ hotelImages.length }} ảnh</span>
        </div>

        <form class="upload-form" @submit.prevent="handleUploadImages">
          <input
            ref="uploadInput"
            type="file"
            accept="image/*"
            multiple
            @change="handleUploadSelection"
          />
          <input
            v-model="uploadDescription"
            type="text"
            placeholder="Mô tả ngắn cho ảnh đăng lên (tuỳ chọn)"
          />
          <button type="submit" :disabled="uploadQueue.length === 0">
            Đăng ảnh
          </button>
        </form>

        <div v-if="uploadQueue.length > 0" class="upload-preview-grid">
          <div v-for="(item, index) in uploadQueue" :key="item.previewUrl" class="upload-preview-item">
            <img :src="item.previewUrl" :alt="item.file.name" />
            <div class="upload-meta">
              <p class="upload-name">{{ item.file.name }}</p>
              <p>{{ formatFileSize(item.file.size) }}</p>
            </div>
            <button type="button" class="ghost-btn" @click="removeUploadQueueItem(index)">Bỏ</button>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>Danh sách ảnh đã đăng</h2>
        </div>
        <div v-if="hotelImages.length" class="gallery-grid">
          <article v-for="image in sortedImages" :key="image.id" class="gallery-card">
            <div class="image-wrapper">
              <img :src="image.url" :alt="image.title" />
              <span v-if="image.isCover" class="cover-badge">Ảnh bìa</span>
            </div>
            <div class="card-body">
              <h3>{{ image.title }}</h3>
              <p>{{ image.description || 'Chưa có mô tả' }}</p>
              <div class="card-actions">
                <button type="button" class="secondary-btn" @click="openImageEditor(image)">Sửa</button>
                <button
                  type="button"
                  class="secondary-btn"
                  :disabled="image.isCover"
                  @click="setCoverImage(image.id)"
                >
                  Đặt làm ảnh bìa
                </button>
                <button type="button" class="danger-btn" @click="removeImage(image.id)">Xoá</button>
              </div>
            </div>
          </article>
        </div>
        <div v-else class="empty-state">
          <p>Chưa có ảnh nào. Hãy đăng ảnh khách sạn đầu tiên.</p>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>Tiện nghi khách sạn</h2>
          <span>{{ hotelAmenities.length }} tiện nghi</span>
        </div>

        <form class="amenity-form" @submit.prevent="addAmenity">
          <input v-model="amenityForm.name" type="text" placeholder="Tên tiện nghi (ví dụ: Hồ bơi vô cực)" required />
          <input
            v-model="amenityForm.description"
            type="text"
            placeholder="Mô tả ngắn (ví dụ: Mở cửa 06:00 - 22:00)"
          />
          <button type="submit">Thêm tiện nghi</button>
        </form>

        <div v-if="hotelAmenities.length" class="amenity-grid">
          <article v-for="amenity in hotelAmenities" :key="amenity.id" class="amenity-card">
            <h3>{{ amenity.name }}</h3>
            <p>{{ amenity.description || 'Không có mô tả' }}</p>
            <div class="card-actions">
              <button type="button" class="secondary-btn" @click="openAmenityEditor(amenity)">Sửa</button>
              <button type="button" class="danger-btn" @click="removeAmenity(amenity.id)">Xoá</button>
            </div>
          </article>
        </div>
        <div v-else class="empty-state">
          <p>Chưa có tiện nghi nào. Hãy thêm tiện nghi đầu tiên.</p>
        </div>
      </section>
    </main>

    <div v-if="showImageEditor" class="modal-overlay" @click="closeImageEditor">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Sửa ảnh đã đăng</h3>
          <button class="icon-btn" @click="closeImageEditor">×</button>
        </div>
        <form class="modal-form" @submit.prevent="saveImageEdit">
          <label>Tên ảnh</label>
          <input v-model="imageEditor.title" type="text" required />

          <label>Mô tả ảnh</label>
          <textarea v-model="imageEditor.description" rows="3"></textarea>

          <label>Thay ảnh mới (tuỳ chọn)</label>
          <input type="file" accept="image/*" @change="handleImageReplacement" />

          <img
            v-if="imageEditor.previewUrl"
            :src="imageEditor.previewUrl"
            alt="Ảnh xem trước khi thay"
            class="edit-preview"
          />

          <div class="modal-actions">
            <button type="button" class="secondary-btn" @click="closeImageEditor">Hủy</button>
            <button type="submit">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showAmenityEditor" class="modal-overlay" @click="closeAmenityEditor">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Sửa tiện nghi</h3>
          <button class="icon-btn" @click="closeAmenityEditor">×</button>
        </div>
        <form class="modal-form" @submit.prevent="saveAmenityEdit">
          <label>Tên tiện nghi</label>
          <input v-model="amenityEditor.name" type="text" required />

          <label>Mô tả</label>
          <textarea v-model="amenityEditor.description" rows="3"></textarea>

          <div class="modal-actions">
            <button type="button" class="secondary-btn" @click="closeAmenityEditor">Hủy</button>
            <button type="submit">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import Sidebar from '../components/Sidebar.vue'

const STORAGE_KEY = 'hotel-page-template-v1'

const defaultImages = [
  {
    id: 'img-default-1',
    title: 'Sảnh chính',
    description: 'Khu vực lễ tân và sảnh chờ',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
    isCover: true
  },
  {
    id: 'img-default-2',
    title: 'Khu hồ bơi',
    description: 'Không gian thư giãn ngoài trời',
    url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200',
    isCover: false
  }
]

const defaultAmenities = [
  { id: 'amenity-default-1', name: 'WiFi miễn phí', description: 'Phủ sóng toàn bộ khuôn viên' },
  { id: 'amenity-default-2', name: 'Bãi đỗ xe', description: 'Đỗ xe miễn phí cho khách lưu trú' },
  { id: 'amenity-default-3', name: 'Nhà hàng', description: 'Phục vụ buffet sáng và gọi món' }
]

const hotelImages = ref([...defaultImages])
const hotelAmenities = ref([...defaultAmenities])
const uploadQueue = ref([])
const uploadDescription = ref('')
const uploadInput = ref(null)
const statusMessage = ref('')

const showImageEditor = ref(false)
const imageEditor = ref({
  id: '',
  title: '',
  description: '',
  replacementFile: null,
  previewUrl: ''
})

const showAmenityEditor = ref(false)
const amenityForm = ref({
  name: '',
  description: ''
})
const amenityEditor = ref({
  id: '',
  name: '',
  description: ''
})

const sortedImages = computed(() => {
  return [...hotelImages.value].sort((a, b) => Number(b.isCover) - Number(a.isCover))
})

const coverImage = computed(() => {
  return hotelImages.value.find((image) => image.isCover) || hotelImages.value[0] || null
})

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const formatFileSize = (size) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Không thể đọc tệp ảnh'))
    reader.readAsDataURL(file)
  })
}

const clearUploadQueue = () => {
  uploadQueue.value.forEach((item) => URL.revokeObjectURL(item.previewUrl))
  uploadQueue.value = []
}

const handleUploadSelection = (event) => {
  clearUploadQueue()
  const files = Array.from(event.target.files || [])
  uploadQueue.value = files.map((file) => ({
    file,
    previewUrl: URL.createObjectURL(file)
  }))
}

const removeUploadQueueItem = (index) => {
  const removed = uploadQueue.value.splice(index, 1)
  if (removed.length > 0) {
    URL.revokeObjectURL(removed[0].previewUrl)
  }
}

const handleUploadImages = async () => {
  if (uploadQueue.value.length === 0) return

  const newImages = await Promise.all(
    uploadQueue.value.map(async ({ file }) => {
      const dataUrl = await fileToDataUrl(file)
      return {
        id: createId('img'),
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: uploadDescription.value.trim(),
        url: dataUrl,
        isCover: false
      }
    })
  )

  if (!hotelImages.value.some((image) => image.isCover) && newImages.length > 0) {
    newImages[0].isCover = true
  }

  hotelImages.value = [...newImages, ...hotelImages.value]
  statusMessage.value = `Đăng thành công ${newImages.length} ảnh.`
  uploadDescription.value = ''

  clearUploadQueue()
  if (uploadInput.value) {
    uploadInput.value.value = ''
  }
}

const setCoverImage = (imageId) => {
  hotelImages.value = hotelImages.value.map((image) => ({
    ...image,
    isCover: image.id === imageId
  }))
  statusMessage.value = 'Đã cập nhật ảnh bìa.'
}

const removeImage = (imageId) => {
  const target = hotelImages.value.find((image) => image.id === imageId)
  if (!target) return
  if (!window.confirm('Bạn chắc chắn muốn xoá ảnh này?')) return

  const remaining = hotelImages.value.filter((image) => image.id !== imageId)
  if (target.isCover && remaining.length > 0 && !remaining.some((image) => image.isCover)) {
    remaining[0] = { ...remaining[0], isCover: true }
  }
  hotelImages.value = remaining
  statusMessage.value = 'Đã xoá ảnh.'
}

const openImageEditor = (image) => {
  showImageEditor.value = true
  imageEditor.value = {
    id: image.id,
    title: image.title,
    description: image.description || '',
    replacementFile: null,
    previewUrl: image.url
  }
}

const releaseImageEditorPreview = () => {
  if (imageEditor.value.replacementFile && imageEditor.value.previewUrl) {
    URL.revokeObjectURL(imageEditor.value.previewUrl)
  }
}

const closeImageEditor = () => {
  releaseImageEditorPreview()
  showImageEditor.value = false
  imageEditor.value = {
    id: '',
    title: '',
    description: '',
    replacementFile: null,
    previewUrl: ''
  }
}

const handleImageReplacement = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  releaseImageEditorPreview()
  imageEditor.value.replacementFile = file
  imageEditor.value.previewUrl = URL.createObjectURL(file)
}

const saveImageEdit = async () => {
  const replacementUrl = imageEditor.value.replacementFile
    ? await fileToDataUrl(imageEditor.value.replacementFile)
    : null

  hotelImages.value = hotelImages.value.map((image) => {
    if (image.id !== imageEditor.value.id) return image
    return {
      ...image,
      title: imageEditor.value.title.trim(),
      description: imageEditor.value.description.trim(),
      url: replacementUrl || image.url
    }
  })

  statusMessage.value = 'Đã cập nhật ảnh.'
  closeImageEditor()
}

const addAmenity = () => {
  const name = amenityForm.value.name.trim()
  if (!name) return

  hotelAmenities.value.unshift({
    id: createId('amenity'),
    name,
    description: amenityForm.value.description.trim()
  })
  amenityForm.value = { name: '', description: '' }
  statusMessage.value = 'Đã thêm tiện nghi.'
}

const openAmenityEditor = (amenity) => {
  showAmenityEditor.value = true
  amenityEditor.value = {
    id: amenity.id,
    name: amenity.name,
    description: amenity.description || ''
  }
}

const closeAmenityEditor = () => {
  showAmenityEditor.value = false
  amenityEditor.value = { id: '', name: '', description: '' }
}

const saveAmenityEdit = () => {
  const name = amenityEditor.value.name.trim()
  if (!name) return

  hotelAmenities.value = hotelAmenities.value.map((amenity) => {
    if (amenity.id !== amenityEditor.value.id) return amenity
    return {
      ...amenity,
      name,
      description: amenityEditor.value.description.trim()
    }
  })

  statusMessage.value = 'Đã cập nhật tiện nghi.'
  closeAmenityEditor()
}

const removeAmenity = (amenityId) => {
  if (!window.confirm('Bạn chắc chắn muốn xoá tiện nghi này?')) return
  hotelAmenities.value = hotelAmenities.value.filter((amenity) => amenity.id !== amenityId)
  statusMessage.value = 'Đã xoá tiện nghi.'
}

const loadStoredData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const data = JSON.parse(raw)

    if (Array.isArray(data.images) && data.images.length > 0) {
      hotelImages.value = data.images.map((image) => ({
        id: image.id || createId('img'),
        title: image.title || 'Ảnh khách sạn',
        description: image.description || '',
        url: image.url,
        isCover: Boolean(image.isCover)
      }))

      if (!hotelImages.value.some((image) => image.isCover) && hotelImages.value.length > 0) {
        hotelImages.value[0] = { ...hotelImages.value[0], isCover: true }
      }
    }

    if (Array.isArray(data.amenities) && data.amenities.length > 0) {
      hotelAmenities.value = data.amenities.map((amenity) => ({
        id: amenity.id || createId('amenity'),
        name: amenity.name || 'Tiện nghi',
        description: amenity.description || ''
      }))
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
}

loadStoredData()

watch(
  [hotelImages, hotelAmenities],
  () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        images: hotelImages.value,
        amenities: hotelAmenities.value
      })
    )
  },
  { deep: true }
)

onBeforeUnmount(() => {
  clearUploadQueue()
  releaseImageEditorPreview()
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
  padding: 0 32px 32px;
}

.hero-banner {
  position: relative;
  height: 220px;
  margin: 0 -32px 28px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 0 40px;
  background: linear-gradient(to right, rgba(15, 23, 42, 0.8) 35%, rgba(15, 23, 42, 0.2));
}

.hero-overlay h1 {
  color: #fff;
  font-size: 32px;
  margin-bottom: 6px;
}

.hero-overlay p {
  color: #cbd5e1;
  font-size: 14px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 32px 0 24px;
}

.content-header h1 {
  font-size: 32px;
  color: #1e293b;
}

.content-header p {
  margin-top: 4px;
  color: #64748b;
  font-size: 14px;
}

.status-message {
  margin-bottom: 18px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #e0f2fe;
  color: #0c4a6e;
  font-size: 14px;
  font-weight: 500;
}

.panel {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 22px;
  margin-bottom: 22px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.panel-header h2 {
  color: #0f172a;
  font-size: 20px;
}

.panel-header span {
  color: #475569;
  font-size: 13px;
  font-weight: 600;
}

.upload-form,
.amenity-form {
  display: grid;
  grid-template-columns: 1.3fr 1fr auto;
  gap: 10px;
  margin-bottom: 16px;
}

.upload-form input,
.amenity-form input,
.modal-form input,
.modal-form textarea {
  width: 100%;
  border: 1px solid #dbe2ea;
  border-radius: 8px;
  padding: 11px 12px;
  font-size: 14px;
  font-family: inherit;
}

.upload-form input:focus,
.amenity-form input:focus,
.modal-form input:focus,
.modal-form textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

button {
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 600;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary-btn {
  background: #eef2ff;
  color: #3730a3;
}

.danger-btn {
  background: #fee2e2;
  color: #b91c1c;
}

.ghost-btn {
  background: #f1f5f9;
  color: #334155;
}

.upload-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 12px;
}

.upload-preview-item {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  background: #f8fafc;
}

.upload-preview-item img {
  width: 100%;
  height: 130px;
  object-fit: cover;
}

.upload-meta {
  padding: 10px 12px 0;
  font-size: 12px;
  color: #64748b;
}

.upload-name {
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 2px;
}

.upload-preview-item .ghost-btn {
  width: calc(100% - 20px);
  margin: 10px;
}

.gallery-grid,
.amenity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

.gallery-card,
.amenity-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.image-wrapper {
  position: relative;
}

.image-wrapper img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.cover-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(15, 23, 42, 0.8);
  color: #fff;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
}

.card-body {
  padding: 12px;
}

.card-body h3 {
  color: #0f172a;
  font-size: 16px;
  margin-bottom: 4px;
}

.card-body p {
  color: #64748b;
  font-size: 13px;
  min-height: 36px;
  margin-bottom: 10px;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.empty-state {
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  padding: 24px;
  text-align: center;
  color: #64748b;
}

.amenity-card {
  padding: 14px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 16px;
}

.modal-content {
  width: 100%;
  max-width: 520px;
  background: #fff;
  border-radius: 12px;
  padding: 18px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.modal-header h3 {
  color: #0f172a;
  font-size: 20px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  color: #334155;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-form label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.edit-preview {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 10px;
  margin-top: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    padding: 0 24px 24px;
  }

  .hero-banner {
    margin: 0 -24px 24px;
  }

  .upload-form,
  .amenity-form {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 0 16px 16px;
  }

  .hero-banner {
    margin: 0 -16px 18px;
    height: 170px;
  }

  .hero-overlay {
    padding: 0 18px;
  }

  .hero-overlay h1,
  .content-header h1 {
    font-size: 24px;
  }
}
</style>
