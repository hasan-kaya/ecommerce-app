'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import Pagination from '@/components/ui/Pagination';
import OrdersTable from '@/components/features/order/OrdersTable';
import OrderDetailsModal from '@/components/features/order/OrderDetailsModal';
import { GET_ORDERS } from '@/graphql/queries/order';
import { Order } from '@/graphql/types';

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, loading, error } = useQuery(GET_ORDERS, {
    variables: { page: currentPage, pageSize },
  });

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <p className="text-center py-8 text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <p className="text-center py-8 text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  const orders: Order[] = (data as any)?.orders?.orders || [];
  const total = (data as any)?.orders?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No orders yet</p>
      ) : (
        <>
          <OrdersTable orders={orders} onOrderClick={handleOrderClick} />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
