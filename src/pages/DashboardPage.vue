<template>
  <div class="space-y-6">
    <!-- Stat Cards Row -->
      <div v-if="loading" class="flex justify-center col-span-4"><Loader/></div>

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

      <StatCard
        label="Completion Rate"
        :value="completionRate + '%'"
        sub="Of all tasks"
        icon-bg="bg-purple-50"
      >
        <template #icon>
          <svg class="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Main Content: Table (left) + Charts (right) -->
    <div v-if="!loading" class="grid grid-cols-12 gap-4" style="min-height: 560px;">
      <!-- Left: Data Table -->
      <div class="col-span-7 flex flex-col">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h2 class="text-sm font-semibold text-slate-800">Recent Tasks</h2>
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
        <div v-if="loading" class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex-1">
          <div v-for="i in 5" :key="i" class="flex gap-4 mb-4 animate-pulse">
            <div class="h-3 bg-slate-100 rounded flex-1"></div>
            <div class="h-3 bg-slate-100 rounded w-24"></div>
            <div class="h-3 bg-slate-100 rounded w-16"></div>
            <div class="h-3 bg-slate-100 rounded w-16"></div>
          </div>
        </div>

        <DataTable v-else :data="projectTasks" class="flex-1" />
      </div>

      <!-- Right: Charts -->
      <div class="col-span-5 flex flex-col gap-4">
        <!-- Add Task CTA -->
        <RouterLink
          to="/tasks/new"
          class="bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-xl p-5 flex items-center justify-between hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md group"
        >
          <div>
            <p class="text-sm font-semibold">Add New Task</p>
            <p class="text-xs text-blue-200 mt-0.5">Create and assign quickly</p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
          </div>
        </RouterLink>

        <!-- Priority Chart -->
        <PriorityChart />

        <!-- Status Chart -->
        <StatusChart />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/taskStore'
import DataTable from '@/components/table/DataTable.vue'
import StatCard from '@/components/ui/StatCard.vue'
import PriorityChart from '@/components/charts/PriorityChart.vue'
import StatusChart from '@/components/charts/StatusChart.vue'

const route = useRoute()
const taskStore = useTaskStore()
const { tasks: projectTasks, tasksLoading: loading } = storeToRefs(taskStore)

// App.vue uses :key="$route.path" so this component is always recreated on navigation
// — onMounted always fires fresh, no guards needed
onMounted(() => {
  const projectId = route.params.id as string
  console.log('[DashboardPage] mounting, projectId:', projectId)
  if (projectId) taskStore.fetchTasks(projectId)
})

const totalTasks = computed(() => projectTasks.value.length)
const completedTasks = computed(() => projectTasks.value.filter(t => t.status === 'done').length)
const inProgressTasks = computed(() => projectTasks.value.filter(t => t.status === 'in-progress').length)
const completionRate = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})




</script>


