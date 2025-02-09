import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomePage.vue'
import UserManagement from '@/views/UserManagement.vue'
import Login from '@/views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/home',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HomePage.vue'),
    },
    {
      path: '/gestion',
      name: 'GestionUsuarios',
      component: UserManagement,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    }
  ],
})

export default router
