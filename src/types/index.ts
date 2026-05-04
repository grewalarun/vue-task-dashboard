export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Projects {
  _id: string;
  name: string;
  description: string;
  createdAt: any;
  members: [{
    _id: string;
    name: string;
    email: string;
  }];
  taskStat: {
    todo: number;
    "in-progress": number;
    done: number;
    total: number;
  };
}[]

export interface TaskUser {
  _id: string
  name: string
  email: string
}

export interface Task {
  _id: string
  project: string          // projectId
  title: string
  description?: string
  assignedTo: TaskUser
  createdBy: TaskUser
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string | null
  createdAt?: string
}

export interface Comment {
  _id: string
  text: string
  createdBy: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
}

export interface CreateTaskPayload {
  title: string
  assignedTo: string
  status: TaskStatus
  priority: TaskPriority
  createdAt?: string | null
  dueDate?: string | null
  description?: string
}

export interface CreateProjectPayload {
  name: string
  description?: string
  createdBy: string
  members?: string[]
  admins?: string[]
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginationState {
  pageIndex: number
  pageSize: number
}



// ─── Members ──────────────────────────────────────────────────────────────

export type MemberRole = 'admin' | 'manager' | 'member'

export interface Member {
  _id: string
  name: string
  email: string
  role: MemberRole
}

export interface UpdateRolePayload {
  role: MemberRole
}


// ─── Auth ──────────────────────────────────────────────────────────────────
export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface AuthUser {
  _id: string
  name: string
  email: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'member'

}