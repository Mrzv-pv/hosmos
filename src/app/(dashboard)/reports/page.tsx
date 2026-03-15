"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FileText, Download, Clock, CheckCircle2, Lock } from "lucide-react";

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

export default function ReportsPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Reports" subtitle="Generate and export ESG reports" />
      <div className="p-8 space-y-8">
        {/* Report Templates */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reportTemplates.map((report) => (
              <Card key={report.id} hover className={!report.available ? "opacity-70" : ""}>
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
                      <CheckCircle2 size={12} className="text-green-400" />
                      {s}
                    </div>
                  ))}
                </div>
                {report.available ? (
                  <Button size="sm" className="w-full">
                    <Download size={14} className="mr-2" /> Generate Report
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" className="w-full" disabled>
                    <Lock size={14} className="mr-2" /> Upgrade to {report.tier}
                  </Button>
                )}
              </Card>
            ))}
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
