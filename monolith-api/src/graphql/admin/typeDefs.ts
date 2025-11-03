export const adminTypeDefs = `#graphql
  type AdminStats {
    totalOrders: Int!
    totalUsers: Int!
    totalProducts: Int!
    totalRevenue: String!
  }

  extend type Query {
    adminStats: AdminStats!
  }
`;
