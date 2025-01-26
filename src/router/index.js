import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Index from '@/views/Index.vue'
import Auth_Layout from '@/views/Authenticated/Auth_Layout.vue'
import Dashboard from '@/views/Authenticated/Dashboard.vue'
import FP_Collection_Records_Index from '@/views/Authenticated/FP_Collection_Records/Index.vue'
import Map from '@/views/Authenticated/ForestProductsMap/Map.vue'
import ForestProducts from '@/views/Authenticated/FP_Collection_Records/Index.vue'
import ForestProductsCreate from '@/views/Authenticated/FP_Collection_Records/Create.vue'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/authenticated',
    component: Auth_Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'records',
        name: 'Records',
        component: FP_Collection_Records_Index
      },
      {
        path: 'map',
        name: 'Map',
        component: Map
      },
      {
        path: 'forest-products',
        name: 'ForestProducts',
        component: ForestProducts
      },
      {
        path: 'forest-products/create',
        name: 'ForestProductsCreate',
        component: ForestProductsCreate
      }
      // Add other routes here
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({ name: 'Index' })
    } else {
      next()
    }
  } else {
    if (authStore.isAuthenticated && to.name === 'Index') {
      next({ name: 'Dashboard' })
    } else {
      next()
    }
  }
})

export default router