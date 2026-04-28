<template>
  <div class="max-w-2xl mx-auto">
    <!-- Back link -->
    <button
      class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 group transition-colors"
      @click="router.back()"
    >
      <svg class="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
      </svg>
      Back
    </button>

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <!-- Form Header -->
      <div class="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
        <h2 class="text-base font-semibold text-slate-900">Task Details</h2>
        <p class="text-xs text-slate-400 mt-1">Fill in all the fields to create a new task</p>
      </div>

      <!-- Success Banner -->
      <Transition name="fade">
        <div
          v-if="successMsg"
          class="mx-8 mt-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ successMsg }}
        </div>
      </Transition>

      <!-- Error Banner -->
      <Transition name="fade">
        <div
          v-if="taskStore.error"
          class="mx-8 mt-5 flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
          </svg>
          {{ taskStore.error }}
          <button class="ml-auto text-rose-400 hover:text-rose-600" @click="taskStore.clearError()">✕</button>
        </div>
      </Transition>

      <!-- Form Body -->
      <div class="px-8 py-7 space-y-5">
        <!-- Title -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Task Title <span class="text-rose-400">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="e.g. Complete API integration"
            class="w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            :class="errors.title ? 'border-rose-300 bg-rose-50' : 'border-slate-200'"
          />
          <p v-if="errors.title" class="text-xs text-rose-500">{{ errors.title }}</p>
        </div>

        <!-- Assigned To -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Assigned To <span class="text-rose-400">*</span>
          </label>
          <input
            v-model="form.assignedTo"
            type="email"
            placeholder="user@example.com"
            class="w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            :class="errors.assignedTo ? 'border-rose-300 bg-rose-50' : 'border-slate-200'"
          />
          <p v-if="errors.assignedTo" class="text-xs text-rose-500">{{ errors.assignedTo }}</p>
        </div>

        <!-- Status + Priority -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</label>
            <select
              v-model="form.status"
              class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Priority</label>
            <select
              v-model="form.priority"
              class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
             
            </select>
          </div>
        </div>

        <!-- Start Date + End Date -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Start Date <span class="text-rose-400">*</span>
            </label>
            <input
              v-model="form.startDate"
              type="date"
              class="w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              :class="errors.startDate ? 'border-rose-300 bg-rose-50' : 'border-slate-200'"
            />
            <p v-if="errors.startDate" class="text-xs text-rose-500">{{ errors.startDate }}</p>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide">End Date</label>
            <input
              v-model="form.endDate"
              type="date"
              class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        <!-- Priority Preview Badge -->
        <div class="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div class="text-xs text-slate-500">Preview:</div>
          <BadgeLabel :variant="`priority-${form.priority}`" :dot="false">{{ form.priority }}</BadgeLabel>
          <BadgeLabel :variant="`status-${form.status}`" :dot="true">{{ form.status.replace('-', ' ') }}</BadgeLabel>
        </div>
      </div>

      <!-- Form Footer -->
      <div class="px-8 py-5 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
        <button
          type="button"
          class="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          @click="resetForm"
        >
          Reset
        </button>
        <button
          type="button"
          class="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          :disabled="taskStore.loading"
          @click="submitForm"
        >
          <svg v-if="taskStore.loading" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ taskStore.loading ? 'Creating…' : 'Create Task' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import BadgeLabel from '@/components/ui/BadgeLabel.vue'
import type { TaskStatus, TaskPriority } from '@/types'

const router = useRouter()
const taskStore = useTaskStore()

const successMsg = ref('')

interface FormState {
  title: string
  assignedTo: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string
  endDate: string
}

const form = reactive<FormState>({
  title: '',
  assignedTo: '',
  status: 'todo',
  priority: 'medium',
  startDate: '',
  endDate: '',
})

const errors = reactive<Partial<Record<keyof FormState, string>>>({})

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete (errors as any)[k])

  if (!form.title.trim()) errors.title = 'Title is required'
  else if (form.title.trim().length < 3) errors.title = 'Title must be at least 3 characters'

  if (!form.assignedTo.trim()) errors.assignedTo = 'Assignee email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.assignedTo)) errors.assignedTo = 'Enter a valid email address'

  if (!form.startDate) errors.startDate = 'Start date is required'

  return Object.keys(errors).length === 0
}

// Convert date input (YYYY-MM-DD) → DDMMYYYY
function formatDateForApi(dateStr: string): string {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}${m}${y}`
}

async function submitForm() {
  taskStore.clearError()
  successMsg.value = ''

  if (!validate()) return

  const result = await taskStore.addTask({
    title: form.title.trim(),
    assignedTo: form.assignedTo.trim(),
    status: form.status,
    priority: form.priority,
    startDate: formatDateForApi(form.startDate),
    endDate: form.endDate ? formatDateForApi(form.endDate) : null,
  })

  if (result) {
    successMsg.value = `Task "${result.title}" created successfully!`
    resetForm()
    setTimeout(() => {
      router.push('/tasks')
    }, 1500)
  }
}

function resetForm() {
  form.title = ''
  form.assignedTo = ''
  form.status = 'todo'
  form.priority = 'medium'
  form.startDate = ''
  form.endDate = ''
  Object.keys(errors).forEach((k) => delete (errors as any)[k])
  taskStore.clearError()
  successMsg.value = ''
}
</script>
