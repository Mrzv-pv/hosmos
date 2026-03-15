"use client";

import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "violet" | "green" | "red" | "gray" | "yellow";
  size?: "sm" | "md";
}

export function Badge({ children, variant = "blue", size = "sm" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center font-semibold rounded-full",
        {
          "bg-blue-50 text-blue-500": variant === "blue",
          "bg-violet-50 text-violet-500": variant === "violet",
          "bg-green-50 text-green-700": variant === "green",
          "bg-red-50 text-red-600": variant === "red",
          "bg-gray-100 text-gray-600": variant === "gray",
          "bg-amber-50 text-amber-700": variant === "yellow",
        },
        {
          "px-2 py-0.5 text-xs": size === "sm",
          "px-3 py-1 text-sm": size === "md",
        }
      )}
    >
      {children}
    </span>
  );
}
