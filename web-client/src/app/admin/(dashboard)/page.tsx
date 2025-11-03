import StatCard from '@/components/features/admin/dashboard/StatCard';
import { getAdminStats, AdminStats } from '@/lib/graphql/services/admin';
import { formatMoney } from '@/lib/utils/money';

export default async function AdminDashboard() {
  let stats: AdminStats | null = null;
  let error: string | null = null;

  try {
    stats = await getAdminStats();
  } catch (err) {
    console.error('Failed to fetch admin stats:', err);
    error = 'Failed to load dashboard statistics';
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">
          {error || 'Failed to load data'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="📦"
          color="blue"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="green"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon="🛍️"
          color="purple"
        />
        <StatCard
          title="Total Revenue"
          value={`${formatMoney(stats.totalRevenue, 'TRY')}`}
          icon="💰"
          color="yellow"
        />
      </div>
    </div>
  );
}
