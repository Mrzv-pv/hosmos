"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Building2, Users, CreditCard, Globe, Save, Upload, Link2, FileText, Zap, CheckCircle2, AlertCircle, Crown, ArrowRight, Loader2 } from "lucide-react";
import { usePlan } from "@/hooks/usePlan";
import { PLAN_FEATURES, type PlanId } from "@/lib/plans";
import { createClient } from "@/lib/supabase/client";

const INTEGRATIONS = [
  { id: "xero", name: "Xero", type: "API", tier: "starter", connected: false, desc: "Cloud accounting" },
  { id: "quickbooks", name: "QuickBooks", type: "API", tier: "starter", connected: false, desc: "Intuit accounting" },
  { id: "csv_import", name: "CSV / Excel", type: "File", tier: "starter", connected: true, desc: "Manual file upload" },
  { id: "pdf_scan", name: "Invoice Scanner", type: "OCR + AI", tier: "starter", connected: true, desc: "Upload PDF invoices" },
  { id: "sage", name: "Sage", type: "API", tier: "pro", connected: false, desc: "Accounting & payroll" },
  { id: "odoo", name: "Odoo", type: "API", tier: "pro", connected: false, desc: "Open-source ERP" },
  { id: "open_banking", name: "Open Banking", type: "PSD2", tier: "pro", connected: false, desc: "Bank transactions" },
  { id: "sap_b1", name: "SAP Business One", type: "CSV", tier: "enterprise", connected: false, desc: "SAP for SMEs" },
  { id: "1c", name: "1C:Enterprise", type: "CSV", tier: "enterprise", connected: false, desc: "CIS accounting" },
];

const PLAN_LIST: { id: PlanId; name: string; price: number; period: string; highlight: string; color: string }[] = [
  { id: "trial", name: "Trial", price: 0, period: "30 days", highlight: "Scope 1+2, 1 report", color: "gray" },
  { id: "starter", name: "Starter", price: 20, period: "/ month", highlight: "Scope 1+2+3, GRI & ESRS", color: "blue" },
  { id: "pro", name: "Pro", price: 100, period: "/ month", highlight: "Full Scope 3, CDP, Supply Chain", color: "violet" },
  { id: "enterprise", name: "Enterprise", price: 1000, period: "/ month", highlight: "API, White label, Unlimited", color: "amber" },
];

interface CompanyData {
  name: string;
  industry: string;
  country: string;
  nace_code: string;
  headcount: number;
  website?: string;
}

export default function SettingsPage() {
  const { plan, features, companyId, changePlan, loading: planLoading } = usePlan();
  const [changingPlan, setChangingPlan] = useState<PlanId | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [company, setCompany] = useState<CompanyData>({ name: "", industry: "", country: "", nace_code: "", headcount: 0 });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadCompany() {
      if (!companyId) return;
      const supabase = createClient();
      const { data } = await supabase.from("companies").select("*").eq("id", companyId).single();
      if (data) {
        setCompany({
          name: data.name || "",
          industry: data.industry || "",
          country: data.country || "",
          nace_code: data.nace_code || "",
          headcount: data.headcount || 0,
        });
      }
    }
    loadCompany();
  }, [companyId]);

  const handleSaveCompany = async () => {
    if (!companyId) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("companies").update({
      name: company.name,
      industry: company.industry,
      country: company.country,
      nace_code: company.nace_code,
      headcount: company.headcount,
    }).eq("id", companyId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePlanChange = async (newPlan: PlanId) => {
    setChangingPlan(newPlan);
    const ok = await changePlan(newPlan);
    setChangingPlan(null);
    if (ok) {
      setShowPlanModal(false);
      window.location.reload();
    }
  };

  const currentPlanInfo = PLAN_LIST.find(p => p.id === plan) || PLAN_LIST[0];

  if (planLoading) {
    return (
      <div className="min-h-screen">
        <TopBar title="Settings" subtitle="Loading..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar title="Settings" subtitle="Company profile, team, billing & integrations" />
      <div className="p-8 space-y-6 max-w-3xl">

        {/* Trial Banner */}
        {plan === "trial" && (
          <div className="bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-4">
              <Crown size={32} className="opacity-80" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">You&apos;re on the Free Trial</h3>
                <p className="text-sm opacity-80 mt-1">
                  Scope 3, People & Governance, ESRS reports and more are locked.
                  Upgrade to unlock all features — your data will be preserved.
                </p>
              </div>
              <Button
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50 border-0"
                onClick={() => setShowPlanModal(true)}
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        )}

        {/* Company Profile */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-blue-50">
              <Building2 size={20} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Company Profile</h3>
          </div>
          <div className="space-y-4">
            <Input
              label="Company Name"
              value={company.name}
              onChange={(e) => setCompany(prev => ({ ...prev, name: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Industry"
                options={["Manufacturing", "IT & Technology", "Retail", "Construction", "Transport", "Healthcare", "Financial Services", "Other"]}
                value={company.industry}
                onChange={(e) => setCompany(prev => ({ ...prev, industry: e.target.value }))}
              />
              <Select
                label="Country"
                options={["Slovenia", "Austria", "Germany", "Croatia", "Italy", "Czech Republic", "Slovakia", "Hungary"]}
                value={company.country}
                onChange={(e) => setCompany(prev => ({ ...prev, country: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="NACE Code"
                value={company.nace_code}
                onChange={(e) => setCompany(prev => ({ ...prev, nace_code: e.target.value }))}
              />
              <Input
                label="Employees"
                type="number"
                value={String(company.headcount)}
                onChange={(e) => setCompany(prev => ({ ...prev, headcount: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
        </Card>

        {/* Team */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-violet-50">
              <Users size={20} className="text-violet-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            <Badge variant="gray" size="sm">
              {features.maxTeamMembers === -1 ? "Unlimited" : `Max ${features.maxTeamMembers}`}
            </Badge>
          </div>
          <div className="space-y-3">
            {[
              { name: "You", email: "Current user", role: "Admin" },
            ].map((member) => (
              <div
                key={member.email}
                className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-gray-50 transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">{member.name}</p>
                  <p className="text-xs text-gray-400">{member.email}</p>
                </div>
                <Badge variant={member.role === "Admin" ? "blue" : "gray"}>
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
          {features.maxTeamMembers > 1 && (
            <Button variant="secondary" size="sm" className="mt-4">
              + Invite Member
            </Button>
          )}
          {plan === "trial" && (
            <p className="text-xs text-gray-400 mt-3">
              Upgrade to invite team members.
            </p>
          )}
        </Card>

        {/* Billing & Plan */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-green-50">
              <CreditCard size={20} className="text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Billing & Plan</h3>
            </div>
            <Badge variant={plan === "trial" ? "gray" : plan === "starter" ? "blue" : plan === "pro" ? "violet" : "blue"} size="md">
              {currentPlanInfo.name.toUpperCase()}
            </Badge>
          </div>

          {/* Current plan info */}
          <div className="bg-gray-50 rounded-xl p-5 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-gray-700">{currentPlanInfo.name} Plan</p>
                <p className="text-xs text-gray-400">{currentPlanInfo.highlight}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-serif text-gray-900">
                  {currentPlanInfo.price === 0 ? "Free" : `\u20AC${currentPlanInfo.price}`}
                </p>
                <p className="text-xs text-gray-400">{currentPlanInfo.period}</p>
              </div>
            </div>
          </div>

          {/* Feature summary */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {[
              { label: "Scope 3", ok: features.scope3 },
              { label: "People & Social", ok: features.socialParams },
              { label: "Governance", ok: features.governanceParams },
              { label: "Supply Chain", ok: features.supplyChain },
              { label: "Goals & OKR", ok: features.goals },
              { label: "Data Export", ok: features.dataExport },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-2 text-xs">
                {f.ok ? (
                  <CheckCircle2 size={14} className="text-green-500" />
                ) : (
                  <AlertCircle size={14} className="text-gray-300" />
                )}
                <span className={f.ok ? "text-gray-700" : "text-gray-400"}>{f.label}</span>
              </div>
            ))}
          </div>

          <Button variant="primary" size="sm" onClick={() => setShowPlanModal(true)}>
            {plan === "enterprise" ? "Manage Plan" : "Change Plan"}
          </Button>
        </Card>

        {/* Plan Selection Modal */}
        {showPlanModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowPlanModal(false)}>
            <div className="bg-white rounded-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-serif text-gray-900 mb-2">Choose Your Plan</h2>
              <p className="text-sm text-gray-500 mb-6">Switch plans instantly. Your data is never deleted.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PLAN_LIST.map(p => {
                  const isCurrent = p.id === plan;
                  const planFeatures = PLAN_FEATURES[p.id];
                  return (
                    <div
                      key={p.id}
                      className={`rounded-xl border-2 p-5 transition-all ${
                        isCurrent
                          ? "border-blue-500 bg-blue-50/50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                        {isCurrent && <Badge variant="blue">Current</Badge>}
                      </div>
                      <div className="mb-3">
                        <span className="text-3xl font-serif text-gray-900">
                          {p.price === 0 ? "Free" : `\u20AC${p.price}`}
                        </span>
                        <span className="text-sm text-gray-400 ml-1">{p.period}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-4">{p.highlight}</p>
                      <div className="space-y-1.5 mb-5">
                        <FeatureLine ok={true} label={`Scope 1 + 2`} />
                        <FeatureLine ok={planFeatures.scope3} label="Scope 3" />
                        <FeatureLine ok={planFeatures.socialParams} label="People & Social" />
                        <FeatureLine ok={planFeatures.governanceParams} label="Governance" />
                        <FeatureLine ok={planFeatures.supplyChain} label="Supply Chain" />
                        <FeatureLine ok={planFeatures.goals} label="Goals & OKR" />
                        <FeatureLine ok={planFeatures.reports.length > 1} label={`${planFeatures.reports.length} report types`} />
                      </div>
                      {isCurrent ? (
                        <Button variant="secondary" size="sm" className="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          loading={changingPlan === p.id}
                          onClick={() => handlePlanChange(p.id)}
                        >
                          {p.price > (PLAN_FEATURES[plan]?.price || 0) ? "Upgrade" : "Switch"} to {p.name}
                          <ArrowRight size={14} className="ml-1" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 text-center">
                <Button variant="ghost" onClick={() => setShowPlanModal(false)}>Close</Button>
              </div>
            </div>
          </div>
        )}

        {/* Language */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-blue-50">
              <Globe size={20} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Language & Region</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Interface Language"
              options={[
                { value: "en", label: "English" },
                { value: "sl", label: "Slovenian" },
              ]}
              defaultValue="en"
            />
            <Select
              label="Report Language"
              options={[
                { value: "en", label: "English" },
                { value: "sl", label: "Slovenian" },
              ]}
              defaultValue="en"
            />
          </div>
        </Card>

        {/* Data Integrations */}
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-violet-50">
              <Link2 size={20} className="text-violet-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Data Integrations</h3>
              <p className="text-xs text-gray-400">Connect accounting systems or upload invoices for automatic emission data</p>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {INTEGRATIONS.map((intg) => {
              const isLocked = !features.integrations.includes(intg.tier);
              return (
                <div
                  key={intg.id}
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl border transition-all ${
                    intg.connected
                      ? "border-green-200 bg-green-50/50"
                      : isLocked
                      ? "border-gray-100 bg-gray-50/50 opacity-60"
                      : "border-gray-100 hover:border-blue-200 hover:bg-blue-50/30"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    intg.connected ? "bg-green-100" : isLocked ? "bg-gray-100" : "bg-blue-50"
                  }`}>
                    {intg.type === "OCR + AI" ? (
                      <FileText size={18} className={intg.connected ? "text-green-600" : "text-gray-400"} />
                    ) : intg.type === "File" ? (
                      <Upload size={18} className={intg.connected ? "text-green-600" : "text-gray-400"} />
                    ) : (
                      <Zap size={18} className={intg.connected ? "text-green-600" : isLocked ? "text-gray-300" : "text-blue-500"} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">{intg.name}</p>
                    <p className="text-xs text-gray-400">{intg.desc} &middot; {intg.type}</p>
                  </div>
                  {intg.connected ? (
                    <div className="flex items-center gap-1.5 text-green-600">
                      <CheckCircle2 size={14} />
                      <span className="text-xs font-medium">Connected</span>
                    </div>
                  ) : isLocked ? (
                    <Badge variant="gray" size="sm">{intg.tier.toUpperCase()}</Badge>
                  ) : (
                    <Button variant="secondary" size="sm">Connect</Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Invoice Scanner */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-50">
              <FileText size={20} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Invoice Scanner</h3>
              <p className="text-xs text-gray-400">Upload PDF invoices — AI extracts emission data automatically</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer">
            <Upload size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-600">Drop PDF invoices here or click to upload</p>
            <p className="text-xs text-gray-400 mt-1">Electricity bills, gas bills, fuel receipts, travel invoices</p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Uploads</p>
            {[
              { name: "Elektro_Ljubljana_Jan2025.pdf", type: "Electricity bill", status: "approved", kwh: "35,200 kWh", co2: "7.46 tCO2e" },
              { name: "Petrol_Fleet_Card_Q4.pdf", type: "Fleet fuel card", status: "review", kwh: "2,840 L diesel", co2: "7.14 tCO2e" },
              { name: "Lufthansa_Invoice_0392.pdf", type: "Travel invoice", status: "extracted", kwh: "3 flights", co2: "1.82 tCO2e" },
            ].map((doc) => (
              <div key={doc.name} className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-gray-50">
                <FileText size={16} className="text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{doc.name}</p>
                  <p className="text-[11px] text-gray-400">{doc.type} &middot; {doc.kwh}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-gray-600">{doc.co2}</p>
                  <div className="flex items-center gap-1 justify-end">
                    {doc.status === "approved" ? (
                      <><CheckCircle2 size={10} className="text-green-500" /><span className="text-[10px] text-green-600">Approved</span></>
                    ) : doc.status === "review" ? (
                      <><AlertCircle size={10} className="text-amber-500" /><span className="text-[10px] text-amber-600">Review</span></>
                    ) : (
                      <><Zap size={10} className="text-blue-500" /><span className="text-[10px] text-blue-600">Extracted</span></>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button size="lg" onClick={handleSaveCompany} loading={saving}>
            <Save size={18} className="mr-2" /> Save Settings
          </Button>
          {saved && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 size={16} /> Saved!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureLine({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {ok ? (
        <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
      ) : (
        <AlertCircle size={12} className="text-gray-300 flex-shrink-0" />
      )}
      <span className={ok ? "text-gray-700" : "text-gray-400"}>{label}</span>
    </div>
  );
}
