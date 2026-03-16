"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Database,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Zap,
  Flame,
  Thermometer,
  Truck,
  Plane,
  Snowflake,
  Package,
  RefreshCw,
  Download,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
} from "lucide-react";
import { STATIONARY_FUELS } from "@/data/emission-factors";
import { VEHICLE_FACTORS } from "@/data/emission-factors";
import { FLIGHT_FACTORS } from "@/data/emission-factors";
import { REFRIGERANT_FACTORS } from "@/data/emission-factors";
import { GRID_FACTORS } from "@/data/emission-factors";
import { HEAT_STEAM_COOLING_FACTORS } from "@/data/emission-factors";
import { SCOPE3_CATEGORIES } from "@/data/emission-factors";

// Data source metadata for audit
const DATA_SOURCES = [
  {
    id: "defra-2024",
    name: "DEFRA / DESNZ UK GHG Conversion Factors 2024",
    version: "2024 v1.1",
    publishedDate: "2024-07-08",
    lastUpdated: "2024-10-30",
    publisher: "UK Department for Energy Security and Net Zero",
    url: "https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024",
    methodology: "GHG Protocol Corporate Standard, IPCC AR5 GWPs",
    coverage: "Scope 1 fuels, vehicles, flights, refrigerants, WTT, waste",
    status: "verified" as const,
    factorCount: STATIONARY_FUELS.length + VEHICLE_FACTORS.length + FLIGHT_FACTORS.length + REFRIGERANT_FACTORS.length,
  },
  {
    id: "defra-2023",
    name: "DEFRA / DESNZ UK GHG Conversion Factors 2023",
    version: "2023 v1.0",
    publishedDate: "2023-06-28",
    lastUpdated: "2023-06-28",
    publisher: "UK Department for Energy Security and Net Zero",
    url: "https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023",
    methodology: "GHG Protocol Corporate Standard, IPCC AR4 GWPs",
    coverage: "Scope 1 fuels, vehicles, flights (prior year comparison)",
    status: "verified" as const,
    factorCount: STATIONARY_FUELS.length,
  },
  {
    id: "aib-2024",
    name: "AIB European Residual Mixes 2024",
    version: "2024 v1.1",
    publishedDate: "2025-08-11",
    lastUpdated: "2025-08-11",
    publisher: "Association of Issuing Bodies (AIB)",
    url: "https://www.aib-net.org/facts/european-residual-mix",
    methodology: "RE-DISS methodology, GO tracking, residual mix calculation",
    coverage: "Scope 2 electricity — 34 EU/EEA/UK countries, location + market-based",
    status: "verified" as const,
    factorCount: GRID_FACTORS.filter(g => g.residualMix["2024"]).length,
  },
  {
    id: "aib-2023",
    name: "AIB European Residual Mixes 2023",
    version: "2023 Final",
    publishedDate: "2024-07-15",
    lastUpdated: "2024-07-15",
    publisher: "Association of Issuing Bodies (AIB)",
    url: "https://www.aib-net.org/facts/european-residual-mix",
    methodology: "RE-DISS methodology",
    coverage: "Scope 2 electricity — prior year comparison",
    status: "verified" as const,
    factorCount: GRID_FACTORS.filter(g => g.residualMix["2023"]).length,
  },
  {
    id: "eea-2024",
    name: "EEA Greenhouse Gas Emission Intensity of Electricity",
    version: "2024 indicator",
    publishedDate: "2024-10-24",
    lastUpdated: "2024-10-24",
    publisher: "European Environment Agency",
    url: "https://www.eea.europa.eu/en/analysis/indicators/greenhouse-gas-emission-intensity-of-1",
    methodology: "National GHG inventories, Eurostat energy balances",
    coverage: "Scope 2 electricity — location-based production mix, EU-27 + EEA",
    status: "verified" as const,
    factorCount: GRID_FACTORS.length,
  },
  {
    id: "iea-2025",
    name: "IEA Emissions Factors 2025",
    version: "2025 edition",
    publishedDate: "2025-01-15",
    lastUpdated: "2025-01-15",
    publisher: "International Energy Agency",
    url: "https://www.iea.org/data-and-statistics/data-product/emissions-factors-2025",
    methodology: "IEA energy balances, national inventories",
    coverage: "Electricity grid factors — non-EU countries (TR, UA, MD, GE, AM, AZ, BY)",
    status: "reference" as const,
    factorCount: 7,
  },
  {
    id: "heat-national",
    name: "National District Heating Statistics",
    version: "2023-2024",
    publishedDate: "2024-06-01",
    lastUpdated: "2025-01-10",
    publisher: "Various national energy agencies (AGFW, DEA, SCB, etc.)",
    url: "https://www.euroheat.org/knowledge-hub/statistics",
    methodology: "National energy statistics, CHP allocation methods",
    coverage: "Scope 2 district heating, steam — 20 EU countries",
    status: "verified" as const,
    factorCount: HEAT_STEAM_COOLING_FACTORS.length,
  },
  {
    id: "exiobase-3.8",
    name: "EXIOBASE 3.8 Multi-Regional Input-Output",
    version: "3.8.2",
    publishedDate: "2022-09-30",
    lastUpdated: "2022-09-30",
    publisher: "EXIOBASE Consortium (TNO, NTNU, etc.)",
    url: "https://zenodo.org/records/5589597",
    methodology: "Environmentally-extended multi-regional input-output model",
    coverage: "Scope 3 Cat.1 spend-based factors (EUR per sector)",
    status: "verified" as const,
    factorCount: 8,
  },
  {
    id: "ipcc-ar5",
    name: "IPCC AR5 Global Warming Potentials",
    version: "AR5 (2014)",
    publishedDate: "2014-11-02",
    lastUpdated: "2014-11-02",
    publisher: "Intergovernmental Panel on Climate Change",
    url: "https://www.ipcc.ch/assessment-report/ar5/",
    methodology: "100-year GWP values for greenhouse gases",
    coverage: "Refrigerant GWP values (Scope 1 fugitive emissions)",
    status: "verified" as const,
    factorCount: REFRIGERANT_FACTORS.length,
  },
];

type TabId = "sources" | "scope1" | "scope2" | "scope3" | "audit";

const TABS: { id: TabId; label: string; icon: typeof Database }[] = [
  { id: "sources", label: "Sources", icon: Database },
  { id: "scope1", label: "Scope 1", icon: Flame },
  { id: "scope2", label: "Scope 2", icon: Zap },
  { id: "scope3", label: "Scope 3", icon: Package },
  { id: "audit", label: "Audit Log", icon: ShieldCheck },
];

export default function DataSourcesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("sources");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>(["fuels"]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Data Sources" subtitle="Emission factor database — auditable and traceable" />

      {/* Tab bar */}
      <div className="px-8 pt-4 border-b border-gray-100">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                activeTab === tab.id
                  ? "bg-white border border-b-white border-gray-200 text-blue-600 -mb-px"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-6xl">
        {/* Search bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search emission factors, countries, sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <Button variant="secondary" size="sm">
            <Filter size={14} className="mr-1.5" /> Filter
          </Button>
          <Button variant="secondary" size="sm">
            <Download size={14} className="mr-1.5" /> Export
          </Button>
        </div>

        {/* SOURCES TAB */}
        {activeTab === "sources" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Emission Factor Sources</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  All factors are traceable to official publications. Last database update: 2025-03-01
                </p>
              </div>
              <Button variant="secondary" size="sm">
                <RefreshCw size={14} className="mr-1.5" /> Check for Updates
              </Button>
            </div>

            {DATA_SOURCES.map((src) => (
              <Card key={src.id}>
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                    src.status === "verified" ? "bg-green-50" : "bg-amber-50"
                  }`}>
                    {src.status === "verified" ? (
                      <ShieldCheck size={20} className="text-green-600" />
                    ) : (
                      <AlertTriangle size={20} className="text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">{src.name}</h4>
                      <Badge variant={src.status === "verified" ? "green" : "yellow"} size="sm">
                        {src.status === "verified" ? "Verified" : "Reference"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{src.coverage}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400">Publisher</span>
                        <p className="text-gray-700 font-medium">{src.publisher}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Version</span>
                        <p className="text-gray-700 font-medium">{src.version}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Published</span>
                        <p className="text-gray-700 font-medium">{src.publishedDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Factors loaded</span>
                        <p className="text-gray-700 font-medium">{src.factorCount} factors</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                      <span className="text-[11px] text-gray-400">
                        <strong>Methodology:</strong> {src.methodology}
                      </span>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 ml-auto"
                      >
                        <ExternalLink size={10} /> Original source
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* SCOPE 1 TAB */}
        {activeTab === "scope1" && (
          <div className="space-y-4">
            {/* Stationary Fuels */}
            <CollapsibleSection
              id="fuels"
              title="Stationary Combustion — Fuels"
              icon={<Flame size={16} className="text-orange-500" />}
              count={STATIONARY_FUELS.length}
              expanded={expandedSections.includes("fuels")}
              onToggle={() => toggleSection("fuels")}
            >
              <FactorTable
                headers={["Fuel", "Unit", "2023", "2024", "2025", "Source"]}
                rows={STATIONARY_FUELS.filter(f => !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase())).map((f) => [
                  f.name,
                  f.unit,
                  f.factors["2023"]?.toString() ?? "—",
                  f.factors["2024"]?.toString() ?? "—",
                  f.factors["2025"]?.toString() ?? "—",
                  f.source,
                ])}
              />
            </CollapsibleSection>

            {/* Vehicles */}
            <CollapsibleSection
              id="vehicles"
              title="Mobile Combustion — Vehicles"
              icon={<Truck size={16} className="text-blue-500" />}
              count={VEHICLE_FACTORS.length}
              expanded={expandedSections.includes("vehicles")}
              onToggle={() => toggleSection("vehicles")}
            >
              <FactorTable
                headers={["Category", "Type", "Fuel", "2024 kgCO2e/km", "2025", "Source"]}
                rows={VEHICLE_FACTORS.filter(v => !searchQuery || v.type.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase())).map((v) => [
                  v.category,
                  v.type,
                  v.fuel,
                  v.factors["2024"]?.toString() ?? "—",
                  v.factors["2025"]?.toString() ?? "—",
                  v.source,
                ])}
              />
            </CollapsibleSection>

            {/* Flights */}
            <CollapsibleSection
              id="flights"
              title="Aviation — Passenger Flights"
              icon={<Plane size={16} className="text-violet-500" />}
              count={FLIGHT_FACTORS.length}
              expanded={expandedSections.includes("flights")}
              onToggle={() => toggleSection("flights")}
            >
              <FactorTable
                headers={["Type", "Class", "2024 w/RF", "2025 w/RF", "2024 w/o RF", "Source"]}
                rows={FLIGHT_FACTORS.filter(f => !searchQuery || f.type.toLowerCase().includes(searchQuery.toLowerCase())).map((f) => [
                  f.type,
                  f.class,
                  f.withRF["2024"]?.toString() ?? "—",
                  f.withRF["2025"]?.toString() ?? "—",
                  f.withoutRF["2024"]?.toString() ?? "—",
                  f.source,
                ])}
              />
            </CollapsibleSection>

            {/* Refrigerants */}
            <CollapsibleSection
              id="refrigerants"
              title="Fugitive Emissions — Refrigerants"
              icon={<Snowflake size={16} className="text-cyan-500" />}
              count={REFRIGERANT_FACTORS.length}
              expanded={expandedSections.includes("refrigerants")}
              onToggle={() => toggleSection("refrigerants")}
            >
              <FactorTable
                headers={["Refrigerant", "GWP (AR5)", "kgCO2e/kg", "Common Use", "Source"]}
                rows={REFRIGERANT_FACTORS.filter(r => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase())).map((r) => [
                  r.name,
                  r.gwp100.toLocaleString(),
                  r.kgCO2ePerKg.toLocaleString(),
                  r.commonUse,
                  r.source,
                ])}
              />
            </CollapsibleSection>
          </div>
        )}

        {/* SCOPE 2 TAB */}
        {activeTab === "scope2" && (
          <div className="space-y-4">
            {/* Electricity Grid */}
            <CollapsibleSection
              id="grid"
              title="Electricity Grid Factors (gCO2/kWh)"
              icon={<Zap size={16} className="text-yellow-500" />}
              count={GRID_FACTORS.length}
              expanded={expandedSections.includes("grid")}
              onToggle={() => toggleSection("grid")}
            >
              <div className="mb-2 px-1">
                <p className="text-[11px] text-gray-400">
                  <strong>Location-based</strong> = Production Mix (EEA/AIB) &nbsp;|&nbsp;
                  <strong>Market-based</strong> = Residual Mix (AIB) &nbsp;|&nbsp;
                  Values in gCO2/kWh. Divide by 1000 for kgCO2e/kWh.
                </p>
              </div>
              <FactorTable
                headers={["Country", "Code", "2023 Location", "2024 Location", "2023 Residual", "2024 Residual"]}
                rows={GRID_FACTORS.filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase())).map((c) => [
                  c.name,
                  c.code,
                  c.locationBased["2023"]?.toString() ?? "—",
                  c.locationBased["2024"]?.toString() ?? "—",
                  c.residualMix["2023"]?.toString() ?? "—",
                  c.residualMix["2024"]?.toString() ?? "—",
                ])}
              />
            </CollapsibleSection>

            {/* District Heating / Steam / Cooling */}
            <CollapsibleSection
              id="heat"
              title="District Heating, Steam & Cooling (kgCO2e/kWh)"
              icon={<Thermometer size={16} className="text-red-500" />}
              count={HEAT_STEAM_COOLING_FACTORS.length}
              expanded={expandedSections.includes("heat")}
              onToggle={() => toggleSection("heat")}
            >
              <div className="mb-2 px-1">
                <p className="text-[11px] text-gray-400">
                  Scope 2 includes all purchased energy: electricity, district heating, steam, and cooling.
                  Values depend on local fuel mix, CHP efficiency, and allocation method.
                </p>
              </div>
              <FactorTable
                headers={["Source / Country", "Unit", "2023", "2024", "Data Source", "Notes"]}
                rows={HEAT_STEAM_COOLING_FACTORS.filter(h => !searchQuery || h.name.toLowerCase().includes(searchQuery.toLowerCase())).map((h) => [
                  h.name,
                  h.unit,
                  h.factors["2023"]?.toString() ?? "—",
                  h.factors["2024"]?.toString() ?? "—",
                  h.source,
                  h.notes,
                ])}
              />
            </CollapsibleSection>
          </div>
        )}

        {/* SCOPE 3 TAB */}
        {activeTab === "scope3" && (
          <div className="space-y-4">
            {SCOPE3_CATEGORIES.filter(cat => cat.factors.length > 0).map((cat) => (
              <CollapsibleSection
                key={cat.id}
                id={`scope3-${cat.id}`}
                title={`Cat. ${cat.id} — ${cat.name}`}
                icon={<Package size={16} className="text-violet-500" />}
                count={cat.factors.length}
                expanded={expandedSections.includes(`scope3-${cat.id}`)}
                onToggle={() => toggleSection(`scope3-${cat.id}`)}
                badge={cat.tier}
              >
                <p className="text-[11px] text-gray-400 mb-2 px-1">{cat.description}</p>
                <FactorTable
                  headers={["Factor", "Unit", "2024", "2025", "Source"]}
                  rows={cat.factors.filter(f => !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase())).map((f) => [
                    f.name,
                    f.unit,
                    f.kgCO2e["2024"]?.toString() ?? "—",
                    f.kgCO2e["2025"]?.toString() ?? "—",
                    f.source,
                  ])}
                />
              </CollapsibleSection>
            ))}
          </div>
        )}

        {/* AUDIT LOG TAB */}
        {activeTab === "audit" && (
          <div className="space-y-4">
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={20} className="text-green-600" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Audit Trail</h3>
                  <p className="text-xs text-gray-400">All emission factor changes are logged and traceable</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { date: "2025-03-01", action: "Database initialized", detail: "Loaded DEFRA 2024/2025, AIB 2024, EEA 2024, EXIOBASE 3.8 factors", user: "System", type: "init" },
                  { date: "2025-03-01", action: "Scope 2 heat factors added", detail: "Added district heating factors for 20 EU countries + steam/cooling (DEFRA, national agencies)", user: "System", type: "add" },
                  { date: "2025-03-01", action: "Refrigerants updated to AR5", detail: "Updated all refrigerant GWPs from IPCC AR4 to AR5 per DEFRA 2024 methodology change", user: "System", type: "update" },
                  { date: "2025-03-01", action: "Grid factors verified", detail: "Cross-checked AIB 2024 residual mix values against official PDF report (Table 2)", user: "System", type: "verify" },
                  { date: "2025-02-15", action: "DEFRA 2025 factors added", detail: "Loaded DEFRA/DESNZ 2025 conversion factors for stationary fuels and flights", user: "System", type: "add" },
                  { date: "2025-01-15", action: "Exiobase spend factors loaded", detail: "Loaded 8 sector-level spend-based emission factors from EXIOBASE 3.8.2", user: "System", type: "add" },
                ].map((log, i) => (
                  <div key={i} className="flex items-start gap-3 py-3 px-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="mt-0.5">
                      {log.type === "verify" ? (
                        <CheckCircle2 size={14} className="text-green-500" />
                      ) : log.type === "update" ? (
                        <RefreshCw size={14} className="text-blue-500" />
                      ) : (
                        <Clock size={14} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-gray-700">{log.action}</p>
                        <span className="text-[10px] text-gray-400">{log.date}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{log.detail}</p>
                    </div>
                    <span className="text-[10px] text-gray-400">{log.user}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Verification status */}
            <Card>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Verification Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Scope 1 Fuels", count: STATIONARY_FUELS.length, status: "verified" },
                  { label: "Scope 1 Vehicles", count: VEHICLE_FACTORS.length, status: "verified" },
                  { label: "Scope 1 Flights", count: FLIGHT_FACTORS.length, status: "verified" },
                  { label: "Scope 1 Refrigerants", count: REFRIGERANT_FACTORS.length, status: "verified" },
                  { label: "Scope 2 Electricity", count: GRID_FACTORS.length, status: "verified" },
                  { label: "Scope 2 Heat/Steam", count: HEAT_STEAM_COOLING_FACTORS.length, status: "verified" },
                  { label: "Scope 3 Categories", count: SCOPE3_CATEGORIES.filter(c => c.factors.length > 0).length, status: "verified" },
                  { label: "Scope 3 Factors", count: SCOPE3_CATEGORIES.reduce((sum, c) => sum + c.factors.length, 0), status: "verified" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-green-50/50 border border-green-100">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle2 size={12} className="text-green-500" />
                      <span className="text-[10px] font-semibold text-green-600 uppercase">Verified</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{item.count}</p>
                    <p className="text-[11px] text-gray-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Collapsible Section Component
// ---------------------------------------------------------------------------

function CollapsibleSection({
  id: _id,
  title,
  icon,
  count,
  expanded,
  onToggle,
  badge,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  count: number;
  expanded: boolean;
  onToggle: () => void;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <button
        onClick={onToggle}
        className="flex items-center gap-3 w-full text-left"
      >
        {expanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
        {icon}
        <span className="text-sm font-semibold text-gray-900 flex-1">{title}</span>
        {badge && <Badge variant={badge === "pro" ? "violet" : "blue"} size="sm">{badge.toUpperCase()}</Badge>}
        <span className="text-xs text-gray-400">{count} factors</span>
      </button>
      {expanded && <div className="mt-4 -mx-1">{children}</div>}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Factor Table Component
// ---------------------------------------------------------------------------

function FactorTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  if (rows.length === 0) {
    return <p className="text-xs text-gray-400 py-4 text-center">No matching factors found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100">
            {headers.map((h) => (
              <th key={h} className="text-left py-2 px-2 text-gray-400 font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className={`py-2 px-2 whitespace-nowrap ${
                  j === 0 ? "font-medium text-gray-700" : "text-gray-500"
                }`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
