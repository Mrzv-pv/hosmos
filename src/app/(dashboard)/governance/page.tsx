"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Circle, Shield, Scale, Eye, Lock, Save, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { getMyCompany, updateCompany } from "@/lib/supabase/queries/company-data";

// ─── Governance checklist definition ──────────────────────────────────────────
// ESRS G1: Business conduct — covers board, ethics, data protection, risk
const GOVERNANCE_ITEMS = [
  {
    category: "Board & Leadership",
    icon: Scale,
    esrs: "G1-1, G1-3",
    items: [
      "Board composition documented",
      "Independent directors identified",
      "Board diversity policy",
      "Executive compensation disclosure",
      "Board ESG committee",
    ],
  },
  {
    category: "Ethics & Anti-corruption",
    icon: Shield,
    esrs: "G1-3, G1-4",
    items: [
      "Code of ethics published",
      "Anti-corruption policy",
      "Whistleblowing channel active",
      "Conflict of interest policy",
      "Political contributions policy",
      "Anti-bribery training completed",
    ],
  },
  {
    category: "Data Protection & Privacy",
    icon: Lock,
    esrs: "G1-1",
    items: [
      "GDPR compliance assessment",
      "Data Processing Agreement (DPA)",
      "Privacy policy published",
      "Data breach notification process",
      "DPO appointed",
      "Data retention policy",
    ],
  },
  {
    category: "Risk Management",
    icon: Eye,
    esrs: "G1-2, G1-5",
    items: [
      "Risk register maintained",
      "Risk assessment methodology",
      "Business continuity plan",
      "Internal audit function",
      "Regulatory compliance monitoring",
    ],
  },
];

const ALL_ITEMS = GOVERNANCE_ITEMS.flatMap(g => g.items);

export default function GovernancePage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [company, setCompany] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Load company & governance data from DB
  useEffect(() => {
    (async () => {
      try {
        const comp = await getMyCompany();
        if (comp) {
          setCompany(comp);
          // Load saved governance state
          const gd = (comp as Record<string, unknown>).governance_data;
          if (gd && typeof gd === "object") {
            setCheckedItems(gd as Record<string, boolean>);
          }
        }
      } catch (err) {
        console.error("Failed to load governance data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleItem = useCallback((label: string) => {
    setCheckedItems(prev => {
      const next = { ...prev, [label]: !prev[label] };
      return next;
    });
    setDirty(true);
    setSaved(false);
  }, []);

  const handleSave = useCallback(async () => {
    if (!company) return;
    setSaving(true);
    try {
      await updateCompany(company.id, { governance_data: checkedItems });
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save governance:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [company, checkedItems]);

  const totalItems = ALL_ITEMS.length;
  const doneItems = ALL_ITEMS.filter(item => checkedItems[item]).length;

  if (loading) {
    return (
      <div className="min-h-screen">
        <TopBar title="Governance" subtitle="ESRS G1 — Business Conduct" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar title="Governance" subtitle="ESRS G1 — Business Conduct" />
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

        {GOVERNANCE_ITEMS.map((group) => {
          const groupDone = group.items.filter(item => checkedItems[item]).length;
          return (
            <Card key={group.category}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-blue-50">
                  <group.icon size={20} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{group.category}</h3>
                  <p className="text-xs text-gray-400">
                    {groupDone} of {group.items.length} completed · <span className="text-blue-400">{group.esrs}</span>
                  </p>
                </div>
                <span className="text-sm font-mono text-gray-500">
                  {Math.round((groupDone / group.items.length) * 100)}%
                </span>
              </div>
              <div className="space-y-3">
                {group.items.map((item) => {
                  const done = !!checkedItems[item];
                  return (
                    <label
                      key={item}
                      className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all select-none"
                      onClick={() => toggleItem(item)}
                    >
                      {done ? (
                        <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle size={20} className="text-gray-300 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          done ? "text-gray-500 line-through" : "text-gray-700"
                        }`}
                      >
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </Card>
          );
        })}

        <div className="flex items-center gap-3">
          <Button size="lg" onClick={handleSave} disabled={saving || !dirty}>
            {saving ? (
              <><Loader2 size={18} className="mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Save size={18} className="mr-2" /> Save Governance Data</>
            )}
          </Button>
          {saved && (
            <span className="text-green-500 text-sm font-medium animate-in fade-in">
              ✓ Saved
            </span>
          )}
          {dirty && !saved && (
            <span className="text-amber-500 text-xs">Unsaved changes</span>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-4">
          These governance parameters map to ESRS G1 (Business Conduct) disclosure requirements.
          Completion status is included in ESRS reports when generated.
        </p>
      </div>
    </div>
  );
}
