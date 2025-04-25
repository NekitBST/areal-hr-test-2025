import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from 'primevue/usetoast'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/organizations',
      name: 'organizations',
      component: () => import('../views/organizations/OrganizationsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/positions',
      name: 'positions',
      component: () => import('../views/positions/PositionsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/departments',
      name: 'departments',
      component: () => import('../views/departments/DepartmentsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/employees',
      name: 'employees',
      component: () => import('../views/employees/EmployeesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/files',
      name: 'files',
      component: () => import('../views/files/FilesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/hr-operations',
      name: 'hr-operations',
      component: () => import('../views/hr-operations/HROperationsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/change-history',
      name: 'change-history',
      component: () => import('../views/change-history/ChangeHistoryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/users/UsersView.vue'),
      meta: { requiresAuth: true, adminOnly: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const toast = useToast()

  if (!authStore.isInitialized) {
    await authStore.checkAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    toast.add({
      severity: 'warn',
      summary: 'Доступ запрещен',
      detail: 'Необходимо войти в систему',
      life: 3000
    })
    next('/login')
    return
  }

  if (to.meta.adminOnly && !authStore.isAdmin) {
    toast.add({
      severity: 'error',
      summary: 'Доступ запрещен',
      detail: 'Этот раздел доступен только администраторам',
      life: 3000
    })
    next('/')
    return
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    next('/')
    return
  }

  next()
})

export default router 