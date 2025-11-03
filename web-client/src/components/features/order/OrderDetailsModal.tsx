import Modal from '@/components/ui/Modal';
import { formatMoney } from '@/lib/utils/money';
import { formatDate } from '@/lib/utils/date';
import { Order } from '@/graphql/types';

type OrderDetailsModalProps = {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order #${order.id}`}>
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="font-semibold">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {formatMoney(Number(item.priceMinor) * item.qty, item.currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Total</p>
            <p className="text-2xl font-bold">
              {formatMoney(order.priceMinor, order.currency)}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
