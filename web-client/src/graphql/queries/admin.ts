import { gql } from '@apollo/client';

export const GET_ADMIN_STATS = gql`
  query GetAdminStats {
    adminStats {
      totalOrders
      totalUsers
      totalProducts
      totalRevenue
    }
  }
`;
