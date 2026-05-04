<template>
  <div class="min-h-screen bg-[#f8fafc]">
    <!-- Auth layout — no shell -->
    <template v-if="!showAppShell">
      <RouterView />
    </template>

    <!-- App shell layout -->
    <template v-else>
      <AppSidebar :mobile-open="sidebarOpen" @close="sidebarOpen = false" />

      <!-- Main area — pushed right on lg+ -->
      <div class="lg:ml-64 min-h-screen flex flex-col">
        <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
        <main class="flex-1 p-4 sm:p-6">
          
            <RouterView :key="$route.path" />
          
        </main>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader  from '@/components/layout/AppHeader.vue'

const route     = useRoute()
const authStore = useAuthStore()

const sidebarOpen = ref(false)

// Close mobile sidebar on route change
watch(() => route.path, () => { sidebarOpen.value = false })

const showAppShell = computed(
  () => authStore.isAuthenticated && !route.meta.public
)
</script>
