import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectService } from '@/services/projectService'
import type { Task, CreateTaskPayload, Projects, CreateProjectPayload } from '@/types'

export const useProjectStore = defineStore('projects', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const projects = ref<Projects[]>([])
  const project = ref<Projects | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)


  // ─── Actions ──────────────────────────────────────────────────────────────
  async function fetchProjects() {

    loading.value = true
    error.value = null

    try {
      const res = await projectService.getAll()
      const raw = res.data as any

      console.log(raw);
      projects.value = raw;
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchProject(id: string, silent = false) {
    if (!silent) loading.value = true
    error.value = null
    try {
      const res = await projectService.getById(id)
      const raw = res.data as any
      project.value = raw
    } catch (err: any) {
      if (!silent) error.value = err.message
    } finally {
      if (!silent) loading.value = false
    }
  }

  async function createProject(payload: CreateProjectPayload) {
    loading.value = true
    error.value = null
    try {
      const res = await projectService.create(payload)
      const raw = res.data as any
      project.value = raw
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function updateProject(id: string, payload: Partial<CreateProjectPayload>) {
    loading.value = true
    error.value = null
    try {
      const res = await projectService.update(id, payload)
      const raw = res.data as any
      project.value = raw

      // Update in projects array if it exists
      const idx = projects.value.findIndex(p => p._id === id)
      if (idx !== -1) projects.value[idx] = { ...projects.value[idx], ...raw }
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteProject(id: string) {
    alert('delete id');
    loading.value = true
    error.value = null
    try {
      await projectService.delete(id)
      project.value = null
      projects.value = projects.value.filter(p => p._id !== id)
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }



  function clearError() {
    error.value = null
  }

  return {
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    project,
    projects,
    loading,
    error,

    clearError,
  }
})
