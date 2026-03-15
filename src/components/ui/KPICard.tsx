"use client";

import { clsx } from "clsx";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon: LucideIcon;
  color?: "blue" | "violet" | "green" | "red";
}

export function KPICard({ title, value, unit, change, icon: Icon, color = "blue" }: KPICardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-serif font-normal text-gray-900">{value}</span>
            {unit && <span className="text-sm text-gray-400 font-mono">{unit}</span>}
          </div>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={clsx(
                  "text-xs font-semibold",
                  change >= 0 ? "text-red-500" : "text-green-600"
                )}
              >
                {change >= 0 ? "+" : ""}{change}%
              </span>
              <span className="text-xs text-gray-400">vs last year</span>
            </div>
          )}
        </div>
        <div
          className={clsx("p-3 rounded-xl", {
            "bg-blue-50": color === "blue",
            "bg-violet-50": color === "violet",
            "bg-green-50": color === "green",
            "bg-red-50": color === "red",
          })}
        >
          <Icon
            size={22}
            className={clsx({
              "text-blue-500": color === "blue",
              "text-violet-500": color === "violet",
              "text-green-500": color === "green",
              "text-red-500": color === "red",
            })}
          />
        </div>
      </div>
    </div>
  );
}
