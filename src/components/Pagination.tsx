export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Todo list pages">
      <button
        type="button"
        className="button button--secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <p className="pagination__status" aria-live="polite">
        Page {currentPage} of {totalPages}
      </p>
      <button
        type="button"
        className="button button--secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
};
