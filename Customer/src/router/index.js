import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import Login from '../views/LoginView.vue'
import Home from '../views/Home.vue'
import Profile from '../components/Profile.vue'
import HotelDetail from '@/views/HotelDetail.vue'
import Bookings from '@/views/BookingList.vue'
import PaymentSuccess from '@/views/PaymentSuccess.vue'
import PaymentCancel from '@/views/PaymentCancel.vue'
import PaymentCheckout from '@/views/PaymentCheckout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/hotel/:id',
      name: 'hotel-detail',
      component: HotelDetail
    },
    {
      path: '/bookings',
      name: 'bookings',
      component: Bookings
    },
    {
      path: '/payment/success',
      name: 'payment-success',
      component: PaymentSuccess
    },
    {
      path: '/payment/cancel',
      name: 'payment-cancel',
      component: PaymentCancel
    },
    {
      path: '/payment/checkout',
      name: 'payment-checkout',
      component: PaymentCheckout
    }
  ],
})

export default router
