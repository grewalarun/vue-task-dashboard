import { apiClient } from '@/services/apiClient'
import type { AuthUser } from '@/types'

export interface UpdateProfilePayload {
    name: string
}

export interface ChangePasswordPayload {
    currentPassword: string
    newPassword: string
}

export const settingsService = {
    updateProfile: (payload: UpdateProfilePayload) =>
        apiClient.patch<AuthUser>('/users/profile', payload),

    changePassword: (payload: ChangePasswordPayload) =>
        apiClient.patch('/users/change-password', payload),
}