<template>
  <div class="bg-white rounded-xl border border-slate-100 p-5 shadow-sm h-full">
    <div class="mb-4">
      <h3 class="text-sm font-semibold text-slate-900">Tasks by Priority</h3>
      <p class="text-xs text-slate-400 mt-0.5">Distribution across priority levels</p>
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

const COLORS = {
  low: '#94a3b8',
  medium: '#f59e0b',
  high: '#ef4444',
}

const hasData = computed(() => taskStore.totalTasks > 0)

const chartData = computed(() => {
  const p = taskStore.tasksByPriority
  return {
    labels: ['Low', 'Medium', 'High'],
    datasets: [{
      data: [p.low, p.medium, p.high],
      backgroundColor: [COLORS.low, COLORS.medium, COLORS.high],
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
  const p = taskStore.tasksByPriority
  return [
    { label: 'low', count: p.low, color: COLORS.low },
    { label: 'medium', count: p.medium, color: COLORS.medium },
    { label: 'high', count: p.high, color: COLORS.high },
  ]
})
</script>
