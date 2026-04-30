'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  hasNextPage: _hasNextPage,
  hasPreviousPage: _hasPreviousPage,
  onPageChange
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, idx) => idx + 1);

  return (
    <div className="my-8 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#9aa8c7] bg-white text-[#64748b]"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`h-9 w-9 rounded-lg border text-sm font-semibold ${
            currentPage === page
              ? 'border-[#0d56d8] bg-[#0d56d8] text-white'
              : 'border-[#9aa8c7] bg-white text-[#1e293b]'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#9aa8c7] bg-white text-[#64748b]"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
