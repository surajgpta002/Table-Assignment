import React from "react";

interface PaginationProps {
  pageIndex: number;
  totalPages: number;
  setPageIndex: (index: number) => void;
}

const no_of_pagesBox = Number(import.meta.env.VITE_NO_OF_PAGES);

const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  totalPages,
  setPageIndex,
}) => {
  const startPage = Math.floor(pageIndex / no_of_pagesBox) * no_of_pagesBox;
  const endPage = Math.min(startPage + no_of_pagesBox, totalPages);

  return (
    <div className="pagination-controls">
      <button
        onClick={() => setPageIndex(pageIndex - 1)}
        disabled={pageIndex === 0}
        className="pagination-button"
      >
        Previous
      </button>

      {Array.from(
        { length: endPage - startPage },
        (_, i) => startPage + i + 1
      ).map((page) => (
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
