"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Link2, Send, Clock, CheckCircle2, AlertCircle, Plus } from "lucide-react";

const suppliers = [
  { name: "Metal Parts GmbH", country: "Germany", status: "completed", score: 78, lastResponse: "2024-12-10" },
  { name: "Plastik d.o.o.", country: "Slovenia", status: "pending", score: null, lastResponse: null },
  { name: "EcoPackaging Ltd", country: "UK", status: "completed", score: 85, lastResponse: "2024-12-05" },
  { name: "TechComponents AG", country: "Austria", status: "overdue", score: null, lastResponse: null },
  { name: "LogiTrans d.d.", country: "Croatia", status: "completed", score: 62, lastResponse: "2024-11-28" },
];

export default function SupplyChainPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Supply Chain Hub" subtitle="Supplier ESG questionnaires — Scope 3 Cat.1" />
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card padding="sm" className="text-center">
            <p className="text-xs text-gray-500 mb-1">Total Suppliers</p>
            <p className="text-2xl font-serif text-gray-900">{suppliers.length}</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-xs text-gray-500 mb-1">Responded</p>
            <p className="text-2xl font-serif text-green-600">
              {suppliers.filter((s) => s.status === "completed").length}
            </p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-xs text-gray-500 mb-1">Pending</p>
            <p className="text-2xl font-serif text-yellow-600">
              {suppliers.filter((s) => s.status === "pending").length}
            </p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-xs text-gray-500 mb-1">Avg ESG Score</p>
            <p className="text-2xl font-serif text-blue-600">75</p>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button>
            <Plus size={16} className="mr-2" /> Add Supplier
          </Button>
          <Button variant="secondary">
            <Send size={16} className="mr-2" /> Send Questionnaire
          </Button>
        </div>

        {/* Supplier List */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Suppliers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3">Company</th>
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3">Country</th>
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3">ESG Score</th>
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3">Last Response</th>
                  <th className="text-right text-xs font-semibold text-gray-500 pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.name} className="border-b border-gray-50 hover:bg-gray-50 transition-all">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Link2 size={14} className="text-blue-500" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-500">{s.country}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          s.status === "completed" ? "green" : s.status === "pending" ? "gray" : "red"
                        }
                      >
                        {s.status === "completed" && <CheckCircle2 size={10} className="mr-1" />}
                        {s.status === "pending" && <Clock size={10} className="mr-1" />}
                        {s.status === "overdue" && <AlertCircle size={10} className="mr-1" />}
                        {s.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      {s.score ? (
                        <span className="font-mono text-sm text-gray-700">{s.score}/100</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 text-sm text-gray-400">{s.lastResponse || "—"}</td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">
                        <Send size={12} className="mr-1" /> Remind
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
          <div className="flex items-center gap-3">
            <Badge variant="violet" size="md">PRO</Badge>
            <p className="text-sm text-violet-700">
              Supply Chain Hub is available on Pro and Enterprise plans. Track supplier ESG data and auto-calculate Scope 3 Category 1 emissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
