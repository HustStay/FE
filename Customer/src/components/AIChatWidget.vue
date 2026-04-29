<template>
  <div class="ai-chat-container">
    <!-- AI Chat Toggle Button -->
    <button
      v-if="!isOpen"
      @click="openChat"
      class="ai-chat-btn"
      title="Chat với AI trợ lý"
    >
      <div class="ai-btn-glow"></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="M8 10h8M8 14h5" stroke-linecap="round"/>
      </svg>
      <span class="ai-btn-label">AI</span>
    </button>

    <!-- AI Chat Window -->
    <Transition name="chat-slide">
      <div v-if="isOpen" class="ai-chat-window">
        <!-- Header -->
        <div class="ai-chat-header">
          <div class="ai-header-left">
            <div class="ai-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                <path d="M17 6l1.5-1.5M7 6L5.5 4.5M12 3V1.5" stroke-linecap="round"/>
              </svg>
              <span class="ai-online-dot"></span>
            </div>
            <div class="ai-header-info">
              <h3>HustStay AI</h3>
              <span class="ai-status">
                <span class="status-dot" :class="{ thinking: isThinking }"></span>
                {{ isThinking ? 'Đang suy nghĩ...' : 'Trợ lý thông minh' }}
              </span>
            </div>
          </div>
          <div class="ai-header-actions">
            <button @click="clearConversation" class="ai-action-btn" title="Xóa cuộc trò chuyện">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
              </svg>
            </button>
            <button @click="closeChat" class="ai-action-btn" title="Đóng">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Quick Suggestions (shown when empty) -->
        <div v-if="messages.length === 0" class="ai-welcome">
          <div class="welcome-icon">🤖</div>
          <h4>Xin chào! Tôi có thể giúp gì cho bạn?</h4>
          <p>Hỏi tôi về khách sạn, phòng, tiện ích và dịch vụ.</p>
          <div class="quick-suggestions">
            <button
              v-for="s in suggestions"
              :key="s"
              @click="sendSuggestion(s)"
              class="suggestion-chip"
            >
              {{ s }}
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div v-else class="ai-messages" ref="messagesContainer">
          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            :class="['ai-message', msg.role]"
          >
            <div v-if="msg.role === 'assistant'" class="msg-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
            <div class="msg-bubble">
              <div class="msg-text" v-html="formatMessage(msg.content)"></div>
              <span class="msg-time">{{ formatTime(msg.timestamp) }}</span>
            </div>
          </div>

          <!-- Thinking indicator -->
          <div v-if="isThinking" class="ai-message assistant thinking-msg">
            <div class="msg-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
            <div class="msg-bubble">
              <div class="typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Banner -->
        <div v-if="errorMessage" class="ai-error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ errorMessage }}
          <button @click="errorMessage = ''" class="error-dismiss">×</button>
        </div>

        <!-- Input Area -->
        <div class="ai-input-area">
          <div class="ai-input-wrapper">
            <textarea
              v-model="inputText"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.enter.shift.exact="newLine"
              @input="autoResize"
              ref="inputRef"
              placeholder="Hỏi về khách sạn, phòng, tiện ích..."
              rows="1"
              :disabled="isThinking"
            ></textarea>
            <button
              @click="sendMessage"
              class="ai-send-btn"
              :disabled="!inputText.trim() || isThinking"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p class="ai-input-hint">Enter gửi · Shift+Enter xuống dòng</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

// ── Configuration ──────────────────────────────────────────────────
const AI_API_URL = import.meta.env.VITE_AI_CHAT_URL || 'http://localhost:8000/api/v1/chat'

// Generate a unique session ID per browser tab (persisted in sessionStorage)
const getSessionId = () => {
  let id = sessionStorage.getItem('ai_chat_session_id')
  if (!id) {
    id = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    sessionStorage.setItem('ai_chat_session_id', id)
  }
  return id
}

// ── State ──────────────────────────────────────────────────────────
const isOpen = ref(false)
const isThinking = ref(false)
const inputText = ref('')
const messages = ref([])
const errorMessage = ref('')
const messagesContainer = ref(null)
const inputRef = ref(null)
const sessionId = ref(getSessionId())

const suggestions = [
  'Khách sạn nào có hồ bơi?',
  'Tiện ích phòng Superior là gì?',
  'Phòng nào phù hợp cho gia đình?',
  'So sánh các loại phòng'
]

// ── Actions ────────────────────────────────────────────────────────
const openChat = () => {
  isOpen.value = true
  nextTick(() => {
    inputRef.value?.focus()
    scrollToBottom()
  })
}

const closeChat = () => {
  isOpen.value = false
}

const clearConversation = () => {
  messages.value = []
  errorMessage.value = ''
  // Reset session so AI starts fresh
  const newId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
  sessionStorage.setItem('ai_chat_session_id', newId)
  sessionId.value = newId
}

const sendSuggestion = (text) => {
  inputText.value = text
  sendMessage()
}

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || isThinking.value) return

  // Add user message
  messages.value.push({
    role: 'user',
    content: text,
    timestamp: new Date()
  })
  inputText.value = ''
  errorMessage.value = ''
  resetTextarea()

  await nextTick()
  scrollToBottom()

  // Call AI API
  isThinking.value = true
  try {
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: text,
        session_id: sessionId.value
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    const reply = data.reply || data.message || 'Xin lỗi, tôi không nhận được phản hồi.'

    messages.value.push({
      role: 'assistant',
      content: reply,
      timestamp: new Date()
    })

    // Sync session id from server if returned
    if (data.session_id) {
      sessionId.value = data.session_id
      sessionStorage.setItem('ai_chat_session_id', data.session_id)
    }
  } catch (err) {
    console.error('[AI Chat] Error:', err)
    errorMessage.value = 'Không thể kết nối đến AI. Vui lòng thử lại sau.'
    // Remove the user message that failed so they can retry
  } finally {
    isThinking.value = false
    await nextTick()
    scrollToBottom()
    inputRef.value?.focus()
  }
}

// ── Helpers ────────────────────────────────────────────────────────
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

// Convert newlines and simple markdown-like formatting to HTML
const formatMessage = (text) => {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

const autoResize = () => {
  const el = inputRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

const resetTextarea = () => {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
  }
}

const newLine = () => {
  // Shift+Enter: just let the default textarea behavior add a newline
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* ── Container ──────────────────────────────────────────────── */
.ai-chat-container {
  position: fixed;
  bottom: 96px; /* sit above the hotel chat button */
  right: 20px;
  z-index: 1100;
  font-family: 'Inter', sans-serif;
}

/* ── Toggle Button ──────────────────────────────────────────── */
.ai-chat-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  box-shadow: 0 6px 24px rgba(124, 58, 237, 0.45);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  overflow: hidden;
}

.ai-chat-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 28px rgba(124, 58, 237, 0.6);
}

.ai-btn-glow {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a78bfa, #818cf8, #7c3aed);
  opacity: 0;
  animation: glow-pulse 2.5s ease-in-out infinite;
  z-index: -1;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.15); }
}

.ai-btn-label {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* ── Window ─────────────────────────────────────────────────── */
.ai-chat-window {
  width: 390px;
  height: 560px;
  background: #0f0f1a;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: bottom right;
}

/* ── Transition ─────────────────────────────────────────────── */
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(16px);
}

/* ── Header ─────────────────────────────────────────────────── */
.ai-chat-header {
  background: linear-gradient(135deg, #1a0a3d, #2d1b69);
  padding: 1rem 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(124,58,237,0.25);
  flex-shrink: 0;
}

.ai-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ai-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  position: relative;
  flex-shrink: 0;
}

.ai-online-dot {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
  border: 2px solid #1a0a3d;
}

.ai-header-info h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #f0e8ff;
  letter-spacing: 0.01em;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  color: #a78bfa;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  transition: background 0.3s;
}

.status-dot.thinking {
  background: #f59e0b;
  animation: blink 0.8s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.ai-header-actions {
  display: flex;
  gap: 0.3rem;
}

.ai-action-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  background: rgba(255,255,255,0.07);
  color: #c4b5fd;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}

.ai-action-btn:hover {
  background: rgba(255,255,255,0.14);
  color: #fff;
}

/* ── Welcome Screen ─────────────────────────────────────────── */
.ai-welcome {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1.5rem 0.5rem;
  text-align: center;
  gap: 0.4rem;
}

.welcome-icon {
  font-size: 2.8rem;
  margin-bottom: 0.3rem;
}

.ai-welcome h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #e9d5ff;
}

.ai-welcome p {
  margin: 0;
  font-size: 0.8rem;
  color: #9ca3af;
}

.quick-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
}

.suggestion-chip {
  background: rgba(124,58,237,0.15);
  border: 1px solid rgba(124,58,237,0.35);
  color: #c4b5fd;
  border-radius: 20px;
  padding: 0.4rem 0.9rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.suggestion-chip:hover {
  background: rgba(124,58,237,0.3);
  border-color: #7c3aed;
  color: #fff;
  transform: translateY(-1px);
}

/* ── Messages ───────────────────────────────────────────────── */
.ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  scroll-behavior: smooth;
}

.ai-messages::-webkit-scrollbar {
  width: 4px;
}
.ai-messages::-webkit-scrollbar-track {
  background: transparent;
}
.ai-messages::-webkit-scrollbar-thumb {
  background: rgba(124,58,237,0.3);
  border-radius: 4px;
}

.ai-message {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

.ai-message.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.msg-bubble {
  max-width: 75%;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ai-message.user .msg-bubble {
  align-items: flex-end;
}

.msg-text {
  padding: 0.6rem 0.9rem;
  border-radius: 16px;
  font-size: 0.84rem;
  line-height: 1.55;
  word-break: break-word;
}

.ai-message.user .msg-text {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.ai-message.assistant .msg-text {
  background: #1e1b2e;
  color: #e2e8f0;
  border-bottom-left-radius: 4px;
  border: 1px solid rgba(124,58,237,0.2);
}

.msg-time {
  font-size: 0.68rem;
  color: #6b7280;
  padding: 0 0.2rem;
}

/* ── Typing dots ────────────────────────────────────────────── */
.typing-dots {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0.75rem 1rem;
  background: #1e1b2e;
  border-radius: 16px;
  border-bottom-left-radius: 4px;
  border: 1px solid rgba(124,58,237,0.2);
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #7c3aed;
  animation: bounce-dot 1.2s ease-in-out infinite;
}

.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce-dot {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-6px); opacity: 1; }
}

/* ── Error Banner ───────────────────────────────────────────── */
.ai-error-banner {
  margin: 0 1rem;
  padding: 0.55rem 0.75rem;
  background: rgba(239,68,68,0.12);
  border: 1px solid rgba(239,68,68,0.3);
  border-radius: 10px;
  color: #f87171;
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.error-dismiss {
  margin-left: auto;
  background: none;
  border: none;
  color: #f87171;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
}

/* ── Input Area ─────────────────────────────────────────────── */
.ai-input-area {
  padding: 0.75rem 1rem 0.6rem;
  border-top: 1px solid rgba(124,58,237,0.2);
  background: #0f0f1a;
  flex-shrink: 0;
}

.ai-input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  background: #1a1830;
  border: 1px solid rgba(124,58,237,0.3);
  border-radius: 14px;
  padding: 0.5rem 0.5rem 0.5rem 0.8rem;
  transition: border-color 0.2s;
}

.ai-input-wrapper:focus-within {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
}

.ai-input-wrapper textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #e2e8f0;
  font-size: 0.84rem;
  font-family: inherit;
  resize: none;
  line-height: 1.5;
  max-height: 120px;
  overflow-y: auto;
}

.ai-input-wrapper textarea::placeholder {
  color: #4b5563;
}

.ai-input-wrapper textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-send-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.2s, transform 0.15s;
}

.ai-send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  opacity: 0.9;
}

.ai-send-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.ai-input-hint {
  margin: 0.3rem 0 0;
  font-size: 0.67rem;
  color: #374151;
  text-align: right;
}
</style>
