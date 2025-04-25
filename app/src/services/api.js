import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useToast } from 'primevue/usetoast'

const api = axios.create({
  baseURL: `http://${import.meta.env.VITE_DB_HOST}:${import.meta.env.VITE_PORT}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

api.interceptors.request.use(config => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data'
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    const toast = useToast()
    const authStore = useAuthStore()

    if (error.response?.status === 401) {
      authStore.clearAuth()
      if (error.config.url !== '/auth/login') {
        toast.add({
          severity: 'warn',
          summary: 'Сессия истекла',
          detail: 'Пожалуйста, войдите снова',
          life: 5000
        })
      }
    }
    return Promise.reject(error)
  }
)

export const organizationsApi = {
  getAll: () => api.get('/organizations'),
  getById: (id) => api.get(`/organizations/${id}`),
  create: (data) => api.post('/organizations', data),
  update: (id, data) => api.put(`/organizations/${id}`, data),
  delete: (id) => api.delete(`/organizations/${id}`)
}

export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
}

export const positionsApi = {
  getAll: () => api.get('/positions'),
  getById: (id) => api.get(`/positions/${id}`),
  create: (data) => api.post('/positions', data),
  update: (id, data) => api.put(`/positions/${id}`, data),
  delete: (id) => api.delete(`/positions/${id}`)
}

export const departmentsApi = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`)
}

export const employeesApi = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`)
}

export const filesApi = {
  getAll: () => api.get('/files'),
  getById: (id) => api.get(`/files/${id}`),
  create: (formData) => api.post('/files', formData),
  update: (id, data) => api.put(`/files/${id}`, data),
  delete: (id) => api.delete(`/files/${id}`)
}

export const hrOperationsApi = {
  getAll: () => api.get('/hr-operations'),
  getById: (id) => api.get(`/hr-operations/${id}`),
  create: (data) => api.post('/hr-operations', data),
  update: (id, data) => api.put(`/hr-operations/${id}`, data),
  delete: (id) => api.delete(`/hr-operations/${id}`)
}

export const changeHistoryApi = {
  getAll: () => api.get('/change-history'),
  getById: (id) => api.get(`/change-history/${id}`)
}

export default api 