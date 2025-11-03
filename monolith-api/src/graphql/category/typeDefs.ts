export const categoryTypeDefs = `#graphql
  type CategoriesResponse {
    categories: [Category!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  extend type Query {
    categories(page: Int = 1, pageSize: Int = 10): CategoriesResponse!
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }

  input CreateCategoryInput {
    name: String!
    slug: String!
  }

  input UpdateCategoryInput {
    name: String!
    slug: String!
  }
`;
