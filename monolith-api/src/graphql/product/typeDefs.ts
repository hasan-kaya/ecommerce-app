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

  type ProductsResponse {
    products: [Product!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  extend type Query {
    products(
      category: String
      search: String
      page: Int
      pageSize: Int
    ): ProductsResponse!
  }
`;
