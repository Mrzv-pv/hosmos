// =============================================================================
// Supabase Database Types (mirrors 001_schema.sql)
// =============================================================================

export interface Company {
  id: string;
  name: string;
  industry: string | null;
  nace_code: string | null;
  country: string | null;
  country_code: string | null;
  headcount: number;
  plan: "trial" | "starter" | "pro" | "enterprise";
  plan_start: string | null;
  reporting_year: string;
  currency: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: "owner" | "admin" | "editor" | "viewer";
  company_id: string | null;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface EmissionFactorSource {
  id: string;
  code: string;
  name: string;
  authority: string;
  publication: string | null;
  version_year: number | null;
  notes: string | null;
  created_at: string;
}

export interface StationaryFuelFactor {
  id: string;
  factor_id: string;
  name: string;
  unit: string;
  year: string;
  kg_co2e: number;
  source_id: string | null;
}

export interface VehicleFactor {
  id: string;
  factor_id: string;
  category: string;
  type: string;
  fuel: string;
  unit: string;
  year: string;
  kg_co2e_per_km: number;
  source_id: string | null;
}

export interface FlightFactor {
  id: string;
  factor_id: string;
  flight_type: string;
  cabin_class: string;
  year: string;
  kg_co2e_with_rf: number;
  kg_co2e_without_rf: number;
  source_id: string | null;
}

export interface RefrigerantFactor {
  id: string;
  factor_id: string;
  name: string;
  gwp_100: number;
  kg_co2e_per_kg: number;
  common_use: string | null;
  source_id: string | null;
}

export interface GridElectricityFactor {
  id: string;
  country_code: string;
  country_name: string;
  year: string;
  location_kwh: number;
  market_kwh: number;
  source_id: string | null;
}

export interface HeatSteamCoolingFactor {
  id: string;
  factor_id: string;
  category: "district_heating" | "steam" | "cooling";
  name: string;
  unit: string;
  year: string;
  kg_co2e_per_kwh: number;
  country_code: string | null;
  notes: string | null;
  source_id: string | null;
}

export interface Scope3Factor {
  id: string;
  factor_id: string;
  category_id: number;
  category_name: string;
  name: string;
  unit: string;
  year: string;
  kg_co2e: number;
  tier: "starter" | "pro";
  source_id: string | null;
}

export interface MonthlyEmissionsData {
  id: string;
  company_id: string;
  year: string;
  month: number;
  natural_gas_m3: number;
  diesel_litres: number;
  petrol_litres: number;
  lpg_litres: number;
  fuel_oil_litres: number;
  fleet_diesel_km: number;
  fleet_petrol_km: number;
  fleet_ev_km: number;
  electricity_kwh: number;
  district_heating_kwh: number;
  steam_kg: number;
  cooling_kwh: number;
  short_flights_pkm: number;
  long_flights_pkm: number;
  commute_car_km: number;
  commute_bus_km: number;
  commute_train_km: number;
  status: "draft" | "submitted" | "verified";
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PeopleData {
  id: string;
  company_id: string;
  year: string;
  headcount: number | null;
  fte: number | null;
  female_ratio: number | null;
  mgmt_female_ratio: number | null;
  board_female_ratio: number | null;
  training_hours: number | null;
  turnover_rate: number | null;
  accident_rate: number | null;
  fatalities: number;
  sick_days: number | null;
  gender_pay_gap: number | null;
  enps: number | null;
  created_at: string;
  updated_at: string;
}

export interface EmissionResult {
  id: string;
  company_id: string;
  year: string;
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
  calculated_at: string;
}
