export const cartTypeDefs = `#graphql
  type CartItem {
    id: ID!
    product: Product!
    qty: Int!
  }

  type Cart {
    id: ID!
    cartItems: [CartItem!]!
  }

  extend type Mutation {
    addToCart(productId: ID!, qty: Int!): CartItem!
  }
`;
