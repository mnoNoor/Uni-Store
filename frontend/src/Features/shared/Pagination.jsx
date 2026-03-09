export default function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      <span className="text-sm font-medium text-gray-700">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
