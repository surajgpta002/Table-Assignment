import React from "react";

interface PaginationProps {
  pageIndex: number;
  totalPages: number;
  setPageIndex: (index: number) => void;
}

const no_of_pagesBox = import.meta.env.VITE_NO_OF_PAGES;

const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  totalPages,
  setPageIndex,
}) => {
  return (
    <div className="pagination-controls">
      <button
        onClick={() => setPageIndex(pageIndex - 1)}
        disabled={pageIndex === 0}
        className="pagination-button"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .slice(
          Math.floor(pageIndex / no_of_pagesBox) * no_of_pagesBox,
          Math.floor(pageIndex / no_of_pagesBox) * no_of_pagesBox +
            no_of_pagesBox
        )
        .map((page) => (
          <button
            key={page}
            onClick={() => setPageIndex(page - 1)}
            className={`pagination-button ${
              pageIndex + 1 === page ? "active" : ""
            }`}
          >
            {page}
          </button>
        ))}

      <button
        onClick={() => setPageIndex(pageIndex + 1)}
        disabled={pageIndex + 1 >= totalPages}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
