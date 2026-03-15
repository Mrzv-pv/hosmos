"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Building2, Users, CreditCard, Globe, Save, Upload, Link2, FileText, Zap, CheckCircle2, AlertCircle } from "lucide-react";

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

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Settings" subtitle="Company profile, team, billing & integrations" />
      <div className="p-8 space-y-6 max-w-3xl">
        {/* Company Profile */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-blue-50">
              <Building2 size={20} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Company Profile</h3>
          </div>
          <div className="space-y-4">
            <Input label="Company Name" defaultValue="Acme Manufacturing d.o.o." />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Industry"
                options={["Manufacturing", "IT & Technology", "Retail"]}
                defaultValue="Manufacturing"
              />
              <Select
                label="Country"
                options={["Slovenia", "Austria", "Germany"]}
                defaultValue="Slovenia"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="NACE Code" defaultValue="C25.1" />
              <Input label="Employees" type="number" defaultValue="120" />
            </div>
            <Input label="Company Website" defaultValue="https://acme-mfg.si" />
          </div>
        </Card>

        {/* Team */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-violet-50">
              <Users size={20} className="text-violet-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: "John Doe", email: "john@acme-mfg.si", role: "Admin" },
              { name: "Ana Novak", email: "ana@acme-mfg.si", role: "Editor" },
              { name: "Marko Petric", email: "marko@acme-mfg.si", role: "Viewer" },
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
          <Button variant="secondary" size="sm" className="mt-4">
            + Invite Member
          </Button>
        </Card>

        {/* Billing */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-green-50">
              <CreditCard size={20} className="text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Billing</h3>
            </div>
            <Badge variant="blue" size="md">STARTER</Badge>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-gray-700">Starter Plan</p>
                <p className="text-xs text-gray-400">1 company, Scope 1/2, GRI/ESRS export</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-serif text-gray-900">&euro;20</p>
                <p className="text-xs text-gray-400">/ month</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" size="sm">Upgrade to Pro</Button>
            <Button variant="ghost" size="sm">Manage Billing</Button>
          </div>
        </Card>

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
              const isLocked = intg.tier === "pro" || intg.tier === "enterprise";
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

          {/* Upload area */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer">
            <Upload size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-600">Drop PDF invoices here or click to upload</p>
            <p className="text-xs text-gray-400 mt-1">Electricity bills, gas bills, fuel receipts, travel invoices</p>
          </div>

          {/* Recent scans demo */}
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

        <Button size="lg">
          <Save size={18} className="mr-2" /> Save Settings
        </Button>
      </div>
    </div>
  );
}
