'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Input from '@/components/ui/Input';
import FormRadio from '@/components/ui/FormRadio';

type ProductFiltersProps = {
  searchQuery: string;
  categories: string[];
  selectedCategory: string | null;
};

export default function ProductFilters({
  searchQuery,
  categories,
  selectedCategory,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/products?${params.toString()}`);
  };

  const handleSearchChange = (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      updateURL({ search: query, page: '1' });
    }, 500);
  };

  const handleCategoryChange = (category: string | null) => {
    updateURL({ category, page: '1' });
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-bold text-lg mb-4">Filters</h3>

      <div className="mb-6">
        <h4 className="font-semibold mb-3">Search</h4>
        <Input
          type="text"
          defaultValue={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search products..."
        />
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-3">Category</h4>
        <div className="space-y-2">
          <FormRadio
            name="category"
            checked={selectedCategory === null}
            onChange={() => handleCategoryChange(null)}
            label="All"
          />
          {categories.map((category) => (
            <FormRadio
              key={category}
              name="category"
              checked={selectedCategory === category}
              onChange={() => handleCategoryChange(category)}
              label={category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
