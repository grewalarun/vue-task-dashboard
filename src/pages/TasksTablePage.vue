<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <p class="text-sm text-slate-500">
        Hover any row to reveal <strong class="font-medium text-slate-700">Edit</strong> and
        <strong class="font-medium text-slate-700">Delete</strong> actions on the last column.
      </p>
      <RouterLink
        to="/tasks/new"
        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        Add Task
      </RouterLink>
    </div>

    <Transition name="fade">
      <div
        v-if="taskStore.error"
        class="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl"
      >
        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
        </svg>
        {{ taskStore.error }}
        <button class="ml-auto text-rose-400 hover:text-rose-600" @click="taskStore.clearError()">✕</button>
      </div>
    </Transition>

    <div v-if="taskStore.loading && taskStore.tasks.length === 0" class="bg-white rounded-xl border border-slate-100 shadow-sm p-10 text-center">
      <svg class="w-6 h-6 animate-spin text-blue-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <p class="text-sm text-slate-400">Loading tasks…</p>
    </div>

    <DataTable v-else :data="taskStore.userTasks" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import DataTable from '@/components/table/DataTable.vue'

const taskStore = useTaskStore()
onMounted(() => { if (taskStore.userTasks.length === 0) taskStore.fetchUserTasks() })
</script>
