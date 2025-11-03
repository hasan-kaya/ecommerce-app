'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/ui/Pagination';

type ProductPaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function ProductPagination({
  currentPage,
  totalPages,
}: ProductPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/products?${params.toString()}`);
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
