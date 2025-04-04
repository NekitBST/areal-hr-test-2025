import axios from 'axios'

const api = axios.create({
  baseURL: `http://${import.meta.env.VITE_DB_HOST}:${import.meta.env.VITE_PORT}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const organizationsApi = {
  getAll: () => api.get('/organizations'),
  getById: (id) => api.get(`/organizations/${id}`),
  create: (data) => api.post('/organizations', data),
  update: (id, data) => api.put(`/organizations/${id}`, data),
  delete: (id) => api.delete(`/organizations/${id}`)
}

export default api 