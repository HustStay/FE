import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import RoomManagementView from '../views/RoomManagementView.vue'
import BookingListView from '../views/BookingListView.vue'
import CommentListView from '../views/CommentListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: RoomManagementView
    },
    {
      path: '/bookings',
      name: 'bookings',
      component: BookingListView
    },
    {
      path: '/comments',
      name: 'comments',
      component: CommentListView
    }
  ],
})

export default router
