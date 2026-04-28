<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center px-4 py-12">

    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-100/40"></div>
      <div class="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-slate-200/50"></div>
    </div>

    <div class="relative w-full max-w-md">

      <!-- Logo -->
      <div class="flex items-center justify-center gap-3 mb-8">
        <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 5h14M2 9h9M2 13h6" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="text-2xl font-bold text-slate-900 tracking-tight">TaskFlow</span>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">

        <!-- Mode Tabs -->
        <div class="flex border-b border-slate-100">
          <button
            class="flex-1 py-4 text-sm font-semibold transition-colors relative"
            :class="mode === 'login'
              ? 'text-blue-600 bg-blue-50/50'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'"
            @click="switchMode('login')"
          >
            Sign in
            <span
              v-if="mode === 'login'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
            />
          </button>
          <button
            class="flex-1 py-4 text-sm font-semibold transition-colors relative"
            :class="mode === 'register'
              ? 'text-blue-600 bg-blue-50/50'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'"
            @click="switchMode('register')"
          >
            Create account
            <span
              v-if="mode === 'register'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
            />
          </button>
        </div>

        <div class="px-8 py-7">

          <!-- Header text -->
          <div class="mb-6">
            <h1 class="text-lg font-bold text-slate-900">
              {{ mode === 'login' ? 'Welcome back' : 'Create your account' }}
            </h1>
            <p class="text-sm text-slate-400 mt-1">
              {{ mode === 'login'
                ? 'Sign in to continue to your dashboard'
                : 'Get started with TaskFlow for free' }}
            </p>
          </div>

          <!-- Error banner -->
          <Transition name="fade">
            <div
              v-if="authStore.error"
              class="flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl mb-5"
            >
              <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
              </svg>
              <span>{{ authStore.error }}</span>
              <button class="ml-auto text-rose-400 hover:text-rose-600 flex-shrink-0" @click="authStore.clearError()">✕</button>
            </div>
          </Transition>

          <!-- Form -->
          <form class="space-y-4" @submit.prevent="handleSubmit">

            <!-- Name (register only) -->
            <Transition name="slide-down">
              <div v-if="mode === 'register'" class="space-y-1.5">
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Full Name <span class="text-rose-400">*</span>
                </label>
                <div class="relative">
                  <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                    </svg>
                  </div>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="John Doe"
                    autocomplete="name"
                    class="w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl bg-white text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    :class="errors.name ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'"
                  />
                </div>
                <p v-if="errors.name" class="text-xs text-rose-500 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                  {{ errors.name }}
                </p>
              </div>
            </Transition>

            <!-- Email -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Email address <span class="text-rose-400">*</span>
              </label>
              <div class="relative">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                  </svg>
                </div>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                  class="w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl bg-white text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  :class="errors.email ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'"
                />
              </div>
              <p v-if="errors.email" class="text-xs text-rose-500 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                {{ errors.email }}
              </p>
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Password <span class="text-rose-400">*</span>
              </label>
              <div class="relative">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                  </svg>
                </div>
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="mode === 'login' ? '••••••••' : 'Min. 6 characters'"
                  :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
                  class="w-full pl-10 pr-12 py-2.5 text-sm border rounded-xl bg-white text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  :class="errors.password ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'"
                />
                <button
                  type="button"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="text-xs text-rose-500 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                {{ errors.password }}
              </p>
            </div>

            <!-- Confirm password (register only) -->
            <Transition name="slide-down">
              <div v-if="mode === 'register'" class="space-y-1.5">
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Confirm Password <span class="text-rose-400">*</span>
                </label>
                <div class="relative">
                  <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <input
                    v-model="form.confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Repeat your password"
                    autocomplete="new-password"
                    class="w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl bg-white text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    :class="errors.confirmPassword ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'"
                  />
                </div>
                <p v-if="errors.confirmPassword" class="text-xs text-rose-500 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                  {{ errors.confirmPassword }}
                </p>
              </div>
            </Transition>

            <!-- Submit button -->
            <button
              type="submit"
              class="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-sm"
              :disabled="authStore.loading"
            >
              <svg v-if="authStore.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <template v-else>
                <svg v-if="mode === 'login'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/>
                </svg>
              </template>
              {{ authStore.loading
                ? (mode === 'login' ? 'Signing in…' : 'Creating account…')
                : (mode === 'login' ? 'Sign in' : 'Create account') }}
            </button>
          </form>
        </div>

        <!-- Footer switch -->
        <div class="px-8 py-4 border-t border-slate-100 bg-slate-50/50 text-center">
          <p class="text-sm text-slate-500">
            {{ mode === 'login' ? "Don't have an account?" : 'Already have an account?' }}
            <button
              class="font-semibold text-blue-600 hover:text-blue-700 ml-1 transition-colors"
              @click="switchMode(mode === 'login' ? 'register' : 'login')"
            >
              {{ mode === 'login' ? 'Sign up' : 'Sign in' }}
            </button>
          </p>
        </div>
      </div>

      <!-- Footer text -->
      <p class="text-center text-xs text-slate-400 mt-6">
        TaskFlow — Smart Project Management Dashboard
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

type Mode = 'login' | 'register'
const mode = ref<Mode>('login')
const showPassword = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive<{
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}>({})

function switchMode(m: Mode) {
  mode.value = m
  // Reset form and errors
  form.name = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  delete errors.name
  delete errors.email
  delete errors.password
  delete errors.confirmPassword
  authStore.clearError()
  showPassword.value = false
}

function validate(): boolean {
  delete errors.name
  delete errors.email
  delete errors.password
  delete errors.confirmPassword

  if (mode.value === 'register') {
    if (!form.name.trim()) errors.name = 'Name is required'
    else if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters'
  }

  if (!form.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address'

  if (!form.password) errors.password = 'Password is required'
  else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters'

  if (mode.value === 'register') {
    if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password'
    else if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match'
  }

  return !errors.name && !errors.email && !errors.password && !errors.confirmPassword
}

async function handleSubmit() {
  authStore.clearError()
  if (!validate()) return

  let success = false

  if (mode.value === 'login') {
    success = await authStore.login({
      email: form.email.trim(),
      password: form.password,
    })
  } else {
    success = await authStore.register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    })
  }

  if (success) {
    router.push('/')
  }
}
</script>

<style scoped>
.slide-down-enter-active { transition: all 0.2s ease; }
.slide-down-leave-active { transition: all 0.15s ease; }
.slide-down-enter-from  { opacity: 0; transform: translateY(-6px); }
.slide-down-leave-to    { opacity: 0; transform: translateY(-4px); }
</style>
