type StatCardProps = {
  title: string;
  value: string | number;
  icon?: string;
  color?: string;
};

export default function StatCard({ title, value, icon, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        {icon && (
          <div className={`w-12 h-12 ${colorClasses[color as keyof typeof colorClasses]} rounded-full flex items-center justify-center text-white text-xl`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
