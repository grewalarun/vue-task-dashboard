import axios from 'axios'
import type { Task, CreateTaskPayload, Comment } from '@/types'
import { apiClient } from './apiClient'



export const taskService = {
  // ── Project-scoped task CRUD ─────────────────────────────────────────────
  /** GET /projects/:projectId/tasks */
  getProjectTasks: (projectId: string) =>
    apiClient.get<Task[]>(`/projects/${projectId}/tasks`),

  /** GET /tasks/me */
  getUserTasks: () =>
    apiClient.get<Task[]>('/tasks/me'),

  /** GET /projects/:projectId/tasks/:taskId */
  getById: (projectId: string, taskId: string) =>
    apiClient.get<Task>(`/projects/${projectId}/tasks/${taskId}`),

  /** POST /projects/:projectId/tasks */
  create: (projectId: string, payload: CreateTaskPayload) =>
    apiClient.post<Task>(`/projects/${projectId}/tasks`, payload),

  /** PATCH /projects/:projectId/tasks/:taskId */
  update: (projectId: string, taskId: string, payload: Partial<CreateTaskPayload>) =>
    apiClient.patch<Task>(`/projects/${projectId}/tasks/${taskId}`, payload),

  /** DELETE /projects/:projectId/tasks/:taskId */
  delete: (projectId: string, taskId: string) =>
    apiClient.delete(`/projects/${projectId}/tasks/${taskId}`),

  // ── Status ───────────────────────────────────────────────────────────────
  /** PATCH /:taskId/status */
  updateStatus: (taskId: string, status: Task['status']) =>
    apiClient.patch<Task>(`/${taskId}/status`, { status }),

  // ── Comments ─────────────────────────────────────────────────────────────
  /** POST /projects/:projectId/tasks/:taskId/comments */
  addComment: (projectId: string, taskId: string, text: string) =>
    apiClient.post<Comment>(`/projects/${projectId}/tasks/${taskId}/comments`, { text }),

  /** GET /projects/:projectId/tasks/:taskId/comments */
  getComments: (projectId: string, taskId: string) =>
    apiClient.get<Comment[]>(`/projects/${projectId}/tasks/${taskId}/comments`),
}

