<template>
  <div class="min-h-screen bg-[#f4f4f4]">
    <!-- Auth layout: no sidebar/header -->
    <template v-if="!showAppShell">
      <RouterView />
    </template>

    <!-- App shell layout: sidebar + header -->
    <template v-else>
      <AppSidebar />
      <div class="ml-64 min-h-screen">
        <AppHeader />
        <main class="p-6">
         
            <RouterView :key="$route.path" />
          
        </main>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const route = useRoute()
const authStore = useAuthStore()

// Show the dashboard shell only when authenticated AND not on a public-only route
const showAppShell = computed(
  () => authStore.isAuthenticated && !route.meta.public
)
</script>
