"use client";

import { clsx } from "clsx";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "blue" | "violet" | "green" | "red";
  size?: "sm" | "md";
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  value,
  max = 100,
  color = "blue",
  size = "md",
  showLabel = false,
  label,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm text-gray-600">{label}</span>
          <span className="text-sm font-mono text-gray-500">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={clsx("w-full bg-gray-100 rounded-full overflow-hidden", {
          "h-1.5": size === "sm",
          "h-2.5": size === "md",
        })}
      >
        <div
          className={clsx("h-full rounded-full transition-all duration-500 ease-out", {
            "bg-blue-500": color === "blue",
            "bg-violet-500": color === "violet",
            "bg-green-500": color === "green",
            "bg-red-500": color === "red",
          })}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
