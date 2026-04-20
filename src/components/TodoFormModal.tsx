import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Task } from "../types/task";

interface TodoFormValues {
  title: string;
  description: string;
  status: string;
  priority: string;
  archived: boolean;
  start: string;
  end: string;
  duration: string | number;
  isDefault: string;
  parentId: string;
  children: string;
  owner: string;
  tags: string;
  completedAt: string;
}
interface TodoFormModalProps {
  open: boolean;
  initialTodo?: Task | null;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
  isSubmitting?: boolean;
}
const EMPTY_FORM = {
  title: "",
  description: "",
  status: "TODO",
  priority: "LOW",
  archived: false,
  start: "",
  end: "",
  duration: "",
  isDefault: "",
  parentId: "",
  children: "",
  owner: "",
  tags: "",
  completedAt: "",
};

const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "DONE", "CANCELLED"];
const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"];
const toDateInputValue = (value:unknown) => {
  if (!value) {
    return "";
  }
  return String(value).slice(0, 10);
};

export const TodoFormModal = ({
  open,
  initialTodo,
  onClose,
  onSubmit,
  isSubmitting,
}:TodoFormModalProps) => {
  const [formValues, setFormValues] = useState<TodoFormValues>(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialTodo) {
      setFormValues({
        title: initialTodo.title,
        description: initialTodo.description,
        status: initialTodo.status ?? "TODO",
        priority: initialTodo.priority ?? "LOW",
        archived: Boolean(initialTodo.archived),
        start: toDateInputValue(initialTodo.start),
        end: toDateInputValue(initialTodo.end),
        duration: initialTodo.duration ?? "",
        isDefault:
          initialTodo.isDefault === null ? "" : String(initialTodo.isDefault),
        parentId: initialTodo.parentId ?? "",
        children: initialTodo.children ?? "",
        owner: initialTodo.owner ?? "",
        tags: initialTodo.tags ?? "",
        completedAt: toDateInputValue(initialTodo.completedAt),
      });
      return;
    }

    setFormValues(EMPTY_FORM);
  }, [open, initialTodo]);

  if (!open) {
    return null;
  }

  const handleChange = (event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, type } = event.target;

    const value =
      type === "checkbox"
        ? (event.target as HTMLInputElement).checked
        : event.target.value;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    
  };

  const handleSubmit = (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formValues.title.trim()) {
      setError("Title is required.");
      return;
    }

    setError("");
    onSubmit({
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      status: formValues.status,
      priority: formValues.priority,
      archived: formValues.archived,
      start: formValues.start,
      end: formValues.end,
      duration: formValues.duration,
      isDefault:
        formValues.isDefault === "" ? null : formValues.isDefault === "true",
      parentId: formValues.parentId,
      children: formValues.children,
      owner: formValues.owner,
      tags: formValues.tags,
      completedAt: formValues.completedAt,
    });
  };

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <section
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="todo-dialog-heading"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="todo-dialog-heading">
          {initialTodo ? "Edit todo" : "Create todo"}
        </h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form__label" htmlFor="todo-title">
            Title
          </label>
          <input
            id="todo-title"
            name="title"
            type="text"
            className="form__input"
            value={formValues.title}
            onChange={handleChange}
            required
          />
          <label className="form__label" htmlFor="todo-description">
            Description
          </label>
          <textarea
            id="todo-description"
            name="description"
            className="form__input form__input--textarea"
            value={formValues.description}
            onChange={handleChange}
            rows={4}
          />
          <label className="form__label" htmlFor="todo-status">
            Status
          </label>
          <select
            id="todo-status"
            name="status"
            className="form__input"
            value={formValues.status}
            onChange={handleChange}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <label className="form__label" htmlFor="todo-priority">
            Priority
          </label>
          <select
            id="todo-priority"
            name="priority"
            className="form__input"
            value={formValues.priority}
            onChange={handleChange}
          >
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          <label className="form__checkbox">
            <input
              name="archived"
              type="checkbox"
              checked={formValues.archived}
              onChange={handleChange}
            />
            Archived
          </label>
          <label className="form__label" htmlFor="todo-start">
            Start date
          </label>
          <input
            id="todo-start"
            name="start"
            type="date"
            className="form__input"
            value={formValues.start}
            onChange={handleChange}
          />
          <label className="form__label" htmlFor="todo-end">
            End date
          </label>
          <input
            id="todo-end"
            name="end"
            type="date"
            className="form__input"
            value={formValues.end}
            onChange={handleChange}
          />
          <label className="form__label" htmlFor="todo-duration">
            Duration
          </label>
          <input
            id="todo-duration"
            name="duration"
            type="number"
            min="0"
            className="form__input"
            value={formValues.duration}
            onChange={handleChange}
          />
          <label className="form__label" htmlFor="todo-is-default">
            Is default
          </label>
          <select
            id="todo-is-default"
            name="isDefault"
            className="form__input"
            value={formValues.isDefault}
            onChange={handleChange}
          >
            <option value="">Unset</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <label className="form__label" htmlFor="todo-parent-id">
            Parent ID
          </label>
          <input
            id="todo-parent-id"
            name="parentId"
            type="text"
            className="form__input"
            value={formValues.parentId}
            onChange={handleChange}
          />
          <label className="form__label" htmlFor="todo-children">
            Children
          </label>
          <input
            id="todo-children"
            name="children"
            type="text"
            className="form__input"
            value={formValues.children}
            onChange={handleChange}
          />
          <label className="form__label" htmlFor="todo-owner">
            Owner
          </label>
          <input
            id="todo-owner"
            name="owner"
            type="text"
            className="form__input"
            value={formValues.owner}
            onChange={handleChange}
          />
          <label className="form__label" htmlFor="todo-tags">
            Tags
          </label>
          <input
            id="todo-tags"
            name="tags"
            type="text"
            className="form__input"
            value={formValues.tags}
            onChange={handleChange}
          />
          <label className="form__label" htmlFor="todo-completed-at">
            Completed at
          </label>
          <input
            id="todo-completed-at"
            name="completedAt"
            type="date"
            className="form__input"
            value={formValues.completedAt}
            onChange={handleChange}
          />
          {error ? (
            <p className="form__error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="dialog__actions">
            <button
              type="button"
              className="button button--secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
