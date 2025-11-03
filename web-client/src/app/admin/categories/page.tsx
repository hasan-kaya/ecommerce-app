'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import DataTable, { Column } from '@/components/ui/DataTable';
import CategoryForm from '@/components/features/admin/categories/CategoryForm';
import { GET_CATEGORIES } from '@/graphql/queries/categories';
import { DELETE_CATEGORY } from '@/graphql/mutations/category';
import { Category } from '@/graphql/types';

interface CategoriesResponse {
  categories: {
    categories: Category[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, loading, refetch } = useQuery<CategoriesResponse>(
    GET_CATEGORIES,
    {
      variables: { page: currentPage, pageSize },
    }
  );
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  const categories = data?.categories?.categories || [];
  const totalPages = data?.categories?.totalPages || 1;

  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSuccess = async () => {
    await refetch({ page: currentPage, pageSize });
    setIsModalOpen(false);
  };

  const handleDelete = async (category: Category) => {
    try {
      await deleteCategory({
        variables: { id: category.id },
      });
      await refetch({ page: currentPage, pageSize });
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: Column<Category>[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
  ];

  return (
    <>
      <DataTable
        data={categories}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        createLabel="Create Category"
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        title="Categories"
        description="Manage product categories"
      />
      <CategoryForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSuccess={handleSuccess}
      />
    </>
  );
}
