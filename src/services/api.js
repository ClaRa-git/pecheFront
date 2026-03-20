import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: 'http://localhost:8088',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor request — injecte le token JWT automatiquement
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor response — gère les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    // Token expiré ou invalide → déconnexion automatique
    if (status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

// ----------------------------------------------------------------
// Auth
// ----------------------------------------------------------------
export const authService = {
  login: (email, password) =>
    api.post('/api/auth/login', { username: email, password }),

  register: (data) =>
    api.post('/api/auth/register', data),

  getProfile: () =>
    api.get('/api/profile'),

  updateProfile: (data) =>
    api.put('/api/profile', data),
}

// ----------------------------------------------------------------
// Produits
// ----------------------------------------------------------------
export const productService = {
  getAll: (params) =>
    api.get('/api/products', { params }),

  getOne: (id) =>
    api.get(`/api/products/${id}`),

  getCategories: () =>
    api.get('/api/categories'),

  create: (data) =>
    api.post('/api/products', data),

  update: (id, data) =>
    api.put(`/api/products/${id}`, data),

  delete: (id) =>
    api.delete(`/api/products/${id}`),
}

// ----------------------------------------------------------------
// Commandes
// ----------------------------------------------------------------
export const orderService = {
  getAll: () =>
    api.get('/api/orders'),

  getOne: (id) =>
    api.get(`/api/orders/${id}`),

  create: (data) =>
    api.post('/api/orders', data),

  checkout: (orderId) =>
    api.post('/api/payments/checkout', { orderId }),
}

// ----------------------------------------------------------------
// Permis de pêche
// ----------------------------------------------------------------
export const permitService = {
  getAll: () =>
    api.get('/api/permits'),

  create: (data) =>
    api.post('/api/permits', data),
}

// ----------------------------------------------------------------
// Concours
// ----------------------------------------------------------------
export const contestService = {
  getAll: () =>
    api.get('/api/contests'),

  register: (contestId) =>
    api.post(`/api/contests/${contestId}/register`),

  getMyRegistrations: () =>
    api.get('/api/contests/my-registrations'),
}

// ----------------------------------------------------------------
// Admin
// ----------------------------------------------------------------
export const adminService = {
  getStats: () =>
    api.get('/api/admin/stats'),

  getUsers: () =>
    api.get('/api/admin/users'),

  getOrders: (params) =>
    api.get('/api/admin/orders', { params }),

  updateOrderStatus: (id, status) =>
    api.put(`/api/admin/orders/${id}/status`, { status }),

  getPermits: () =>
    api.get('/api/admin/permits'),

  updatePermitStatus: (id, status, rejectionReason) =>
    api.put(`/api/admin/permits/${id}/status`, { status, rejectionReason }),

  getContests: () =>
    api.get('/api/admin/contests'),

  createContest: (data) =>
    api.post('/api/admin/contests', data),

  updateContest: (id, data) =>
    api.put(`/api/admin/contests/${id}`, data),
}

export default api