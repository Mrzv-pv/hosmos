"use client";

import { Bell, Search } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-lg sticky top-0 z-10 flex items-center justify-between px-8">
      <div>
        <h1 className="text-xl font-serif text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-all">
          <Search size={18} className="text-gray-400" />
        </button>
        <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-all relative">
          <Bell size={18} className="text-gray-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
