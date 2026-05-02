<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
        @click.self="close"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
            <h3 class="text-sm font-semibold text-slate-900">Edit Project</h3>
            <button class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors" @click="close">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          
          <div class="px-6 py-5 space-y-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Project Name *</label>
              <input v-model="form.name" type="text" class="w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" :class="errors.name ? 'border-rose-300' : 'border-slate-200'" />
              <p v-if="errors.name" class="text-xs text-rose-500">{{ errors.name }}</p>
            </div>
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
              <textarea v-model="form.description" rows="3" class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"></textarea>
            </div>
          </div>
          
          <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
            <div v-if="projectStore.error" class="flex items-center gap-1.5 mb-3 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
              {{ projectStore.error }}
            </div>
            <div class="flex justify-end gap-3">
              <button class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" @click="close" :disabled="projectStore.loading">Cancel</button>
              <button
                class="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                :disabled="projectStore.loading"
                @click="submit"
              >
                <svg v-if="projectStore.loading" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                {{ projectStore.loading ? 'Saving…' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

const props = defineProps<{ project: any }>()
const emit = defineEmits(['close'])
const projectStore = useProjectStore()

const form = reactive({
  name: '',
  description: ''
})

const errors = reactive({ name: '' })

watch(() => props.project, (newProject) => {
  if (newProject) {
    form.name = newProject.name || ''
    form.description = newProject.description || ''
  }
}, { immediate: true })

function close() {
  projectStore.clearError()
  emit('close')
}

async function submit() {
  errors.name = ''
  if (!form.name.trim()) {
    errors.name = 'Project name is required'
    return
  }

  const payload = {
    name: form.name.trim(),
    description: form.description.trim()
  }

  const ok = await projectStore.updateProject(props.project._id, payload)
  
  if (ok) {
    close()
  }
}
</script>
