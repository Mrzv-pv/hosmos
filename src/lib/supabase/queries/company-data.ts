"use server";

import { createClient } from "../server";

/** Get the current user's company */
export async function getMyCompany() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (!profile?.company_id) return null;

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", profile.company_id)
    .single();

  return company;
}

/** Get monthly emissions data for a company and year */
export async function getMonthlyEmissions(companyId: string, year: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("monthly_emissions_data")
    .select("*")
    .eq("company_id", companyId)
    .eq("year", year)
    .order("month");

  if (error) throw error;
  return data;
}

/** Upsert monthly emissions data (insert or update) */
export async function saveMonthlyEmissions(
  companyId: string,
  year: string,
  month: number,
  values: Record<string, number>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("monthly_emissions_data")
    .upsert(
      {
        company_id: companyId,
        year,
        month,
        ...values,
        updated_by: user?.id,
        status: "draft",
      },
      {
        onConflict: "company_id,year,month",
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Save all 12 months at once */
export async function saveAllMonthlyEmissions(
  companyId: string,
  year: string,
  months: Array<{ month: number } & Record<string, number>>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rows = months.map((m) => ({
    company_id: companyId,
    year,
    ...m,
    updated_by: user?.id,
    status: "draft" as const,
  }));

  const { data, error } = await supabase
    .from("monthly_emissions_data")
    .upsert(rows, {
      onConflict: "company_id,year,month",
    })
    .select();

  if (error) throw error;
  return data;
}

/** Get people data for a company and year */
export async function getPeopleData(companyId: string, year: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("people_data")
    .select("*")
    .eq("company_id", companyId)
    .eq("year", year)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

/** Upsert people data */
export async function savePeopleData(
  companyId: string,
  year: string,
  values: Record<string, number | null>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("people_data")
    .upsert(
      {
        company_id: companyId,
        year,
        ...values,
      },
      {
        onConflict: "company_id,year",
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Get cached emission results */
export async function getEmissionResults(companyId: string, year: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("emission_results")
    .select("*")
    .eq("company_id", companyId)
    .eq("year", year)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

/** Save calculated emission results */
export async function saveEmissionResults(
  companyId: string,
  year: string,
  results: {
    scope1_stationary: number;
    scope1_fleet: number;
    scope1_total: number;
    scope2_location: number;
    scope2_market: number;
    scope2_total: number;
    scope3_total: number;
    total_tco2e: number;
    per_employee: number;
    esg_score: number;
  }
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("emission_results")
    .upsert(
      {
        company_id: companyId,
        year,
        ...results,
        calculated_at: new Date().toISOString(),
      },
      {
        onConflict: "company_id,year",
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Update company settings */
export async function updateCompany(
  companyId: string,
  updates: {
    name?: string;
    industry?: string;
    nace_code?: string;
    country?: string;
    country_code?: string;
    headcount?: number;
    reporting_year?: string;
    currency?: string;
    logo_url?: string;
    governance_data?: Record<string, boolean>;
  }
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("companies")
    .update(updates)
    .eq("id", companyId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
