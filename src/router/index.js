import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomePage.vue'
import Login from '@/views/Login.vue'
import ProfileAdmin from '@/views/ProfileAdmin.vue'
import ProfileGuia from '@/views/ProfileGuia.vue'
import ProfileUser from '@/views/ProfileUser.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: HomeView
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/admin',
      name: 'ProfileAdmin',
      component: ProfileAdmin,
    },
    {
      path: '/guia',
      name: 'ProfileGuia',
      component: ProfileGuia,
    },
    {
      path: '/cliente',
      name: 'ProfileUser',
      component: ProfileUser,
    },
  ],
})

export default router
