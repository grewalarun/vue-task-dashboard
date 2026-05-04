<template>
  <div class="space-y-6">
    <!-- Stat Cards Row -->
    <h2 class="text-2xl font-bold text-slate-800 mb-4">Project dashboard</h2>
    <div class="grid grid-cols-2 gap-4">
        <div v-if="loading.loading" class="flex justify-center col-span-4"><Loader/></div>

<StatCard label="Projects" :value="projects?.projects?.length" sub="Total" icon-bg="bg-blue-50">
        <template #icon>
          <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </template>
      </StatCard>

      <StatCard label="Tasks" :value="totalTasks" sub="Total" icon-bg="bg-green-50">
        <template #icon>
          <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </template>
      </StatCard>
</div>
<section>
            <div class="flex items-center justify-between mb-3">
          <div>
            <h2 class="text-md font-semibold text-slate-800">Projects</h2>
            <p class="text-xs text-slate-400">Recent added projects</p>
          </div>
          <router-link to="/projects" class="btn-link"> View All <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg></router-link>
        </div>
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">

        <template v-for="p in projects.projects">
      <StatCard :label="p.name" :value="p.taskStat.total" :path="`/projects/${p._id}`"  sub="Tasks" icon-bg="bg-blue-50">
        <template #icon>
          <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </template>
        
       <template #footer>
        <progress :value="p.taskStat.done" :max="p.taskStat.total" class="mt-4 w-full appearance-none h-1 rounded-full overflow-hidden
         [&::-webkit-progress-bar]:bg-gray-200 
         [&::-webkit-progress-value]:bg-blue-600 
         [&::-moz-progress-bar]:bg-blue-600" id="progress"></progress>
        <p class="text-xs text-slate-400 mt-1">{{ p.taskStat.done }} / {{ p.taskStat.total }} tasks completed</p> 
      </template>
      </StatCard>

    </template>
</div>
</section>

</div>
<section class="mt-6">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h2 class="text-md font-semibold text-slate-800">My Recent Tasks</h2>
            <p class="text-xs text-slate-400">Latest entries from your team</p>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-if="taskStore.loading && userTasks.length === 0" class="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <div v-for="i in 5" :key="i" class="flex gap-4 mb-4 animate-pulse">
            <div class="h-3 bg-slate-100 rounded flex-1"></div>
            <div class="h-3 bg-slate-100 rounded w-24"></div>
            <div class="h-3 bg-slate-100 rounded w-20"></div>
          </div>
        </div>

        <DataTable v-else :data="userTasks" />

        
</section>

</template>

<script setup lang="ts">
import StatCard from '@/components/ui/StatCard.vue'
import { useProjectStore } from '@/stores/projectStore'
import { useTaskStore } from '@/stores/taskStore'
import { storeToRefs } from 'pinia'
import { onMounted, watch, computed , onBeforeMount,  onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onErrorCaptured, onRenderTracked, onRenderTriggered} from 'vue';
import DataTable from '@/components/table/DataTable.vue';
import router from '@/router';

const projectStore = useProjectStore();
const taskStore = useTaskStore();


onMounted(async() => {
  await projectStore.fetchProjects()
  await taskStore.fetchUserTasks()
 
})

const projects = projectStore;
const { userTasks, userTasksLoading } = storeToRefs(taskStore)

const loading = projectStore;

const totalTasks = computed(() => {
  if (!projectStore.projects || projectStore.projects.length === 0) return 0
  return projectStore.projects.reduce((sum, project) => {
    return sum + (project.taskStat?.total || 0)
  }, 0)
})



console.log('🟣 SETUP: Component is initializing (before lifecycle hooks)')


// 2. onBeforeMount
onBeforeMount(() => {
  console.log('📦 onBeforeMount - DOM not ready yet, template not rendered')
})

// 3. onMounted
onMounted(() => {
  console.log('✅ onMounted - You can access DOM elements now')
})

// 4. onBeforeUpdate
onBeforeUpdate(() => {
  

  console.log('🔄 onBeforeUpdate - DOM still has old values')
})

// 5. onUpdated
onUpdated(() => {
  
  console.log('✨ onUpdated - DOM now has new values')
})

// 6. onBeforeUnmount (rarely triggers in dev with HMR)
onBeforeUnmount(() => {
 
  console.log('🗑️ onBeforeUnmount - Remove event listeners, timers, etc.')
})

// 7. onUnmounted
onUnmounted(() => {

  console.log('💀 onUnmounted - Component no longer exists')
})

// 8. onErrorCaptured (catches errors from child components)
onErrorCaptured((err, instance, info) => {
  
  console.error('⚠️ Error details:', err)
  return false // Prevent error from propagating further
})

onRenderTriggered((event) => {
  if (import.meta.env.DEV) {
    console.log(`⚡ onRenderTriggered: ${event.key} triggered re-render`)
    console.log('   Old value:', event.oldValue)
    console.log('   New value:', event.newValue)
  }
})



</script>

<style scoped>

</style>