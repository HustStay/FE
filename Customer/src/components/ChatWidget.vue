<template>
  <div class="chat-widget-container">
    <!-- Chat Button -->
    <button
      v-if="!isOpen"
      @click="openChat"
      class="chat-button"
      :class="{ 'has-unread': unreadCount > 0 }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
    </button>

    <!-- Chat Window -->
    <div v-if="isOpen" class="chat-window">
      <!-- Chat Header -->
      <div class="chat-header">
        <div class="hotel-info">
          <div class="hotel-avatar">{{ hotelName.charAt(0) }}</div>
          <div class="hotel-details">
            <h3>{{ hotelName }}</h3>
            <span class="status" :class="{ online: isConnected }">
              {{ isConnected ? 'Đang hoạt động' : 'Ngoại tuyến' }}
            </span>
          </div>
        </div>
        <div class="chat-actions">
          <button @click="minimizeChat" class="action-btn">−</button>
          <button @click="closeChat" class="action-btn">×</button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="chat-messages" ref="messagesContainer">
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải tin nhắn...</p>
        </div>

        <div v-else-if="messages.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <p>Chưa có tin nhắn nào</p>
          <span>Gửi tin nhắn đầu tiên của bạn!</span>
        </div>

        <div v-else class="messages-list">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message', msg.senderType === 0 ? 'sent' : 'received']"
          >
            <div class="message-bubble">
              <!-- Text Message -->
              <div v-if="msg.messageType === 'TEXT'" class="text-message">
                <p class="message-content">{{ msg.content }}</p>
              </div>

              <!-- Image Message -->
              <div v-else-if="msg.messageType === 'IMAGE'" class="image-message">
                <img
                  :src="msg.thumbnailUrl || msg.fileUrl"
                  :alt="msg.fileName || 'Image'"
                  class="chat-image"
                  @click="openImageModal(msg.fileUrl)"
                />
              </div>

              <!-- File Message -->
              <div v-else-if="msg.messageType === 'FILE' || msg.messageType === 'DOCUMENT'" class="file-message">
                <div class="file-info">
                  <div class="file-details">
                    <div class="file-name">{{ msg.fileName || msg.content }}</div>
                    <div class="file-size">{{ formatFileSize(msg.fileSize) }}</div>
                  </div>
                  <a :href="getDownloadUrl(msg.fileUrl, msg.fileName)" target="_blank" download class="download-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                  </a>
                </div>
              </div>

              <div class="message-meta">
                <span class="message-time">{{ formatTime(msg.createdAt) }}</span>
                <span v-if="msg.senderType === 0" class="read-status">
                  {{ msg.isRead ? '✓✓' : '✓' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- File Preview (if file selected) -->
      <div v-if="selectedFile" class="file-preview">
        <div class="preview-content">
          <div v-if="isImageFile(selectedFile)" class="image-preview">
            <img :src="filePreviewUrl" :alt="selectedFile.name" />
          </div>
          <div v-else class="file-preview-info">
            <!-- <div class="file-icon">{{ getFileIcon(selectedFile) }}</div> -->
            <div class="file-details">
              <div class="file-name">{{ selectedFile.name }}</div>
              <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
            </div>
          </div>

          <div class="preview-actions">
            <button @click="clearSelectedFile" class="cancel-btn">Hủy</button>
            <!-- <button @click="handleFileUpload" :disabled="isUploading" class="upload-btn">
              {{ isUploading ? 'Đang gửi...' : 'Gửi' }}
            </button> -->
          </div>

          <!-- Upload Progress -->
          <div v-if="isUploading && uploadProgress > 0" class="upload-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <span class="progress-text">{{ uploadProgress }}%</span>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="chat-input-wrapper">
        <div class="chat-input">
          <!-- File Upload Button -->
          <label class="file-upload-btn">
            <input
              type="file"
              ref="fileInput"
              @change="handleFileSelect"
              accept="image/*,.pdf,.doc,.docx,.txt"
              style="display: none;"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L8.8 16.94a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </label>

          <textarea
            v-model="newMessage"
            @keydown.enter.prevent="sendMessage"
            placeholder="Nhập tin nhắn..."
            rows="1"
            ref="messageInput"
            :disabled="selectedFile !== null"
          ></textarea>
          <button
            @click="sendMessage"
            class="send-btn"
            :disabled="(!newMessage.trim() && !selectedFile) || isSending || isUploading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="imageModal.isOpen" class="image-modal" @click="closeImageModal">
      <div class="modal-content">
        <img :src="imageModal.url" alt="Full size image" />
        <button @click="closeImageModal" class="modal-close">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, nextTick } from 'vue'
import { Client } from '@stomp/stompjs'
import cloudinaryService from '@/services/cloudinaryService.js'
import { FILE_CONFIG, getDownloadUrl } from '@/utils/cloudinaryConfig.js'

const props = defineProps({
  hotelId: {
    type: Number,
    required: true
  },
  hotelName: {
    type: String,
    required: true
  }
})

const isOpen = ref(false)
const isConnected = ref(false)
const isLoading = ref(false)
const isSending = ref(false)
const messages = ref([])
const newMessage = ref('')
const unreadCount = ref(0)
const conversationId = ref(null)
const messagesContainer = ref(null)
const messageInput = ref(null)

let stompClient = null
const DEFAULT_API_GATEWAY_URL = 'https://api-gateway-310906765270.asia-southeast1.run.app'
const apiGatewayUrl = (import.meta.env.VITE_API_GATEWAY_URL || import.meta.env.VITE_API_URL || DEFAULT_API_GATEWAY_URL).replace(/\/+$/, '')

// File upload reactive data
const selectedFile = ref(null)
const filePreviewUrl = ref('')
const isUploading = ref(false)
const uploadProgress = ref(0)
const fileInput = ref(null)

// Image modal
const imageModal = ref({
  isOpen: false,
  url: ''
})

// Use Vite proxy in dev; use API Gateway URL in production
const buildChatWebSocketUrl = (token) => {
  const encodedToken = encodeURIComponent(token)
  if (import.meta.env.DEV) {
    const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws'
    return `${scheme}://${window.location.host}/chat-ws/chat-service/ws/websocket?token=${encodedToken}`
  }
  const wsBaseUrl = apiGatewayUrl.replace(/^http/, 'ws')
  return `${wsBaseUrl}/chat-service/ws/websocket?token=${encodedToken}`
}

// Subscribe to conversation topic (extracted for reuse)
const subscribeToTopic = () => {
  if (!conversationId.value || !stompClient) return

  stompClient.subscribe(`/topic/chat/${conversationId.value}`, (message) => {
    const receivedMessage = JSON.parse(message.body)

    // Handle read status updates
    if (receivedMessage.type === 'READ_STATUS_UPDATE') {
      console.log('📡 Customer received read status update:', receivedMessage)
      if (receivedMessage.readerType === 1) { // Hotel marked customer messages as read
        messages.value.forEach(msg => {
          if (msg.senderType === 0) msg.isRead = true
        })
      }
      return
    }

    // Handle regular chat messages
    messages.value.push({
      content: receivedMessage.content,
      senderType: receivedMessage.senderType,
      createdAt: receivedMessage.createdAt,
      isRead: receivedMessage.isRead,
      messageType: receivedMessage.messageType,
      fileUrl: receivedMessage.fileUrl,
      fileName: receivedMessage.fileName,
      fileSize: receivedMessage.fileSize,
      fileType: receivedMessage.fileType,
      thumbnailUrl: receivedMessage.thumbnailUrl
    })

    nextTick(() => scrollToBottom())

    if (!isOpen.value && receivedMessage.senderType === 1) {
      unreadCount.value++
    }
  })
}

// WebSocket connection using new STOMP Client API (supports auto-reconnect)
const connectWebSocket = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    console.error('No JWT token found')
    return
  }

  // Deactivate existing client if any
  if (stompClient) {
    try {
      stompClient.deactivate()
    } catch (e) {
      console.warn('Error deactivating stale STOMP client:', e)
    }
  }

  // Use native WebSocket URL to avoid deprecated unload handlers in SockJS
  stompClient = new Client({
    brokerURL: buildChatWebSocketUrl(token),
    connectHeaders: {
      'Authorization': `Bearer ${token}`
    },
    reconnectDelay: 5000, // auto-reconnect after 5s
    onConnect: () => {
      isConnected.value = true
      console.log('✅ WebSocket connected')
      subscribeToTopic()
    },
    onStompError: (frame) => {
      console.error('❌ STOMP error:', frame)
      isConnected.value = false
    },
    onDisconnect: () => {
      isConnected.value = false
      console.log('🔌 WebSocket disconnected')
    },
    onWebSocketClose: () => {
      isConnected.value = false
    }
  })

  stompClient.activate()
}

// Initialize chat
const initializeChat = async () => {
  try {
    isLoading.value = true
    const token = localStorage.getItem('token')

    // Start/get conversation
    const response = await fetch('/api/chat-service/chat/start', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hotelId: props.hotelId
      })
    })

    if (response.ok) {
      const result = await response.json()
      conversationId.value = result.data.id

      // Load messages
      await loadMessages()

      // Connect WebSocket
      connectWebSocket()
    }
  } catch (error) {
    console.error('Error initializing chat:', error)
  } finally {
    isLoading.value = false
  }
}

// Load message history
const loadMessages = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(
      `/api/chat-service/chat/messages?conversationId=${conversationId.value}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (response.ok) {
      const result = await response.json()
      messages.value = result.data || []

      // 📖 NEW: Mark hotel messages as read when customer opens chat
      await markHotelMessagesAsRead()

      nextTick(() => scrollToBottom())
    }
  } catch (error) {
    console.error('Error loading messages:', error)
  }
}

// 📖 NEW: Mark hotel messages as read
const markHotelMessagesAsRead = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`/api/chat-service/chat/messages/mark-read?conversationId=${conversationId.value}&readerType=0`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      const result = await response.json()
      console.log('📖 Customer marked hotel messages as read:', result)

      // Update local messages isRead status
      messages.value.forEach(msg => {
        if (msg.senderType === 1) { // Hotel messages
          msg.isRead = true
        }
      })

      // Reset unread count
      unreadCount.value = 0
    } else {
      console.error('❌ Failed to mark messages as read:', response.statusText)
    }
  } catch (error) {
    console.error('❌ Error marking messages as read:', error)
  }
}

// Send message
const sendMessage = () => {
  // Handle file upload if file is selected
  if (selectedFile.value) {
    handleFileUpload()
    return
  }

  // Handle text message
  if (!newMessage.value.trim() || isSending.value || !stompClient || !conversationId.value) return

  if (!stompClient || !stompClient.active) {
    console.warn('STOMP client is not connected. Reconnecting...')
    connectWebSocket()
    return
  }

  isSending.value = true

  try {
    const userId = localStorage.getItem('userId')

    const messageData = {
      conversationId: conversationId.value,
      senderId: parseInt(userId), // FALLBACK: Include in body for debugging
      senderType: 0, // 0 = customer
      content: newMessage.value.trim(),
      messageType: 'TEXT'
    }

    // Send with STOMP headers AND in body
    const headers = {
      'X-Auth-UserId': userId
    }

    console.log('Sending message with data:', messageData)
    console.log('Sending message with headers:', headers)

    stompClient.publish({
      destination: '/app/chat/message',
      headers: { 'X-Auth-UserId': userId },
      body: JSON.stringify(messageData)
    })

    newMessage.value = ''
    nextTick(() => {
      if (messageInput.value) {
        messageInput.value.focus()
      }
    })
  } catch (error) {
    console.error('Error sending message:', error)
  } finally {
    isSending.value = false
  }
}

// Open chat
const openChat = async () => {
  isOpen.value = true
  unreadCount.value = 0

  if (!conversationId.value) {
    await initializeChat()
  }

  nextTick(() => {
    scrollToBottom()
    if (messageInput.value) {
      messageInput.value.focus()
    }
  })
}

// Minimize chat
const minimizeChat = () => {
  isOpen.value = false
}

// Close chat
const closeChat = () => {
  isOpen.value = false
  if (stompClient) {
    stompClient.deactivate()
    stompClient = null
  }
}

// Scroll to bottom
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Format time
const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date

  // Less than 1 minute
  if (diff < 60000) {
    return 'Vừa xong'
  }

  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes} phút trước`
  }

  // Today
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  // This year
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) +
           ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  // Other years
  return date.toLocaleDateString('vi-VN')
}

// File handling methods
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // Validate file using cloudinary service
    cloudinaryService.validateFile(file)

    selectedFile.value = file

    // Generate preview for images
    if (isImageFile(file)) {
      const reader = new FileReader()
      reader.onload = (e) => {
        filePreviewUrl.value = e.target.result
      }
      reader.readAsDataURL(file)
    }

    // Clear existing message when file is selected
    newMessage.value = ''
  } catch (error) {
    alert('Lỗi: ' + error.message)
    clearSelectedFile()
  }
}

const clearSelectedFile = () => {
  selectedFile.value = null
  filePreviewUrl.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleFileUpload = async () => {
  if (!selectedFile.value || isUploading.value) return

  try {
    isUploading.value = true
    uploadProgress.value = 0

    console.log('Uploading file to Cloudinary:', selectedFile.value.name)

    const result = await cloudinaryService.uploadFile(
      selectedFile.value,
      (progress) => {
        uploadProgress.value = progress
      }
    )

    if (result.success) {
      console.log('File uploaded successfully:', result)

      // Send file message via WebSocket
      await sendFileMessage(result)

      // Clear file after successful upload
      clearSelectedFile()
    } else {
      throw new Error(result.error || 'Upload failed')
    }
  } catch (error) {
    console.error('File upload error:', error)
    alert('Không thể gửi file: ' + error.message)
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

const sendFileMessage = async (uploadResult) => {
  if (!conversationId.value) return

  if (!stompClient || !stompClient.active) {
    console.warn('STOMP client is not connected. Reconnecting before sending file...')
    connectWebSocket()
    return
  }

  const userId = parseInt(localStorage.getItem('userId'))

  const fileMessage = {
    conversationId: conversationId.value,
    senderId: userId,
    senderType: 0, // customer
    content: uploadResult.fileName, // filename as content
    messageType: uploadResult.messageType,
    fileUrl: uploadResult.url,
    fileName: uploadResult.fileName,
    fileSize: uploadResult.fileSize,
    fileType: uploadResult.fileType,
    thumbnailUrl: uploadResult.thumbnailUrl
  }

  const headers = {
    'X-Auth-UserId': userId.toString()
  }

  console.log('Sending file message with data:', fileMessage)
  console.log('Sending file message with headers:', headers)

  stompClient.publish({
    destination: '/app/chat/message',
    headers: { 'X-Auth-UserId': userId.toString() },
    body: JSON.stringify(fileMessage)
  })
}

// Utility methods for files
const isImageFile = (file) => {
  return FILE_CONFIG.ALLOWED_IMAGES.includes(file.type)
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  return cloudinaryService.formatFileSize(bytes)
}

const getFileIcon = (file) => {
  if (!file) return '📎'
  return cloudinaryService.getFileIcon(file)
}

// Image modal methods
const openImageModal = (url) => {
  imageModal.value = {
    isOpen: true,
    url: url
  }
}

const closeImageModal = () => {
  imageModal.value = {
    isOpen: false,
    url: ''
  }
}

onUnmounted(() => {
  if (stompClient) {
    stompClient.deactivate()
    stompClient = null
  }
})
</script>

<style scoped>
.chat-widget-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22a6d6, #1a8bb5);
  border: none;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(34, 166, 214, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.chat-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(34, 166, 214, 0.5);
}

.chat-button.has-unread {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(34, 166, 214, 0.4);
  }
  50% {
    box-shadow: 0 4px 30px rgba(34, 166, 214, 0.7);
  }
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  border: 2px solid white;
}

.chat-window {
  width: 380px;
  height: 550px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-header {
  background: linear-gradient(135deg, #22a6d6, #1a8bb5);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hotel-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.hotel-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
}

.hotel-details h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.status {
  font-size: 0.75rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.status::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}

.status.online::before {
  background: #4caf50;
  box-shadow: 0 0 8px #4caf50;
}

.chat-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #f5f7fa;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #22a6d6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state svg {
  color: #ddd;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1rem;
  font-weight: 600;
  margin: 0.5rem 0;
}

.empty-state span {
  font-size: 0.875rem;
  color: #bbb;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.message {
  display: flex;
}

.message.sent {
  justify-content: flex-end;
}

.message.received {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 75%;
  padding: 0.75rem 1rem;
  border-radius: 16px;
  position: relative;
}

.message.sent .message-bubble {
  background: linear-gradient(135deg, #22a6d6, #1a8bb5);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.received .message-bubble {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.message-content {
  margin: 0 0 0.35rem 0;
  font-size: 0.925rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
}

.message-time {
  font-size: 0.7rem;
  opacity: 0.7;
}

.read-status {
  font-size: 0.7rem;
  opacity: 0.7;
  color: #4caf50;
}

.chat-input-wrapper {
  padding: 1rem;
  background: white;
  border-top: 1px solid #e7eef1;
}

.chat-input {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}

.chat-input textarea {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 0.75rem 1rem;
  font-size: 0.925rem;
  font-family: inherit;
  resize: none;
  max-height: 100px;
  transition: border-color 0.2s;
}

.chat-input textarea:focus {
  outline: none;
  border-color: #22a6d6;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #22a6d6, #1a8bb5);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(34, 166, 214, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 40px);
    height: calc(100vh - 100px);
  }
}

@media (max-width: 640px) {
  .chat-widget-container {
    bottom: 16px;
    right: 16px;
  }
  
  .chat-button {
    width: 52px;
    height: 52px;
  }
  
  .chat-window {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100vw;
    height: calc(100vh - 60px);
    border-radius: 16px 16px 0 0;
  }
  
  .chat-header {
    padding: 0.875rem;
  }
  
  .hotel-avatar {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  
  .hotel-details h3 {
    font-size: 0.9rem;
  }
  
  .chat-messages {
    padding: 0.75rem;
  }
  
  .message-bubble {
    max-width: 85%;
  }
  
  .message-content {
    font-size: 0.9rem;
  }
  
  .chat-input {
    margin: 0.75rem;
    padding: 0.625rem;
  }
  
  .chat-input textarea {
    font-size: 0.85rem;
  }
  
  .file-upload-btn {
    width: 28px;
    height: 28px;
  }
  
  .send-btn {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 480px) {
  .chat-widget-container {
    bottom: 12px;
    right: 12px;
  }
  
  .chat-button {
    width: 48px;
    height: 48px;
  }
  
  .chat-button svg {
    width: 22px;
    height: 22px;
  }
  
  .chat-window {
    height: calc(100vh - 50px);
    border-radius: 12px 12px 0 0;
  }
  
  .chat-header {
    padding: 0.75rem;
  }
  
  .hotel-info {
    gap: 0.5rem;
  }
  
  .hotel-avatar {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
  
  .hotel-details h3 {
    font-size: 0.85rem;
  }
  
  .status {
    font-size: 0.7rem;
  }
  
  .action-btn {
    width: 28px;
    height: 28px;
    font-size: 1.1rem;
  }
  
  .chat-messages {
    padding: 0.5rem;
  }
  
  .message-bubble {
    padding: 0.5rem 0.75rem;
    max-width: 90%;
  }
  
  .message-content {
    font-size: 0.85rem;
  }
  
  .message-time {
    font-size: 0.65rem;
  }
  
  .chat-input {
    margin: 0.5rem;
    padding: 0.5rem;
    border-radius: 10px;
  }
  
  .chat-input textarea {
    font-size: 0.8rem;
  }
  
  .file-preview {
    padding: 0.75rem;
  }
  
  .preview-content {
    padding: 0.75rem;
  }
  
  .image-preview img {
    max-width: 150px;
    max-height: 120px;
  }
}

/* File Upload Styles */
.file-upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #f0f2f5;
  cursor: pointer;
  transition: background 0.2s;
  margin-right: 8px;
}

.file-upload-btn:hover {
  background: #e4e6ea;
}

.file-upload-btn svg {
  color: #65676b;
}

/* File Preview Styles */
.file-preview {
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 1rem;
}

.preview-content {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}

.image-preview img {
  width: 100%;
  max-width: 200px;
  max-height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.file-preview-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.file-preview-info .file-icon {
  font-size: 2rem;
}

.file-preview-info .file-details {
  flex: 1;
}

.file-preview-info .file-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.file-preview-info .file-size {
  font-size: 0.875rem;
  color: #6b7280;
}

.preview-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.75rem;
}

.cancel-btn,
.upload-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: white;
  border-color: #d1d5db;
  color: #374151;
}

.cancel-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.upload-btn {
  background: #22a6d6;
  border-color: #22a6d6;
  color: white;
}

.upload-btn:hover:not(:disabled) {
  background: #1a8bb5;
  border-color: #1a8bb5;
}

.upload-btn:disabled {
  background: #d1d5db;
  border-color: #d1d5db;
  cursor: not-allowed;
}

/* Upload Progress */
.upload-progress {
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #22a6d6;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #22a6d6;
  min-width: 40px;
  text-align: right;
}

/* Message Type Styles */
.image-message {
  margin-bottom: 0.5rem;
}

.chat-image {
  width: 100%;
  max-width: 250px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.chat-image:hover {
  transform: scale(1.02);
}

.image-caption {
  margin-top: 0.5rem;
  margin-bottom: 0;
  font-size: 0.9rem;
  color: inherit;
}

.file-message {
  margin-bottom: 0.5rem;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  max-width: 280px;
}

.file-info .file-icon {
  font-size: 1.5rem;
}

.file-info .file-details {
  flex: 1;
}

.file-info .file-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  word-break: break-word;
}

.file-info .file-size {
  font-size: 0.8rem;
  opacity: 0.8;
}

.download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  text-decoration: none;
  transition: all 0.2s;
}

.download-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* Image Modal Styles */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.modal-close {
  position: absolute;
  top: -50px;
  right: -10px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background: white;
  transform: scale(1.1);
}

/* Chat Input Updates for File Support */
.chat-input {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 0.75rem;
  background: white;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  margin: 1rem;
  transition: border-color 0.2s;
}

.chat-input:focus-within {
  border-color: #22a6d6;
}

.chat-input textarea {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.4;
  max-height: 100px;
  background: transparent;
}

.chat-input textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
