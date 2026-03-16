"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Target, TrendingDown, Calendar, Flag } from "lucide-react";

const goals = [
  {
    title: "Reduce Scope 1 by 30%",
    baseline: 185,
    target: 130,
    current: 142,
    unit: "tCO2e",
    deadline: "2026-12-31",
    category: "Scope 1",
    aligned: "SBTi",
  },
  {
    title: "Reduce Scope 2 by 50%",
    baseline: 120,
    target: 60,
    current: 89,
    unit: "tCO2e",
    deadline: "2027-12-31",
    category: "Scope 2",
    aligned: "SBTi",
  },
  {
    title: "100% renewable electricity",
    baseline: 25,
    target: 100,
    current: 45,
    unit: "%",
    deadline: "2028-06-30",
    category: "Energy",
    aligned: "Net-zero",
  },
  {
    title: "Zero workplace accidents",
    baseline: 3,
    target: 0,
    current: 1,
    unit: "accidents",
    deadline: "2025-12-31",
    category: "Safety",
    aligned: "GRI 403",
  },
];

export default function GoalsPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Goals & OKR" subtitle="SBTi-aligned reduction targets" />
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Net-zero timeline */}
        <Card className="bg-gradient-to-br from-blue-50 to-violet-50 border-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Target size={24} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Net-Zero Target: 2040</h3>
              <p className="text-sm text-gray-500">SBTi-aligned 1.5°C pathway</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-3xl font-serif text-gray-900">231</p>
              <p className="text-xs text-gray-500 font-mono">tCO2e current total</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>2024 baseline: 305 tCO2e</span>
              <span>2040 target: 0 tCO2e</span>
            </div>
            <div className="h-3 bg-white/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all"
                style={{ width: "24%" }}
              />
            </div>
            <p className="text-xs text-green-600 mt-2 font-semibold">24% reduction achieved</p>
          </div>
        </Card>

        {/* Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {goals.map((goal) => {
            const isReduction = goal.target < goal.baseline;
            const progress = isReduction
              ? ((goal.baseline - goal.current) / (goal.baseline - goal.target)) * 100
              : ((goal.current - goal.baseline) / (goal.target - goal.baseline)) * 100;

            return (
              <Card key={goal.title}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="blue">{goal.category}</Badge>
                    <Badge variant="violet">{goal.aligned}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={12} />
                    {goal.deadline}
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-4">{goal.title}</h4>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Baseline</p>
                    <p className="text-lg font-mono text-gray-500">{goal.baseline}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Current</p>
                    <p className="text-lg font-mono text-blue-600 font-semibold">{goal.current}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Target</p>
                    <p className="text-lg font-mono text-green-600">{goal.target}</p>
                  </div>
                </div>

                <ProgressBar
                  value={Math.min(100, Math.max(0, progress))}
                  color={progress >= 100 ? "green" : progress >= 50 ? "blue" : "violet"}
                  showLabel
                  label={`${goal.unit}`}
                />

                <div className="mt-3 flex items-center gap-2">
                  {progress >= 50 ? (
                    <TrendingDown size={14} className="text-green-500" />
                  ) : (
                    <Flag size={14} className="text-yellow-500" />
                  )}
                  <span className="text-xs text-gray-500">
                    {progress >= 100
                      ? "Target reached!"
                      : `${Math.round(progress)}% progress`}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
          <div className="flex items-center gap-3">
            <Badge variant="violet" size="md">PRO</Badge>
            <p className="text-sm text-violet-700">
              OKR & Goals module is available on Pro and Enterprise plans. Set SBTi-aligned reduction targets and track progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
