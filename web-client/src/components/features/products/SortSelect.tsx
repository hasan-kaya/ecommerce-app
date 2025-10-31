'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Label from '@/components/ui/Label';
import Select from '@/components/ui/Select';

type SortSelectProps = {
  currentSort: string;
};

export default function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (sort === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', sort);
    }
    
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Label variant="small" className="font-medium">Sort by:</Label>
      <Select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        variant="small"
      >
        <option value="default">Default</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="price-asc">Price (Low to High)</option>
        <option value="price-desc">Price (High to Low)</option>
      </Select>
    </div>
  );
}
