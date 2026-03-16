"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getPlanFeatures, type PlanId, type PlanFeatures } from "@/lib/plans";

interface PlanState {
  plan: PlanId;
  features: PlanFeatures;
  companyId: string | null;
  companyName: string;
  loading: boolean;
  userId: string | null;
  changePlan: (newPlan: PlanId) => Promise<boolean>;
}

export function usePlan(): PlanState {
  const [plan, setPlan] = useState<PlanId>("trial");
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        setUserId(user.id);

        const { data: profile } = await supabase
          .from("profiles")
          .select("company_id")
          .eq("id", user.id)
          .single();

        if (profile?.company_id) {
          setCompanyId(profile.company_id);
          const { data: comp } = await supabase
            .from("companies")
            .select("plan, name")
            .eq("id", profile.company_id)
            .single();

          if (comp) {
            setPlan((comp.plan || "trial") as PlanId);
            setCompanyName(comp.name || "");
          }
        }
      } catch (e) {
        console.error("usePlan error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const changePlan = async (newPlan: PlanId): Promise<boolean> => {
    if (!companyId) return false;
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("companies")
        .update({
          plan: newPlan,
          plan_start: new Date().toISOString().split("T")[0],
        })
        .eq("id", companyId);

      if (error) {
        console.error("Plan change error:", error);
        return false;
      }
      setPlan(newPlan);
      return true;
    } catch (e) {
      console.error("Plan change error:", e);
      return false;
    }
  };

  return {
    plan,
    features: getPlanFeatures(plan),
    companyId,
    companyName,
    loading,
    userId,
    changePlan,
  };
}
