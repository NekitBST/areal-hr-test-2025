import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import router from '../router'

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
    const authStore = useAuthStore()

    if (error.response?.status === 401) {
      authStore.clearAuth()
      if (error.config.url !== '/auth/login') {
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)

export const organizationsApi = {
  getAll: (params = {}) => api.get('/organizations', { params }),
  getById: (id) => api.get(`/organizations/${id}`),
  create: (data) => api.post('/organizations', data),
  update: (id, data) => api.put(`/organizations/${id}`, data),
  delete: (id) => api.delete(`/organizations/${id}`)
}

export const usersApi = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
}

export const positionsApi = {
  getAll: (params = {}) => api.get('/positions', { params }),
  getById: (id) => api.get(`/positions/${id}`),
  create: (data) => api.post('/positions', data),
  update: (id, data) => api.put(`/positions/${id}`, data),
  delete: (id) => api.delete(`/positions/${id}`)
}

export const departmentsApi = {
  getAll: (params = {}) => api.get('/departments', { params }),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`)
}

export const employeesApi = {
  getAll: (params = {}) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`)
}

export const filesApi = {
  getAll: (params = {}) => api.get('/files', { params }),
  getById: (id) => api.get(`/files/${id}`),
  create: (formData) => api.post('/files', formData),
  update: (id, data) => api.put(`/files/${id}`, data),
  delete: (id) => api.delete(`/files/${id}`)
}

export const hrOperationsApi = {
  getAll: (params = {}) => api.get('/hr-operations', { params }),
  getById: (id) => api.get(`/hr-operations/${id}`),
  create: (data) => api.post('/hr-operations', data),
  update: (id, data) => api.put(`/hr-operations/${id}`, data),
  delete: (id) => api.delete(`/hr-operations/${id}`)
}

export const changeHistoryApi = {
  getAll: (params = {}) => api.get('/change-history', { params }),
  getById: (id) => api.get(`/change-history/${id}`)
}

export default api 