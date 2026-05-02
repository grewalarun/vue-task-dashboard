import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskService } from '@/services/taskService'
import type { Task, Comment, CreateTaskPayload, TaskStatus } from '@/types'

export const useTaskStore = defineStore('tasks', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const tasks = ref<Task[]>([])
  const userTasks = ref<Task[]>([])
  const activeTask = ref<Task | null>(null)
  const comments = ref<Comment[]>([])

  const tasksLoading = ref(false)      // project list fetch
  const userTasksLoading = ref(false)  // /tasks/me fetch
  const taskLoading = ref(false)       // single task fetch
  const commentLoading = ref(false)    // comments fetch

  const error = ref<string | null>(null)

  // Combined loading — true if any fetch is in flight
  const loading = computed(() => tasksLoading.value || userTasksLoading.value)

  // ─── Getters ──────────────────────────────────────────────────────────────
  const tasksByPriority = computed(() => {
    const counts = { low: 0, medium: 0, high: 0 }
    tasks.value.forEach((t) => { counts[t.priority] = (counts[t.priority] || 0) + 1 })
    return counts
  })

  const tasksByUser = computed(() => {
    const counts: Record<string, number> = {}
    tasks.value.forEach((t) => {
      const name = t.assignedTo?.name || 'Unassigned'
      counts[name] = (counts[name] || 0) + 1
    })
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
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
  async function fetchTasks(projectId: string, silent = false) {
    if (!silent) tasksLoading.value = true
    error.value = null
    try {
      const res = await taskService.getProjectTasks(projectId)
      const raw = res.data as any
      if (Array.isArray(raw)) tasks.value = raw
      else if (Array.isArray(raw?.data)) tasks.value = raw.data
      else if (Array.isArray(raw?.tasks)) tasks.value = raw.tasks
      else if (Array.isArray(raw?.data?.tasks)) tasks.value = raw.data.tasks
      else { console.warn('[TaskStore] fetchTasks unexpected shape:', raw); tasks.value = [] }
    } catch (err: any) {
      error.value = err.message
    } finally {
      if (!silent) tasksLoading.value = false
    }
  }

  /** GET /tasks/me */
  async function fetchUserTasks() {
    userTasksLoading.value = true
    error.value = null
    try {
      const res = await taskService.getUserTasks()
      const raw = res.data as any
      if (Array.isArray(raw)) userTasks.value = raw
      else if (Array.isArray(raw?.data)) userTasks.value = raw.data
      else if (Array.isArray(raw?.tasks)) userTasks.value = raw.tasks
      else { console.warn('[TaskStore] fetchUserTasks unexpected shape:', raw); userTasks.value = [] }
    } catch (err: any) {
      error.value = err.message
    } finally {
      userTasksLoading.value = false
    }
  }

  /** GET /projects/:projectId/tasks/:taskId */
  async function fetchTask(projectId: string, taskId: string, silent = false) {
    if (!silent) taskLoading.value = true
    error.value = null
    try {
      const res = await taskService.getById(projectId, taskId)
      const raw = res.data as any
      activeTask.value = raw?.task ?? raw?.data ?? raw
    } catch (err: any) {
      if (!silent) error.value = err.message
    } finally {
      if (!silent) taskLoading.value = false
    }
  }

  /** GET /projects/:projectId/tasks/:taskId/comments */
  async function fetchComments(projectId: string, taskId: string) {
    commentLoading.value = true
    try {
      const res = await taskService.getComments(projectId, taskId)
      const raw = res.data as any
      if (Array.isArray(raw)) comments.value = raw
      else if (Array.isArray(raw?.data)) comments.value = raw.data
      else if (Array.isArray(raw?.comments)) comments.value = raw.comments
      else comments.value = []
    } catch (err: any) {
      error.value = err.message
    } finally {
      commentLoading.value = false
    }
  }

  /** POST /projects/:projectId/tasks/:taskId/comments */
  async function addComment(projectId: string, taskId: string, text: string) {
    try {
      const res = await taskService.addComment(projectId, taskId, text)
      const raw = res.data as any
      const comment = raw?.comment ?? raw?.data ?? raw
      comments.value.push(comment)
    } catch (err: any) {
      error.value = err.message
    }
  }

  /** Clear single-task detail state */
  function clearTask() {
    activeTask.value = null
    comments.value = []
    error.value = null
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
      if (activeTask.value?._id === taskId) activeTask.value = null
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
    try {
      await taskService.update(projectId, taskId, payload)
      // Re-fetch to guarantee fully populated `assignedTo` and `createdBy` objects
      await fetchTasks(projectId, true)
      if (activeTask.value?._id === taskId) {
        await fetchTask(projectId, taskId, true)
      }
      return true
    } catch (err: any) {
      console.error(err)
      return false
    }
  }

  /** PATCH /:taskId/status */
  async function updateTaskStatus(projectId: string, taskId: string, payload: { status: TaskStatus }): Promise<boolean> {
    try {
      await taskService.updateStatus(taskId, payload.status)
      await fetchTasks(projectId, true)
      if (activeTask.value?._id === taskId) {
        activeTask.value = { ...activeTask.value!, status: payload.status }
      }
      return true
    } catch (err: any) {
      console.error(err)
      return false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    tasks,
    userTasks,
    activeTask,
    comments,
    loading,
    tasksLoading,
    userTasksLoading,
    taskLoading,
    commentLoading,
    error,
    tasksByPriority,
    tasksByStatus,
    tasksByUser,
    totalTasks,
    completedTasks,
    inProgressTasks,
    fetchTasks,
    fetchUserTasks,
    fetchTask,
    fetchComments,
    addComment,
    clearTask,
    addTask,
    deleteTask,
    updateTask,
    updateTaskStatus,
    clearError,
  }
})
