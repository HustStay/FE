import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Profile from '../components/Profile.vue'
import HotelDetail from '@/views/HotelDetail.vue'
import Bookings from '@/views/Bookings.vue'
import PaymentSuccess from '@/views/PaymentSuccess.vue'
import PaymentCancel from '@/views/PaymentCancel.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
    }
  ],
})

export default router
