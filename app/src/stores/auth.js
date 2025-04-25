import { defineStore } from 'pinia'
import api from '../services/api'
import router from '../router'
import { useToast } from 'primevue/usetoast'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isInitialized: false,
    lastActivity: Date.now()
  }),

  getters: {
    isAdmin: (state) => state.user?.role_name === 'Администратор',
    isManager: (state) => state.user?.role_name === 'Менеджер по персоналу',
    fullName: (state) => state.user ? `${state.user.last_name} ${state.user.first_name}` : ''
  },

  actions: {
    updateLastActivity() {
      this.lastActivity = Date.now()
    },

    async checkAuth() {
      try {
        const response = await api.get('/auth/check')
        this.user = response.data
        this.isAuthenticated = true
        this.updateLastActivity()
      } catch (error) {
        this.user = null
        this.isAuthenticated = false
        if (router.currentRoute.value.meta.requiresAuth) {
          const toast = useToast()
          if (error.response?.status === 401) {
            toast.add({
              severity: 'warn',
              summary: 'Сессия истекла',
              detail: 'Пожалуйста, войдите снова',
              life: 5000
            })
          }
          router.push('/login')
        }
      } finally {
        this.isInitialized = true
      }
    },

    async login(credentials) {
      try {
        const response = await api.post('/auth/login', credentials)
        this.user = response.data
        this.isAuthenticated = true
        this.updateLastActivity()
        router.push('/')
        return true
      } catch (error) {
        console.error('Login error:', error)
        return false
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.isAuthenticated = false
        router.push('/login')
      }
    },

    clearAuth() {
      this.user = null
      this.isAuthenticated = false
      this.updateLastActivity()
    }
  }
}) 