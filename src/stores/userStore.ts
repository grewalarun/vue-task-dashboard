import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userService } from '@/services/usersService'
import type { User } from '@/types'

export const useUserStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers() {
    if (users.value.length > 0) return // return cached if already fetched
    loading.value = true
    error.value = null
    try {
      const res = await userService.getAll()
      users.value = res.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch users'
    } finally {
      loading.value = false
    }
  }

  return { users, loading, error, fetchUsers }
})
