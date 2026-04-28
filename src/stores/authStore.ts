import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types'

const TOKEN_KEY = 'tf_token'
const USER_KEY  = 'tf_user'

export const useAuthStore = defineStore('auth', () => {
  // ─── State ──────────────────────────────────────────────────────────────
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user  = ref<AuthUser | null>(
    (() => {
      try { return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null') }
      catch { return null }
    })()
  )
  const loading = ref(false)
  const error   = ref<string | null>(null)

  // ─── Getters ────────────────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // ─── Helpers ────────────────────────────────────────────────────────────
  function persist(t: string, u: AuthUser) {
    token.value = t
    user.value  = u
    localStorage.setItem(TOKEN_KEY, t)
    localStorage.setItem(USER_KEY, JSON.stringify(u))
  }

  function clearSession() {
    token.value = null
    user.value  = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  // ─── Actions ────────────────────────────────────────────────────────────
  async function login(payload: LoginPayload): Promise<boolean> {
    loading.value = true
    error.value   = null
    try {
      const res = await authService.login(payload)
      const raw = res.data as any
      // Handle: { token, user } | { data: { token, user } } | { token, data: user }
      const t = raw?.token ?? raw?.data?.token ?? raw?.accessToken
      const u = raw?.user  ?? raw?.data?.user  ?? raw?.data
      if (!t) throw new Error('Invalid response — no token received')
      persist(t, u)
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterPayload): Promise<boolean> {
    loading.value = true
    error.value   = null
    try {
      const res = await authService.register(payload)
      const raw = res.data as any
      const t = raw?.token ?? raw?.data?.token ?? raw?.accessToken
      const u = raw?.user  ?? raw?.data?.user  ?? raw?.data
      if (!t) throw new Error('Registration succeeded but no token received — please log in.')
      persist(t, u)
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    clearSession()
  }

  function clearError() {
    error.value = null
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
  }
})
