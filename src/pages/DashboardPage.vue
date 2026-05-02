<template>
  <div class="space-y-6">
    <!-- Project Title & Actions -->
    <div class="flex items-center gap-4 mb-4">
      <h2 class="text-2xl font-bold text-slate-800">
        {{ projectStore.project?.name || 'Tasks Dashboard' }}
      </h2>
      <div v-if="isAdmin && projectStore.project" class="flex items-center gap-3 text-sm mt-1">
        <button @click="showEditModal = true" class="text-blue-600 hover:text-blue-800 font-medium transition-colors">Edit</button>
        <span class="text-slate-300">|</span>
        <button @click="confirmDelete" class="text-rose-600 hover:text-rose-800 font-medium transition-colors">Delete</button>
      </div>
    </div>

    <!-- Stat Cards Loading -->
    <div v-if="projectLoading" class="flex justify-center col-span-4">
      <Loader />
    </div>

    <div v-else class="grid grid-cols-4 gap-4">
      <StatCard label="Total Tasks" :value="totalTasks" sub="My tasks" icon-bg="bg-blue-50">
        <template #icon>
          <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </template>
      </StatCard>

      <StatCard label="In Progress" :value="inProgressTasks" sub="Active tasks" icon-bg="bg-amber-50">
        <template #icon>
          <svg class="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
          </svg>
        </template>
      </StatCard>

      <StatCard label="Completed" :value="completedTasks" sub="Done tasks" icon-bg="bg-emerald-50">
        <template #icon>
          <svg class="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </template>
      </StatCard>

      <StatCard label="Completion Rate" :value="completionRate + '%'" sub="Of all tasks" icon-bg="bg-purple-50">
        <template #icon>
          <svg class="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-12 gap-4" style="min-height: 560px;">
      <!-- Left: Data Table -->
      <div class="col-span-12 flex flex-col">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h2 class="text-sm font-semibold text-slate-800">Project Tasks</h2>
            <p class="text-xs text-slate-400">Latest entries from your team</p>
          </div>
          <RouterLink
            to="/tasks"
            class="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            View all
            <svg class="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </RouterLink>
        </div>

        <!-- Loading skeleton -->
        <div v-if="tasksLoading" class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex-1">
          <div v-for="i in 5" :key="i" class="flex gap-4 mb-4 animate-pulse">
            <div class="h-3 bg-slate-100 rounded flex-1"></div>
            <div class="h-3 bg-slate-100 rounded w-24"></div>
            <div class="h-3 bg-slate-100 rounded w-16"></div>
            <div class="h-3 bg-slate-100 rounded w-16"></div>
          </div>
        </div>

        <DataTable v-else :data="projectTasks" class="flex-1" />
      </div>

      <!-- Charts -->
      <div class="col-span-6 flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <PriorityChart />
          <StatusChart />
        </div>
      </div>
      <div class="col-span-6 flex flex-col gap-4">
        <UsersChart />
      </div>
    </div>

    <ProjectEditModal v-if="showEditModal" :project="projectStore.project" @close="showEditModal = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/taskStore'
import { useProjectStore } from '@/stores/projectStore'
import { useAuthStore } from '@/stores/authStore'
import DataTable from '@/components/table/DataTable.vue'
import StatCard from '@/components/ui/StatCard.vue'
import PriorityChart from '@/components/charts/PriorityChart.vue'
import StatusChart from '@/components/charts/StatusChart.vue'
import UsersChart from '@/components/charts/UsersChart.vue'
import Loader from '@/components/ui/Loader.vue'
import ProjectEditModal from '@/components/ProjectEditModal.vue'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showEditModal = ref(false)

const isAdmin = computed(() => {
  const user = authStore.user || JSON.parse(localStorage.getItem('tf_user') || '{}')
  return user?.role === 'admin'
})

// ✅ Project store — storeToRefs for reactive state, function taken directly
const projectStore = useProjectStore()
const { project, loading: projectLoading } = storeToRefs(projectStore)
const { fetchProject } = projectStore

// ✅ Task store — separate loading so they don't conflict
const taskStore = useTaskStore()
const { tasks: projectTasks, tasksLoading } = storeToRefs(taskStore)

onMounted(() => {
  const projectId = route.params.id as string
  if (!projectId) return

  // ✅ Reset project so stale data from previous route doesn't flash
  projectStore.project = null

  taskStore.fetchTasks(projectId)
  projectStore.fetchProject(projectId)
})

// ✅ Computed stats from task store
const totalTasks = computed(() => projectTasks.value.length)
const completedTasks = computed(() => projectTasks.value.filter(t => t.status === 'done').length)
const inProgressTasks = computed(() => projectTasks.value.filter(t => t.status === 'in-progress').length)
const completionRate = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

async function confirmDelete() {
  if (!projectStore.project) return
  if (confirm(`Are you sure you want to delete the project "${projectStore.project.name}"? This action cannot be undone.`)) {
    console.log(projectStore.project._id)
    const ok = await projectStore.deleteProject(projectStore.project._id)
    if (ok) {
      await projectStore.fetchProjects()
      router.push('/')
    } else {
      alert(projectStore.error || 'Failed to delete project')
    }
  }
}
</script>