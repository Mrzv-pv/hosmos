import { createClient } from './client'

// Types for DB rows
// Note: Supabase joins return arrays for relations; we normalize to single objects below

export interface DbSource { code: string; name: string; authority: string }

export interface DbStationaryFuelFactor {
  factor_id: string
  name: string
  unit: string
  year: number
  factor_kg_co2e: number
  source?: DbSource
}

export interface DbVehicleFactor {
  factor_id: string
  category: string
  type: string
  fuel: string
  unit: string
  year: number
  factor_kg_co2e: number
  source?: { code: string }
}

export interface DbFlightFactor {
  factor_id: string
  type: string
  class: string
  year: number
  with_rf_kg_co2e: number
  without_rf_kg_co2e: number
  source?: { code: string }
}

export interface DbGridFactor {
  country_code: string
  country_name: string
  year: number
  location_based_kg_co2e: number
  residual_mix_kg_co2e: number
}

export interface DbHeatFactor {
  factor_id: string
  name: string
  category: string
  country_code: string | null
  unit: string
  year: number
  factor_kg_co2e: number
}

export interface DbScope3Factor {
  factor_id: string
  name: string
  scope3_category: number
  unit: string
  year: number
  factor_kg_co2e: number
  source?: { code: string }
}

export interface DbCompany {
  id: string
  name: string
  industry: string | null
  nace_code: string | null
  country: string | null
  country_code: string | null
  headcount: number | null
  plan: string
  reporting_year: string | null
  currency: string | null
}

// Helper to flatten Supabase join arrays into single objects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flattenSource<T extends Record<string, any>>(rows: T[]): T[] {
  return rows.map(row => {
    if (row.emission_factor_sources) {
      const src = Array.isArray(row.emission_factor_sources)
        ? row.emission_factor_sources[0]
        : row.emission_factor_sources
      const { emission_factor_sources: _, ...rest } = row
      return { ...rest, source: src ?? undefined } as unknown as T
    }
    return row
  })
}

// ── Emission Factor Queries ──

export async function getStationaryFuelFactors(year?: number) {
  const supabase = createClient()
  let query = supabase
    .from('stationary_fuel_factors')
    .select('factor_id, name, unit, year, factor_kg_co2e, emission_factor_sources(code, name, authority)')
  if (year) query = query.eq('year', year)
  const { data, error } = await query.order('name')
  if (error) throw error
  return flattenSource(data ?? []) as unknown as DbStationaryFuelFactor[]
}

export async function getVehicleFactors(year?: number) {
  const supabase = createClient()
  let query = supabase
    .from('vehicle_factors')
    .select('factor_id, category, type, fuel, unit, year, factor_kg_co2e, emission_factor_sources(code)')
  if (year) query = query.eq('year', year)
  const { data, error } = await query.order('category').order('type')
  if (error) throw error
  return flattenSource(data ?? []) as unknown as DbVehicleFactor[]
}

export async function getFlightFactors(year?: number) {
  const supabase = createClient()
  let query = supabase
    .from('flight_factors')
    .select('factor_id, type, class, year, with_rf_kg_co2e, without_rf_kg_co2e, emission_factor_sources(code)')
  if (year) query = query.eq('year', year)
  const { data, error } = await query.order('type')
  if (error) throw error
  return flattenSource(data ?? []) as unknown as DbFlightFactor[]
}

export async function getGridFactors(year?: number) {
  const supabase = createClient()
  let query = supabase
    .from('grid_electricity_factors')
    .select('country_code, country_name, year, location_based_kg_co2e, residual_mix_kg_co2e')
  if (year) query = query.eq('year', year)
  const { data, error } = await query.order('country_name')
  if (error) throw error
  return (data ?? []) as unknown as DbGridFactor[]
}

export async function getHeatFactors(year?: number) {
  const supabase = createClient()
  let query = supabase
    .from('heat_steam_cooling_factors')
    .select('factor_id, name, category, country_code, unit, year, factor_kg_co2e')
  if (year) query = query.eq('year', year)
  const { data, error } = await query.order('name')
  if (error) throw error
  return (data ?? []) as unknown as DbHeatFactor[]
}

export async function getScope3Factors(year?: number) {
  const supabase = createClient()
  let query = supabase
    .from('scope3_factors')
    .select('factor_id, name, scope3_category, unit, year, factor_kg_co2e, emission_factor_sources(code)')
  if (year) query = query.eq('year', year)
  const { data, error } = await query.order('scope3_category').order('name')
  if (error) throw error
  return flattenSource(data ?? []) as unknown as DbScope3Factor[]
}

// ── Company & User Queries ──

export async function getCurrentCompany(): Promise<DbCompany | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.company_id) return null

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', profile.company_id)
    .single()

  return company as DbCompany | null
}

export async function getEmissionFactorSources() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('emission_factor_sources')
    .select('*')
    .order('code')
  if (error) throw error
  return data ?? []
}

// ── Monthly Emissions Data ──

export async function getMonthlyEmissions(companyId: string, year: string | number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('monthly_emissions_data')
    .select('*')
    .eq('company_id', companyId)
    .eq('year', String(year))
    .order('month')
  if (error) throw error
  return data ?? []
}

export async function saveMonthlyEmission(
  companyId: string,
  year: string | number,
  month: number,
  rowData: Record<string, number>
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('monthly_emissions_data')
    .upsert(
      { company_id: companyId, year: String(year), month, ...rowData },
      { onConflict: 'company_id,year,month' }
    )
    .select()
    .single()
  if (error) throw error
  return data
}

export async function saveEmissionResults(
  companyId: string,
  year: string | number,
  results: {
    scope1_stationary?: number
    scope1_fleet?: number
    scope1_total: number
    scope2_location: number
    scope2_market: number
    scope3_total: number
    total_tco2e: number
    per_employee: number | null
  }
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('emission_results')
    .upsert(
      { company_id: companyId, year: String(year), ...results },
      { onConflict: 'company_id,year' }
    )
    .select()
    .single()
  if (error) throw error
  return data
}
