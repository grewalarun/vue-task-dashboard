import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AuthPage from '@/pages/AuthPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import AddTaskPage from '@/pages/AddTaskPage.vue'
import TasksTablePage from '@/pages/TasksTablePage.vue'
import ProjectDashboard from '@/pages/ProjectDashboard.vue'
import TaskDetailPage from '@/pages/TaskDetailPage.vue'

const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: AuthPage,
    meta: { title: 'Sign In', public: true },
  },
  {
    path: '/',
    name: 'porjectdashboard',
    component: ProjectDashboard,
    meta: { title: 'Project Dashboard', requiresAuth: true },
  },
  {
    path: '/projects/:id',
    name: 'dashboard',
    component: DashboardPage,
    meta: { title: 'Dashboard', requiresAuth: true },
  },
  {
    path: '/projects/:projectId/tasks/:taskId',
    name: 'task-detail',
    component: TaskDetailPage,
    meta: { title: 'Task Detail', requiresAuth: true },
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TasksTablePage,
    meta: { title: 'All Tasks', requiresAuth: true },
  },
  {
    path: '/tasks/new',
    name: 'add-task',
    component: AddTaskPage,
    meta: { title: 'Add Task', requiresAuth: true },
  },
  // Catch-all → redirect to dashboard or auth
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  document.title = `${to.meta.title ?? 'TaskFlow'} — TaskFlow`

  // Lazy-init authStore inside the guard (avoids pinia-not-ready error)
  const authStore = useAuthStore()

  // Route requires auth and user is NOT logged in → go to /auth
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'auth' }
  }

  // User IS logged in and tries to visit /auth → send to dashboard
  if (to.name === 'auth' && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
