"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { KPICard } from "@/components/ui/KPICard";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import {
  Flame,
  Zap,
  Users,
  Award,
  TrendingDown,
  FileText,
  ArrowRight,
  Globe,
  Lock,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { DEMO_DASHBOARD, DEMO_SCOPE1, DEMO_SCOPE2, DEMO_SCOPE3 } from "@/data/seed-company";
import { createClient } from "@/lib/supabase/client";
import { usePlan } from "@/hooks/usePlan";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Monthly breakdown (pro-rata from annual totals)
const monthlyEmissions = [
  { month: "Jan", scope1: 6.8, scope2: 8.5 },
  { month: "Feb", scope1: 6.5, scope2: 8.1 },
  { month: "Mar", scope1: 6.2, scope2: 7.8 },
  { month: "Apr", scope1: 5.5, scope2: 6.9 },
  { month: "May", scope1: 5.2, scope2: 6.5 },
  { month: "Jun", scope1: 5.0, scope2: 6.2 },
  { month: "Jul", scope1: 5.3, scope2: 7.8 },
  { month: "Aug", scope1: 4.9, scope2: 7.2 },
  { month: "Sep", scope1: 5.8, scope2: 7.0 },
  { month: "Oct", scope1: 6.4, scope2: 7.5 },
  { month: "Nov", scope1: 6.9, scope2: 7.9 },
  { month: "Dec", scope1: 7.3, scope2: 8.6 },
];

const recentActivity = [
  { action: "Scope 1 data updated — fleet mileage Q4", time: "2 hours ago", type: "edit" },
  { action: "GRI 2021 report generated (PDF)", time: "1 day ago", type: "report" },
  { action: "Employee commute survey imported", time: "3 days ago", type: "social" },
  { action: "Natural gas consumption updated", time: "5 days ago", type: "edit" },
  { action: "ESG score recalculated: 62 → 62", time: "1 week ago", type: "score" },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(DEMO_DASHBOARD);
  const [scope1, setScope1] = useState(DEMO_SCOPE1);
  const [scope2, setScope2] = useState(DEMO_SCOPE2);
  const [scope3, setScope3] = useState(DEMO_SCOPE3);
  const { plan, features } = usePlan();

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        // Get profile → company
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id, full_name')
          .eq('id', user.id)
          .single();

        if (profile?.company_id) {
          const { data: comp } = await supabase
            .from('companies')
            .select('*')
            .eq('id', profile.company_id)
            .single();

          if (comp) {
            setDashboard(prev => ({
              ...prev,
              company: {
                id: comp.id,
                name: comp.name,
                industry: comp.industry || '',
                naceCode: comp.nace_code || '',
                country: comp.country || '',
                countryCode: comp.country_code || '',
                headcount: comp.headcount || 0,
                plan: (comp.plan || 'starter') as "trial" | "starter" | "pro" | "enterprise",
                planStartDate: '',
                reportingYear: comp.reporting_year || '2024',
                currency: comp.currency || 'EUR',
              },
              reportingYear: comp.reporting_year || prev.reportingYear,
            }));

            // Try to get emission results
            const { data: results } = await supabase
              .from('emission_results')
              .select('*')
              .eq('company_id', comp.id)
              .eq('year', parseInt(comp.reporting_year || '2024'))
              .single();

            if (results) {
              setScope1({ stationaryCombustion_tCO2e: 0, mobileFleet_tCO2e: 0, total_tCO2e: results.scope1_total || 0 });
              setScope2({ locationBased_tCO2e: results.scope2_location || 0, marketBased_tCO2e: results.scope2_market || 0, total_tCO2e: results.scope2_location || 0 });
              setScope3({ categories: [], total_tCO2e: results.scope3_total || 0 });

              const total = results.total_tco2e || 0;
              setDashboard(prev => ({
                ...prev,
                scope1: results.scope1_total || prev.scope1,
                scope2: results.scope2_location || prev.scope2,
                scope3: results.scope3_total || prev.scope3,
                totalEmissions: total || prev.totalEmissions,
                emissionsPerEmployee: comp.headcount ? +(total / comp.headcount).toFixed(2) : prev.emissionsPerEmployee,
              }));
            }
          }
        }
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const d = dashboard;
  const maxEmission = Math.max(...monthlyEmissions.map((m) => m.scope1 + m.scope2));

  const scope1Change = Math.round(((d.scope1 - d.previousYear.scope1) / d.previousYear.scope1) * 100);
  const scope2Change = Math.round(((d.scope2 - d.previousYear.scope2) / d.previousYear.scope2) * 100);

  if (loading) {
    return (
      <div className="min-h-screen">
        <TopBar title="Dashboard" subtitle="Loading..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar
        title="Dashboard"
        subtitle={`${d.company.name} · ${d.company.country} · ${d.reportingYear}`}
      />

      <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        {/* Trial Banner */}
        {plan === "trial" && (
          <div className="bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl p-5 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Crown size={28} className="opacity-80 hidden sm:block" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm sm:text-base">Free Trial — Limited Features</h3>
                <p className="text-xs sm:text-sm opacity-80 mt-0.5">
                  Scope 3, People, Governance and ESRS reports are locked. Upgrade to unlock.
                </p>
              </div>
              <Link href="/settings">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 border-0" size="sm">
                  Upgrade
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Plan Badge */}
        <div className="flex items-center gap-3">
          <Badge variant={plan === "trial" ? "gray" : plan === "pro" ? "violet" : "blue"}>
            {features.name} Plan
          </Badge>
          <span className="text-xs text-gray-400">
            Reporting year: {d.reportingYear} · {d.company.headcount} employees · NACE {d.company.naceCode}
          </span>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
          <KPICard
            title="Scope 1"
            value={d.scope1.toFixed(1)}
            unit="tCO2e"
            change={scope1Change}
            icon={Flame}
            color="blue"
          />
          <KPICard
            title="Scope 2"
            value={d.scope2.toFixed(1)}
            unit="tCO2e"
            change={scope2Change}
            icon={Zap}
            color="violet"
          />
          <KPICard
            title="Scope 3 (basic)"
            value={d.scope3.toFixed(1)}
            unit="tCO2e"
            icon={Globe}
            color="green"
          />
          <KPICard
            title="Women Ratio"
            value={`${Math.round(d.people.femaleRatio * 100)}%`}
            icon={Users}
            color="violet"
          />
          <KPICard
            title="ESG Score"
            value={String(d.esgScore)}
            unit="/100"
            icon={Award}
            color="blue"
          />
        </div>

        {/* Total Emissions Summary */}
        <Card>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">Total Emissions (Scope 1+2+3)</p>
              <p className="text-3xl font-serif text-gray-900">{d.totalEmissions} <span className="text-base font-sans text-gray-400">tCO2e</span></p>
            </div>
            <div className="h-12 w-px bg-gray-100 hidden md:block" />
            <div>
              <p className="text-xs text-gray-400 mb-1">Per Employee</p>
              <p className="text-xl font-serif text-gray-900">{d.emissionsPerEmployee} <span className="text-sm font-sans text-gray-400">tCO2e</span></p>
            </div>
            <div className="h-12 w-px bg-gray-100 hidden md:block" />
            <div>
              <p className="text-xs text-gray-400 mb-1">YoY Change</p>
              <p className="text-xl font-serif text-green-600">{d.yoyChange}%</p>
            </div>
            <div className="h-12 w-px bg-gray-100 hidden md:block" />
            <div>
              <p className="text-xs text-gray-400 mb-1">Breakdown</p>
              <div className="flex gap-3 text-sm">
                <span className="text-blue-600">S1: {((d.scope1 / d.totalEmissions) * 100).toFixed(0)}%</span>
                <span className="text-violet-600">S2: {((d.scope2 / d.totalEmissions) * 100).toFixed(0)}%</span>
                <span className="text-green-600">S3: {((d.scope3 / d.totalEmissions) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Emissions Chart */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Monthly Emissions</h3>
                <p className="text-xs text-gray-400">Scope 1 + Scope 2, tCO2e ({d.reportingYear})</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-gray-500">Scope 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-violet-400" />
                  <span className="text-xs text-gray-500">Scope 2</span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-3 h-48">
              {monthlyEmissions.map((m) => {
                const scope1Pct = (m.scope1 / maxEmission) * 100;
                const scope2Pct = (m.scope2 / maxEmission) * 100;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col gap-0.5" style={{ height: "160px", justifyContent: "flex-end" }}>
                      <div
                        className="w-full bg-violet-300 rounded-t-sm"
                        style={{ height: `${scope2Pct}%` }}
                      />
                      <div
                        className="w-full bg-blue-500 rounded-b-sm"
                        style={{ height: `${scope1Pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Completion */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Data Completion</h3>
            <div className="space-y-5">
              <ProgressBar value={82} label="Environment (E)" color="blue" showLabel />
              <ProgressBar value={55} label="Social (S)" color="violet" showLabel />
              <ProgressBar value={38} label="Governance (G)" color="blue" showLabel />
            </div>
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Overall</span>
                <span className="text-2xl font-serif text-gray-900">{d.completionPct}%</span>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                  style={{ width: `${d.completionPct}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Scope Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Scope 1 Detail */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Scope 1 Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Stationary combustion</span>
                <span className="text-sm font-medium text-gray-900">{scope1.stationaryCombustion_tCO2e} t</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Fleet vehicles</span>
                <span className="text-sm font-medium text-gray-900">{scope1.mobileFleet_tCO2e} t</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-700">Total</span>
                <span className="text-sm font-bold text-blue-600">{scope1.total_tCO2e} tCO2e</span>
              </div>
            </div>
          </Card>

          {/* Scope 2 Detail */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Scope 2 Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Location-based</span>
                <span className="text-sm font-medium text-gray-900">{scope2.locationBased_tCO2e} t</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Market-based (residual mix)</span>
                <span className="text-sm font-medium text-gray-900">{scope2.marketBased_tCO2e} t</span>
              </div>
              <div className="border-t border-gray-100 pt-2">
                <p className="text-[10px] text-gray-400">Grid: Slovenia {d.reportingYear} · 212 gCO2/kWh (loc) · 429 gCO2/kWh (mkt)</p>
              </div>
            </div>
          </Card>

          {/* Scope 3 Detail */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Scope 3 {!features.scope3 && <Lock size={12} className="inline text-gray-400 ml-1" />}
            </h3>
            {features.scope3 ? (
              <div className="space-y-2">
                {scope3.categories.map((cat) => (
                  <div key={cat.id} className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Cat. {cat.id}: {cat.name}</span>
                    <span className="text-sm font-medium text-gray-900">{cat.tCO2e} t</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-700">Total</span>
                  <span className="text-sm font-bold text-green-600">{scope3.total_tCO2e} tCO2e</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Lock size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs text-gray-400">Upgrade to Starter to unlock Scope 3</p>
                <Link href="/settings">
                  <Button variant="secondary" size="sm" className="mt-2">Upgrade</Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                    {item.type === "report" ? (
                      <FileText size={14} className="text-violet-500" />
                    ) : item.type === "score" ? (
                      <Award size={14} className="text-blue-500" />
                    ) : (
                      <TrendingDown size={14} className="text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{item.action}</p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { href: "/calculator", label: "Update Carbon Data", desc: "Enter latest energy & transport numbers", icon: Flame, badge: "E", locked: false },
                { href: "/people", label: "Update Social Data", desc: features.socialParams ? "Update workforce & HR parameters" : "Upgrade to Starter to unlock", icon: Users, badge: "S", locked: !features.socialParams },
                { href: "/reports", label: "Generate Report", desc: "Export GRI or ESRS report as PDF", icon: FileText, badge: "R", locked: false },
                { href: "/supply-chain", label: "Supply Chain Portal", desc: features.supplyChain ? "Manage supplier ESG data" : "Upgrade to Pro to unlock", icon: Globe, badge: "SC", locked: !features.supplyChain },
                { href: "/goals", label: "OKR & Goals", desc: features.goals ? "Track ESG targets" : "Upgrade to Pro to unlock", icon: TrendingDown, badge: "OK", locked: !features.goals },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.locked ? "/pricing" : action.href}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${
                    action.locked ? "opacity-50 hover:opacity-70" : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    action.locked ? "bg-gray-100" : "bg-blue-50 group-hover:bg-blue-100"
                  }`}>
                    {action.locked ? (
                      <Lock size={18} className="text-gray-400" />
                    ) : (
                      <action.icon size={18} className="text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700">{action.label}</p>
                    <p className="text-xs text-gray-400">{action.desc}</p>
                  </div>
                  <Badge variant={action.locked ? "gray" : "blue"}>{action.badge}</Badge>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Data Sources Footer */}
        <div className="text-center py-4">
          <p className="text-[10px] text-gray-300">
            Emission factors: DEFRA/DESNZ 2024-2025 · Grid: AIB Residual Mix / EEA Production Mix 2023-2024 · GHG Protocol
          </p>
        </div>
      </div>
    </div>
  );
}
