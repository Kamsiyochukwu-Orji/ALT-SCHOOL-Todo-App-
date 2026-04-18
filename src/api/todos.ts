import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";

const TASKS_QUERY_KEY = ["tasks"];

const DEFAULT_META = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const normalizeTask = (task) => {
  const status = String(task.status ?? "TODO");
  const priority = String(task.priority ?? "LOW");

  return {
    id: String(task.id ?? ""),
    title: String(task.name ?? "Untitled task"),
    description: String(task.description ?? ""),
    status,
    priority,
    completed: status === "DONE",
    archived: Boolean(task.archived ?? false),
    start: task.start ?? null,
    end: task.end ?? null,
    duration: task.duration ?? null,
    isDefault: task.isDefault ?? null,
    parentId: task.parentId ?? null,
    children: task.children ?? null,
    owner: task.owner ?? null,
    tags: task.tags ?? null,
    completedAt: task.completedAt ?? null,
    createdAt: task.createdAt ?? null,
    updatedAt: task.updatedAt ?? null,
  };
};

const normalizeListResponse = (responseData) => ({
  data: Array.isArray(responseData?.data) ? responseData.data.map(normalizeTask) : [],
  meta: responseData?.meta ? { ...DEFAULT_META, ...responseData.meta } : DEFAULT_META,
});

const emptyToNull = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === "string" && !value.trim()) {
    return null;
  }

  return value;
};

const normalizeNumberField = (value) => {
  const normalized = emptyToNull(value);
  if (normalized === null) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? null : parsed;
};

const toTaskPayload = (payload) => ({
  name: payload.title?.trim() ?? payload.name?.trim() ?? "",
  description: emptyToNull(payload.description?.trim()),
  status: payload.status ?? "TODO",
  priority: payload.priority ?? "LOW",
  archived: payload.archived ?? false,
  // The API currently rejects date-only strings from form inputs for these fields.
  // Send null instead of raw strings to avoid Zod invalid_type failures.
  start: null,
  end: null,
  duration: normalizeNumberField(payload.duration),
  isDefault: payload.isDefault === "" ? null : payload.isDefault ?? null,
  parentId: emptyToNull(payload.parentId),
  children: payload.children?.trim() ?? "",
  owner: emptyToNull(payload.owner),
  tags: emptyToNull(payload.tags),
  completedAt: null,
});

export const listTodos = async ({ page = 1, limit = 10, search = "", status = "all", sort = "DESC", all }) => {
  const params = {
    page,
    limit,
    sort,
  };

  if (typeof all === "boolean") {
    params.all = all;
  }

  if (search.trim()) {
    params.search = search.trim();
  }

  if (status !== "all") {
    params.status = status;
  }

  const { data } = await apiClient.get("/tasks", { params });
  return normalizeListResponse(data);
};

export const getTodoById = async (id) => {
  const { data } = await apiClient.get(`/tasks/${id}`);
  return normalizeTask(data);
};

export const createTodo = async (payload) => {
  const { data } = await apiClient.post("/tasks", toTaskPayload(payload));
  return normalizeTask(data);
};

export const updateTodo = async ({ id, payload }) => {
  const { data } = await apiClient.patch(`/tasks/${id}`, toTaskPayload(payload));
  return normalizeTask(data);
};

export const deleteTodo = async (id) => {
  await apiClient.delete(`/tasks/${id}`);
  return id;
};

export const useTodosQuery = (params) =>
  useQuery({
    queryKey: [...TASKS_QUERY_KEY, params],
    queryFn: () => listTodos(params),
  });

export const useTodoDetailsQuery = (todoId) => {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, todoId],
    queryFn: () => getTodoById(todoId),
    enabled: Boolean(todoId),
  });
};

export const useCreateTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};

export const useUpdateTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...TASKS_QUERY_KEY, variables.id] });
    },
  });
};

export const useDeleteTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: [...TASKS_QUERY_KEY, id] });
    },
  });
};
