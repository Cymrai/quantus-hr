import { ReactNode } from 'react';

interface Props { title: string; value: string | number; icon: ReactNode; trend?: string; }

export function StatsCard({ title, value, icon, trend }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 font-medium">{title}</span>
        <span className="p-2 bg-brand-50 text-brand-600 rounded-lg">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
    </div>
  );
}
