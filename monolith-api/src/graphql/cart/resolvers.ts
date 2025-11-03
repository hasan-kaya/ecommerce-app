import { GraphQLContext, requireAuth } from '@/graphql/utils/auth';
import { CartService } from '@/services/CartService';

const cartService = new CartService();

interface AddToCartArgs {
  productId: string;
  qty: number;
}

export const cartResolvers = {
  Mutation: {
    addToCart: async (_: any, { productId, qty }: AddToCartArgs, context: GraphQLContext) => {
      const userId = requireAuth(context);
      const cartItem = await cartService.addToCart(userId, productId, qty);

      return cartItem;
    },
  },
  CartItem: {
    product: (parent: any) => parent.product,
  },
};
