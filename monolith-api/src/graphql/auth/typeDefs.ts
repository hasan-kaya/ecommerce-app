export const authTypeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
  }
    
  extend type Query {
    me: User!
  }
`;
