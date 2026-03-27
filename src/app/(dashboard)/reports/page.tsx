"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FileText, Download, Clock, CheckCircle2, Lock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ReportData } from "@/lib/pdf/generate-report";
import { usePlan } from "@/hooks/usePlan";
import { canAccessReport, getRequiredPlan } from "@/lib/plans";
import Link from "next/link";

const reportTemplates = [
  {
    id: "gri",
    name: "GRI Standards 2021",
    description: "Global Reporting Initiative — GRI 2, GRI 300, GRI 400 series",
    tier: "starter",
    available: true,
    sections: ["General Disclosures", "Environmental", "Social"],
  },
  {
    id: "esrs",
    name: "ESRS (CSRD)",
    description: "European Sustainability Reporting Standards — E1 Climate",
    tier: "starter",
    available: true,
    sections: ["ESRS E1 Climate", "ESRS S1 Workforce", "ESRS G1 Governance"],
  },
  {
    id: "cdp",
    name: "CDP Climate",
    description: "Carbon Disclosure Project — sections C1-C12",
    tier: "pro",
    available: false,
    sections: ["C1-C4 Governance & Risk", "C5-C8 Emissions", "C9-C12 Targets"],
  },
  {
    id: "ungc",
    name: "UN Global Compact",
    description: "10 principles self-assessment and progress report",
    tier: "pro",
    available: false,
    sections: ["Human Rights", "Labour", "Environment", "Anti-Corruption"],
  },
  {
    id: "taxonomy",
    name: "EU Taxonomy",
    description: "Article 8 disclosure — eligible and aligned activities",
    tier: "enterprise",
    available: false,
    sections: ["Eligibility", "Alignment", "KPIs"],
  },
  {
    id: "tcfd",
    name: "TCFD",
    description: "Task Force on Climate-related Financial Disclosures",
    tier: "enterprise",
    available: false,
    sections: ["Governance", "Strategy", "Risk Management", "Metrics"],
  },
];

const recentReports = [
  { name: "GRI 2021 Report — Q4 2024", date: "2024-12-15", format: "PDF", size: "2.4 MB" },
  { name: "ESRS E1 Climate Report", date: "2024-11-30", format: "PDF", size: "1.8 MB" },
  { name: "Carbon Data Export", date: "2024-11-15", format: "Excel", size: "450 KB" },
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function makeDemoMonthly(total: number) {
  return MONTHS.map((month) => {
    const scope1 = total * 0.3 / 12;
    const scope2 = total * 0.4 / 12;
    const scope3 = total * 0.3 / 12;
    return { month, scope1, scope2, scope3, total: scope1 + scope2 + scope3 };
  });
}

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);
  const { plan } = usePlan();

  const handleGenerate = async (reportId: string) => {
    setGenerating(reportId);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Default demo data
      let reportData: ReportData = {
        companyName: 'Demo Company d.o.o.',
        country: 'Slovenia',
        countryCode: 'SI',
        industry: 'Information Technology',
        naceCode: 'J62.0',
        headcount: 45,
        reportingYear: '2024',
        scope1: 12.5,
        scope1Stationary: 8.3,
        scope1Fleet: 4.2,
        scope1Lpg: 0,
        biogenicCO2: 0,
        scope2Location: 18.7,
        scope2Market: 22.1,
        scope3: 6.8,
        total: 38.0,
        perEmployee: 0.84,
        monthlyData: makeDemoMonthly(38.0),
        gridCountry: 'Slovenia',
        gridLocation: 231,
        gridMarket: 362,
      };

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single();

        if (profile?.company_id) {
          const { data: comp } = await supabase
            .from('companies')
            .select('*')
            .eq('id', profile.company_id)
            .single();

          if (comp) {
            const year = comp.reporting_year || '2024';
            const { data: results } = await supabase
              .from('emission_results')
              .select('*')
              .eq('company_id', comp.id)
              .eq('year', year)
              .single();

            const { data: grid } = await supabase
              .from('grid_electricity_factors')
              .select('*')
              .eq('country_code', comp.country_code || 'SI')
              .eq('year', year)
              .single();

            const { data: monthly } = await supabase
              .from('monthly_emissions_data')
              .select('*')
              .eq('company_id', comp.id)
              .eq('year', year)
              .order('month');

            const s1 = results?.scope1_total ?? reportData.scope1;
            const s2l = results?.scope2_location ?? reportData.scope2Location;
            const s3 = results?.scope3_total ?? reportData.scope3;
            const tot = results?.total_tco2e ?? reportData.total;

            reportData = {
              companyName: comp.name,
              country: comp.country || reportData.country,
              countryCode: comp.country_code || reportData.countryCode,
              industry: comp.industry || reportData.industry,
              naceCode: comp.nace_code || reportData.naceCode,
              headcount: comp.headcount || reportData.headcount,
              reportingYear: year,
              scope1: s1,
              scope1Stationary: results?.scope1_stationary ?? reportData.scope1Stationary,
              scope1Fleet: results?.scope1_fleet ?? reportData.scope1Fleet,
              scope1Lpg: monthly && monthly.length > 0
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? monthly.reduce((sum: number, m: any) => sum + (Number(m.lpg_litres) || 0), 0) * 1.5575 / 1000
                : 0,
              biogenicCO2: monthly && monthly.length > 0
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? monthly.reduce((sum: number, m: any) => sum + (Number(m.biomass_wood_kg) || 0), 0) * 1.838 / 1000
                : 0,
              scope2Location: s2l,
              scope2Market: results?.scope2_market ?? reportData.scope2Market,
              scope3: s3,
              total: tot,
              perEmployee: results?.per_employee ?? (tot / (comp.headcount || 1)),
              monthlyData: monthly && monthly.length > 0
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? monthly.map((m: any) => ({
                    month: MONTHS[(m.month as number) - 1] || String(m.month),
                    scope1: m.scope1 ?? 0,
                    scope2: m.scope2 ?? 0,
                    scope3: m.scope3 ?? 0,
                    total: m.total ?? 0,
                  }))
                : makeDemoMonthly(tot),
              governanceData: (comp as Record<string, unknown>).governance_data as Record<string, boolean> | undefined,
              gridCountry: grid?.country_name || comp.country || reportData.gridCountry,
              gridLocation: grid ? Math.round(grid.location_kwh * 1000) : reportData.gridLocation,
              gridMarket: grid ? Math.round(grid.market_kwh * 1000) : reportData.gridMarket,
            };
          }
        }
      }

      const { generateGRIReport, generateESRSReport } = await import('@/lib/pdf/generate-report');
      const doc = reportId === 'esrs' ? generateESRSReport(reportData) : generateGRIReport(reportData);
      doc.save(`hosmos-${reportId}-report-${reportData.reportingYear}.pdf`);
    } catch (err) {
      console.error('Report generation error:', err);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Reports" subtitle="Generate and export ESG reports" />
      <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        {/* Report Templates */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reportTemplates.map((report) => {
              const hasAccess = canAccessReport(plan, report.id);
              const requiredPlan = getRequiredPlan(report.id);
              return (
                <Card key={report.id} hover className={!hasAccess ? "opacity-70" : ""}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-xl bg-violet-50">
                      <FileText size={20} className="text-violet-500" />
                    </div>
                    <Badge
                      variant={
                        report.tier === "starter"
                          ? "blue"
                          : report.tier === "pro"
                          ? "violet"
                          : "gray"
                      }
                    >
                      {report.tier.toUpperCase()}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{report.name}</h4>
                  <p className="text-xs text-gray-500 mb-4">{report.description}</p>
                  <div className="space-y-1 mb-5">
                    {report.sections.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-xs text-gray-400">
                        <CheckCircle2 size={12} className={hasAccess ? "text-green-400" : "text-gray-300"} />
                        {s}
                      </div>
                    ))}
                  </div>
                  {hasAccess ? (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleGenerate(report.id)}
                      disabled={generating !== null}
                    >
                      {generating === report.id ? (
                        <><Loader2 size={14} className="mr-2 animate-spin" /> Generating...</>
                      ) : (
                        <><Download size={14} className="mr-2" /> Generate Report</>
                      )}
                    </Button>
                  ) : (
                    <Link href="/settings" className="block">
                      <Button size="sm" variant="secondary" className="w-full">
                        <Lock size={14} className="mr-2" /> Upgrade to {requiredPlan}
                      </Button>
                    </Link>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Reports */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div
                key={report.name}
                className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-gray-50 transition-all"
              >
                <div className="p-2 rounded-lg bg-blue-50">
                  <FileText size={16} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">{report.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {report.date}
                    </span>
                    <span>{report.format}</span>
                    <span>{report.size}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download size={14} />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
