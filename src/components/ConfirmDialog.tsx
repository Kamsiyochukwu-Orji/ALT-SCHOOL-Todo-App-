import type { FC } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText,
  onCancel,
  onConfirm,
  isLoading,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="dialog-backdrop" role="presentation" onClick={(event)=>{
      if(event.target === event.currentTarget) onCancel();
    }}>
      <section
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-heading"
        aria-describedby = 'confirm-dialog-message'
        onClick={(event)=>event.stopPropagation()}
      >
        <h2 id="confirm-dialog-heading">{title}</h2>
        <p id="confirm-dialog-message">{message}</p>
        <div className="dialog__actions">
          <button
            type="button"
            className="button button--secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </section>
    </div>
  );
};
