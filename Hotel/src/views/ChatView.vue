<template>
  <div class="chat-view">
    <Sidebar />

    <div class="main-content">
      <div class="header">
        <h1>Tin nhắn</h1>
        <p class="subtitle">Quản lý trò chuyện với khách hàng</p>
      </div>

      <div class="chat-container">
        <!-- Conversations List -->
        <div class="conversations-panel">
          <div class="panel-header">
            <h2>Cuộc hội thoại</h2>
            <span class="count-badge">{{ conversations.length }}</span>
          </div>

          <div v-if="isLoadingConversations" class="loading-state">
            <div class="spinner"></div>
            <p>Đang tải...</p>
          </div>

          <div v-else-if="conversations.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p>Chưa có cuộc hội thoại nào</p>
          </div>

          <div v-else class="conversations-list">
            <div
              v-for="conv in conversations"
              :key="conv.id"
              @click="selectConversation(conv)"
              :class="['conversation-item', { active: selectedConversation?.id === conv.id }]"
            >
              <div class="avatar">{{ conv.customerName?.charAt(0) || 'K' }}</div>
              <div class="conversation-info">
                <div class="info-row">
                  <h3>{{ conv.customerName || 'Khách hàng' }}</h3>
                  <span class="time">{{ formatConversationTime(conv.createdAt) }}</span>
                </div>
                <div class="info-row">
                  <p class="last-message">{{ conv.lastMessage || 'Bắt đầu trò chuyện' }}</p>
                  <span v-if="conv.unreadCount > 0" class="unread-badge">{{ conv.unreadCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Messages Panel -->
        <div class="messages-panel">
          <div v-if="!selectedConversation" class="no-conversation">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h2>Chọn một cuộc hội thoại</h2>
            <p>Chọn cuộc hội thoại bên trái để bắt đầu nhắn tin với khách hàng</p>
          </div>

          <template v-else>
            <!-- Chat Header -->
            <div class="chat-header">
              <div class="customer-info">
                <div class="avatar large">{{ selectedConversation.customerName?.charAt(0) || 'K' }}</div>
                <div>
                  <h2>{{ selectedConversation.customerName || 'Khách hàng' }}</h2>
                  <span class="status" :class="{ online: isConnected }">
                    {{ isConnected ? 'Đang kết nối' : 'Ngoại tuyến' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Messages Area -->
            <div class="messages-area" ref="messagesArea">
              <div v-if="isLoadingMessages" class="loading-state">
                <div class="spinner"></div>
                <p>Đang tải tin nhắn...</p>
              </div>

              <div v-else class="messages-list">
                <div
                  v-for="(msg, index) in currentMessages"
                  :key="index"
                  :class="['message', msg.senderType === 1 ? 'sent' : 'received']"
                >
                  <div class="message-bubble">
                    <!-- Ảnh từ Cloudinary -->
                    <div v-if="msg.messageType === 'IMAGE' && msg.fileUrl" class="msg-image-wrapper" @click="openImageModal(msg.fileUrl)">
                      <img :src="msg.thumbnailUrl || msg.fileUrl" :alt="msg.fileName || 'Ảnh'" class="msg-image" />
                    </div>

                    <!-- File / Document -->
                    <div v-else-if="(msg.messageType === 'FILE' || msg.messageType === 'DOCUMENT') && msg.fileUrl" class="msg-file">
                      <div class="file-info">
                        <div class="file-name">{{ msg.fileName }}</div>
                        <div class="file-size" v-if="msg.fileSize">{{ formatFileSize(msg.fileSize) }}</div>
                      </div>
                      <a :href="getDownloadUrl(msg.fileUrl, msg.fileName)" target="_blank" download class="file-download-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                      </a>
                    </div>

                    <!-- Text thông thường -->
                    <p v-else class="message-content">{{ msg.content }}</p>

                    <div class="message-meta">
                      <span class="message-time">{{ formatMessageTime(msg.createdAt) }}</span>
                      <span v-if="msg.senderType === 1" class="read-status">
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
                  <div class="file-details">
                    <div class="file-name">{{ selectedFile.name }}</div>
                    <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
                  </div>
                </div>

                <div class="preview-actions">
                  <button @click="clearSelectedFile" class="cancel-btn">Hủy</button>
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

            <!-- Input Area -->
            <div class="input-area">
              <div class="input-wrapper">
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
          </template>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="imageModal.isOpen" class="image-modal" @click="closeImageModal">
      <div class="modal-content" @click.stop>
        <img :src="imageModal.url" alt="Xem ảnh đầy đủ" />
        <button class="modal-close" @click="closeImageModal">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import cloudinaryService from '@/services/cloudinaryService.js'
import { FILE_CONFIG, getDownloadUrl } from '@/utils/cloudinaryConfig.js'

const conversations = ref([])
const selectedConversation = ref(null)
const currentMessages = ref([])
const newMessage = ref('')
const isLoadingConversations = ref(false)
const isLoadingMessages = ref(false)
const isSending = ref(false)
const isConnected = ref(false)
const messagesArea = ref(null)
const messageInput = ref(null)
const imageModal = ref({ isOpen: false, url: '' })

// File upload reactive data
const selectedFile = ref(null)
const filePreviewUrl = ref('')
const isUploading = ref(false)
const uploadProgress = ref(0)
const fileInput = ref(null)

let stompClient = null

// WebSocket Connection
const connectWebSocket = () => {
  console.log(' Hotel connectWebSocket called')

  // Get JWT token for authentication
  const token = localStorage.getItem('token')
  if (!token) {
    console.error(' No JWT token found')
    return
  }

  console.log(' Hotel JWT token found:', token ? token.substring(0, 20) + '...' : 'null')

  // Don't create multiple connections
  if (stompClient && stompClient.connected) {
    console.log(' Hotel WebSocket already connected')
    return
  }

  if (stompClient) {
    console.log(' Hotel disposing existing non-connected stompClient')
    stompClient.disconnect()
  }

  // Connect through API Gateway with JWT token as query parameter
  const websocketUrl = `http://localhost:1111/chat-service/ws?token=${token}`
  console.log('Hotel connecting to WebSocket URL:', websocketUrl)

  const socket = new SockJS(websocketUrl)
  stompClient = Stomp.over(socket)

  // Connect with JWT token in STOMP headers as well (for additional security)
  const connectHeaders = {
    'Authorization': `Bearer ${token}`
  }

  console.log(' Hotel attempting STOMP connection with headers:', connectHeaders)

  stompClient.connect(connectHeaders, () => {
    isConnected.value = true
    console.log(' Hotel WebSocket connected with JWT authentication')

    // Enable STOMP debugging AFTER connection (like Customer)
    stompClient.debug = (str) => {
      console.log(' Hotel STOMP Debug:', str)
    }

    // Subscribe to conversation topic when conversation is already selected
    if (selectedConversation.value) {
      console.log('Hotel auto-subscribing to conversation on connect:', selectedConversation.value.id)
      subscribeToConversation(selectedConversation.value.id)
    } else {
      console.log(' Hotel connected but no conversation selected yet')
    }
  }, (error) => {
    console.error(' Hotel WebSocket connection error:', error)
    isConnected.value = false
  })
}

let currentSubscription = null

// Subscribe to conversation
const subscribeToConversation = (conversationId) => {
  console.log(' Hotel subscribeToConversation called with conversationId:', conversationId)

  if (!stompClient || !stompClient.connected) {
    console.error(' STOMP client not connected, current state:', {
      stompClient: !!stompClient,
      connected: stompClient ? stompClient.connected : false
    })
    return
  }

  console.log(' STOMP client is connected, proceeding with subscription')

  // Unsubscribe from previous conversation
  if (currentSubscription) {
    currentSubscription.unsubscribe()
    console.log(' Unsubscribed from previous conversation')
    currentSubscription = null
  }

  // Subscribe to new conversation
  const topic = `/topic/chat/${conversationId}`
  console.log(' Hotel subscribing to topic:', topic)

  currentSubscription = stompClient.subscribe(topic, (message) => {
    console.log(' Hotel received message on topic:', topic)
    console.log(' Hotel message body:', message.body)
    console.log(' Hotel current messages count before:', currentMessages.value.length)

    try {
      const receivedMessage = JSON.parse(message.body)
      console.log(' Hotel parsed message:', receivedMessage)

      // 📡 NEW: Handle read status updates
      if (receivedMessage.type === 'READ_STATUS_UPDATE') {
        console.log('📡 Hotel received read status update:', receivedMessage)

        // Update local messages read status
        if (receivedMessage.readerType === 0) { // Customer marked hotel messages as read
          currentMessages.value.forEach(msg => {
            if (msg.senderType === 1) { // Hotel messages
              msg.isRead = true
            }
          })
          console.log('📡 Hotel updated read status for hotel messages')
        }
        return // Don't add read status updates to message list
      }

      // Handle regular chat messages
      currentMessages.value.push({
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

      console.log(' Hotel current messages count after:', currentMessages.value.length)

      // Scroll to bottom
      nextTick(() => scrollToBottom())

      // Update conversation last message
      updateConversationLastMessage(conversationId, receivedMessage.content)
    } catch (error) {
      console.error(' Hotel error processing received message:', error)
    }
  }, (error) => {
    console.error(' Hotel subscription error:', error)
  })

  // Log successful subscription
  if (currentSubscription) {
    console.log(' Hotel successfully subscribed to topic:', topic)
    console.log(' Current subscription object:', currentSubscription)
  } else {
    console.error(' Hotel failed to create subscription')
  }
}

// Load conversations
const loadConversations = async () => {
  try {
    isLoadingConversations.value = true
    const token = localStorage.getItem('token')

    console.log(' Loading conversations with token:', token ? 'Present' : 'Missing')

    // Get hotel's conversations through API Gateway
    const response = await fetch('/api/chat-service/chat/conversations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    console.log(' Conversations API response status:', response.status)

    if (response.ok) {
      const result = await response.json()
      console.log(' Conversations API result:', result)
      conversations.value = result.data || []
      console.log(' Loaded conversations count:', conversations.value.length)
    } else {
      console.error(' Failed to load conversations:', response.statusText)
    }
  } catch (error) {
    console.error(' Error loading conversations:', error)
    // Mock data for development
    conversations.value = []
  } finally {
    isLoadingConversations.value = false
  }
}

// Select conversation
const selectConversation = async (conversation) => {
  console.log(' Hotel selecting conversation:', {
    id: conversation.id,
    customerName: conversation.customerName,
    hotelId: conversation.hotelId
  })

  selectedConversation.value = conversation

  // Load messages for this conversation
  console.log(' Hotel loading messages for conversation:', conversation.id)
  await loadMessages(conversation.id)

  // Subscribe to this conversation (WebSocket should already be connected)
  console.log('🔌 Hotel WebSocket connection status:', {
    stompClient: !!stompClient,
    connected: stompClient ? stompClient.connected : false,
    isConnectedFlag: isConnected.value
  })

  if (stompClient && stompClient.connected) {
    console.log(' Hotel WebSocket is connected, subscribing...')
    subscribeToConversation(conversation.id)
  } else {
    console.warn(' Hotel WebSocket not connected, trying to connect...')
    connectWebSocket()
    // Note: subscription will happen in connect callback
  }

  nextTick(() => {
    scrollToBottom()
    if (messageInput.value) {
      messageInput.value.focus()
    }
  })
}

// Load messages
const loadMessages = async (conversationId) => {
  try {
    console.log(' Hotel loadMessages called for conversationId:', conversationId)
    isLoadingMessages.value = true
    const token = localStorage.getItem('token')

    // Only need conversationId to get messages, hotelId is not required
    const url = `/api/chat-service/chat/messages?conversationId=${conversationId}`
    console.log(' Hotel loading messages from URL:', url)

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    console.log(' Hotel loadMessages response status:', response.status)

    if (response.ok) {
      const result = await response.json()
      console.log(' Hotel loadMessages result:', result)

      currentMessages.value = result.data || []
      console.log(' Hotel loaded messages count:', currentMessages.value.length)

      // 📖 NEW: Mark customer messages as read when hotel opens conversation
      await markCustomerMessagesAsRead(conversationId)

      nextTick(() => scrollToBottom())
    } else {
      const errorText = await response.text()
      console.error(' Hotel loadMessages error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
    }
  } catch (error) {
    console.error(' Hotel loadMessages error:', error)
  } finally {
    isLoadingMessages.value = false
  }
}

// 📖 NEW: Mark customer messages as read
const markCustomerMessagesAsRead = async (conversationId) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`/api/chat-service/chat/messages/mark-read?conversationId=${conversationId}&readerType=1`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      const result = await response.json()
      console.log('📖 Hotel marked customer messages as read:', result)

      // Update local messages isRead status
      currentMessages.value.forEach(msg => {
        if (msg.senderType === 0) { // Customer messages
          msg.isRead = true
        }
      })
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
  if (!newMessage.value.trim() || isSending.value || !stompClient || !selectedConversation.value) {
    console.warn(' Hotel sendMessage aborted:', {
      hasMessage: !!newMessage.value.trim(),
      isSending: isSending.value,
      hasStompClient: !!stompClient,
      hasSelected: !!selectedConversation.value
    })
    return
  }

  isSending.value = true
  console.log(' Hotel sending message...')

  try {
    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')

    // 🔍 DEBUG: Check localStorage values
    console.log('🔍 HOTEL DEBUG localStorage:', {
      userId: userId,
      userIdType: typeof userId,
      userIdParsed: userId ? parseInt(userId) : 'null',
      token: token ? token.substring(0, 20) + '...' : 'null',
      allLocalStorage: { ...localStorage }
    })

    // ⚠️ CRITICAL: Handle case where userId is missing
    if (!userId || userId === 'null' || userId === 'undefined') {
      console.error('❌ Hotel critical error: No userId in localStorage!')
      alert('Hotel login error: Please refresh and login again')
      return
    }

    const messageData = {
      conversationId: selectedConversation.value.id,
      senderId: parseInt(userId), // FALLBACK: Include in body for debugging
      senderType: 1, // 1 = hotel staff
      content: newMessage.value.trim(),
      messageType: 'TEXT'
    }

    // Send with STOMP headers AND in body
    const headers = {
      'X-Auth-UserId': userId
    }

    console.log(' Hotel sending message with data:', messageData)
    console.log(' Hotel sending message with headers:', headers)
    console.log(' Hotel STOMP client connected?', stompClient.connected)

    stompClient.send('/app/chat/message', headers, JSON.stringify(messageData))
    console.log(' Hotel message sent successfully')

    newMessage.value = ''
    nextTick(() => {
      if (messageInput.value) {
        messageInput.value.focus()
      }
    })
  } catch (error) {
    console.error(' Hotel error sending message:', error)
  } finally {
    isSending.value = false
  }
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
  if (!selectedFile.value || isUploading.value || !selectedConversation.value) return

  try {
    isUploading.value = true
    uploadProgress.value = 0

    console.log('Hotel uploading file to Cloudinary:', selectedFile.value.name)

    const result = await cloudinaryService.uploadFile(
      selectedFile.value,
      (progress) => {
        uploadProgress.value = progress
      }
    )

    if (result.success) {
      console.log('Hotel file uploaded successfully:', result)

      // Send file message via WebSocket
      await sendFileMessage(result)

      // Clear file after successful upload
      clearSelectedFile()
    } else {
      throw new Error(result.error || 'Upload failed')
    }
  } catch (error) {
    console.error('Hotel file upload error:', error)
    alert('Không thể gửi file: ' + error.message)
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

const sendFileMessage = async (uploadResult) => {
  if (!selectedConversation.value) return

  const userId = parseInt(localStorage.getItem('userId'))

  const fileMessage = {
    conversationId: selectedConversation.value.id,
    senderId: userId,
    senderType: 1, // hotel
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

  console.log('Hotel sending file message with data:', fileMessage)
  console.log('Hotel sending file message with headers:', headers)

  stompClient.send('/app/chat/message', headers, JSON.stringify(fileMessage))
}

// Utility methods for files
const isImageFile = (file) => {
  return FILE_CONFIG.ALLOWED_IMAGES.includes(file.type)
}

// Update conversation last message
const updateConversationLastMessage = (conversationId, message) => {
  const conv = conversations.value.find(c => c.id === conversationId)
  if (conv) {
    conv.lastMessage = message
  }
}

// Scroll to bottom
const scrollToBottom = () => {
  if (messagesArea.value) {
    messagesArea.value.scrollTop = messagesArea.value.scrollHeight
  }
}

// Image modal
const openImageModal = (url) => {
  imageModal.value = { isOpen: true, url }
}
const closeImageModal = () => {
  imageModal.value = { isOpen: false, url: '' }
}

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Format conversation time
const formatConversationTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date

  if (diff < 86400000 && date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  if (diff < 604800000) {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    return days[date.getDay()]
  }

  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

// Format message time
const formatMessageTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  console.log('🏨 Hotel Chat View mounted - initializing...')

  // Check authentication data
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')

  // 🔍 ENHANCED DEBUG: Full localStorage inspection
  console.log('🔍 HOTEL DEBUG - Full localStorage check:', {
    token: token ? 'Present (' + token.substring(0, 20) + '...)' : 'Missing',
    userId: userId || 'Missing',
    userIdType: typeof userId,
    userIdParsed: userId ? parseInt(userId) : 'null',
    allLocalStorageKeys: Object.keys(localStorage),
    allLocalStorageData: { ...localStorage }
  })

  // ⚠️ CRITICAL CHECK: If no userId, show warning
  if (!userId || userId === 'null' || userId === 'undefined') {
    console.error('❌ CRITICAL: Hotel has no userId in localStorage!')
    console.log('Hotel should logout and login again to get correct userId')
  }

  // Load conversations first
  console.log('🏨 Hotel loading conversations...')
  loadConversations()

  // Connect WebSocket immediately to be ready for messages
  console.log('🏨 Hotel connecting WebSocket...')
  connectWebSocket()

  console.log('🏨 Hotel Chat View mounted - initialization complete')
})

onUnmounted(() => {
  console.log(' Hotel Chat View unmounting')

  // Unsubscribe from conversation
  if (currentSubscription) {
    currentSubscription.unsubscribe()
    currentSubscription = null
  }

  // Disconnect WebSocket
  if (stompClient && stompClient.connected) {
    stompClient.disconnect()
  }
})
</script>

<style scoped>
.chat-view {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: #666;
  margin: 0;
}

.chat-container {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 1.5rem;
  height: calc(100vh - 180px);
}

/* Conversations Panel */
.conversations-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e7eef1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h2 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  color: #333;
}

.count-badge {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.conversation-item:hover {
  background: #f5f7fa;
}

.conversation-item.active {
  background: #e8f5e9;
  border-left: 4px solid #22a6d6;
}

.avatar {
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

.avatar.large {
  width: 56px;
  height: 56px;
  font-size: 1.5rem;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.conversation-info h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time {
  font-size: 0.75rem;
  color: #999;
  flex-shrink: 0;
}

.last-message {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unread-badge {
  background: #ff4444;
  color: white;
  border-radius: 10px;
  padding: 0.15rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

/* Messages Panel */
.messages-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.no-conversation {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  text-align: center;
  padding: 2rem;
}

.no-conversation svg {
  color: #ddd;
  margin-bottom: 1.5rem;
}

.no-conversation h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #666;
  margin: 0 0 0.5rem 0;
}

.no-conversation p {
  font-size: 1rem;
  color: #999;
  margin: 0;
}

.chat-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e7eef1;
  background: white;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.customer-info h2 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: #333;
}

.status {
  font-size: 0.875rem;
  color: #999;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e0e0e0;
}

.status.online::before {
  background: #4caf50;
  box-shadow: 0 0 8px #4caf50;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background: #f5f7fa;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  max-width: 60%;
  padding: 0.875rem 1.125rem;
  border-radius: 16px;
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
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
}

.read-status {
  font-size: 0.75rem;
  opacity: 0.7;
}

.input-area {
  padding: 1.25rem;
  background: white;
  border-top: 1px solid #e7eef1;
}

.input-wrapper {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.input-wrapper textarea {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 0.875rem 1rem;
  font-size: 0.95rem;
  font-family: inherit;
  resize: none;
  max-height: 120px;
  transition: border-color 0.2s;
}

.input-wrapper textarea:focus {
  outline: none;
  border-color: #22a6d6;
}

.send-btn {
  width: 48px;
  height: 48px;
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

/* File Upload Button */
.file-upload-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f5f7fa;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
  border: 1px solid #e0e0e0;
}

.file-upload-btn:hover {
  background: #e8f5e9;
  color: #22a6d6;
  border-color: #22a6d6;
}

/* File Preview */
.file-preview {
  padding: 1rem 1.25rem;
  background: #f5f7fa;
  border-top: 1px solid #e7eef1;
}

.preview-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.image-preview {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-preview-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.file-preview-info .file-details {
  flex: 1;
  min-width: 0;
}

.file-preview-info .file-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-preview-info .file-size {
  font-size: 0.75rem;
  color: #666;
}

.preview-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #666;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  border-color: #ff4444;
  color: #ff4444;
  background: #fff5f5;
}

/* Upload Progress */
.upload-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 120px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #22a6d6, #1a8bb5);
  border-radius: 3px;
  transition: width 0.2s;
}

.progress-text {
  font-size: 0.75rem;
  color: #666;
  font-weight: 600;
  flex-shrink: 0;
}

/* Loading and Empty States */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
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
  margin: 0.5rem 0;
  font-size: 1rem;
}

/* Scrollbar */
.conversations-list::-webkit-scrollbar,
.messages-area::-webkit-scrollbar {
  width: 6px;
}

.conversations-list::-webkit-scrollbar-track,
.messages-area::-webkit-scrollbar-track {
  background: transparent;
}

.conversations-list::-webkit-scrollbar-thumb,
.messages-area::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 3px;
}

.conversations-list::-webkit-scrollbar-thumb:hover,
.messages-area::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

@media (max-width: 1200px) {
  .chat-container {
    grid-template-columns: 320px 1fr;
  }
}

@media (max-width: 980px) {
  .main-content {
    margin-left: 0;
  }

  .chat-container {
    grid-template-columns: 1fr;
    height: auto;
  }

  .conversations-panel {
    height: 300px;
  }

  .messages-panel {
    height: calc(100vh - 560px);
    min-height: 400px;
  }
}

/* ===== Image & File message styles ===== */
.msg-image-wrapper {
  position: relative;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  max-width: 240px;
}

.msg-image {
  display: block;
  width: 100%;
  max-width: 240px;
  height: auto;
  border-radius: 10px;
  transition: filter 0.2s;
}

.msg-image-wrapper:hover .msg-image {
  filter: brightness(0.92);
}

.msg-file {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.25rem;
  min-width: 180px;
}

.msg-file .file-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.msg-file .file-info {
  flex: 1;
  min-width: 0;
}

.msg-file .file-name {
  font-size: 0.875rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.msg-file .file-size {
  font-size: 0.75rem;
  opacity: 0.7;
}

.file-download-btn {
  color: inherit;
  opacity: 0.8;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.file-download-btn:hover {
  opacity: 1;
}

/* ===== Image Modal ===== */
.image-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-modal .modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.image-modal .modal-content img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 10px;
  object-fit: contain;
}

.image-modal .modal-close {
  position: absolute;
  top: -14px;
  right: -14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #333;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  line-height: 1;
}
</style>
