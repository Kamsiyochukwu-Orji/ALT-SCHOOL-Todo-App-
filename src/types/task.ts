export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  completed: boolean;
  archived: boolean;
  start: string | null;
  end: string | null;
  duration: number | null;
  isDefault: boolean | null;
  parentId: string | null;
  children: string | null;
  owner: string | null;
  tags: string | null;
  completedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface TaskMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TaskListResponse {
  data: Task[];
  meta: TaskMeta;
}

export interface ListTodosParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
  all?: boolean;
}

export interface UpdateTodoInput {
  id: string;
  payload: Partial<Task>;
}