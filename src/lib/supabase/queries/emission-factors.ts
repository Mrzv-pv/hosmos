"use server";

import { createClient } from "../server";

/** Fetch all stationary fuel factors for a given year */
export async function getStationaryFuelFactors(year: string = "2024") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stationary_fuel_factors")
    .select("*, emission_factor_sources(*)")
    .eq("year", year)
    .order("name");

  if (error) throw error;
  return data;
}

/** Fetch all vehicle factors for a given year */
export async function getVehicleFactors(year: string = "2024") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicle_factors")
    .select("*, emission_factor_sources(*)")
    .eq("year", year)
    .order("category")
    .order("type");

  if (error) throw error;
  return data;
}

/** Fetch all flight factors for a given year */
export async function getFlightFactors(year: string = "2024") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("flight_factors")
    .select("*, emission_factor_sources(*)")
    .eq("year", year)
    .order("flight_type")
    .order("cabin_class");

  if (error) throw error;
  return data;
}

/** Fetch all refrigerant factors */
export async function getRefrigerantFactors() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("refrigerant_factors")
    .select("*, emission_factor_sources(*)")
    .order("name");

  if (error) throw error;
  return data;
}

/** Fetch grid electricity factor for a specific country and year */
export async function getGridElectricityFactor(
  countryCode: string,
  year: string = "2024"
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("grid_electricity_factors")
    .select("*, emission_factor_sources(*)")
    .eq("country_code", countryCode)
    .eq("year", year)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

/** Fetch all grid electricity factors for a given year */
export async function getAllGridFactors(year: string = "2024") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("grid_electricity_factors")
    .select("*, emission_factor_sources(*)")
    .eq("year", year)
    .order("country_name");

  if (error) throw error;
  return data;
}

/** Fetch heat/steam/cooling factors for a given year */
export async function getHeatSteamCoolingFactors(year: string = "2024") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("heat_steam_cooling_factors")
    .select("*, emission_factor_sources(*)")
    .eq("year", year)
    .order("category")
    .order("name");

  if (error) throw error;
  return data;
}

/** Fetch scope 3 factors for a given year and optional tier filter */
export async function getScope3Factors(
  year: string = "2024",
  tier?: "starter" | "pro"
) {
  const supabase = await createClient();
  let query = supabase
    .from("scope3_factors")
    .select("*, emission_factor_sources(*)")
    .eq("year", year)
    .order("category_id")
    .order("name");

  if (tier) {
    query = query.eq("tier", tier);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/** Fetch all emission factor sources (for audit/data-sources page) */
export async function getEmissionFactorSources() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("emission_factor_sources")
    .select("*")
    .order("code");

  if (error) throw error;
  return data;
}
