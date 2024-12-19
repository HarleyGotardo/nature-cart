import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/views/Index.vue';

const routes = [
  {
    path: '/',
    name: 'landing-page',
    component: LandingPage,
    meta: { requiresUnauth: true, title: 'Fiber Muscle - Home' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Fiber Muscle';
  next();
});

export default router;