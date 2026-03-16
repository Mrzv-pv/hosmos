"use client";

import { Bell, Search } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-lg sticky top-0 z-10 flex items-center justify-between px-4 md:px-8">
      <div className="ml-10 md:ml-0">
        <h1 className="text-lg md:text-xl font-serif text-gray-900">{title}</h1>
        {subtitle && <p className="text-[10px] md:text-xs text-gray-400 truncate max-w-[200px] md:max-w-none">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <button className="p-2 md:p-2.5 rounded-xl hover:bg-gray-100 transition-all">
          <Search size={18} className="text-gray-400" />
        </button>
        <button className="p-2 md:p-2.5 rounded-xl hover:bg-gray-100 transition-all relative">
          <Bell size={18} className="text-gray-400" />
          <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
