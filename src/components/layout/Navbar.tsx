'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  selectedRange?: string;
  onRangeChange?: (range: string) => void;
}

export default function Navbar({
  selectedRange = '30d',
  onRangeChange,
}: NavbarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDateRange, setActiveDateRange] = useState(selectedRange);

  const getPageTitle = () => {
    switch (pathname) {
      case '/':
      case '/dashboard':
        return 'Dashboard';
      case '/content':
        return 'Content Analytics';
      case '/viewers':
        return 'Viewer Analytics';
      case '/engagement':
        return 'Engagement';
      case '/revenue':
        return 'Revenue';
      case '/reports':
        return 'Reports';
      case '/settings':
        return 'Settings';
      default:
        return 'Analytics';
    }
  };

  const handleRangeSelect = (val: string) => {
    setActiveDateRange(val);
    if (onRangeChange) onRangeChange(val);
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-8 bg-[#0D0F14]/90 backdrop-blur-md border-b border-[#1B1F2A]">
      {/* Page Title */}
      <h1 className="text-base font-semibold text-white tracking-tight">
        {getPageTitle()}
      </h1>

      {/* Center/Right Controls */}
      <div className="flex items-center gap-4">
        {/* Simple Search */}
        <div className="relative hidden sm:block w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg bg-[#141720] text-gray-200 placeholder-gray-500 border border-[#1E2330] focus:border-red-500/60 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center bg-[#141720] border border-[#1E2330] rounded-lg p-0.5 text-xs">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => handleRangeSelect(r)}
              className={cn(
                'px-2.5 py-1 rounded font-medium transition-colors',
                activeDateRange === r
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              )}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Clean Avatar */}
        <div className="flex items-center gap-2 pl-2">
          <div className="w-7 h-7 rounded-full bg-[#1F2432] text-gray-300 font-semibold text-xs flex items-center justify-center border border-[#2B3245]">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
