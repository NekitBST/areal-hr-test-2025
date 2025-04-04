import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/organizations',
      name: 'organizations',
      component: () => import('../views/organizations/OrganizationsView.vue')
    },
    {
      path: '/positions',
      name: 'positions',
      component: () => import('../views/positions/PositionsView.vue')
    }
  ]
})

export default router 