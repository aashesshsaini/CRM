import axios from 'axios'
import { API_BASE_URL } from '../config/constants.js'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s for scraper
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for global error normalization
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default apiClient
