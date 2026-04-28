<template>
  <div class="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">{{ label }}</p>
        <p class="text-2xl font-bold text-slate-900 mt-1">{{ value }}</p>
        <p v-if="sub" class="text-xs text-slate-400 mt-1">{{ sub }}</p>
      </div>
      <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="iconBg">
        <slot name="icon" />
      </div>
    </div>
    <slot name="footer">
      
    </slot>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps<{
  label: string
  value: string | number
  sub?: string
  iconBg?: string
}>()
</script>
