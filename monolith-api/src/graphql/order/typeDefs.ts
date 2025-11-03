export const orderTypeDefs = `#graphql
  enum OrderStatus {
    PENDING
    PAID
    SHIPPED
    DELIVERED
    CANCELLED
    REFUNDED
  }

  type OrderItem {
    id: ID!
    product: Product!
    qty: Int!
    priceMinor: String!
    currency: String!
  }

  type Order {
    id: ID!
    priceMinor: String!
    currency: String!
    status: OrderStatus!
    items: [OrderItem!]!
    createdAt: String!
  }

  extend type Mutation {
    checkout(walletCurrency: String!): Order!
  }
`;
