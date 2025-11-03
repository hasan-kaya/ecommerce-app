'use client';

import Button from '@/components/ui/Button';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="ghost"
      >
        Previous
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={currentPage === page ? 'primary' : 'ghost'}
        >
          {page}
        </Button>
      ))}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="ghost"
      >
        Next
      </Button>
    </div>
  );
}
