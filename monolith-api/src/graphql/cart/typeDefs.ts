export const cartTypeDefs = `#graphql
  type CartItem {
    id: ID!
    product: Product!
    qty: Int!
  }

  type Cart {
    id: ID!
    cartItems: [CartItem!]!
    totalPrice: String!
  }

  extend type Query {
    cart: Cart
  }

  extend type Mutation {
    addToCart(productId: ID!, qty: Int!): CartItem!
    updateCartItemQuantity(cartItemId: ID!, qty: Int!): Cart!
    removeCartItem(cartItemId: ID!): Cart!
  }
`;
