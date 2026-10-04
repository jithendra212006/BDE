'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Film,
  Users,
  Activity,
  DollarSign,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Tv,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Content', href: '/content', icon: Film },
  { name: 'Viewers', href: '/viewers', icon: Users },
  { name: 'Engagement', href: '/engagement', icon: Activity },
  { name: 'Revenue', href: '/revenue', icon: DollarSign },
  { name: 'Reports', href: '/reports', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-[#0E1017] border-r border-[#1B1F2A] transition-all duration-200 ease-in-out z-30 select-none',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-[#1B1F2A]">
        {!collapsed ? (
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 text-white">
              <Tv className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white">
                Stream<span className="text-red-500">Insight</span>
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/" className="mx-auto">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 text-white">
              <Tv className="w-4 h-4" />
            </div>
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-gray-200 hover:bg-[#161922] transition-colors',
            collapsed && 'hidden'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Mini mode expander */}
      {collapsed && (
        <div className="flex justify-center py-2 border-b border-[#1B1F2A]">
          <button
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            className="flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-gray-200 hover:bg-[#161922] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-red-500/10 text-white font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#151822]',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  active ? 'text-red-500' : 'text-gray-400'
                )}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Settings at the bottom */}
      <div className="p-3 border-t border-[#1B1F2A]">
        <Link
          href="/settings"
          title={collapsed ? 'Settings' : undefined}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive('/settings')
              ? 'bg-red-500/10 text-white font-semibold'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#151822]',
            collapsed && 'justify-center px-2'
          )}
        >
          <Settings
            className={cn(
              'w-4 h-4 shrink-0',
              isActive('/settings') ? 'text-red-500' : 'text-gray-400'
            )}
          />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
