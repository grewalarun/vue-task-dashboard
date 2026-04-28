# TaskFlow — Project Dashboard

A production-grade Vue 3 task management dashboard built with:
- **Vue 3** (Composition API + `<script setup>`)
- **TypeScript**
- **Vue Router 4**
- **Pinia** (state management)
- **TanStack Table v8** (data table with search, sort, pagination)
- **Chart.js + vue-chartjs** (priority doughnut & status bar charts)
- **Tailwind CSS v4** (utility-first styling)
- **Axios** (API integration)

---

## 📁 Project Structure

```
src/
├── assets/
│   └── main.css              # Global styles + Tailwind v4 theme
├── components/
│   ├── charts/
│   │   ├── PriorityChart.vue # Doughnut chart — tasks by priority
│   │   └── StatusChart.vue   # Bar chart — tasks by status
│   ├── layout/
│   │   ├── AppSidebar.vue    # Fixed left sidebar with nav
│   │   └── AppHeader.vue     # Sticky top header
│   ├── table/
│   │   └── DataTable.vue     # TanStack Table — search, sort, paginate, delete
│   └── ui/
│       ├── BadgeLabel.vue    # Status/priority badge component
│       └── StatCard.vue      # KPI stat card component
├── pages/
│   ├── DashboardPage.vue     # Main dashboard (table + charts)
│   ├── TasksTablePage.vue    # Full tasks table with delete
│   └── AddTaskPage.vue       # Add new task form
├── router/
│   └── index.ts              # Vue Router config
├── services/
│   └── taskService.ts        # Axios API service layer
├── stores/
│   └── taskStore.ts          # Pinia store (CRUD + computed stats)
└── types/
    └── index.ts              # TypeScript interfaces
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start dev server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

---

## 🌐 API Endpoints

Base URL: `https://task-management-virid-omega.vercel.app`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/test/tasks` | Fetch all tasks |
| POST | `/test/tasks` | Create a new task |
| GET | `/test/tasks/:id` | Get single task |
| PUT | `/test/tasks/:id` | Update task |
| DELETE | `/test/tasks/:id` | Delete task |

---

## 📋 Features

### Dashboard Page (`/`)
- 4 KPI stat cards (Total, In Progress, Completed, Completion Rate)
- Data table with search + pagination (recent tasks)
- Priority Doughnut Chart (Chart.js)
- Status Bar Chart (Chart.js)
- Quick "Add Task" CTA button

### All Tasks Page (`/tasks`)
- Full TanStack Table with global search, column sorting, pagination
- Delete button on each row (with confirmation modal)
- Error handling banner

### Add Task Page (`/tasks/new`)
- Reactive form with full validation
- Fields: Title, Assignee Email, Status, Priority, Start Date, End Date
- Live badge preview
- Success redirect to tasks page

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | Blue 600 `#2563eb` |
| Surface | Slate 50 `#f8fafc` |
| Panel | White `#ffffff` |
| Border | Slate 100/200 |
| Font | DM Sans + DM Mono |

### Priority Colors
- 🔵 Low — Slate
- 🟡 Medium — Amber
- 🟠 High — Orange
- 🔴 Critical — Red

### Status Colors
- ⚪ Todo — Slate
- 🔵 In Progress — Blue
- 🟢 Done — Emerald
- 🔴 Cancelled — Rose
