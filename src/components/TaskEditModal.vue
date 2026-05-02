<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="task"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
        @click.self="close"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
            <h3 class="text-sm font-semibold text-slate-900">Edit Task</h3>
            <button class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors" @click="close">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="px-6 py-5 space-y-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</label>
              <input v-model="editForm.title" type="text" class="w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" :class="editErrors.title ? 'border-rose-300' : 'border-slate-200'" />
              <p v-if="editErrors.title" class="text-xs text-rose-500">{{ editErrors.title }}</p>
            </div>
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
              <textarea v-model="editForm.description" rows="4" class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"></textarea>
            </div>
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Assigned To</label>
              <select v-model="editForm.assignedTo._id" class="w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" :class="editErrors.assignedTo ? 'border-rose-300' : 'border-slate-200'">
                <option value="" disabled>Select User</option>
                <option v-for="user in projectMembers" :key="user._id" :value="user._id">
                  {{ user.name }} ({{ user.email }})
                </option>
              </select>
              <p v-if="editErrors.assignedTo" class="text-xs text-rose-500">{{ editErrors.assignedTo }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</label>
                <select v-model="editForm.status" class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all">
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Priority</label>
                <select v-model="editForm.priority" class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Start Date</label>
                <input v-model="editForm.startDate" type="date" disabled class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed focus:outline-none transition-all" />
              </div>
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">End Date</label>
                <input v-model="editForm.endDate" type="date" class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
            <div v-if="editError" class="flex items-center gap-1.5 mb-3 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
              {{ editError }}
            </div>
            <div class="flex justify-end gap-3">
              <button class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" @click="close">Cancel</button>
              <button
                class="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                :disabled="saving"
                @click="saveEdit"
              >
                <svg v-if="saving" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                {{ saving ? 'Saving…' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { useProjectStore } from '@/stores/projectStore'
import type { Task, TaskStatus, TaskPriority } from '@/types'

const props = defineProps<{ task: Task | null, projectId?: string }>()
const emit = defineEmits(['close'])
const route = useRoute()

const taskStore = useTaskStore()
const projectStore = useProjectStore()

const resolvedProjectId = computed(() => {
  if (props.projectId) return props.projectId
  if (route.params.projectId) return route.params.projectId as string
  if (route.params.id) return route.params.id as string
  if (!props.task) return ''
  return typeof props.task.project === 'object' ? (props.task.project as any)._id : props.task.project
})

const projectMembers = computed(() => {
  if (!props.task) return []
  return projectStore.projects.find(p => p._id === resolvedProjectId.value)?.members || []
})

onMounted(() => {
  if (projectStore.projects.length === 0) {
    projectStore.fetchProjects()
  }
})

const saving = ref(false)
const editError = ref('')
const editForm = reactive({
  title: '',
  description: '',
  assignedTo: {name:'',_id:'',email:''},
  status: 'todo' as TaskStatus,
  priority: 'low' as TaskPriority,
  startDate: '',
  endDate: '',
})
const editErrors = reactive<{ title?: string; assignedTo?: string }>({})

function apiToInput(raw: string | null): string {
  if (!raw) return ''
  if (raw.length === 8) return `${raw.slice(4)}-${raw.slice(2, 4)}-${raw.slice(0, 2)}`
  return raw.split('T')[0]
}

function inputToApi(s: string): string {
  if (!s) return ''
  const parts = s.split('-')
  if (parts.length === 3) {
    const [y, m, d] = parts
    return `${d}${m}${y}`
  }
  return s
}

watch(() => props.task, (newTask) => {
  if (newTask) {
    editForm.title = newTask.title
    editForm.description = newTask.description ?? ''
    editForm.assignedTo = newTask.assignedTo ? { ...newTask.assignedTo } : {name:'',_id:'',email:''}
    editForm.status = newTask.status
    editForm.priority = newTask.priority
    editForm.startDate = apiToInput(newTask.createdAt ?? null)
    editForm.endDate = apiToInput(newTask.dueDate ?? null)
    delete editErrors.title
    delete editErrors.assignedTo
    editError.value = ''
  }
}, { immediate: true })

function close() {
  emit('close')
}

function validateEdit(): boolean {
  delete editErrors.title
  delete editErrors.assignedTo
  if (!editForm.title.trim()) editErrors.title = 'Title is required'
  if (!editForm.assignedTo._id) editErrors.assignedTo = 'Assignee is required'
  return !editErrors.title && !editErrors.assignedTo
}

async function saveEdit() {
  if (!props.task || !validateEdit()) return
  saving.value = true
  editError.value = ''

  const payload = {
    title: editForm.title.trim(),
    description: editForm.description,
    assignedTo: editForm.assignedTo._id,
    status: editForm.status,
    priority: editForm.priority,
    dueDate: editForm.endDate ? inputToApi(editForm.endDate) : null,
  }

  const ok = await taskStore.updateTask(resolvedProjectId.value, props.task._id, payload)
  saving.value = false

  if (ok) {
    close()
  } else {
    editError.value = taskStore.error || 'Failed to update task'
  }
}
</script>
