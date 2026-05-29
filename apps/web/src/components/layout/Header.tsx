'use client';
import { Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        <button className="relative p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-medium">U</div>
      </div>
    </header>
  );
}
