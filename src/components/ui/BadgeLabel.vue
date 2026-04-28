<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border"
    :class="classes"
  >
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full mr-1.5 shrink-0" :class="dotClass" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant: 'priority-low' | 'priority-medium' | 'priority-high' |
           'status-todo' | 'status-in-progress' | 'status-done'
  dot?: boolean
}>()

const variantMap: Record<string, string> = {
  'priority-low':          'bg-slate-50 text-slate-600 border-slate-200',
  'priority-medium':       'bg-amber-50 text-amber-700 border-amber-200',
  'priority-high':         'bg-red-50 text-red-700 border-red-200',
  'status-todo':           'bg-sky-50 text-sky-700 border-sky-200',
  'status-in-progress':    'bg-blue-50 text-blue-700 border-blue-200',
  'status-done':           'bg-emerald-50 text-emerald-700 border-emerald-200',
}

const dotMap: Record<string, string> = {
  'priority-low':          'bg-slate-400',
  'priority-medium':       'bg-amber-500',
  'priority-high':         'bg-red-500',
  'status-todo':           'bg-sky-500',
  'status-in-progress':    'bg-blue-500',
  'status-done':           'bg-emerald-500',
}

const classes = computed(() => variantMap[props.variant] ?? '')
const dotClass = computed(() => dotMap[props.variant] ?? '')
</script>
