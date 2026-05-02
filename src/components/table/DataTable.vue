<template>
  <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">

    <!-- Toolbar -->
    <div class="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
      <div class="relative flex-1 max-w-xs">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="globalFilter"
          type="text"
          placeholder="Search tasks…"
          class="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        />
      </div>
      <span class="text-xs text-slate-400 ml-auto">{{ filteredCount }} tasks</span>
    </div>

    <!-- Table -->
    <div class="overflow-auto flex-1">
      <table class="w-full min-w-full text-sm">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50/60">
            <th
              v-for="header in table.getFlatHeaders()"
              :key="header.id"
              class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap select-none"
              :class="{ 'cursor-pointer hover:text-slate-700': header.column.getCanSort() }"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <div class="flex items-center gap-1.5">
                <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                <span v-if="header.column.getIsSorted()" class="text-blue-500 text-xs">
                  {{ header.column.getIsSorted() === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="table.getRowModel().rows.length > 0">
            <tr
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              class="border-b border-slate-50 hover:bg-slate-50/80 transition-colors duration-100 group"
            >
              <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="px-4 py-3">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </td>
            </tr>
          </template>
          <tr v-else>
            <td :colspan="columns.length" class="text-center py-14 text-slate-400 text-sm">
              <div class="flex flex-col items-center gap-2">
                <svg class="w-9 h-9 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                No tasks found
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-400">Rows per page:</span>
        <select
          :value="table.getState().pagination.pageSize"
          @change="table.setPageSize(Number(($event.target as HTMLSelectElement).value))"
          class="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option v-for="n in [5, 10, 20, 50]" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-xs text-slate-400 mr-2">
          Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() }}
        </span>
        <button class="pag-btn" :disabled="!table.getCanPreviousPage()" @click="table.setPageIndex(0)">«</button>
        <button class="pag-btn" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">‹</button>
        <button class="pag-btn" :disabled="!table.getCanNextPage()" @click="table.nextPage()">›</button>
        <button class="pag-btn" :disabled="!table.getCanNextPage()" @click="table.setPageIndex(table.getPageCount() - 1)">»</button>
      </div>
    </div>
  </div>

  <!-- Edit Modal -->

       
  <TaskEditModal v-if="editingTask" :task="editingTask" @updated="onTaskUpdated"  @close="closeEdit" />
  


  <!-- Delete Confirm Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="deletingTask"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
        @click.self="deletingTask = null"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 w-full max-w-sm">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900">Delete Task</h3>
              <p class="text-xs text-slate-400 mt-0.5">This action cannot be undone.</p>
            </div>
          </div>
          <p class="text-sm text-slate-600 mb-5">
            Are you sure you want to delete <strong class="text-slate-800">"{{ deletingTask.title }}"</strong>?
          </p>
          <div class="flex gap-3">
            <button class="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors" @click="deletingTask = null">
              Cancel
            </button>
            <button
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50"
              :disabled="deleting"
              @click="confirmDelete"
            >
              <svg v-if="deleting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ deleting ? 'Deleting…' : 'Delete Task' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, h } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FlexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/vue-table'
import { RouterLink } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { useProjectStore } from '@/stores/projectStore'
import type { Task, TaskStatus, TaskPriority } from '@/types'
import BadgeLabel from '@/components/ui/BadgeLabel.vue'
import TaskEditModal from '@/components/TaskEditModal.vue'

const props = defineProps<{ data: Task[] }>()

const taskStore = useTaskStore()
const projectStore = useProjectStore()

// Table state
const globalFilter = ref('')
const sorting = ref<SortingState>([])

// Edit state
const editingTask = ref<Task | null>(null)
// Delete state
const deletingTask = ref<Task | null>(null)
const deleting = ref(false)


function formatDateDisplay(raw: string | null): string {
  if (!raw) return '—'
  if (raw.length === 8) return `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4)}`
  return raw
}

// Edit handlers
function openEdit(task: Task) {
  editingTask.value = task
}

function closeEdit() {
  editingTask.value = null
}

// Delete handlers
function openDelete(task: Task) {
  deletingTask.value = task
}

async function confirmDelete() {
  if (!deletingTask.value) return
  deleting.value = true
  await taskStore.deleteTask(deletingTask.value.project, deletingTask.value._id)
  deleting.value = false
  deletingTask.value = null
}

// Column definitions
const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    enableSorting: true,
    cell: (info) => {
      const task = info.row.original
      return h(
        RouterLink,
        {
          to: `/projects/${task.project}/tasks/${task._id}`,
          class: 'font-medium text-slate-800 text-xs leading-relaxed block max-w-[220px] truncate hover:text-blue-600 hover:underline transition-colors',
        },
        () => info.getValue() as string,
      )
    },
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: (info) => {
      const user = info.getValue() as { name: string; email: string } | null
      if (!user) return h('span', { class: 'text-slate-400 text-xs' }, '—')
      return h('span', {
        class: 'text-xs text-slate-700 font-medium cursor-default',
        title: user.email,
      }, user.name)
    },
  },
  {
    accessorKey: 'createdBy',
    header: 'Created By',
    cell: (info) => {
      const user = info.getValue() as { name: string; email: string } | null
      if (!user) return h('span', { class: 'text-slate-400 text-xs' }, '—')
      return h('span', {
        class: 'text-xs text-slate-500 cursor-default',
        title: user.email,
      }, user.name)
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => {
      const val = info.getValue() as string
      const label = { 'todo': 'Todo', 'in-progress': 'In Progress', 'done': 'Done' }[val] ?? val
      return h(BadgeLabel, { variant: `status-${val}` as any, dot: true }, { default: () => label })
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: (info) => {
      const val = info.getValue() as string
      return h(BadgeLabel, { variant: `priority-${val}` as any }, { default: () => val.charAt(0).toUpperCase() + val.slice(1) })
    },
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    cell: (info) => h('span', { class: 'text-xs text-slate-500' }, formatDateDisplay(info.getValue() as string | null)),
  },
  {
    id: 'actions',
    header: '',
    cell: (info) => {
      const task = info.row.original
      return h('div', { class: 'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150' }, [
        h('button', {
          title: 'Edit task',
          class: 'flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded-md transition-all duration-150 font-medium',
          onClick: () => openEdit(task),
        }, [
          h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.8', stroke: 'currentColor', class: 'w-3.5 h-3.5' }, [
            h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125' }),
          ]),
          'Edit',
        ]),
        h('span', { class: 'w-px h-4 bg-slate-200' }),
        h('button', {
          title: 'Delete task',
          class: 'flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-2 py-1.5 rounded-md transition-all duration-150 font-medium',
          onClick: () => openDelete(task),
        }, [
          h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.8', stroke: 'currentColor', class: 'w-3.5 h-3.5' }, [
            h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0' }),
          ]),
          'Delete',
        ]),
      ])
    },
  },
]
const tableData = computed(() => props.data)

const table = useVueTable({
  get data() { return tableData.value },
  columns,
  state: {
    get globalFilter() { return globalFilter.value },
    get sorting() { return sorting.value },
  },
  onGlobalFilterChange: (v) => { globalFilter.value = v },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  initialState: { pagination: { pageSize: 10 } },

  
})

async function onTaskUpdated() {
  // Refetch tasks from the store so props.data updates
  const projectId = editingTask.value 
    ? (typeof editingTask.value.project === 'object' 
        ? (editingTask.value.project as any)._id 
        : editingTask.value.project)
    : null

  if (projectId) {
    await taskStore.fetchTasks(projectId) // ✅ this updates the store → parent re-renders → props.data changes
  }

  editingTask.value = null
}


const filteredCount = computed(() => table.getFilteredRowModel().rows.length)
</script>

<style scoped lang="postcss">
.pag-btn {
  @apply w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 text-xs
         hover:bg-white hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors;
}
</style>
