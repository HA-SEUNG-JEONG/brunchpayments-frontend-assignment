interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  const handlePrevious = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="rounded-lg bg-white border-2 border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-900 transition-all hover:bg-gray-50 hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-gray-300"
      >
        이전
      </button>
      <div className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2.5">
        <span className="text-sm font-bold text-gray-900">{currentPage}</span>
        <span className="text-sm text-gray-600">/</span>
        <span className="text-sm font-bold text-gray-600">{totalPages}</span>
      </div>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="rounded-lg bg-white border-2 border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-900 transition-all hover:bg-gray-50 hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-gray-300"
      >
        다음
      </button>
    </div>
  );
}

