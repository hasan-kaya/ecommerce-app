export const productTypeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    slug: String!
    priceMinor: String!
    currency: String!
    stockQty: Int!
    category: Category!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
  }

  extend type Query {
    products(category: String, search: String): [Product!]!
  }
`;
