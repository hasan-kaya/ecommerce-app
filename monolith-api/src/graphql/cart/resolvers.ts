import { GraphQLContext, requireAuth } from '@/graphql/utils/auth';
import { CartService } from '@/services/CartService';

const cartService = new CartService();

interface AddToCartArgs {
  productId: string;
  qty: number;
}

export const cartResolvers = {
  Query: {
    cart: async (_: any, __: any, context: GraphQLContext) => {
      const userId = requireAuth(context);
      const cart = await cartService.getUserCart(userId);
      return cart;
    },
  },
  Mutation: {
    addToCart: async (_: any, { productId, qty }: AddToCartArgs, context: GraphQLContext) => {
      const userId = requireAuth(context);
      await cartService.addToCart(userId, productId, qty);
      return cartService.getUserCart(userId);
    },
    updateCartItemQuantity: async (
      _: any,
      { cartItemId, qty }: { cartItemId: string; qty: number },
      context: GraphQLContext
    ) => {
      const userId = requireAuth(context);
      const cart = await cartService.updateCartItemQuantity(userId, cartItemId, qty);

      return cart;
    },
    removeCartItem: async (
      _: any,
      { cartItemId }: { cartItemId: string },
      context: GraphQLContext
    ) => {
      const userId = requireAuth(context);
      const cart = await cartService.removeCartItem(userId, cartItemId);
      return cart;
    },
  },
  CartItem: {
    product: (parent: any) => parent.product,
  },
};
