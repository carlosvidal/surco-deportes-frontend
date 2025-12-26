// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/carriles',
      name: 'ControlCarriles',
      component: () => import('../views/ControlCarriles.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/vecinos',
      name: 'Vecinos',
      component: () => import('../views/Vecinos.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/vecino/:dni',
      name: 'VecinoFicha',
      component: () => import('../views/VecinoFicha.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/metricas',
      name: 'DashboardMetricas',
      component: () => import('../views/DashboardMetricas.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/caja',
      name: 'Caja',
      component: () => import('../views/Caja.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Guardia de navegación para rutas protegidas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.loadFromStorage()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
