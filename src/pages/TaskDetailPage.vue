<template>
  <div class="max-w-6xl mx-auto">

    <!-- Breadcrumb -->
    <nav class="flex items-center gap-1.5 text-xs text-slate-400 mb-5 flex-wrap">
      <RouterLink to="/" class="hover:text-slate-600 transition-colors">Dashboard</RouterLink>
      <svg class="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      <RouterLink to="/tasks" class="hover:text-slate-600 transition-colors">Tasks</RouterLink>
      <svg class="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      <span class="text-slate-600 truncate max-w-xs">{{ taskStore.activeTask?.title ?? 'Task Detail' }}</span>
    </nav>

    <!-- Back link -->
    <RouterLink
      to="/tasks"
      class="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium mb-6 group transition-colors"
    >
      <svg class="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
      </svg>
      Back to Tasks
    </RouterLink>

    <!-- Loading skeleton -->
    <div v-if="taskStore.taskLoading" class="animate-pulse space-y-4">
      <div class="h-8 bg-slate-100 rounded w-2/3"></div>
      <div class="h-4 bg-slate-100 rounded w-32"></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div class="lg:col-span-2 space-y-4">
          <div class="h-48 bg-slate-100 rounded-xl"></div>
          <div class="h-64 bg-slate-100 rounded-xl"></div>
        </div>
        <div class="space-y-4">
          <div class="h-32 bg-slate-100 rounded-xl"></div>
          <div class="h-32 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="taskStore.error && !taskStore.activeTask" class="bg-rose-50 border border-rose-200 rounded-xl p-8 text-center">
      <p class="text-rose-600 text-sm font-medium">{{ taskStore.error }}</p>
      <RouterLink to="/tasks" class="mt-3 inline-flex text-sm text-slate-500 hover:text-slate-700">← Back to tasks</RouterLink>
    </div>

    <!-- Main content -->
    <div v-else-if="task">

      <!-- Title row -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div class="min-w-0">
          <h1 class="text-2xl font-bold text-slate-900 leading-tight">{{ task.title }}</h1>
          <p class="text-xs text-slate-400 mt-1.5 font-mono">{{ task._id }}</p>
        </div>
        <div class="flex items-center gap-2.5 flex-shrink-0">
          <button
            class="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
            @click="openEditModal"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
            </svg>
            Edit
          </button>
          <button
            class="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
            @click="showDeleteConfirm = true"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
            </svg>
            Delete
          </button>
        </div>
      </div>

      <!-- 2-column layout: main left, sidebar right -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <!-- ── LEFT COLUMN ─────────────────────────────────────────────────── -->
        <div class="lg:col-span-2 space-y-5">

          <!-- Description card -->
          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Description</h2>
            <p v-if="task.description" class="text-sm text-slate-700 leading-relaxed">{{ task.description }}</p>
            <p v-else class="text-sm text-slate-400 italic">No description provided.</p>
          </div>

          <!-- Comments card -->
          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
              Comments ({{ taskStore.comments.length }})
            </h2>

            <!-- Comment list -->
            <div v-if="taskStore.commentLoading" class="space-y-4">
              <div v-for="i in 2" :key="i" class="flex gap-3 animate-pulse">
                <div class="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-3 bg-slate-100 rounded w-24"></div>
                  <div class="h-10 bg-slate-100 rounded"></div>
                </div>
              </div>
            </div>

            <div v-else-if="taskStore.comments.length === 0" class="text-sm text-slate-400 italic mb-5">
              No comments yet. Be the first to add one.
            </div>

            <div v-else class="space-y-4 mb-5">
              <div
                v-for="comment in taskStore.comments"
                :key="comment._id"
                class="flex gap-3"
              >
                <!-- Avatar -->
                <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 flex-shrink-0">
                  {{ getInitials(comment.createdBy?.name ?? 'U') }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span class="text-sm font-semibold text-slate-800">{{ comment.createdBy?.name ?? 'User' }}</span>
                    <span class="text-xs text-slate-400">{{ formatCommentDate(comment.createdAt) }}</span>
                  </div>
                  <div class="bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-sm text-slate-700">
                    {{ comment.text }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Add comment input -->
            <div class="flex items-center gap-3 pt-4 border-t border-slate-100">
              <!-- Current user avatar -->
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {{ authInitials }}
              </div>
              <div class="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <input
                  v-model="newComment.text"
                  type="text"
                  placeholder="Write a comment..."
                  class="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                  @keydown.enter.prevent="submitComment"
                />
                <button
                  class="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors flex-shrink-0 disabled:opacity-40"
                  :disabled="!newComment.text.trim() || submittingComment"
                  @click="submitComment"
                >
                  <svg v-if="submittingComment" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── RIGHT COLUMN (sidebar panels) ─────────────────────────────── -->
        <div class="space-y-4">

          <!-- Status panel -->
          <div class="bg-white rounded-xl border border-slate-200 p-5">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Status</h3>
            <select
              :value="task?.status"
              class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
              :disabled="updatingStatus"
              @change="handleStatusChange(($event.target as HTMLSelectElement).value as TaskStatus)"
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <div v-if="updatingStatus" class="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
              <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Updating…
            </div>
            <div v-if="statusError" class="flex items-center gap-1.5 mt-2 text-xs text-rose-500">
              <svg class="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
              {{ statusError }}
            </div>
          </div>

          <!-- Assigned To panel -->
          <div class="bg-white rounded-xl border border-slate-200 p-5">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Assigned To</h3>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 flex-shrink-0">
                {{ getInitials(resolvedAssignedTo?.name ?? '') }}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-slate-800 truncate">{{ assigneeName }}</p>
                <p class="text-xs text-slate-400 truncate font-mono" :title="resolvedAssignedTo?.email">{{ resolvedAssignedTo?.email }}</p>
              </div>
            </div>
          </div>

          <!-- Created By panel (if available) -->
          <div v-if="task.createdBy" class="bg-white rounded-xl border border-slate-200 p-5">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Created By</h3>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 flex-shrink-0">
                {{ getInitials(resolvedCreatedBy?.name ?? '') }}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-slate-800 truncate">{{ resolvedCreatedBy?.name }}</p>
                <p v-if="resolvedCreatedBy?.email" class="text-xs text-slate-400 truncate font-mono">{{ resolvedCreatedBy.email }}</p>
              </div>
            </div>
          </div>

          <!-- Priority panel -->
          <div class="bg-white rounded-xl border border-slate-200 p-5">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Priority</h3>
            <BadgeLabel :variant="`priority-${task.priority}`">
              {{ task.priority.charAt(0).toUpperCase() + task.priority.slice(1) }}
            </BadgeLabel>
          </div>

          <!-- Dates panel -->
          <div class="bg-white rounded-xl border border-slate-200 p-5">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Dates</h3>
            <div class="space-y-3">
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Created</p>
                <p class="text-sm font-medium text-slate-800">{{ formatDisplayDate(task.createdAt ?? null) }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Due Date</p>
                <p class="text-sm font-medium text-slate-800">{{ formatDisplayDate(task.dueDate ?? null) }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ── Edit Modal ──────────────────────────────────────────────────────── -->
    <TaskEditModal v-if="showEditModal" :task="task" @close="showEditModal = false" />

    <!-- ── Delete Confirm Modal ───────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          @click.self="showDeleteConfirm = false"
        >
          <div class="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 w-full max-w-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-900">Delete Task</h3>
                <p class="text-xs text-slate-400 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <p class="text-sm text-slate-600 mb-5">
              Delete <strong class="text-slate-800">"{{ task?.title }}"</strong>?
            </p>
            <div class="flex gap-3">
              <button class="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors" @click="showDeleteConfirm = false">Cancel</button>
              <button
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50"
                :disabled="deleting"
                @click="confirmDelete"
              >
                <svg v-if="deleting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                {{ deleting ? 'Deleting…' : 'Delete Task' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { useProjectStore } from '@/stores/projectStore'
import BadgeLabel from '@/components/ui/BadgeLabel.vue'
import TaskEditModal from '@/components/TaskEditModal.vue'
import type { TaskStatus, TaskPriority, User } from '@/types'

const route     = useRoute()
const router    = useRouter()
const taskStore = useTaskStore()
const authStore = useAuthStore()
const userStore = useUserStore()
const projectStore = useProjectStore()

const projectId = route.params.projectId as string
const taskId    = route.params.taskId as string

// ── Local state ───────────────────────────────────────────────────────────────
const newComment       = reactive({text:''})
const submittingComment = ref(false)
const updatingStatus   = ref(false)
const statusError      = ref('')
const showEditModal    = ref(false)
const showDeleteConfirm = ref(false)
const deleting = ref(false)

// ── Computed ──────────────────────────────────────────────────────────────────
const task = computed(() => taskStore.activeTask)
const projectMembers = computed(() => projectStore.projects.find(p => p._id === projectId)?.members || [])

const resolvedAssignedTo = computed(() => {
  const id = task.value?.assignedTo as any
  if (!id) return null
  if (typeof id === 'string') return userStore.users.find(u => u.id === id) || { name: 'Unknown User', email: '' }
  return id
})

const resolvedCreatedBy = computed(() => {
  const id = task.value?.createdBy as any
  if (!id) return null
  if (typeof id === 'string') return userStore.users.find(u => u.id === id) || { name: 'Unknown User', email: '' }
  return id
})

const assigneeName = computed(() => resolvedAssignedTo.value?.name ?? '—')

const authInitials = computed(() => {
  const name = authStore.user?.name ?? ''
  return name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'U'
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(val: string): string {
  if (!val) return 'U'
  if (val.includes('@')) return val[0].toUpperCase()
  return val.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

function formatDisplayDate(raw: string | null): string {
  if (!raw) return '—'
  let date: Date | null = null
  if (raw.length === 8) {
    date = new Date(`${raw.slice(4)}-${raw.slice(2, 4)}-${raw.slice(0, 2)}`)
  } else {
    date = new Date(raw)
  }
  if (isNaN(date.getTime())) return raw
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatCommentDate(raw: string): string {
  if (!raw) return ''
  const date = new Date(raw)
  if (isNaN(date.getTime())) return raw
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// ── Actions ───────────────────────────────────────────────────────────────────
async function handleStatusChange(status: TaskStatus) {
  updatingStatus.value = true
  statusError.value = ''
  const ok = await taskStore.updateTaskStatus(projectId, taskId, { status })
  updatingStatus.value = false
  if (!ok) {
    statusError.value = taskStore.error ?? 'Failed to update status. Please try again.'
    setTimeout(() => { statusError.value = '' }, 4000)
  }
}

async function submitComment() {
  if (!newComment) return
  submittingComment.value = true
  await taskStore.addComment(projectId, taskId, newComment.text)

  newComment.text = ''
  submittingComment.value = false
}

function openEditModal() {
  if (!task.value) return
  showEditModal.value = true
}

async function confirmDelete() {
  if (!task.value) return
  deleting.value = true
  const ok = await taskStore.deleteTask(projectId, taskId)
  deleting.value = false
  if (ok) router.push('/tasks')
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => {
  if (!projectStore.projects.length) projectStore.fetchProjects()
  taskStore.fetchTask(projectId, taskId)
  taskStore.fetchComments(projectId, taskId)
  userStore.fetchUsers()
})

onUnmounted(() => {
  taskStore.clearTask()
})

console.log(task.value?.status)
</script>