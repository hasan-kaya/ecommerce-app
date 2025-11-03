import { getClient } from '@/lib/graphql/client';
import { GET_ADMIN_STATS } from '@/graphql/queries/admin';

export interface AdminStats {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalRevenue: string;
}

export async function getAdminStats(): Promise<AdminStats> {
  const client = await getClient();
  const { data } = await client.query({
    query: GET_ADMIN_STATS,
  });
  return (data as { adminStats: AdminStats }).adminStats;
}
