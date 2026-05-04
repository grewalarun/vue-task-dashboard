<template>
  <div class="max-w-7xl mx-auto space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Settings</h1>
      <p class="text-sm text-slate-500 mt-1">Manage your account and workspace preferences.</p>
    </div>

    <!-- Profile Section -->
    <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Profile</h3>
      
      <div class="flex items-start gap-6">
        <!-- Avatar -->
        <div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-bold flex-shrink-0">
          {{ userInitials }}
        </div>

        <!-- Form -->
        <div class="flex-1">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-500">Full Name</label>
              <input 
                v-model="profileForm.name" 
                type="text" 
                class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-slate-50/50" 
              />
            </div>
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-500">Email</label>
              <input 
                v-model="profileForm.email" 
                type="email" 
                readonly
                class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none bg-slate-50/50 text-slate-500 cursor-not-allowed" 
              />
            </div>
          </div>
          <button 
            @click="handleProfileUpdate"
            :disabled="profileUpdating"
            class="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center disabled:opacity-50"
          >
            <span v-if="profileUpdating" class="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Save Changes
          </button>
          <p v-if="profileMessage" class="text-xs mt-2 text-emerald-600">{{ profileMessage }}</p>
          <p v-if="profileError" class="text-xs mt-2 text-rose-500">{{ profileError }}</p>
        </div>
      </div>
    </div>

    <!-- Change Password Section -->
    <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Change Password</h3>
      
      <div class="space-y-4 max-w-md">
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-slate-500">Current Password</label>
          <input 
            v-model="passwordForm.currentPassword" 
            type="password" 
            placeholder="••••••••"
            class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-slate-50/50" 
          />
        </div>
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-slate-500">New Password</label>
          <input 
            v-model="passwordForm.newPassword" 
            type="password" 
            placeholder="••••••••"
            class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-slate-50/50" 
          />
        </div>
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-slate-500">Confirm New Password</label>
          <input 
            v-model="passwordForm.confirmPassword" 
            type="password" 
            placeholder="••••••••"
            class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-slate-50/50" 
          />
        </div>
        
        <div class="pt-2">
          <button 
            @click="handlePasswordUpdate"
            :disabled="passwordUpdating"
            class="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center disabled:opacity-50"
          >
            <span v-if="passwordUpdating" class="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Change Password
          </button>
          <p v-if="passwordMessage" class="text-xs mt-2 text-emerald-600">{{ passwordMessage }}</p>
          <p v-if="passwordError" class="text-xs mt-2 text-rose-500">{{ passwordError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { settingsService } from '@/services/settingsService'

const authStore = useAuthStore()

const profileUpdating = ref(false)
const profileMessage = ref('')
const profileError = ref('')

const passwordUpdating = ref(false)
const passwordMessage = ref('')
const passwordError = ref('')

const profileForm = reactive({
  name: '',
  email: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const userInitials = computed(() => {
  const name = authStore.user?.name ?? ''
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U'
})

onMounted(() => {
  if (authStore.user) {
    profileForm.name = authStore.user.name
    profileForm.email = authStore.user.email
  }
})

async function handleProfileUpdate() {
  profileError.value = ''
  profileMessage.value = ''
  
  if (!profileForm.name.trim()) {
    profileError.value = 'Name cannot be empty'
    return
  }

  profileUpdating.value = true
  try {
    const res = await settingsService.updateProfile({ name: profileForm.name })
    
    // Update local store user
    if (authStore.user && authStore.token) {
      const updatedUser = { ...authStore.user, name: profileForm.name }
      authStore.persist(authStore.token, updatedUser)
    }
    
    profileMessage.value = 'Profile updated successfully'
    setTimeout(() => { profileMessage.value = '' }, 3000)
  } catch (err: any) {
    profileError.value = err.message || 'Failed to update profile'
  } finally {
    profileUpdating.value = false
  }
}

async function handlePasswordUpdate() {
  passwordError.value = ''
  passwordMessage.value = ''

  if (!passwordForm.currentPassword) {
    passwordError.value = 'Current password is required'
    return
  }
  if (!passwordForm.newPassword) {
    passwordError.value = 'New password is required'
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'New passwords do not match'
    return
  }

  passwordUpdating.value = true
  try {
    await settingsService.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
    
    passwordMessage.value = 'Password changed successfully'
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    setTimeout(() => { passwordMessage.value = '' }, 3000)
  } catch (err: any) {
    passwordError.value = err.message || 'Failed to change password'
  } finally {
    passwordUpdating.value = false
  }
}
</script>