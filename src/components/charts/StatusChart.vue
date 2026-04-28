<template>
  <div class="bg-white rounded-xl border border-slate-100 p-5 shadow-sm h-full">
    <div class="mb-4">
      <h3 class="text-sm font-semibold text-slate-900">Tasks by Status</h3>
      <p class="text-xs text-slate-400 mt-0.5">Current workflow breakdown</p>
    </div>

    <div v-if="hasData" style="height: 220px; position: relative;">
      <Bar :data="chartData" :options="chartOptions" />
    </div>

    <div v-else class="flex items-center justify-center" style="height: 220px;">
      <p class="text-sm text-slate-400">No task data yet</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { useTaskStore } from '@/stores/taskStore'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const taskStore = useTaskStore()

const hasData = computed(() => taskStore.totalTasks > 0)

const chartData = computed(() => {
  const s = taskStore.tasksByStatus
  return {
    labels: ['Todo', 'In Progress', 'Done'],
    datasets: [{
      label: 'Tasks',
      data: [s.todo, s['in-progress'], s.done],
      backgroundColor: ['#e0f2fe', '#3b82f6', '#8b5cf6'],
      borderColor:     ['#7dd3fc', '#2563eb', '#7c3aed'],
      borderWidth: 1.5,
      borderRadius: 6,
      borderSkipped: false,
    }],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => ` ${ctx.raw} tasks`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: '#94a3b8',
        font: { size: 11, family: 'DM Sans' },
      },
    },
    y: {
      beginAtZero: true,
      border: { display: false, dash: [4, 4] },
      grid: { color: '#f1f5f9' },
      ticks: {
        color: '#94a3b8',
        font: { size: 11, family: 'DM Sans' },
        stepSize: 1,
        precision: 0,
      },
    },
  },
}
</script>
