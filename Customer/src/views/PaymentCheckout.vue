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

            <button class="refresh-btn" @click="refreshPayment">
              ↻ Làm mới
            </button>
          </div>

          <div v-if="loading" class="loading">Đang tải thông tin thanh toán...</div>
          <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

          <template v-else>
            <div class="payment-body">
              <div class="qr-col">
                <div class="qr-box">
                  <img v-if="qrUrl" :src="qrUrl" alt="PayOS QR" class="qr-image" />
                  <div v-else class="qr-empty">Không có mã QR để hiển thị.</div>
                </div>
                <div class="amount-box">
                  <span>Số tiền cần thanh toán</span>
                  <strong>{{ formatPrice(totalAmount) }}</strong>
                </div>
                <p class="qr-note">Mở ứng dụng ngân hàng hoặc ví điện tử để quét mã QR.</p>
                <button class="ghost-btn" @click="downloadQr">⭳ Tải mã QR</button>
                <button class="payos-btn" @click="openPayOSPage" :disabled="redirecting">
                  {{ redirecting ? 'Đang chuyển sang PayOS...' : 'Thanh toán ngay (PayOS)' }}
                </button>
              </div>

              <div class="info-col">
                <div class="info-item">
                  <div>
                    <span>Ngân hàng</span>
                    <strong>{{ displayBankName }}</strong>
                  </div>
                  <button class="copy-btn" @click="copyToClipboard(displayBankName, 'ngân hàng')">Sao chép</button>
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
                    <span>Chủ tài khoản</span>
                    <strong>{{ displayAccountName }}</strong>
                  </div>
                  <button class="copy-btn" @click="copyToClipboard(displayAccountName, 'chủ tài khoản')">Sao chép</button>
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
                    <span>Nội dung chuyển khoản</span>
                    <strong>{{ displayTransferContent }}</strong>
                  </div>
                  <button class="copy-btn" @click="copyToClipboard(displayTransferContent, 'nội dung chuyển khoản')">Sao chép</button>
                </div>
              </div>
            </div>

            <p v-if="copiedField" class="copy-state">Đã sao chép {{ copiedField }}.</p>

            <div class="notice-box">
              <p><strong>Lưu ý:</strong></p>
              <ul>
                <li>Vui lòng giữ nguyên nội dung chuyển khoản để hệ thống tự đối soát.</li>
                <li>Sau khi thanh toán thành công, PayOS sẽ tự động chuyển về trang xác nhận.</li>
              </ul>
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
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { apiFetch } from '../utils/apiClient.js'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const redirecting = ref(false)
const errorMessage = ref('')
const copiedField = ref('')
const DEFAULT_PAYOS_CHECKOUT_URL = 'https://pay.payos.vn/web/4ef6cb9ca85040f09e8ae3e99c659547/'

const paymentInfo = ref({
  bookingId: null,
  orderCode: null,
  amount: 0,
  checkoutUrl: '',
  qrCode: '',
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
  return pickFirst(paymentInfo.value.checkoutUrl, route.query.checkoutUrl, DEFAULT_PAYOS_CHECKOUT_URL)
})

const qrUrl = computed(() => {
  if (paymentInfo.value.qrCode) return paymentInfo.value.qrCode
  if (!payosCheckoutUrl.value) return ''
  return `https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=${encodeURIComponent(payosCheckoutUrl.value)}`
})

const displayBankName = computed(() => pickFirst(paymentInfo.value.bankName, 'PayOS / VietQR'))
const displayAccountNumber = computed(() => pickFirst(paymentInfo.value.accountNumber, 'Theo thông tin trên PayOS'))
const displayAccountName = computed(() => pickFirst(paymentInfo.value.accountName, 'Theo thông tin trên PayOS'))
const displayTransferContent = computed(() => pickFirst(paymentInfo.value.transferContent, `BOOKING-${paymentInfo.value.orderCode || ''}`))

const roomSubtotal = computed(() => asNumber(bookingSummary.value.roomSubtotal, asNumber(paymentInfo.value.amount)))
const taxFee = computed(() => asNumber(bookingSummary.value.taxFee))
const serviceFee = computed(() => asNumber(bookingSummary.value.serviceFee))
const totalAmount = computed(() => {
  const summaryTotal = asNumber(bookingSummary.value.totalAmount)
  if (summaryTotal > 0) return summaryTotal
  return asNumber(paymentInfo.value.amount)
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

const downloadQr = () => {
  if (!qrUrl.value) return
  const link = document.createElement('a')
  link.href = qrUrl.value
  link.download = `payos-qr-${paymentInfo.value.orderCode || 'payment'}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const applySavedPayment = (raw) => {
  paymentInfo.value = {
    bookingId: raw.bookingId ?? paymentInfo.value.bookingId,
    orderCode: raw.orderCode ?? paymentInfo.value.orderCode,
    amount: asNumber(raw.amount, paymentInfo.value.amount),
    checkoutUrl: raw.checkoutUrl ?? paymentInfo.value.checkoutUrl,
    qrCode: raw.qrCode ?? raw.qrUrl ?? paymentInfo.value.qrCode,
    bankName: raw.bankName ?? paymentInfo.value.bankName,
    accountNumber: raw.accountNumber ?? paymentInfo.value.accountNumber,
    accountName: raw.accountName ?? paymentInfo.value.accountName,
    transferContent: raw.transferContent ?? raw.description ?? paymentInfo.value.transferContent
  }

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
}

const applyPaymentFromApi = (payment, orderCode) => {
  paymentInfo.value = {
    bookingId: payment.bookingId ?? paymentInfo.value.bookingId,
    orderCode: payment.sessionId || orderCode || paymentInfo.value.orderCode,
    amount: asNumber(payment.amount, paymentInfo.value.amount),
    checkoutUrl: payment.sessionUrl || payment.checkoutUrl || paymentInfo.value.checkoutUrl,
    qrCode: pickFirst(payment.qrCode, payment.qrCodeUrl, payment.qrUrl, payment.checkoutQrCode, paymentInfo.value.qrCode),
    bankName: pickFirst(payment.bankName, payment.bankNameVi, payment.bank?.name, payment.binName, paymentInfo.value.bankName),
    accountNumber: pickFirst(payment.accountNumber, payment.accountNo, payment.account?.number, paymentInfo.value.accountNumber),
    accountName: pickFirst(payment.accountName, payment.account?.name, paymentInfo.value.accountName),
    transferContent: pickFirst(payment.transferContent, payment.description, payment.content, paymentInfo.value.transferContent)
  }

  bookingSummary.value = {
    ...bookingSummary.value,
    totalAmount: asNumber(payment.amount, bookingSummary.value.totalAmount || paymentInfo.value.amount)
  }
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
  return !!paymentInfo.value.checkoutUrl
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
    if (!resolvedOrderCode && !payosCheckoutUrl.value) {
      errorMessage.value = 'Không tìm thấy thông tin phiên thanh toán.'
      return
    }

    if (resolvedOrderCode) {
      const loaded = await fetchPaymentByOrderCode(resolvedOrderCode)
      if (!loaded && !payosCheckoutUrl.value) {
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
  grid-template-columns: minmax(290px, 0.95fr) minmax(0, 1.55fr);
  gap: 1.3rem;
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
  width: min(100%, 320px);
  aspect-ratio: 1;
  object-fit: contain;
  border-radius: 12px;
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

.ghost-btn,
.payos-btn,
.copy-btn,
.done-btn {
  border: none;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
}

.ghost-btn {
  background: #f0ece4;
  color: #31271e;
  border: 1px solid #ddd3c6;
  padding: 0.72rem 1rem;
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

.info-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  background: #f2ede5;
  border: 1px solid #ddd4c7;
  border-radius: 18px;
  padding: 0.9rem 1.05rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.info-item span {
  display: block;
  color: #6c6155;
  font-size: 0.95rem;
}

.info-item strong {
  display: block;
  margin-top: 0.2rem;
  color: #211a13;
  font-size: 1.02rem;
  word-break: break-word;
}

.copy-btn {
  background: #e7eee6;
  color: #355143;
  border: 1px solid #d4e0d2;
  padding: 0.56rem 0.95rem;
  font-size: 0.95rem;
  white-space: nowrap;
}

.copy-state {
  margin: 0.9rem 0 0;
  color: #3a6d4d;
  font-weight: 600;
}

.notice-box {
  margin-top: 1rem;
  border: 1px dashed #c8bba9;
  border-radius: 16px;
  padding: 1rem 1.1rem;
  background: #f7f2e9;
}

.notice-box p {
  margin: 0 0 0.5rem;
  color: #3f3326;
}

.notice-box ul {
  margin: 0;
  padding-left: 1.1rem;
  color: #5f5245;
  display: grid;
  gap: 0.4rem;
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
    width: min(100%, 280px);
  }

  .total-line strong {
    font-size: 2.1rem;
  }
}
</style>
