<template>
  <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button class="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" @click="$emit('toggle-sidebar')">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div>
          <h1 class="text-lg font-semibold text-slate-900">{{ pageTitle }}</h1>
          <p class="text-xs text-slate-400 mt-0.5">{{ pageSubtitle }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <!-- Syncing indicator -->
        <div v-if="taskStore.loading" class="flex items-center gap-2 text-xs text-slate-400">
          <svg class="w-3.5 h-3.5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Syncing…
        </div>

        <!-- Greeting -->
        <span class="text-xs text-slate-400 hidden sm:block">
          Hello, <span class="font-medium text-slate-600">{{ firstName }}</span>
        </span>

        <!-- Add Project CTA (Admin only) -->
        <button
          v-if="isAdmin"
          @click="showProjectModal = true"
          class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Add Project
        </button>

        <!-- New Task CTA -->
        <RouterLink
          to="/tasks/new"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          New Task
        </RouterLink>
      </div>
    </div>

    <!-- Modals -->
    <ProjectCreateModal v-if="showProjectModal" @close="showProjectModal = false" />
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import ProjectCreateModal from '@/components/ProjectCreateModal.vue'

defineEmits(['toggle-sidebar'])

const route     = useRoute()
const taskStore = useTaskStore()
const authStore = useAuthStore()

const showProjectModal = ref(false)

const isAdmin = computed(() => {
  const user = authStore.user || JSON.parse(localStorage.getItem('tf_user') || '{}')
  return user?.role === 'admin'
})

const firstName = computed(() => {
  const name = authStore.user?.name ?? ''
  return name.split(' ')[0] || 'there'
})

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    '/': 'Dashboard',
    '/tasks': 'All Tasks',
    '/tasks/new': 'Add New Task',
  }
  return map[route.path] ?? 'TaskFlow'
})

const pageSubtitle = computed(() => {
  const map: Record<string, string> = {
    '/': 'projects',
    '/tasks': 'Browse and manage all tasks',
    '/tasks/new': 'Fill in details to create a task',
  }
  return map[route.path] ?? ''
})
</script>
