import StatCard from '@/components/features/dashboard/StatCard';

export default function AdminDashboard() {
  // Mock data
  const stats = {
    totalOrders: 1234,
    totalUsers: 567,
    totalProducts: 89,
    totalRevenue: 45678,
  };

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
          value={`$${(stats.totalRevenue / 100).toFixed(2)}`}
          icon="💰"
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Top Products</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
