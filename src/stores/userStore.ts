import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userService } from '@/services/usersService'
import type { Member, MemberRole } from '@/types'

function extractMembers(raw: any): Member[] {
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw?.data)) return raw.data
  if (Array.isArray(raw?.users)) return raw.users
  if (Array.isArray(raw?.members)) return raw.members
  if (Array.isArray(raw?.data?.users)) return raw.data.users
  console.warn('[UserStore] Unexpected shape:', raw)
  return []
}

export const useUserStore = defineStore('users', () => {
  // ─── State ─────────────────────────────────────────────────────────────────
  const members = ref<Member[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  // track which userId is currently being role-updated
  const updatingRoleId = ref<string | null>(null)

  // ─── Actions ────────────────────────────────────────────────────────────────
  async function fetchUsers() {
    loading.value = true
    error.value = null
    try {
      const res = await userService.getAll()
      members.value = extractMembers(res.data)
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function updateRole(userId: string, role: MemberRole): Promise<boolean> {
    updatingRoleId.value = userId
    error.value = null
    try {
      await userService.updateRole(userId, { role })
      // optimistic update
      const idx = members.value.findIndex(m => m._id === userId)
      if (idx !== -1) members.value[idx] = { ...members.value[idx], role }
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      updatingRoleId.value = null
    }
  }

  function clearError() { error.value = null }

  return {
    members,
    loading,
    error,
    updatingRoleId,
    fetchUsers,
    updateRole,
    clearError,
  }
})
