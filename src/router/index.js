import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/Index.vue'
import Auth_Layout from '@/views/Authenticated/Auth_Layout.vue'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/authenticated',
    name: 'Authenticated',
    component: Auth_Layout
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router