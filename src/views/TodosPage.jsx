import { useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useTodosQuery,
  useUpdateTodoMutation,
} from "../api/todos";
import { useAuth } from "../auth/AuthProvider";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Pagination } from "../components/Pagination";
import { TodoFormModal } from "../components/TodoFormModal";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { Seo } from "../shared/Seo";
import {toast} from 'sonner'

const PAGE_SIZE = 10;
const STATUS_FILTERS = ["all", "TODO", "IN_PROGRESS", "DONE", "CANCELLED"];

const formatStatusLabel = (status) => status.replace("_", " ");

export default function TodosPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { todoId } = useParams();
  const isMyTasksView = location.pathname.startsWith("/my-tasks");
  const basePath = isMyTasksView ? "/my-tasks" : "/todos";
  const canManageTasks = isAuthenticated;
  const createTodoMutation = useCreateTodoMutation();
  const updateTodoMutation = useUpdateTodoMutation();
  const deleteTodoMutation = useDeleteTodoMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const queryParams = {
    page,
    limit: PAGE_SIZE,
    search: debouncedSearchTerm,
    status: statusFilter,
    sort: "DESC",
  };
  const {
    data: tasksResponse,
    isLoading,
    isError,
    error,
  } = useTodosQuery(queryParams);
  const tasks = tasksResponse?.data ?? [];
  const meta = tasksResponse?.meta;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingTodo, setDeletingTodo] = useState(null);

  const handleOpenCreate = () => {
    setEditingTodo(null);
    setIsFormOpen(true);
  };

  const handleCreateOrEdit = async (payload) => {
    if (editingTodo) {
      await updateTodoMutation.mutateAsync({
        id: editingTodo.id,
        payload,
      });
    } else {
      await createTodoMutation.mutateAsync(payload);
    }

    setIsFormOpen(false);
    setEditingTodo(null);
  };

  const handleOpenEdit = (todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingTodo) return;
  
    const deletedId = deletingTodo.id;
  
    try {
      await deleteTodoMutation.mutateAsync(deletedId);
  
      toast.success("Task deleted successfully"); 
  
      setDeletingTodo(null);
  
      if (todoId === deletedId) navigate(basePath);
    } catch (error) {
      toast.error("Failed to delete task"); 
    }
  };
  if (isLoading) {
    return (
      <section className="state-card" aria-live="polite">
        <Seo title="Loading todos" description="Loading your todo list." />
        <h1>Loading tasks...</h1>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="state-card" role="alert">
        <Seo
          title="Todo list error"
          description="There was an error loading the todo list."
        />
        <h1>Could not load tasks</h1>
        <p>{error?.message ?? "Unknown API error."}</p>
      </section>
    );
  }

  return (
    <section className="todos-layout">
      <Seo
        title={isMyTasksView ? "My tasks" : "All tasks"}
        description="View and manage tasks with pagination, searching, and status filters."
      />
      <section className="card">
        <header className="todos-header">
          <h1>{isMyTasksView ? "My Tasks" : "All Tasks"}</h1>
          <div className="todo-item__actions">
            {!isMyTasksView && isAuthenticated ? (
              <Link to="/my-tasks" className="button button--secondary">
                View my tasks
              </Link>
            ) : null}
            {isMyTasksView ? (
              <Link to="/todos" className="button button--secondary">
                View all tasks
              </Link>
            ) : null}
            {canManageTasks ? (
              <button
                type="button"
                className="button button--primary"
                onClick={handleOpenCreate}
              >
                Add todo
              </button>
            ) : null}
          </div>
        </header>
        <form className="filters" role="search" aria-label="Todo filters">
          <div className="filters__field">
            <label htmlFor="search-todos">Search by title</label>
            <input
              id="search-todos"
              type="search"
              className="form__input"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              placeholder="Type a title..."
            />
          </div>
          <div className="filters__field">
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              className="form__input"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
            >
              {STATUS_FILTERS.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All" : formatStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </form>
        <p className="filters__result-count" aria-live="polite">
          Showing {tasks.length} of {meta?.total ?? 0} tasks
          {searchTerm !== debouncedSearchTerm ? " (updating search...)" : ""}
        </p>
        {tasks.length === 0 ? (
          <p>No tasks match your filters.</p>
        ) : (
          <ul className="todo-list">
            {tasks.map((todo) => {
              const isSelected = todoId === todo.id;

              return (
                <li
                  key={todo.id}
                  className={
                    isSelected ? "todo-item todo-item--selected" : "todo-item"
                  }
                >
                  <article>
                    <h2>
                      <Link
                        to={`${basePath}/${todo.id}`}
                        className="todo-item__link"
                      >
                        {todo.title}
                      </Link>
                    </h2>
                    <p>
                      <strong>Status:</strong> {formatStatusLabel(todo.status)}
                    </p>
                    <div className="todo-item__actions">
                      {canManageTasks ? (
                        <>
                          <button
                            type="button"
                            className="button button--secondary"
                            onClick={() => handleOpenEdit(todo)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="button button--danger"
                            onClick={() => setDeletingTodo(todo)}
                          >
                            Delete
                          </button>
                        </>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
        <Pagination
          currentPage={meta?.page ?? page}
          totalPages={meta?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </section>

      <section className={`card card--details ${todoId ? "is-open" : ""}`}>
        {todoId ? (
          <Outlet context={{ onEdit: handleOpenEdit }} />
        ) : (
          <article>
            <h2>Todo details</h2>
            <p>Select a task from the list to view its full details.</p>
          </article>
        )}
      </section>

      <TodoFormModal
        open={isFormOpen}
        initialTodo={editingTodo}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={handleCreateOrEdit}
        isSubmitting={
          createTodoMutation.isPending || updateTodoMutation.isPending
        }
      />

      <ConfirmDialog
        open={Boolean(deletingTodo)}
        title="Delete this todo?"
        message="This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteTodoMutation.isPending}
        onCancel={() => setDeletingTodo(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
