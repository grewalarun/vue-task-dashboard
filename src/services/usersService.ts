import axios from 'axios'
import type { User, Task, CreateTaskPayload, UpdateRolePayload } from '@/types'
import { apiClient } from './apiClient'

export const userService = {
  getAll: () => apiClient.get<User[]>('/users'),

  updateRole: (userId: string, payload: UpdateRolePayload) =>
    apiClient.patch<User>(`/users/${userId}/role`, payload),
}