"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Database,
  Lock,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePlan } from "@/hooks/usePlan";
import { PlanetIcon } from "@/components/ui/PlanetIcon";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, feature: null },
  { href: "/calculator", label: "Carbon Calculator", icon: Flame, feature: null },
  { href: "/people", label: "People & Social", icon: Users, badge: "S", feature: "socialParams" as const },
  { href: "/governance", label: "Governance", icon: Shield, badge: "G", feature: "governanceParams" as const },
  { href: "/reports", label: "Reports", icon: FileText, feature: null },
  { href: "/supply-chain", label: "Supply Chain", icon: Link2, feature: "supplyChain" as const },
  { href: "/goals", label: "Goals & OKR", icon: Target, feature: "goals" as const },
  { href: "/data-sources", label: "Data Sources", icon: Database, feature: null },
  { href: "/settings", label: "Settings", icon: Settings, feature: null },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userInitials, setUserInitials] = useState("??");
  const { features } = usePlan();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || "");
        const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "";
        setUserName(name);
        const parts = name.split(" ");
        setUserInitials(
          parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : name.substring(0, 2).toUpperCase()
        );
      }
    });
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          <PlanetIcon size={28} />
        </div>
        {!collapsed && (
          <span className="font-serif text-xl text-gray-900">Hosmos</span>
        )}
        {/* Close button on mobile, collapse on desktop */}
        <button
          onClick={() => {
            if (window.innerWidth < 768) setMobileOpen(false);
            else setCollapsed(!collapsed);
          }}
          className={clsx(
            "ml-auto p-1.5 rounded-lg hover:bg-gray-100 transition-all",
            collapsed && "ml-0"
          )}
        >
          {mobileOpen && window.innerWidth < 768 ? (
            <X size={16} className="text-gray-400" />
          ) : (
            <ChevronLeft
              size={16}
              className={clsx(
                "text-gray-400 transition-transform duration-300",
                collapsed && "rotate-180"
              )}
            />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const isLocked = item.feature ? !features[item.feature] : false;
          return (
            <Link
              key={item.href}
              href={isLocked ? "/settings" : item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isLocked
                  ? "text-gray-400 hover:bg-gray-50 opacity-60"
                  : isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                size={20}
                className={clsx(
                  "flex-shrink-0",
                  isLocked ? "text-gray-300" : isActive ? "text-blue-500" : "text-gray-400"
                )}
              />
              {!collapsed && (
                <>
                  <span className="text-sm font-semibold truncate">{item.label}</span>
                  {isLocked ? (
                    <Lock size={12} className="ml-auto text-gray-300" />
                  ) : item.badge ? (
                    <span className="ml-auto text-[10px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-all">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-violet-400 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">{userInitials}</span>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{userName || "User"}</p>
                <p className="text-xs text-gray-400 truncate">{userEmail}</p>
              </div>
              <button onClick={handleLogout} title="Log out">
                <LogOut size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button - visible only on mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white shadow-md border border-gray-200"
      >
        <Menu size={20} className="text-gray-600" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={clsx(
          "md:hidden fixed top-0 left-0 h-screen w-[260px] bg-white z-50 flex flex-col border-r border-gray-100 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={clsx(
          "hidden md:flex h-screen sticky top-0 flex-col bg-white border-r border-gray-100 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
