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
    },
    {
      path: '/departments',
      name: 'departments',
      component: () => import('../views/departments/DepartmentsView.vue')
    },
    {
      path: '/employees',
      name: 'employees',
      component: () => import('../views/employees/EmployeesView.vue')
    },
    {
      path: '/files',
      name: 'files',
      component: () => import('../views/files/FilesView.vue')
    },
    {
      path: '/hr-operations',
      name: 'hr-operations',
      component: () => import('../views/hr-operations/HROperationsView.vue')
    },
    {
      path: '/change-history',
      name: 'change-history',
      component: () => import('../views/change-history/ChangeHistoryView.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/users/UsersView.vue')
    }
  ]
})

export default router 