import axios from 'axios'
import type { Task, CreateTaskPayload, Comment } from '@/types'

const BASE_URL = 'https://task-management-virid-omega.vercel.app'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Request interceptor — attach auth token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

export const taskService = {
  // ── Project-scoped task CRUD ─────────────────────────────────────────────
  /** GET /projects/:projectId/tasks */
  getProjectTasks: (projectId: string) =>
    api.get<Task[]>(`/projects/${projectId}/tasks`),

  /** GET /tasks/me */
  getUserTasks: () =>
    api.get<Task[]>('/tasks/me'),

  /** GET /projects/:projectId/tasks/:taskId */
  getById: (projectId: string, taskId: string) =>
    api.get<Task>(`/projects/${projectId}/tasks/${taskId}`),

  /** POST /projects/:projectId/tasks */
  create: (projectId: string, payload: CreateTaskPayload) =>
    api.post<Task>(`/projects/${projectId}/tasks`, payload),

  /** PATCH /projects/:projectId/tasks/:taskId */
  update: (projectId: string, taskId: string, payload: Partial<CreateTaskPayload>) =>
    api.patch<Task>(`/projects/${projectId}/tasks/${taskId}`, payload),

  /** DELETE /projects/:projectId/tasks/:taskId */
  delete: (projectId: string, taskId: string) =>
    api.delete(`/projects/${projectId}/tasks/${taskId}`),

  // ── Status ───────────────────────────────────────────────────────────────
  /** PATCH /:taskId/status */
  updateStatus: (taskId: string, status: Task['status']) =>
    api.patch<Task>(`/${taskId}/status`, { status }),

  // ── Comments ─────────────────────────────────────────────────────────────
  /** POST /projects/:projectId/tasks/:taskId/comments */
  addComment: (projectId: string, taskId: string, text: string) =>
    api.post<Comment>(`/projects/${projectId}/tasks/${taskId}/comments`, { text }),

  /** GET /projects/:projectId/tasks/:taskId/comments */
  getComments: (projectId: string, taskId: string) =>
    api.get<Comment[]>(`/projects/${projectId}/tasks/${taskId}/comments`),
}

