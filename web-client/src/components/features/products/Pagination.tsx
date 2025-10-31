'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/products?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="ghost"
      >
        Previous
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => handlePageChange(page)}
          variant={currentPage === page ? 'primary' : 'ghost'}
        >
          {page}
        </Button>
      ))}

      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="ghost"
      >
        Next
      </Button>
    </div>
  );
}
