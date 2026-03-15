"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Users, Heart, GraduationCap, Shield, Save } from "lucide-react";

const socialParameters = [
  {
    category: "Workforce Composition",
    icon: Users,
    fields: [
      { label: "Total employees", value: "120", unit: "" },
      { label: "Female employees", value: "82", unit: "" },
      { label: "Male employees", value: "38", unit: "" },
      { label: "Part-time employees", value: "15", unit: "" },
      { label: "New hires (12 months)", value: "18", unit: "" },
      { label: "Employee turnover rate", value: "8.5", unit: "%" },
    ],
  },
  {
    category: "Diversity & Inclusion",
    icon: Heart,
    fields: [
      { label: "Women in management", value: "42", unit: "%" },
      { label: "Women on board", value: "33", unit: "%" },
      { label: "Gender pay gap", value: "3.2", unit: "%" },
      { label: "Employees with disability", value: "4", unit: "" },
      { label: "Age diversity: under 30", value: "25", unit: "%" },
      { label: "Age diversity: 30-50", value: "55", unit: "%" },
    ],
  },
  {
    category: "Training & Development",
    icon: GraduationCap,
    fields: [
      { label: "Training hours / employee", value: "24", unit: "hrs" },
      { label: "Training budget / employee", value: "800", unit: "EUR" },
      { label: "Employees with training", value: "95", unit: "%" },
      { label: "Internal promotion rate", value: "12", unit: "%" },
    ],
  },
  {
    category: "Health & Safety",
    icon: Shield,
    fields: [
      { label: "Workplace accidents", value: "1", unit: "" },
      { label: "Lost time injury rate", value: "0.8", unit: "" },
      { label: "Sick days / employee", value: "5.2", unit: "days" },
      { label: "eNPS score", value: "42", unit: "" },
    ],
  },
];

export default function PeoplePage() {
  return (
    <div className="min-h-screen">
      <TopBar title="People & Social" subtitle="40 social parameters — GRI 401-403" />
      <div className="p-8 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card padding="sm" className="text-center">
            <p className="text-xs text-gray-500 mb-1">Employees</p>
            <p className="text-2xl font-serif text-gray-900">120</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-xs text-gray-500 mb-1">Women Ratio</p>
            <p className="text-2xl font-serif text-green-600">68%</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-xs text-gray-500 mb-1">Accidents</p>
            <p className="text-2xl font-serif text-blue-600">1</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-xs text-gray-500 mb-1">eNPS</p>
            <p className="text-2xl font-serif text-violet-600">+42</p>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <ProgressBar value={62} max={100} label="S-parameters completion" color="violet" showLabel />
          </div>
          <div className="flex gap-2">
            <Badge variant="violet">GRI 401</Badge>
            <Badge variant="violet">GRI 402</Badge>
            <Badge variant="violet">GRI 403</Badge>
          </div>
        </div>

        {/* Parameter groups */}
        {socialParameters.map((group) => (
          <Card key={group.category}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-violet-50">
                <group.icon size={20} className="text-violet-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{group.category}</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {group.fields.map((field) => (
                <Input
                  key={field.label}
                  label={field.label}
                  type="number"
                  defaultValue={field.value}
                  unit={field.unit || undefined}
                />
              ))}
            </div>
          </Card>
        ))}

        <Button size="lg">
          <Save size={18} className="mr-2" /> Save Social Data
        </Button>
      </div>
    </div>
  );
}
