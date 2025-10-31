export const authTypeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
  }

  type AuthPayload {
    user: User!
    access_token: String!
    refresh_token: String!
    expires_in: Int!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    name: String!
    password: String!
  }

  extend type Query {
    me: User!
  }

  extend type Mutation {
    login(input: LoginInput!): AuthPayload!
    register(input: RegisterInput!): AuthPayload!
    refreshToken(refreshToken: String!): AuthPayload!
  }
`;
