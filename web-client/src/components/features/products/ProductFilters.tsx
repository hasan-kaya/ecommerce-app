'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Label from '@/components/ui/Label';
import Input from '@/components/ui/Input';

type ProductFiltersProps = {
  searchQuery: string;
  categories: string[];
  selectedCategory: string | null;
  minPrice: number;
  maxPrice: number;
};

export default function ProductFilters({
  searchQuery,
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const priceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (priceTimeoutRef.current) clearTimeout(priceTimeoutRef.current);
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

  const handlePriceChange = (min: number, max: number) => {
    if (priceTimeoutRef.current) {
      clearTimeout(priceTimeoutRef.current);
    }
    
    priceTimeoutRef.current = setTimeout(() => {
      updateURL({ 
        minPrice: min.toString(), 
        maxPrice: max.toString(),
        page: '1'
      });
    }, 500);
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
          <Label variant="inline">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === null}
              onChange={() => handleCategoryChange(null)}
            />
            <span>All</span>
          </Label>
          {categories.map((category) => (
            <Label key={category} variant="inline">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category}
                onChange={() => handleCategoryChange(category)}
              />
              <span>{category}</span>
            </Label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Price Range</h4>
        <div className="flex gap-2">
          <div className="flex-1">
            <Label variant="small">Min</Label>
            <Input
              type="number"
              defaultValue={minPrice}
              onChange={(e) => handlePriceChange(Number(e.target.value), maxPrice)}
              min="0"
            />
          </div>
          <div className="flex-1">
            <Label variant="small">Max</Label>
            <Input
              type="number"
              defaultValue={maxPrice}
              onChange={(e) => handlePriceChange(minPrice, Number(e.target.value))}
              min="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
