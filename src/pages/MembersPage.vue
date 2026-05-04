<template>
  <div class="max-w-7xl mx-auto space-y-8">

    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Manage Members</h1>
      <p class="text-sm text-slate-500 mt-1">View all workspace members and manage their roles.</p>
    </div>

    <!-- Error banner -->
    <Transition name="fade">
      <div
        v-if="userStore.error"
        class="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl"
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
        </svg>
        {{ userStore.error }}
        <button class="ml-auto text-rose-400 hover:text-rose-600 transition-colors" @click="userStore.clearError()">✕</button>
      </div>
    </Transition>

    <!-- Role Permissions Card -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6">
      <div class="flex items-center gap-2 mb-5">
        <svg class="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
        </svg>
        <span class="text-xs font-bold text-slate-700 uppercase tracking-widest">Role Permissions</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Admin -->
        <div class="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-600 border border-rose-200 mb-3">
            Admin
          </span>
          <p class="text-sm text-slate-600 leading-relaxed">
            Full access to manage workspace and members. Create Project and Tasks
          </p>
        </div>

        <!-- Manager -->
        <div class="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-600 border border-violet-200 mb-3">
            Manager
          </span>
          <p class="text-sm text-slate-600 leading-relaxed">
            Can manage projects and tasks.
          </p>
        </div>

        <!-- Member -->
        <div class="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600 border border-emerald-200 mb-3">
            Member
          </span>
          <p class="text-sm text-slate-600 leading-relaxed">
            Can create task and work on assigned tasks.
          </p>
        </div>
      </div>
    </div>

    <!-- All Members section -->
    <div>
      <!-- Section header -->
      <div class="flex items-center gap-2 mb-4">
        <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
        </svg>
        <span class="text-xs font-bold text-slate-700 uppercase tracking-widest">
          All Members
          <span v-if="!userStore.loading" class="text-slate-400">({{ userStore.members.length }})</span>
        </span>
      </div>

      <!-- Loading skeleton -->
      <div v-if="userStore.loading" class="space-y-2">
        <div
          v-for="i in 5"
          :key="i"
          class="bg-white border border-slate-100 rounded-xl px-5 py-4 flex items-center gap-4 animate-pulse"
        >
          <div class="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3.5 bg-slate-100 rounded w-32"></div>
            <div class="h-3 bg-slate-100 rounded w-40"></div>
          </div>
          <div class="h-6 w-16 bg-slate-100 rounded-full"></div>
          <div class="h-9 w-32 bg-slate-100 rounded-lg hidden sm:block"></div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="userStore.members.length === 0"
        class="bg-white border border-slate-100 rounded-xl p-12 text-center"
      >
        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
          </svg>
        </div>
        <p class="text-sm text-slate-400">No members found.</p>
      </div>

      <!-- Member list -->
      <div v-else class="space-y-2">
        <div
          v-for="member in userStore.members"
          :key="member._id"
          class="bg-white border border-slate-100 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-slate-200 hover:shadow-sm transition-all duration-150"
        >
          <!-- Avatar -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            :class="avatarClass(member.role)"
          >
            {{ getInitials(member.name) }}
          </div>

          <!-- Name + email -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-800 truncate">{{ member.name }}</p>
            <p class="text-xs text-slate-400 truncate font-mono">{{ member.email }}</p>
          </div>

          <!-- Role badge -->
          <div class="flex-shrink-0">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
              :class="roleBadgeClass(member.role)"
            >
              {{ capitalize(member.role) }}
            </span>
          </div>

          <!-- Role dropdown (hidden for admin — admin can't be changed) -->
          <div class="flex-shrink-0 hidden sm:block">
            <div v-if="member.role === 'admin'" class="w-36"></div>
            <div v-else class="relative">
              <select
                :value="member.role"
                :disabled="userStore.updatingRoleId === member._id"
                class="w-36 appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                @change="handleRoleChange(member._id, ($event.target as HTMLSelectElement).value as MemberRole)"
              >
                <option value="manager">Manager</option>
                <option value="member">Member</option>
              </select>
              <!-- Custom chevron -->
              <div class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                <svg
                  v-if="userStore.updatingRoleId === member._id"
                  class="w-3.5 h-3.5 text-slate-400 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <svg v-else class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Mobile role dropdown (shown only on small screens, not for admin) -->
          <div v-if="member.role !== 'admin'" class="flex-shrink-0 sm:hidden">
            <select
              :value="member.role"
              :disabled="userStore.updatingRoleId === member._id"
              class="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none disabled:opacity-50"
              @change="handleRoleChange(member._id, ($event.target as HTMLSelectElement).value as MemberRole)"
            >
              <option value="manager">Manager</option>
              <option value="member">Member</option>
            </select>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { MemberRole } from '@/types'

const userStore = useUserStore()

onMounted(() => {
  userStore.fetchUsers()
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function avatarClass(role: MemberRole): string {
  const map: Record<MemberRole, string> = {
    admin:   'bg-rose-100 text-rose-600',
    manager: 'bg-violet-100 text-violet-600',
    member:  'bg-emerald-100 text-emerald-700',
  }
  return map[role] ?? 'bg-slate-100 text-slate-600'
}

function roleBadgeClass(role: MemberRole): string {
  const map: Record<MemberRole, string> = {
    admin:   'bg-rose-100 text-rose-600',
    manager: 'bg-violet-100 text-violet-600',
    member:  'bg-emerald-100 text-emerald-700',
  }
  return map[role] ?? 'bg-slate-100 text-slate-600'
}

// ── Actions ───────────────────────────────────────────────────────────────────
async function handleRoleChange(userId: string, role: MemberRole) {
  await userStore.updateRole(userId, role)
}
</script>
