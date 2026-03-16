"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Circle, Shield, Scale, Eye, Lock, Save } from "lucide-react";

const governanceChecklist = [
  {
    category: "Board & Leadership",
    icon: Scale,
    items: [
      { label: "Board composition documented", done: true },
      { label: "Independent directors identified", done: true },
      { label: "Board diversity policy", done: false },
      { label: "Executive compensation disclosure", done: false },
      { label: "Board ESG committee", done: true },
    ],
  },
  {
    category: "Ethics & Anti-corruption",
    icon: Shield,
    items: [
      { label: "Code of ethics published", done: true },
      { label: "Anti-corruption policy", done: true },
      { label: "Whistleblowing channel active", done: true },
      { label: "Conflict of interest policy", done: false },
      { label: "Political contributions policy", done: false },
      { label: "Anti-bribery training completed", done: true },
    ],
  },
  {
    category: "Data Protection & Privacy",
    icon: Lock,
    items: [
      { label: "GDPR compliance assessment", done: true },
      { label: "Data Processing Agreement (DPA)", done: true },
      { label: "Privacy policy published", done: true },
      { label: "Data breach notification process", done: false },
      { label: "DPO appointed", done: true },
      { label: "Data retention policy", done: false },
    ],
  },
  {
    category: "Risk Management",
    icon: Eye,
    items: [
      { label: "Risk register maintained", done: true },
      { label: "Risk assessment methodology", done: false },
      { label: "Business continuity plan", done: false },
      { label: "Internal audit function", done: false },
      { label: "Regulatory compliance monitoring", done: true },
    ],
  },
];

export default function GovernancePage() {
  const totalItems = governanceChecklist.reduce((acc, g) => acc + g.items.length, 0);
  const doneItems = governanceChecklist.reduce(
    (acc, g) => acc + g.items.filter((i) => i.done).length,
    0
  );

  return (
    <div className="min-h-screen">
      <TopBar title="Governance" subtitle="25 governance parameters — ESRS G1" />
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <ProgressBar
              value={doneItems}
              max={totalItems}
              label="G-parameters completion"
              color="blue"
              showLabel
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="blue">GDPR</Badge>
            <Badge variant="blue">ISO 27001</Badge>
            <Badge variant="blue">ESRS G1</Badge>
          </div>
        </div>

        {governanceChecklist.map((group) => {
          const groupDone = group.items.filter((i) => i.done).length;
          return (
            <Card key={group.category}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-blue-50">
                  <group.icon size={20} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{group.category}</h3>
                  <p className="text-xs text-gray-400">
                    {groupDone} of {group.items.length} completed
                  </p>
                </div>
                <span className="text-sm font-mono text-gray-500">
                  {Math.round((groupDone / group.items.length) * 100)}%
                </span>
              </div>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    {item.done ? (
                      <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle size={20} className="text-gray-300 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        item.done ? "text-gray-500 line-through" : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </Card>
          );
        })}

        <Button size="lg">
          <Save size={18} className="mr-2" /> Save Governance Data
        </Button>
      </div>
    </div>
  );
}
