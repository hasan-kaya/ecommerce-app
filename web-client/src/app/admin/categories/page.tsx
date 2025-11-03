'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/ui/DataTable';
import CategoryForm from '@/components/features/admin/categories/CategoryForm';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Mock data - replace with API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Generate mock data for pagination demo
      const mockCategories = Array.from({ length: 25 }, (_, i) => ({
        id: String(i + 1),
        name: `Category ${i + 1}`,
        slug: `category-${i + 1}`,
      }));
      setCategories(mockCategories);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: { name: string; slug: string }) => {
    // TODO: API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (editingCategory) {
      // Update
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...formData } : cat
        )
      );
    } else {
      // Create
      const newCategory = {
        id: Date.now().toString(),
        ...formData,
      };
      setCategories((prev) => [...prev, newCategory]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (category: Category) => {
    try {
      // TODO: API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCategories((prev) => prev.filter((cat) => cat.id !== category.id));
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(categories.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCategories = categories.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: Column<Category>[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="mt-2 text-gray-600">Manage product categories</p>
      </div>

      <DataTable
        data={paginatedCategories}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        createLabel="Create Category"
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <CategoryForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
