import { Order } from '@/entities/Order';
import { GraphQLContext, requireAuth } from '@/graphql/utils/auth';
import { OrderService } from '@/services/OrderService';

const orderService = new OrderService();

interface CheckoutArgs {
  walletCurrency: string;
}

export const orderResolvers = {
  Query: {
    orders: async (
      _: unknown,
      { page, pageSize }: { page?: number; pageSize?: number },
      context: GraphQLContext
    ) => {
      const userId = requireAuth(context);
      return orderService.getUserOrders(userId, page, pageSize);
    },
  },
  Mutation: {
    checkout: async (_: any, { walletCurrency }: CheckoutArgs, context: GraphQLContext) => {
      const userId = requireAuth(context);
      const order = await orderService.createOrder(walletCurrency, userId);
      return order;
    },
  },
  Order: {
    status: (parent: Order) => parent.status.toUpperCase(),
    createdAt: (parent: Order) => parent.createdAt.toISOString(),
  },
};
