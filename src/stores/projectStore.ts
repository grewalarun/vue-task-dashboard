import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectService } from '@/services/projectService'
import type { Task, CreateTaskPayload, Projects } from '@/types'

export const useProjectStore = defineStore('projects', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const projects = ref<Projects[]>([])
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




  function clearError() {
    error.value = null
  }

  return {
    fetchProjects,
    projects,
    loading,
    error,

    clearError,
  }
})
