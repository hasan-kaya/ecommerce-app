import { GraphQLContext, requireAuth } from '@/graphql/utils/auth';
import { OrderService } from '@/services/OrderService';

const orderService = new OrderService();

interface CheckoutArgs {
  walletCurrency: string;
}

export const orderResolvers = {
  Mutation: {
    checkout: async (_: any, { walletCurrency }: CheckoutArgs, context: GraphQLContext) => {
      const userId = requireAuth(context);
      const order = await orderService.createOrder(walletCurrency, userId);
      return order;
    },
  },
  Order: {
    priceMinor: (parent: any) => parent.price_minor.toString(),
    createdAt: (parent: any) => parent.created_at,
  },
  OrderItem: {
    priceMinor: (parent: any) => parent.price_minor.toString(),
  },
};
