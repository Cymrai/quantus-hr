'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, TrendingUp, Settings, LogOut, Timer, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useRouter } from 'next/navigation';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/employees', label: 'Employees', icon: Users },
  { href: '/performance', label: 'Performance', icon: TrendingUp },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/pomodoro', label: 'Pomodoro', icon: Timer },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-brand-700">Quantus HR</h1>
        <p className="text-xs text-gray-400 mt-0.5">Smart Performance Platform</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors', pathname.startsWith(href) ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100')}>
            <Icon className="w-4 h-4" /> {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button onClick={() => { logout(); router.push('/login'); }} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
