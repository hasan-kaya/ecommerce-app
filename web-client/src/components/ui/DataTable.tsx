'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onCreate?: () => void;
  createLabel?: string;
  isLoading?: boolean;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  title?: string;
  description?: string;
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onCreate,
  createLabel = 'Create New',
  isLoading = false,
  currentPage,
  totalPages,
  onPageChange,
  title,
  description,
}: DataTableProps<T>) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (item: T) => {
    if (!onDelete) return;

    if (window.confirm('Are you sure you want to delete this item?')) {
      setDeletingId(item.id);
      try {
        await onDelete(item);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>
        {onCreate && <Button onClick={onCreate}>{createLabel}</Button>}
      </div>
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {column.render
                          ? column.render(item)
                          : String(
                              (item as Record<string, unknown>)[column.key] ||
                                '-'
                            )}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {onEdit && (
                            <Button
                              onClick={() => onEdit(item)}
                              variant="success"
                            >
                              Edit
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              onClick={() => handleDelete(item)}
                              disabled={deletingId === item.id}
                              variant="danger"
                            >
                              {deletingId === item.id
                                ? 'Deleting...'
                                : 'Delete'}
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages && totalPages > 1 && onPageChange && currentPage && (
          <div className="px-6 py-4 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </>
  );
}
