"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Flame,
  Users,
  Shield,
  FileText,
  Link2,
  Target,
  Settings,
  LogOut,
  ChevronLeft,
  Leaf,
  Database,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calculator", label: "Carbon Calculator", icon: Flame },
  { href: "/people", label: "People & Social", icon: Users, badge: "S" },
  { href: "/governance", label: "Governance", icon: Shield, badge: "G" },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/supply-chain", label: "Supply Chain", icon: Link2, pro: true },
  { href: "/goals", label: "Goals & OKR", icon: Target, pro: true },
  { href: "/data-sources", label: "Data Sources", icon: Database },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "h-screen sticky top-0 flex flex-col bg-white border-r border-gray-100 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-100">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Leaf size={18} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-serif text-xl text-gray-900">Hosmos</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            "ml-auto p-1.5 rounded-lg hover:bg-gray-100 transition-all",
            collapsed && "ml-0"
          )}
        >
          <ChevronLeft
            size={16}
            className={clsx(
              "text-gray-400 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                size={20}
                className={clsx(
                  "flex-shrink-0",
                  isActive ? "text-blue-500" : "text-gray-400"
                )}
              />
              {!collapsed && (
                <>
                  <span className="text-sm font-semibold truncate">{item.label}</span>
                  {item.pro && (
                    <span className="ml-auto text-[10px] font-semibold bg-violet-50 text-violet-500 px-1.5 py-0.5 rounded-full">
                      PRO
                    </span>
                  )}
                  {item.badge && (
                    <span className="ml-auto text-[10px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div
          className={clsx(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-all",
          )}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-violet-400 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">JD</span>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-400 truncate">john@company.com</p>
              </div>
              <LogOut size={16} className="text-gray-400" />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
