import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskService } from '@/services/taskService'
import type { Task, CreateTaskPayload } from '@/types'

export const useTaskStore = defineStore('tasks', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const tasks = ref<Task[]>([])
  const userTasks = ref<Task[]>([])
  const tasksLoading = ref(false)      // for project-scoped fetchTasks
  const userTasksLoading = ref(false)  // for fetchUserTasks
  const error = ref<string | null>(null)

  // Combined loading — true if either fetch is in flight
  const loading = computed(() => tasksLoading.value || userTasksLoading.value)

  // ─── Getters ──────────────────────────────────────────────────────────────
  const tasksByPriority = computed(() => {
    const counts = { low: 0, medium: 0, high: 0 }
    tasks.value.forEach((t) => { counts[t.priority] = (counts[t.priority] || 0) + 1 })
    return counts
  })

  const tasksByStatus = computed(() => {
    const counts = { todo: 0, 'in-progress': 0, done: 0 }
    tasks.value.forEach((t) => { counts[t.status] = (counts[t.status] || 0) + 1 })
    return counts
  })

  const totalTasks = computed(() => tasks.value.length)
  const completedTasks = computed(() => tasks.value.filter((t) => t.status === 'done').length)
  const inProgressTasks = computed(() => tasks.value.filter((t) => t.status === 'in-progress').length)

  // ─── Actions ──────────────────────────────────────────────────────────────

  /** GET /projects/:projectId/tasks */
  async function fetchTasks(projectId: string) {
    tasksLoading.value = true
    error.value = null
    try {
      const res = await taskService.getProjectTasks(projectId)
      const raw = res.data as any
      if (Array.isArray(raw)) {
        tasks.value = raw
      } else if (Array.isArray(raw?.data)) {
        tasks.value = raw.data
      } else if (Array.isArray(raw?.tasks)) {
        tasks.value = raw.tasks
      } else if (Array.isArray(raw?.data?.tasks)) {
        tasks.value = raw.data.tasks
      } else {
        console.warn('[TaskStore] Unexpected API shape for fetchTasks:', raw)
        tasks.value = []
      }
    } catch (err: any) {
      error.value = err.message
    } finally {
      tasksLoading.value = false
    }
  }

  /** GET /tasks/me */
  async function fetchUserTasks() {
    userTasksLoading.value = true
    error.value = null
    try {
      const res = await taskService.getUserTasks()
      const raw = res.data as any
      if (Array.isArray(raw)) {
        userTasks.value = raw
      } else if (Array.isArray(raw?.data)) {
        userTasks.value = raw.data
      } else if (Array.isArray(raw?.tasks)) {
        userTasks.value = raw.tasks
      } else {
        console.warn('[TaskStore] Unexpected API shape for fetchUserTasks:', raw)
        userTasks.value = []
      }
    } catch (err: any) {
      error.value = err.message
    } finally {
      userTasksLoading.value = false
    }
  }

  async function addTask(projectId: string, payload: CreateTaskPayload): Promise<Task | null> {
    tasksLoading.value = true
    error.value = null
    try {
      const res = await taskService.create(projectId, payload)
      const raw = res.data as any
      const newTask = raw?.task ?? raw?.data ?? raw
      tasks.value.unshift(newTask)
      return newTask
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      tasksLoading.value = false
    }
  }

  async function deleteTask(projectId: string, taskId: string): Promise<boolean> {
    error.value = null
    try {
      await taskService.delete(projectId, taskId)
      tasks.value = tasks.value.filter((t) => t._id !== taskId)
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    }
  }

  async function updateTask(
    projectId: string,
    taskId: string,
    payload: Partial<CreateTaskPayload>
  ): Promise<boolean> {
    error.value = null
    try {
      const res = await taskService.update(projectId, taskId, payload)
      const raw = res.data as any
      const updated = raw?.task ?? raw?.data ?? raw
      const idx = tasks.value.findIndex((t) => t._id === taskId)
      if (idx !== -1) tasks.value[idx] = { ...tasks.value[idx], ...updated }
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    }
  }

  /** PATCH /:taskId/status */
  async function updateTaskStatus(taskId: string, status: Task['status']): Promise<boolean> {
    error.value = null
    try {
      const res = await taskService.updateStatus(taskId, status)
      const raw = res.data as any
      const updated = raw?.task ?? raw?.data ?? raw
      const idx = tasks.value.findIndex((t) => t._id === taskId)
      if (idx !== -1) tasks.value[idx] = { ...tasks.value[idx], ...updated }
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    tasks,
    userTasks,
    loading,
    tasksLoading,
    userTasksLoading,
    error,
    tasksByPriority,
    tasksByStatus,
    totalTasks,
    completedTasks,
    inProgressTasks,
    fetchTasks,
    fetchUserTasks,
    addTask,
    deleteTask,
    updateTask,
    updateTaskStatus,
    clearError,
  }
})
