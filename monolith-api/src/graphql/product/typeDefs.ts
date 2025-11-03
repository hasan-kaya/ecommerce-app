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

  extend type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }

  input CreateProductInput {
    name: String!
    slug: String!
    priceMinor: String!
    currency: String!
    stockQty: Int!
    categoryId: ID!
  }

  input UpdateProductInput {
    name: String!
    slug: String!
    priceMinor: String!
    currency: String!
    stockQty: Int!
    categoryId: ID!
  }
`;
