import { Link, useLocation, useOutletContext, useParams } from "react-router-dom";
import { useTodoDetailsQuery } from "../api/todos";
import { Seo } from "../shared/Seo";

const formatStatusLabel = (status) => status.replace("_", " ");
const formatFieldValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Unavailable";
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return String(value);
};

export default function TodoDetailsPage() {
  const location = useLocation();
  const { todoId } = useParams();
  const { onEdit } = useOutletContext();
  const listBasePath = location.pathname.startsWith("/my-tasks") ? "/my-tasks" : "/todos";
  const { data: todo, isLoading, isError, error } = useTodoDetailsQuery(todoId);

  if (isLoading) {
    return <p aria-live="polite">Loading details...</p>;
  }

  if (isError) {
    return (
      <section role="alert">
        <h2>Could not load todo details</h2>
        <p>{error?.message ?? "Unknown API error."}</p>
        <Link className="button button--secondary" to={listBasePath}>
          Back to list
        </Link>
      </section>
    );
  }

  return (
    <article>
      <Seo
        title={todo.title}
        description={todo.description || "Detailed view of the selected todo item."}
      />
      <header className="details-header">
        <h2>{todo.title}</h2>
        <button type="button" className="button button--secondary" onClick={() => onEdit(todo)}>
          Edit todo
        </button>
      </header>
      <p>
        <strong>ID:</strong> {formatFieldValue(todo.id)}
      </p>
      <p>
        <strong>Status:</strong> {formatStatusLabel(todo.status)}
      </p>
      <p>
        <strong>Priority:</strong> {todo.priority}
      </p>
      <p>
        <strong>Description:</strong> {todo.description || "No description provided."}
      </p>
      <p>
        <strong>Archived:</strong> {todo.archived ? "true" : "false"}
      </p>
      <p>
        <strong>Start:</strong> {formatFieldValue(todo.start)}
      </p>
      <p>
        <strong>End:</strong> {formatFieldValue(todo.end)}
      </p>
      <p>
        <strong>Duration:</strong> {formatFieldValue(todo.duration)}
      </p>
      <p>
        <strong>Is Default:</strong> {formatFieldValue(todo.isDefault)}
      </p>
      <p>
        <strong>Parent ID:</strong> {formatFieldValue(todo.parentId)}
      </p>
      <p>
        <strong>Children:</strong> {formatFieldValue(todo.children)}
      </p>
      <p>
        <strong>Owner:</strong> {formatFieldValue(todo.owner)}
      </p>
      <p>
        <strong>Tags:</strong> {formatFieldValue(todo.tags)}
      </p>
      <p>
        <strong>Completed At:</strong> {formatFieldValue(todo.completedAt)}
      </p>
      <p>
        <strong>Created:</strong> {formatFieldValue(todo.createdAt)}
      </p>
      <p>
        <strong>Last Updated:</strong> {formatFieldValue(todo.updatedAt)}
      </p>
      <Link className="button button--secondary" to={listBasePath}>
        Back to list
      </Link>
    </article>
  );
}
