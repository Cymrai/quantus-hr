import { StatsCard } from '@/components/ui/StatsCard';
import { Users, TrendingUp, Clock, CheckSquare } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Employees" value="—" icon={<Users className="w-5 h-5" />} />
        <StatsCard title="Avg Performance" value="—" icon={<TrendingUp className="w-5 h-5" />} />
        <StatsCard title="Active Tasks" value="—" icon={<CheckSquare className="w-5 h-5" />} />
        <StatsCard title="Hours Logged" value="—" icon={<Clock className="w-5 h-5" />} />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-500 text-sm">Connect your data sources to see live metrics here.</p>
      </div>
    </div>
  );
}
