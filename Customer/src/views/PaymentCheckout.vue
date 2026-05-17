<template>
  <div class="payment-checkout-page">
    <Navbar />

    <div class="checkout-shell">
      <div class="checkout-layout">
        <section class="payment-card">
          <div class="payment-header">
            <div>
              <h1>Quét mã QR để thanh toán</h1>
              <p>Mở ứng dụng ngân hàng hoặc ví điện tử để quét mã bên dưới.</p>
            </div>
          </div>

          <div v-if="loading" class="loading">Đang tải thông tin thanh toán...</div>
          <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

          <template v-else>
            <div class="amount-box">
              <span>Số tiền cần thanh toán</span>
              <strong>{{ formatPrice(totalAmount) }}</strong>
            </div>

            <div class="payment-body">
              <div class="qr-col">
                <div class="qr-box">
                  <img v-if="displayQrUrl" :src="displayQrUrl" alt="VietQR" class="qr-image" />
                  <div v-else class="qr-empty">Không có thông tin QR để hiển thị.</div>
                </div>
                <p class="qr-note">Mở app ngân hàng và quét mã VietQR để thanh toán ngay.</p>
                <button class="payos-btn" @click="openPayOSPage" :disabled="redirecting">
                  {{ redirecting ? 'Đang chuyển sang PayOS...' : 'Mở trang PayOS' }}
                </button>
              </div>

              <div class="info-col">
                <div class="info-item">
                  <div>
                    <span>Ngân hàng</span>
                    <strong>{{ displayBankName }}</strong>
                  </div>
                </div>

                <div class="info-item">
                  <div>
                    <span>Chủ tài khoản</span>
                    <strong>{{ displayAccountName }}</strong>
                  </div>
                  <button class="copy-btn" @click="copyToClipboard(displayAccountName, 'chủ tài khoản')">Sao chép</button>
                </div>

                <div class="info-item">
                  <div>
                    <span>Số tài khoản</span>
                    <strong>{{ displayAccountNumber }}</strong>
                  </div>
                  <button class="copy-btn" @click="copyToClipboard(displayAccountNumber, 'số tài khoản')">Sao chép</button>
                </div>

                <div class="info-item">
                  <div>
                    <span>Số tiền</span>
                    <strong>{{ formatPrice(totalAmount) }}</strong>
                  </div>
                  <button class="copy-btn" @click="copyToClipboard(formatPrice(totalAmount), 'số tiền')">Sao chép</button>
                </div>

                <div class="info-item">
                  <div>
                    <span>Nội dung</span>
                    <strong>{{ displayTransferContent }}</strong>
                  </div>
                  <button class="copy-btn" @click="copyToClipboard(displayTransferContent, 'nội dung chuyển khoản')">Sao chép</button>
                </div>
              </div>
            </div>

            <p v-if="copiedField" class="copy-state">Đã sao chép {{ copiedField }}.</p>

            <div class="notice-box">
              <p><strong>Lưu ý:</strong> Nhập chính xác số tiền và nội dung chuyển khoản để hệ thống tự đối soát.</p>
            </div>
          </template>
        </section>

        <aside class="summary-card">
          <img v-if="bookingSummary.hotelImage" :src="bookingSummary.hotelImage" alt="Hotel image" class="hotel-image" />
          <div v-else class="hotel-image placeholder"></div>

          <h2>{{ bookingSummary.hotelName || 'Thông tin booking' }}</h2>
          <p class="hotel-location">{{ bookingSummary.location || 'Đang cập nhật địa chỉ' }}</p>

          <div class="meta-grid">
            <div class="meta-item">
              <span>Nhận phòng</span>
              <strong>{{ formatDate(bookingSummary.checkInDate) }}</strong>
            </div>
            <div class="meta-item">
              <span>Trả phòng</span>
              <strong>{{ formatDate(bookingSummary.checkOutDate) }}</strong>
            </div>
            <div class="meta-item full">
              <span>Khách</span>
              <strong>{{ bookingSummary.guests || 1 }} người · {{ bookingSummary.nights || 1 }} đêm</strong>
            </div>
          </div>

          <div class="price-breakdown">
            <div class="line">
              <span>Tiền phòng</span>
              <strong>{{ formatPrice(roomSubtotal) }}</strong>
            </div>
            <div class="line">
              <span>Thuế & phí</span>
              <strong>{{ formatPrice(taxFee) }}</strong>
            </div>
            <div class="line">
              <span>Phí dịch vụ</span>
              <strong>{{ formatPrice(serviceFee) }}</strong>
            </div>
          </div>

          <div class="total-line">
            <span>Tổng cộng</span>
            <strong>{{ formatPrice(totalAmount) }}</strong>
          </div>

          <button class="done-btn" @click="goToBookings">Tôi đã thanh toán</button>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as vietqrPackage from 'vietqr'
import Navbar from '@/components/Navbar.vue'
import { apiFetch } from '../utils/apiClient.js'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const redirecting = ref(false)
const errorMessage = ref('')
const copiedField = ref('')
const VIETQR_CLIENT_ID = import.meta.env.VITE_VIETQR_CLIENT_ID || 'local-client-id'
const VIETQR_API_KEY = import.meta.env.VITE_VIETQR_API_KEY || 'local-api-key'

const paymentInfo = ref({
  bookingId: null,
  orderCode: null,
  amount: 0,
  checkoutUrl: '',
  bin: '',
  qrUrl: '',
  paymentLinkData: null,
  data: null,
  bankBin: '',
  bankCode: '',
  bankName: '',
  accountNumber: '',
  accountName: '',
  transferContent: ''
})

const bookingSummary = ref({
  hotelName: '',
  hotelImage: '',
  location: '',
  checkInDate: '',
  checkOutDate: '',
  guests: 1,
  nights: 1,
  roomSubtotal: 0,
  taxFee: 0,
  serviceFee: 0,
  totalAmount: 0
})

const pickFirst = (...values) => {
  for (const value of values) {
    if (value === undefined || value === null) continue
    const normalized = String(value).trim()
    if (normalized) return normalized
  }
  return ''
}

const asNumber = (value, fallback = 0) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

const payosCheckoutUrl = computed(() => {
  return pickFirst(paymentInfo.value.checkoutUrl, route.query.checkoutUrl)
})

const vietQrClient = vietqrPackage?.VietQR || vietqrPackage?.default?.VietQR
  ? new (vietqrPackage?.VietQR || vietqrPackage?.default?.VietQR)({
      clientID: VIETQR_CLIENT_ID,
      apiKey: VIETQR_API_KEY
    })
  : null

const displayBankName = computed(() => pickFirst(paymentInfo.value.bankName, 'Theo thông tin PayOS'))
const displayAccountNumber = computed(() => pickFirst(paymentInfo.value.accountNumber, 'Theo thông tin PayOS'))
const displayAccountName = computed(() => pickFirst(paymentInfo.value.accountName, 'Theo thông tin PayOS'))
const displayTransferContent = computed(() =>
  pickFirst(paymentInfo.value.transferContent, `BOOKING-${paymentInfo.value.orderCode || ''}`)
)

const hasPrimitiveValue = (value) => {
  if (value === undefined || value === null) return false
  if (typeof value === 'object') return false
  return String(value).trim() !== ''
}

const pickPrimitive = (...values) => {
  for (const value of values) {
    if (!hasPrimitiveValue(value)) continue
    return value
  }
  return ''
}

const tryParseJsonString = (value) => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || (!trimmed.startsWith('{') && !trimmed.startsWith('['))) return null
  try {
    const parsed = JSON.parse(trimmed)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

const findDeepValue = (payload, keyCandidates = []) => {
  if (!payload || typeof payload !== 'object') return ''

  const queue = [payload]
  const visited = new Set()

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current || typeof current !== 'object' || visited.has(current)) continue
    visited.add(current)

    for (const key of keyCandidates) {
      if (hasPrimitiveValue(current[key])) return current[key]
    }

    for (const value of Object.values(current)) {
      if (value && typeof value === 'object' && !visited.has(value)) {
        queue.push(value)
        continue
      }

      const parsed = tryParseJsonString(value)
      if (parsed && !visited.has(parsed)) {
        queue.push(parsed)
      }
    }
  }

  return ''
}

const getPaymentField = (payload, keyCandidates, fallback = '') => {
  return pickPrimitive(findDeepValue(payload, keyCandidates), fallback)
}

const PAYMENT_KEYS = {
  orderCode: ['orderCode', 'order_code', 'sessionId', 'session_id'],
  amount: ['amount', 'totalAmount', 'total_amount', 'price'],
  checkoutUrl: ['checkoutUrl', 'checkout_url', 'sessionUrl', 'session_url', 'paymentUrl', 'payment_url'],
  qrCode: ['qrCode', 'qr_code', 'qrData', 'qr_data'],
  qrUrl: ['qrUrl', 'qr_url', 'qrCodeUrl', 'qr_code_url'],
  checkoutQrCode: ['checkoutQrCode', 'checkout_qr_code'],
  bankBin: ['bankBin', 'bank_bin', 'acqId', 'acq_id', 'bin', 'bankId', 'bank_id', 'binCode', 'bin_code'],
  bankCode: ['bankCode', 'bank_code', 'shortName', 'short_name', 'bankShortName', 'bank_short_name'],
  bankName: ['bankName', 'bank_name', 'bankNameVi', 'bank_name_vi', 'binName', 'bin_name'],
  accountNumber: ['accountNumber', 'account_number', 'accountNo', 'account_no'],
  accountName: ['accountName', 'account_name'],
  transferContent: ['transferContent', 'transfer_content', 'description', 'desc', 'content', 'addInfo', 'add_info']
}

const mergePaymentInfo = (payload, fallbackOrderCode = '') => {
  const prev = paymentInfo.value

  const next = {
    bookingId: getPaymentField(payload, ['bookingId', 'booking_id'], prev.bookingId),
    orderCode: pickPrimitive(getPaymentField(payload, PAYMENT_KEYS.orderCode), fallbackOrderCode, prev.orderCode),
    amount: asNumber(getPaymentField(payload, PAYMENT_KEYS.amount, prev.amount), prev.amount),
    checkoutUrl: getPaymentField(payload, PAYMENT_KEYS.checkoutUrl, prev.checkoutUrl),
    bin: getPaymentField(payload, ['bin', 'bankBin', 'bank_bin'], prev.bin),
    qrUrl: getPaymentField(payload, PAYMENT_KEYS.qrUrl, prev.qrUrl),
    paymentLinkData: payload?.paymentLinkData ?? prev.paymentLinkData,
    data: payload?.data ?? prev.data,
    bankBin: getPaymentField(payload, PAYMENT_KEYS.bankBin, prev.bankBin),
    bankCode: getPaymentField(payload, PAYMENT_KEYS.bankCode, prev.bankCode),
    bankName: getPaymentField(payload, PAYMENT_KEYS.bankName, prev.bankName),
    accountNumber: getPaymentField(payload, PAYMENT_KEYS.accountNumber, prev.accountNumber),
    accountName: getPaymentField(payload, PAYMENT_KEYS.accountName, prev.accountName),
    transferContent: getPaymentField(payload, PAYMENT_KEYS.transferContent, prev.transferContent)
  }

  paymentInfo.value = next
}

const roomSubtotal = computed(() => asNumber(bookingSummary.value.roomSubtotal, asNumber(paymentInfo.value.amount)))
const taxFee = computed(() => asNumber(bookingSummary.value.taxFee))
const serviceFee = computed(() => asNumber(bookingSummary.value.serviceFee))
const totalAmount = computed(() => {
  const summaryTotal = asNumber(bookingSummary.value.totalAmount)
  if (summaryTotal > 0) return summaryTotal
  return asNumber(paymentInfo.value.amount)
})

const generatedVietQrUrl = computed(() => {
  if (!vietQrClient) return ''

  const bank = String(pickFirst(paymentInfo.value.bin, paymentInfo.value.bankBin, paymentInfo.value.bankCode)).trim()
  const accountNumber = String(paymentInfo.value.accountNumber || '').replace(/\s+/g, '')
  const amount = Math.round(asNumber(totalAmount.value || paymentInfo.value.amount))
  const memo = displayTransferContent.value
  const accountName = displayAccountName.value

  if (!bank || !accountNumber || !amount || !memo) return ''

  const generated = vietQrClient.genQuickLink({
    bank,
    accountName,
    accountNumber,
    amount: String(amount),
    memo,
    template: 'compact2',
    media: '.jpg'
  })

  return typeof generated === 'string' ? generated : ''
})

const displayQrUrl = computed(() => {
  return generatedVietQrUrl.value || paymentInfo.value.qrUrl
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(asNumber(price))
    .replace('₫', 'đ')
}

const formatDate = (dateValue) => {
  if (!dateValue) return '--'
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return '--'
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

const goToBookings = () => {
  router.push('/bookings')
}

const copyToClipboard = async (value, label) => {
  if (!value) return
  try {
    await navigator.clipboard.writeText(String(value))
    copiedField.value = label
    setTimeout(() => {
      copiedField.value = ''
    }, 2000)
  } catch (error) {
    console.error('❌ Copy failed:', error)
    errorMessage.value = 'Không thể sao chép. Vui lòng thử lại.'
  }
}

const applySavedPayment = (raw) => {
  mergePaymentInfo(raw)

  bookingSummary.value = {
    hotelName: raw.hotelName ?? bookingSummary.value.hotelName,
    hotelImage: raw.hotelImage ?? bookingSummary.value.hotelImage,
    location: raw.location ?? bookingSummary.value.location,
    checkInDate: raw.checkInDate ?? bookingSummary.value.checkInDate,
    checkOutDate: raw.checkOutDate ?? bookingSummary.value.checkOutDate,
    guests: asNumber(raw.guests, bookingSummary.value.guests || 1),
    nights: asNumber(raw.nights, bookingSummary.value.nights || 1),
    roomSubtotal: asNumber(raw.roomSubtotal, bookingSummary.value.roomSubtotal),
    taxFee: asNumber(raw.taxFee, bookingSummary.value.taxFee),
    serviceFee: asNumber(raw.serviceFee, bookingSummary.value.serviceFee),
    totalAmount: asNumber(raw.totalAmount, bookingSummary.value.totalAmount)
  }
  // renderPayosQr() sẽ tự kích hoạt qua watch(payosQrSource)
}

const applyPaymentFromApi = (payment, orderCode) => {
  mergePaymentInfo(payment, orderCode)

  bookingSummary.value = {
    ...bookingSummary.value,
    totalAmount: asNumber(payment.amount, bookingSummary.value.totalAmount || paymentInfo.value.amount)
  }
  // renderPayosQr() sẽ tự kích hoạt qua watch(payosQrSource) khi paymentInfo.qrCode thay đổi
}

const fetchPaymentByOrderCode = async (orderCode) => {
  if (!orderCode) return false

  const token = localStorage.getItem('token')
  const response = await apiFetch(`/api/payment-service/payos/payment/${orderCode}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) return false

  const payment = await response.json()
  applyPaymentFromApi(payment, orderCode)
  return !!(paymentInfo.value.checkoutUrl || payosQrSource.value)
}

const openPayOSPage = async () => {
  if (redirecting.value) return
  redirecting.value = true

  let hasCheckoutUrl = !!paymentInfo.value.checkoutUrl
  if (!hasCheckoutUrl) {
    hasCheckoutUrl = await fetchPaymentByOrderCode(paymentInfo.value.orderCode || route.query.orderCode)
  }

  const checkoutTarget = payosCheckoutUrl.value
  if (!hasCheckoutUrl && !checkoutTarget) {
    errorMessage.value = 'Không tìm thấy liên kết thanh toán PayOS. Vui lòng thử lại sau.'
    redirecting.value = false
    return
  }

  window.location.assign(checkoutTarget)
}

const loadPaymentInfo = async () => {
  errorMessage.value = ''

  try {
    const savedPayment = sessionStorage.getItem('pendingPayment')
    const orderCodeFromQuery = route.query.orderCode

    if (savedPayment) {
      applySavedPayment(JSON.parse(savedPayment))
    }

    const resolvedOrderCode = paymentInfo.value.orderCode || orderCodeFromQuery
    if (!resolvedOrderCode && !payosCheckoutUrl.value && !payosQrSource.value) {
      errorMessage.value = 'Không tìm thấy thông tin phiên thanh toán.'
      return
    }

    if (resolvedOrderCode) {
      const loaded = await fetchPaymentByOrderCode(resolvedOrderCode)
      if (!loaded && !payosQrSource.value) {
        errorMessage.value = 'Không thể tải thông tin phiên thanh toán.'
      }
    }
  } catch (error) {
    console.error('❌ Error loading payment info:', error)
    if (!payosCheckoutUrl.value) {
      errorMessage.value = 'Đã xảy ra lỗi khi tải thông tin thanh toán.'
    }
  } finally {
    loading.value = false
  }
}

const refreshPayment = () => {
  loading.value = true
  loadPaymentInfo()
}

onMounted(() => {
  loadPaymentInfo()
})
</script>

<style scoped>
.payment-checkout-page {
  min-height: 100vh;
  background: #f8f5ef;
}

.checkout-shell {
  max-width: 1500px;
  margin: 0 auto;
  padding: 6rem 1rem 2rem;
}

.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
  gap: 1rem;
}

.payment-card,
.summary-card {
  background: #f8f6f2;
  border: 1px solid #e2dcd3;
  border-radius: 24px;
  padding: 1.8rem;
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.payment-header h1 {
  margin: 0;
  color: #1d1917;
  font-size: clamp(1.4rem, 1.8vw, 2rem);
}

.payment-header p {
  margin: 0.45rem 0 0;
  color: #6f6457;
  font-size: 1.05rem;
}

.refresh-btn {
  border: none;
  background: transparent;
  color: #3e3429;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  padding: 0.5rem 0.2rem;
}

.loading,
.error {
  border-radius: 12px;
  padding: 0.95rem 1rem;
  font-weight: 600;
  margin-top: 1rem;
}

.loading {
  color: #1e429f;
  background: #ecf2ff;
}

.error {
  color: #b42318;
  background: #fff1f1;
}

.payment-body {
  display: grid;
  grid-template-columns: minmax(290px, 0.95fr) minmax(0, 1.2fr);
  gap: 1.3rem;
  margin-top: 1rem;
}

.qr-col {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.qr-box {
  background: #fff;
  border: 1px solid #e3ddd5;
  border-radius: 18px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-image {
  width: min(100%, 430px);
  border-radius: 12px;
  object-fit: contain;
  background: #fff;
}

.qr-empty {
  color: #7b6f62;
  font-weight: 600;
}

.amount-box {
  background: #f2ede5;
  border: 1px solid #ddd4c7;
  border-radius: 14px;
  padding: 0.85rem 1rem;
}

.amount-box span {
  color: #6f6357;
  font-size: 0.95rem;
}

.amount-box strong {
  display: block;
  margin-top: 0.2rem;
  color: #6d4e37;
  font-size: 1.5rem;
  line-height: 1.1;
}

.qr-note {
  margin: 0;
  color: #746758;
  font-size: 0.95rem;
}

.info-col {
  display: grid;
  gap: 0.75rem;
  align-content: start;
}

.info-item {
  background: #f2ede5;
  border: 1px solid #ddd4c7;
  border-radius: 16px;
  padding: 0.8rem 0.95rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}

.info-item span {
  display: block;
  color: #6f6357;
  font-size: 0.95rem;
}

.info-item strong {
  display: block;
  margin-top: 0.15rem;
  color: #211a13;
  font-size: 1.08rem;
  line-height: 1.2;
  word-break: break-word;
}

.copy-btn {
  border: none;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  background: #d9f5e6;
  color: #0a6d42;
  padding: 0.5rem 1rem;
  white-space: nowrap;
}

.copy-state {
  margin: 0.9rem 0 0;
  color: #2f7d55;
  font-weight: 600;
}

.payos-btn,
.done-btn {
  border: none;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
}

.payos-btn {
  background: #75553c;
  color: #fff;
  padding: 0.75rem 1rem;
}

.payos-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.notice-box {
  margin-top: 1rem;
  border: 1px dashed #c8bba9;
  border-radius: 16px;
  padding: 1rem 1.1rem;
  background: #f7f2e9;
}

.notice-box p {
  margin: 0;
  color: #3f3326;
}

.summary-card {
  display: flex;
  flex-direction: column;
}

.hotel-image {
  width: 100%;
  height: 190px;
  object-fit: cover;
  border-radius: 16px;
  border: 1px solid #e1d8cb;
}

.hotel-image.placeholder {
  background: linear-gradient(135deg, #efe8dc, #e7e0d4);
}

.summary-card h2 {
  margin: 1rem 0 0.35rem;
  font-size: 2rem;
  color: #211a13;
}

.hotel-location {
  margin: 0;
  color: #6b6052;
  font-size: 1rem;
}

.meta-grid {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
}

.meta-item {
  background: #ece6dd;
  border-radius: 16px;
  padding: 0.85rem;
}

.meta-item.full {
  grid-column: 1 / -1;
}

.meta-item span {
  color: #6f6357;
  font-size: 0.92rem;
}

.meta-item strong {
  display: block;
  margin-top: 0.2rem;
  color: #221b14;
  font-size: 1.03rem;
}

.price-breakdown {
  margin-top: 1rem;
  border-top: 1px solid #ddd3c6;
  border-bottom: 1px solid #ddd3c6;
  padding: 0.8rem 0;
  display: grid;
  gap: 0.6rem;
}

.line,
.total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
}

.line span {
  color: #6f6357;
  font-size: 1rem;
}

.line strong {
  color: #3a2e22;
  font-size: 1rem;
}

.total-line {
  margin-top: 1rem;
}

.total-line span {
  color: #4a3e32;
  font-size: 1.4rem;
}

.total-line strong {
  color: #6d4e37;
  font-size: 3.2rem;
  line-height: 1.1;
}

.done-btn {
  margin-top: 1.1rem;
  width: 100%;
  padding: 0.9rem 1.1rem;
  background: #75553c;
  color: #fff;
  font-size: 1.1rem;
}

@media (max-width: 1200px) {
  .summary-card h2 {
    font-size: 1.7rem;
  }

  .total-line span {
    font-size: 1.2rem;
  }

  .total-line strong {
    font-size: 2.5rem;
  }
}

@media (max-width: 980px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .summary-card {
    order: 2;
  }
}

@media (max-width: 760px) {
  .checkout-shell {
    padding-top: 5.5rem;
  }

  .payment-card,
  .summary-card {
    padding: 1.1rem;
    border-radius: 18px;
  }

  .payment-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .payment-body {
    grid-template-columns: 1fr;
  }

  .qr-image {
    width: min(100%, 320px);
  }

  .total-line strong {
    font-size: 2.1rem;
  }
}
</style>
