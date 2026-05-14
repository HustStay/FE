<template>
  <div class="ai-chat-container">
    <!-- AI Chat Toggle Button (Always visible) -->
    <button
      @click="isOpen ? closeChat() : openChat()"
      class="ai-chat-btn"
      :class="{ 'is-open': isOpen }"
      :title="isOpen ? 'Đóng chat' : 'Mở chat với AI'"
    >
      <!-- Chat bubble icon (shown when closed) -->
      <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
      <!-- Close icon (shown when open) -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <!-- AI Chat Window -->
    <Transition name="chat-slide">
      <div v-if="isOpen" class="ai-chat-window">
        <!-- Header -->
        <div class="ai-chat-header">
          <div class="ai-header-left">
            <div class="ai-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <span class="ai-online-dot"></span>
            </div>
            <div class="ai-header-info">
              <h3>Sandy — Trợ lý du lịch</h3>
              <span class="ai-status">
                <span class="status-dot"></span>
                Đang trực tuyến · Phản hồi tức thì
              </span>
            </div>
          </div>
        </div>

        <!-- Messages Area -->
        <div v-if="messages.length === 0" class="ai-welcome">
          <h4>Xin chào! Mình là Sandy ✨ — trợ lý du lịch của Sandstay</h4>
          <p>Mình có thể giúp bạn tìm khách sạn, kiếm tra ưu đãi hay giải đáp về đặt phòng. Bạn cần gì hôm nay?</p>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <div class="msg-bubble">
              <div class="msg-text" v-html="formatMessage(msg.content)"></div>
            </div>
          </div>

          <!-- Quick suggestions after assistant message -->
          <div v-if="messages.length > 0 && messages[messages.length - 1].role === 'assistant'" class="quick-suggestions-area">
            <p class="suggestions-label">Gợi ý nhanh</p>
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

          <!-- Thinking indicator -->
          <div v-if="isThinking" class="ai-message assistant thinking-msg">
            <div class="msg-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
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
              placeholder="Nhập tin nhắn..."
              rows="1"
              :disabled="isThinking || isStreaming"
            ></textarea>
            <button
              @click="sendMessage"
              class="ai-send-btn"
              :disabled="!inputText.trim() || isThinking || isStreaming"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16507265 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99521575 L3.03521743,10.4362088 C3.03521743,10.5933061 3.19218622,10.7504035 3.50612381,10.7504035 L16.6915026,11.5358905 C16.6915026,11.5358905 17.1624089,11.5358905 17.1624089,12.0071827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

// ── Configuration ──────────────────────────────────────────────────
// Strip any old /api/v1/chat suffix from env var and always use streaming endpoint
const _rawBase = import.meta.env.VITE_AI_CHAT_URL || 'http://localhost:8000'
const AI_STREAM_URL = _rawBase.replace(/\/api\/v1\/chat(\/stream)?$/, '') + '/api/v1/chat/stream'

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
const isThinking = ref(false)   // typing-dots while waiting for first chunk
const isStreaming = ref(false)  // true while SSE chunks are arriving
const inputText = ref('')
const messages = ref([])
const errorMessage = ref('')
const messagesContainer = ref(null)
const inputRef = ref(null)
const sessionId = ref(getSessionId())

const suggestions = [
  'Gợi ý khách sạn ở Đà Nẵng',
  'Resort cho gia đình tại Phú Quốc',
  'Khách sạn có bể bơi',
  'Tiện ích phòng Superior là gì?'
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
  if (!text || isThinking.value || isStreaming.value) return

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

  // Show typing indicator while waiting for the first chunk
  isThinking.value = true

  try {
    const response = await fetch(AI_STREAM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        session_id: sessionId.value
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // Hide typing dots, create an empty assistant bubble to fill incrementally
    isThinking.value = false
    isStreaming.value = true

    const assistantMsg = {
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }
    messages.value.push(assistantMsg)

    // Read the SSE stream
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // SSE lines are separated by double newline
      const parts = buffer.split('\n\n')
      buffer = parts.pop() // keep incomplete last part

      for (const part of parts) {
        const line = part.trim()
        if (!line.startsWith('data:')) continue

        const jsonStr = line.slice(5).trim()
        try {
          const payload = JSON.parse(jsonStr)

          if (payload.error) {
            errorMessage.value = payload.error
            break
          }

          if (payload.chunk) {
            assistantMsg.content += payload.chunk
            // Trigger Vue reactivity on the array item
            messages.value = [...messages.value]
            await nextTick()
            scrollToBottom()
          }

          if (payload.done) {
            // Stream finished
            break
          }
        } catch (parseErr) {
          console.warn('[AI Chat] JSON parse error:', parseErr, jsonStr)
        }
      }
    }
  } catch (err) {
    isThinking.value = false
    console.error('[AI Chat] Stream error:', err)
    errorMessage.value = 'Không thể kết nối đến AI. Vui lòng thử lại sau.'
  } finally {
    isThinking.value = false
    isStreaming.value = false
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
  bottom: 80px;
  right: 20px;
  z-index: 1100;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  gap: 0;
}

/* ── Toggle Button ──────────────────────────────────────────── */
.ai-chat-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: #6b4a3a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(107, 74, 58, 0.3);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  flex-shrink: 0;
}

.ai-chat-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(107, 74, 58, 0.4);
}

.ai-chat-btn.is-open {
  background: #6b4a3a;
}

/* ── Window ─────────────────────────────────────────────────── */
.ai-chat-window {
  width: 390px;
  max-height: 600px;
  background: #FBF7F2;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: bottom right;
  margin-bottom: 12px;
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
  background: #FFF9F4;
  padding: 1rem 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E8DCD2;
  flex-shrink: 0;
}

.ai-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ai-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #6b4a3a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  position: relative;
  flex-shrink: 0;
}

.ai-online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #10b981;
  border-radius: 50%;
  border: 2px solid #FFF9F4;
}

.ai-header-info h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #3d2817;
  letter-spacing: 0.01em;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  color: #8B6F47;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  transition: background 0.3s;
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
  background: #EBE0D8;
  color: #6b4a3a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}

.ai-action-btn:hover {
  background: #DDD0C8;
  color: #3d2817;
}

/* ── Welcome Screen ─────────────────────────────────────────── */
.ai-welcome {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem 1.5rem;
  text-align: center;
  gap: 0.6rem;
}

.ai-welcome h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #3d2817;
}

.ai-welcome p {
  margin: 0;
  font-size: 0.8rem;
  color: #8B6F47;
}

.quick-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
  margin-top: 1rem;
}

.suggestion-chip {
  background: #FFF9F4;
  border: 1px solid #D4C4B0;
  color: #6b4a3a;
  border-radius: 20px;
  padding: 0.5rem 0.95rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.suggestion-chip:hover {
  background: #EBE0D8;
  border-color: #B09880;
  color: #3d2817;
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
  background: #D4C4B0;
  border-radius: 4px;
}

.ai-message {
  display: flex;
  align-items: flex-end;
  gap: 0.6rem;
}

.ai-message.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #6b4a3a;
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
  padding: 0.7rem 0.95rem;
  border-radius: 16px;
  font-size: 0.84rem;
  line-height: 1.55;
  word-break: break-word;
}

.ai-message.user .msg-text {
  background: #EBE0D8;
  color: #3d2817;
  border-bottom-right-radius: 4px;
}

.ai-message.assistant .msg-text {
  background: #FFF9F4;
  color: #3d2817;
  border-bottom-left-radius: 4px;
  border: 1px solid #E8DCD2;
}

/* ── Typing dots ────────────────────────────────────────────── */
.typing-dots {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0.75rem 1rem;
  background: #FFF9F4;
  border-radius: 16px;
  border-bottom-left-radius: 4px;
  border: 1px solid #E8DCD2;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6b4a3a;
  animation: bounce-dot 1.2s ease-in-out infinite;
}

.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce-dot {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
  40% { transform: translateY(-6px); opacity: 1; }
}

/* ── Quick Suggestions Area ─────────────────────────────────── */
.quick-suggestions-area {
  padding: 1rem;
  border-top: 1px solid #E8DCD2;
  flex-shrink: 0;
}

.suggestions-label {
  margin: 0 0 0.8rem 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b4a3a;
}

/* ── Error Banner ───────────────────────────────────────────── */
.ai-error-banner {
  margin: 0 1rem;
  padding: 0.6rem 0.8rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #dc2626;
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
  color: #dc2626;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
}

/* ── Input Area ─────────────────────────────────────────────── */
.ai-input-area {
  padding: 0.75rem 1rem 1rem;
  border-top: 1px solid #E8DCD2;
  background: #FBF7F2;
  flex-shrink: 0;
}

.ai-input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  background: #FFF9F4;
  border: 1px solid #D4C4B0;
  border-radius: 24px;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  transition: border-color 0.2s;
}

.ai-input-wrapper:focus-within {
  border-color: #6b4a3a;
  box-shadow: 0 0 0 3px rgba(107, 74, 58, 0.08);
}

.ai-input-wrapper textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #3d2817;
  font-size: 0.84rem;
  font-family: inherit;
  resize: none;
  line-height: 1.5;
  max-height: 120px;
  overflow-y: auto;
}

.ai-input-wrapper textarea::placeholder {
  color: #B09880;
}

.ai-input-wrapper textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-send-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #6b4a3a;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.2s, transform 0.15s;
}

.ai-send-btn:hover:not(:disabled) {
  transform: scale(1.1);
  opacity: 0.9;
}

.ai-send-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>
