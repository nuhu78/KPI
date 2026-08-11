import axios from 'axios'

export const TOKEN_KEY = 'kpi_token'
export const ROLE_KEY = 'kpi_role'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

export function getImageUrl(path) {
  if (!path) return null
  if (/^https?:\/\//.test(path)) return path
  const base = import.meta.env.VITE_API_URL || ''
  return `${base}${path}`
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(ROLE_KEY)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  },
)

export function getErrorMessage(err) {
  const data = err.response?.data
  if (data?.message) {
    return Array.isArray(data.message) ? data.message.join(', ') : data.message
  }
  return 'Something went wrong. Please try again.'
}
