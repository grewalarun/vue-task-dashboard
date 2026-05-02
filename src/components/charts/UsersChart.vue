<template>
  <div class="bg-white rounded-xl border border-slate-100 p-5 shadow-sm h-full">
    <div class="mb-4">
      <h3 class="text-sm font-semibold text-slate-900">Tasks by Users</h3>
      <p class="text-xs text-slate-400 mt-0.5">Distribution across Users</p>
    </div>

    <div v-if="hasData" class="relative" style="height: 200px;">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>

    <div v-else class="flex items-center justify-center" style="height: 200px;">
      <p class="text-sm text-slate-400">No task data yet</p>
    </div>

    <!-- Legend -->
    <div class="mt-4 space-y-2">
      <div v-for="item in legendItems" :key="item.label" class="flex items-center justify-between text-xs">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: item.color }" />
          <span class="text-slate-600 capitalize">{{ item.label }}</span>
        </div>
        <span class="font-semibold text-slate-800">{{ item.count }}</span>
      </div>
    </div>
  </div>
 

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { useTaskStore } from '@/stores/taskStore'

ChartJS.register(ArcElement, Tooltip, Legend)

const taskStore = useTaskStore()

const CHART_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#6366f1', '#84cc16', '#eab308', '#f43f5e', '#a855f7', '#d946ef', '#0ea5e9', '#f97316'
]

const hasData = computed(() => taskStore.totalTasks > 0)

const chartData = computed(() => {
  const usersData = taskStore.tasksByUser
  return {
    labels: usersData.map(u => u.name),
    datasets: [{
      data: usersData.map(u => u.count),
      backgroundColor: usersData.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 4,
    }],
  }
})


const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => ` ${ctx.label}: ${ctx.raw} tasks`,
      },
    },
  },
}

const legendItems = computed(() => {
  return taskStore.tasksByUser.map((u, i) => ({
    label: u.name,
    count: u.count,
    color: CHART_COLORS[i % CHART_COLORS.length]
  }))
})
</script>
