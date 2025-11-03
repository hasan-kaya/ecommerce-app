'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import DataTable, { Column } from '@/components/ui/DataTable';
import ProductForm from '@/components/features/admin/products/ProductForm';
import { GET_PRODUCTS } from '@/graphql/queries/products';
import { Product } from '@/graphql/types';
import { DELETE_PRODUCT } from '@/graphql/mutations/product';

interface ProductsResponse {
  products: {
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, loading, refetch } = useQuery<ProductsResponse>(GET_PRODUCTS, {
    variables: { page: currentPage, pageSize },
  });
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const products = data?.products?.products || [];
  const totalPages = data?.products?.totalPages || 1;

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSuccess = async () => {
    await refetch({ page: currentPage, pageSize });
    setIsModalOpen(false);
  };

  const handleDelete = async (product: Product) => {
    try {
      await deleteProduct({
        variables: { id: product.id },
      });
      await refetch({ page: currentPage, pageSize });
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: Column<Product>[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    {
      key: 'category',
      label: 'Category',
      render: (product) => product.category.name,
    },
    {
      key: 'priceMinor',
      label: 'Price',
      render: (product) => {
        const price = Number(product.priceMinor) / 100;
        return `${price.toFixed(2)}`;
      },
    },
    { key: 'currency', label: 'Currency' },
    { key: 'stockQty', label: 'Stock' },
  ];

  return (
    <>
      <DataTable
        data={products}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        createLabel="Create Product"
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        title="Products"
        description="Manage products"
      />
      <ProductForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSuccess={handleSuccess}
      />
    </>
  );
}
