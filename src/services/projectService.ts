import axios from 'axios'
import type { Projects, Task, CreateTaskPayload } from '@/types'

const BASE_URL = 'https://task-management-virid-omega.vercel.app'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tf_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor for error handling
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

export const projectService = {
  getAll: () => api.get<Projects[]>('/projects'),
  // getById: (id: string) => api.get<Projects>(`/tasks/${id}`),
  // create: (payload: CreateTaskPayload) => api.post<Projects>('/tasks', payload),
  // update: (id: string, payload: Partial<CreateTaskPayload>) => api.put<Projects>(`/tasks/${id}`, payload),
  // delete: (id: string) => api.delete(`/tasks/${id}`),
}
