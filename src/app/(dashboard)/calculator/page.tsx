"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { COUNTRIES } from "@/lib/constants";
import { EMISSION_FACTORS } from "@/lib/constants";
import { getGridFactor, GRID_FACTORS } from "@/data/emission-factors";
import {
  getStationaryFuelFactors,
  getVehicleFactors,
  getGridFactors,
  getHeatFactors,
  getScope3Factors,
  getFlightFactors,
  getCurrentCompany,
  getMonthlyEmissions,
  saveMonthlyEmission,
  saveEmissionResults,
  type DbStationaryFuelFactor,
  type DbVehicleFactor,
  type DbGridFactor,
  type DbHeatFactor,
  type DbScope3Factor,
  type DbFlightFactor,
  type DbCompany,
} from "@/lib/supabase/queries";
import {
  Flame,
  Zap,
  Save,
  Info,
  Calendar,
  ChevronDown,
  ChevronUp,
  Thermometer,
  Car,
  Plane,
  Users,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Globe,
  Download,
} from "lucide-react";

// Stable number formatter (avoids hydration mismatch from toLocaleString)
function fmtNum(n: number): string {
  const s = Math.round(n).toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ─── Types ──────────────────────────────────────────────────────────────────
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FULL_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface MonthlyRow {
  // Scope 1 - Stationary
  naturalGas_m3: number;
  diesel_L: number;
  petrol_L: number;
  lpg_L: number;
  fuelOil_L: number;
  // Scope 1 - Fleet
  fleetDiesel_km: number;
  fleetPetrol_km: number;
  fleetEV_km: number;
  // Scope 2
  electricity_kWh: number;
  districtHeating_kWh: number;
  steam_kg: number;
  cooling_kWh: number;
  // Scope 3 basic
  shortFlights_pkm: number;
  longFlights_pkm: number;
  commuteCar_km: number;
  commuteBus_km: number;
  commuteTrain_km: number;
}

interface MonthlyResult {
  scope1: number;
  scope2: number;
  scope2Market: number;
  scope3: number;
  total: number;
  // Scope 1 breakdown
  s1_stationary: number;
  s1_fleet: number;
  // Scope 2 breakdown
  s2_electricity: number;
  s2_electricityMarket: number;
  s2_heating: number;
  s2_steam: number;
  s2_cooling: number;
  // Scope 3 breakdown
  s3_flights: number;
  s3_commute: number;
}

// Default monthly distribution for demo (Slovenia manufacturing)
function createDemoMonth(m: number): MonthlyRow {
  // Seasonal patterns: more heating in winter, more electricity in summer (cooling)
  const winterFactor = [1.3, 1.25, 1.1, 0.85, 0.7, 0.6, 0.55, 0.55, 0.75, 0.95, 1.15, 1.35][m];
  const summerFactor = [0.8, 0.8, 0.9, 0.95, 1.05, 1.15, 1.2, 1.15, 1.05, 0.95, 0.85, 0.8][m];
  const flightFactor = [0.6, 0.7, 1.0, 1.1, 1.2, 1.1, 0.8, 0.4, 1.1, 1.2, 1.0, 0.5][m];

  return {
    naturalGas_m3: Math.round(742 * winterFactor),     // ~8900 total
    diesel_L: Math.round(267),                          // ~3200 total
    petrol_L: 0,
    lpg_L: 0,
    fuelOil_L: 0,
    fleetDiesel_km: Math.round(8333),                   // ~100,000 total
    fleetPetrol_km: Math.round(3000),                   // ~36,000 total
    fleetEV_km: 0,
    electricity_kWh: Math.round(35000 * summerFactor),  // ~420,000 total
    districtHeating_kWh: Math.round(2500 * winterFactor),
    steam_kg: 0,
    cooling_kWh: Math.round(800 * summerFactor),
    shortFlights_pkm: Math.round(1200 * flightFactor),
    longFlights_pkm: Math.round(2167 * flightFactor),
    commuteCar_km: Math.round(13417),                   // ~161,000 total
    commuteBus_km: Math.round(1500),
    commuteTrain_km: Math.round(800),
  };
}

// ─── DB Factor Lookup Map ────────────────────────────────────────────────────
interface CalculatorFactors {
  // Stationary combustion (kgCO2e per unit)
  naturalGas_m3: number;
  diesel_L: number;
  petrol_L: number;
  lpg_L: number;
  fuelOil_L: number;
  // Vehicles (kgCO2e per km)
  fleetDiesel_km: number;
  fleetPetrol_km: number;
  fleetEV_km: number;
  // Heat/steam/cooling (kgCO2e per kWh)
  districtHeating_kWh: number;
  steam_kWh: number;
  cooling_kWh: number;
  // Scope 3 (kgCO2e per unit)
  shortFlight_pkm: number;
  longFlight_pkm: number;
  commuteCar_km: number;
  commuteBus_km: number;
  commuteTrain_km: number;
}

/** Build a flat CalculatorFactors map from DB rows, with static fallbacks */
function buildFactorMap(
  fuels: DbStationaryFuelFactor[],
  vehicles: DbVehicleFactor[],
  flights: DbFlightFactor[],
  heat: DbHeatFactor[],
  scope3: DbScope3Factor[],
): CalculatorFactors {
  // Helper: find row by factor_id, return factor value
  const fuelVal = (id: string) => fuels.find(f => f.factor_id === id)?.factor_kg_co2e;
  const vehVal = (id: string) => vehicles.find(f => f.factor_id === id)?.factor_kg_co2e;
  const flightVal = (id: string) => flights.find(f => f.factor_id === id)?.with_rf_kg_co2e;
  const heatVal = (id: string) => heat.find(f => f.factor_id === id)?.factor_kg_co2e;
  const s3Val = (id: string) => scope3.find(f => f.factor_id === id)?.factor_kg_co2e;

  return {
    naturalGas_m3:       fuelVal('natural_gas_m3')       ?? EMISSION_FACTORS.naturalGas,
    diesel_L:            fuelVal('diesel_biofuel_litre')  ?? EMISSION_FACTORS.diesel,
    petrol_L:            fuelVal('petrol_biofuel_litre')  ?? EMISSION_FACTORS.petrol,
    lpg_L:               fuelVal('lpg_litre')             ?? EMISSION_FACTORS.lpg,
    fuelOil_L:           fuelVal('fuel_oil_litre')        ?? 2.96,
    fleetDiesel_km:      vehVal('car_diesel_avg')         ?? EMISSION_FACTORS.vehicles.car_diesel,
    fleetPetrol_km:      vehVal('car_petrol_avg')         ?? EMISSION_FACTORS.vehicles.car_petrol,
    fleetEV_km:          vehVal('car_bev_avg')            ?? EMISSION_FACTORS.vehicles.car_bev,
    districtHeating_kWh: heatVal('heat_defra_default')    ?? 0.198,
    steam_kWh:           heatVal('steam_defra')           ?? 0.17679,
    cooling_kWh:         heatVal('cooling_defra')         ?? 0.145,
    shortFlight_pkm:     flightVal('flight_shorthaul_avg') ?? 0.18592,
    longFlight_pkm:      flightVal('flight_longhaul_avg')  ?? 0.26128,
    commuteCar_km:       s3Val('s3_c7_car_avg')           ?? 0.16725,
    commuteBus_km:       s3Val('s3_c7_bus')               ?? 0.10312,
    commuteTrain_km:     s3Val('s3_c7_rail_national') ?? s3Val('s3_c7_rail') ?? 0.03549,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function CalculatorPage() {
  const [country, setCountry] = useState("Slovenia");
  const [year, setYear] = useState("2024");
  const [headcount, setHeadcount] = useState(85);
  const [saved, setSaved] = useState(false);
  const [activeMonth, setActiveMonth] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"monthly" | "annual">("monthly");
  const [expandedScope, setExpandedScope] = useState<string | null>("scope1");

  // ─── DB-loaded emission factors ──────────────────────────────────────────
  const [dbFactors, setDbFactors] = useState<CalculatorFactors | null>(null);
  const [dbGridFactors, setDbGridFactors] = useState<DbGridFactor[]>([]);
  const [factorsLoading, setFactorsLoading] = useState(true);
  const [company, setCompany] = useState<DbCompany | null>(null);
  const [saving, setSaving] = useState(false);

  // Monthly data - 12 rows
  const [monthlyData, setMonthlyData] = useState<MonthlyRow[]>(
    () => Array.from({ length: 12 }, (_, i) => createDemoMonth(i))
  );

  // ─── Load emission factors + company data from Supabase ────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const yearNum = parseInt(year);
        const [fuels, vehicles, flights, grid, heat, scope3, comp] = await Promise.all([
          getStationaryFuelFactors(yearNum),
          getVehicleFactors(yearNum),
          getFlightFactors(yearNum),
          getGridFactors(yearNum),
          getHeatFactors(yearNum),
          getScope3Factors(yearNum),
          getCurrentCompany(),
        ]);
        if (cancelled) return;

        setDbFactors(buildFactorMap(fuels, vehicles, flights, heat, scope3));
        setDbGridFactors(grid);

        if (comp) {
          setCompany(comp);
          if (comp.headcount) setHeadcount(comp.headcount);
          // Load existing monthly data for this company/year
          try {
            const rows = await getMonthlyEmissions(comp.id, yearNum);
            if (!cancelled && rows.length > 0) {
              const loaded: MonthlyRow[] = Array.from({ length: 12 }, (_, i) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const row = rows.find((r: any) => r.month === i + 1);
                if (!row) return createDemoMonth(i);
                return {
                  naturalGas_m3: Number(row.natural_gas_m3) || 0,
                  diesel_L: Number(row.diesel_litres) || 0,
                  petrol_L: Number(row.petrol_litres) || 0,
                  lpg_L: Number(row.lpg_litres) || 0,
                  fuelOil_L: Number(row.fuel_oil_litres) || 0,
                  fleetDiesel_km: Number(row.fleet_diesel_km) || 0,
                  fleetPetrol_km: Number(row.fleet_petrol_km) || 0,
                  fleetEV_km: Number(row.fleet_ev_km) || 0,
                  electricity_kWh: Number(row.electricity_kwh) || 0,
                  districtHeating_kWh: Number(row.district_heating_kwh) || 0,
                  steam_kg: Number(row.steam_kg) || 0,
                  cooling_kWh: Number(row.cooling_kwh) || 0,
                  shortFlights_pkm: Number(row.short_flights_pkm) || 0,
                  longFlights_pkm: Number(row.long_flights_pkm) || 0,
                  commuteCar_km: Number(row.commute_car_km) || 0,
                  commuteBus_km: Number(row.commute_bus_km) || 0,
                  commuteTrain_km: Number(row.commute_train_km) || 0,
                };
              });
              setMonthlyData(loaded);
            }
          } catch {
            // Monthly data not available - keep demo data
          }
        }
      } catch (err) {
        console.warn("Failed to load emission factors from DB, using static fallback:", err);
      } finally {
        if (!cancelled) setFactorsLoading(false);
      }
    }
    setFactorsLoading(true);
    load();
    return () => { cancelled = true; };
  }, [year]);

  const updateMonth = (monthIdx: number, field: keyof MonthlyRow, value: number) => {
    setMonthlyData(prev => {
      const next = [...prev];
      next[monthIdx] = { ...next[monthIdx], [field]: value };
      return next;
    });
    setSaved(false);
  };

  // ─── Save to Supabase ────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!company) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return;
    }
    setSaving(true);
    try {
      const yearNum = parseInt(year);
      // Save each month's data
      await Promise.all(
        monthlyData.map((m, i) =>
          saveMonthlyEmission(company.id, yearNum, i + 1, {
            natural_gas_m3: m.naturalGas_m3,
            diesel_litres: m.diesel_L,
            petrol_litres: m.petrol_L,
            lpg_litres: m.lpg_L,
            fuel_oil_litres: m.fuelOil_L,
            fleet_diesel_km: m.fleetDiesel_km,
            fleet_petrol_km: m.fleetPetrol_km,
            fleet_ev_km: m.fleetEV_km,
            electricity_kwh: m.electricity_kWh,
            district_heating_kwh: m.districtHeating_kWh,
            steam_kg: m.steam_kg,
            cooling_kwh: m.cooling_kWh,
            short_flights_pkm: m.shortFlights_pkm,
            long_flights_pkm: m.longFlights_pkm,
            commute_car_km: m.commuteCar_km,
            commute_bus_km: m.commuteBus_km,
            commute_train_km: m.commuteTrain_km,
          })
        )
      );
      // Save annual results
      const totals = monthlyResults.reduce(
        (acc, r) => ({
          scope1: acc.scope1 + r.scope1,
          scope2: acc.scope2 + r.scope2,
          scope2Market: acc.scope2Market + r.scope2Market,
          scope3: acc.scope3 + r.scope3,
          total: acc.total + r.total,
        }),
        { scope1: 0, scope2: 0, scope2Market: 0, scope3: 0, total: 0 }
      );
      await saveEmissionResults(company.id, yearNum, {
        scope1_total: Math.round(totals.scope1 * 100) / 100,
        scope2_location: Math.round(totals.scope2 * 100) / 100,
        scope2_market: Math.round(totals.scope2Market * 100) / 100,
        scope3_total: Math.round(totals.scope3 * 100) / 100,
        total_tco2e: Math.round(totals.total * 100) / 100,
        per_employee: headcount > 0 ? Math.round((totals.total / headcount) * 100) / 100 : null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save data. Please try again.");
    } finally {
      setSaving(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company, year, monthlyData, headcount]);

  // Calculate grid factors - prefer DB, fallback to static
  const countryEntry = GRID_FACTORS.find(c => c.name.toLowerCase() === country.toLowerCase());
  const countryCode = countryEntry?.code ?? "SI";

  const { gridLocation, gridMarket } = useMemo(() => {
    // Try DB grid factors first
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbGrid = dbGridFactors.find((g: any) => g.country_code === countryCode);
    if (dbGrid) {
      // DB stores kgCO2e/kWh (same unit as getGridFactor returns)
      // Handle both possible column name shapes from Supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = dbGrid as any;
      return {
        gridLocation: Number(dbGrid.location_based_kg_co2e ?? raw.location_kwh ?? 0),
        gridMarket: Number(dbGrid.residual_mix_kg_co2e ?? raw.market_kwh ?? 0),
      };
    }
    // Fallback to static (returns kgCO2e/kWh)
    return {
      gridLocation: getGridFactor(countryCode, year, "location"),
      gridMarket: getGridFactor(countryCode, year, "market"),
    };
  }, [dbGridFactors, countryCode, year]);

  // ─── Resolved emission factors (DB or static fallback) ─────────────
  const EF: CalculatorFactors = useMemo(() => {
    if (dbFactors) return dbFactors;
    // Static fallback
    return {
      naturalGas_m3: EMISSION_FACTORS.naturalGas,
      diesel_L: EMISSION_FACTORS.diesel,
      petrol_L: EMISSION_FACTORS.petrol,
      lpg_L: EMISSION_FACTORS.lpg,
      fuelOil_L: 2.96,
      fleetDiesel_km: EMISSION_FACTORS.vehicles.car_diesel,
      fleetPetrol_km: EMISSION_FACTORS.vehicles.car_petrol,
      fleetEV_km: EMISSION_FACTORS.vehicles.car_bev,
      districtHeating_kWh: 0.198,
      steam_kWh: 0.17679,
      cooling_kWh: 0.145,
      shortFlight_pkm: 0.18592,
      longFlight_pkm: 0.26128,
      commuteCar_km: 0.16725,
      commuteBus_km: 0.10312,
      commuteTrain_km: 0.03549,
    };
  }, [dbFactors]);

  // ─── Calculate emissions per month ──────────────────────────────────
  const monthlyResults: MonthlyResult[] = useMemo(() => {
    const r = (v: number) => Math.round(v * 100) / 100;
    return monthlyData.map(m => {
      // Scope 1 - Stationary combustion
      const s1_gas = (m.naturalGas_m3 * EF.naturalGas_m3) / 1000;
      const s1_diesel = (m.diesel_L * EF.diesel_L) / 1000;
      const s1_petrol = (m.petrol_L * EF.petrol_L) / 1000;
      const s1_lpg = (m.lpg_L * EF.lpg_L) / 1000;
      const s1_fuelOil = (m.fuelOil_L * EF.fuelOil_L) / 1000;
      const s1_stationary = s1_gas + s1_diesel + s1_petrol + s1_lpg + s1_fuelOil;

      // Scope 1 - Fleet
      const s1_fleetD = (m.fleetDiesel_km * EF.fleetDiesel_km) / 1000;
      const s1_fleetP = (m.fleetPetrol_km * EF.fleetPetrol_km) / 1000;
      const s1_fleet = s1_fleetD + s1_fleetP;

      const scope1 = s1_stationary + s1_fleet;

      // Scope 2
      const s2_elecLoc = (m.electricity_kWh * gridLocation) / 1000;
      const s2_elecMkt = (m.electricity_kWh * gridMarket) / 1000;
      const s2_heating = (m.districtHeating_kWh * EF.districtHeating_kWh) / 1000;
      const s2_steam = (m.steam_kg * EF.steam_kWh) / 1000;
      const s2_cooling = (m.cooling_kWh * EF.cooling_kWh) / 1000;

      const scope2 = s2_elecLoc + s2_heating + s2_steam + s2_cooling;
      const scope2Market = s2_elecMkt + s2_heating + s2_steam + s2_cooling;

      // Scope 3 basic
      const s3_shortFlight = (m.shortFlights_pkm * EF.shortFlight_pkm) / 1000;
      const s3_longFlight = (m.longFlights_pkm * EF.longFlight_pkm) / 1000;
      const s3_car = (m.commuteCar_km * EF.commuteCar_km) / 1000;
      const s3_bus = (m.commuteBus_km * EF.commuteBus_km) / 1000;
      const s3_train = (m.commuteTrain_km * EF.commuteTrain_km) / 1000;

      const s3_flights = s3_shortFlight + s3_longFlight;
      const s3_commute = s3_car + s3_bus + s3_train;
      const scope3 = s3_flights + s3_commute;

      return {
        scope1: r(scope1),
        scope2: r(scope2),
        scope2Market: r(scope2Market),
        scope3: r(scope3),
        total: r(scope1 + scope2 + scope3),
        s1_stationary: r(s1_stationary),
        s1_fleet: r(s1_fleet),
        s2_electricity: r(s2_elecLoc),
        s2_electricityMarket: r(s2_elecMkt),
        s2_heating: r(s2_heating),
        s2_steam: r(s2_steam),
        s2_cooling: r(s2_cooling),
        s3_flights: r(s3_flights),
        s3_commute: r(s3_commute),
      };
    });
  }, [monthlyData, gridLocation, gridMarket, EF]);

  // Annual totals
  const annualTotals = useMemo(() => {
    const sum = (fn: (r: MonthlyResult) => number) =>
      Math.round(monthlyResults.reduce((a, r) => a + fn(r), 0) * 100) / 100;
    return {
      scope1: sum(r => r.scope1),
      scope2: sum(r => r.scope2),
      scope2Market: sum(r => r.scope2Market),
      scope3: sum(r => r.scope3),
      total: sum(r => r.total),
      s1_stationary: sum(r => r.s1_stationary),
      s1_fleet: sum(r => r.s1_fleet),
      s2_electricity: sum(r => r.s2_electricity),
      s2_electricityMarket: sum(r => r.s2_electricityMarket),
      s2_heating: sum(r => r.s2_heating),
      s2_steam: sum(r => r.s2_steam),
      s2_cooling: sum(r => r.s2_cooling),
      s3_flights: sum(r => r.s3_flights),
      s3_commute: sum(r => r.s3_commute),
    };
  }, [monthlyResults]);

  // Annual input sums
  const annualInputs = useMemo(() => {
    const sum = (fn: (m: MonthlyRow) => number) =>
      monthlyData.reduce((a, m) => a + fn(m), 0);
    return {
      naturalGas: sum(m => m.naturalGas_m3),
      diesel: sum(m => m.diesel_L),
      petrol: sum(m => m.petrol_L),
      lpg: sum(m => m.lpg_L),
      fuelOil: sum(m => m.fuelOil_L),
      fleetDiesel: sum(m => m.fleetDiesel_km),
      fleetPetrol: sum(m => m.fleetPetrol_km),
      electricity: sum(m => m.electricity_kWh),
      districtHeating: sum(m => m.districtHeating_kWh),
      steam: sum(m => m.steam_kg),
      cooling: sum(m => m.cooling_kWh),
      shortFlights: sum(m => m.shortFlights_pkm),
      longFlights: sum(m => m.longFlights_pkm),
      commuteCar: sum(m => m.commuteCar_km),
    };
  }, [monthlyData]);

  const perEmployee = headcount > 0 ? Math.round((annualTotals.total / headcount) * 100) / 100 : 0;

  // Chart max for bar heights
  const maxMonthlyTotal = Math.max(...monthlyResults.map(r => r.total), 1);

  // Toggle scope sections
  const toggleScope = (scope: string) => {
    setExpandedScope(prev => prev === scope ? null : scope);
  };

  return (
    <div className="min-h-screen">
      <TopBar
        title="Carbon Calculator"
        subtitle="Monthly data entry · Scope 1 + 2 + 3 · DEFRA/DESNZ + AIB + EEA factors"
      />
      {factorsLoading && (
        <div className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-700 text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          Loading emission factors...
        </div>
      )}
      <div className="p-8 space-y-6">

        {/* ─── Header Controls ──────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-40">
              <Select
                label="Country"
                options={COUNTRIES}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="w-32">
              <Select
                label="Year"
                options={["2023", "2024", "2025"]}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Employees</label>
              <input
                type="number"
                value={headcount}
                onChange={e => setHeadcount(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-base
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              <button
                onClick={() => setViewMode("monthly")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "monthly"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Calendar size={14} className="inline mr-1.5 -mt-0.5" />
                Monthly
              </button>
              <button
                onClick={() => setViewMode("annual")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "annual"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <BarChart3 size={14} className="inline mr-1.5 -mt-0.5" />
                Annual
              </button>
            </div>

            <Button variant="secondary" onClick={handleSave} disabled={saving}>
              <Save size={16} className="mr-1.5" /> {saving ? "Saving..." : saved ? "Saved!" : "Save"}
            </Button>
          </div>
        </div>

        {/* ─── Grid factor info ──────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50/50 rounded-xl">
          <Info size={14} className="text-blue-400 flex-shrink-0" />
          <p className="text-xs text-gray-500">
            <strong className="text-gray-700">{country}</strong> · Grid:
            <span className="font-mono text-blue-600 ml-1">{Math.round(gridLocation * 1000)} gCO2/kWh</span> (location) /
            <span className="font-mono text-violet-600 ml-1">{Math.round(gridMarket * 1000)} gCO2/kWh</span> (market)
            · Year: {year} · Sources: DEFRA {year}, AIB, EEA
          </p>
        </div>

        {/* ─── KPI Summary Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <KPIMini label="Total" value={annualTotals.total} unit="tCO2e" color="gray" />
          <KPIMini label="Scope 1" value={annualTotals.scope1} unit="tCO2e" color="blue" />
          <KPIMini label="Scope 2 (loc)" value={annualTotals.scope2} unit="tCO2e" color="violet" />
          <KPIMini label="Scope 2 (mkt)" value={annualTotals.scope2Market} unit="tCO2e" color="purple" />
          <KPIMini label="Scope 3" value={annualTotals.scope3} unit="tCO2e" color="green" />
          <KPIMini label="Per Employee" value={perEmployee} unit="tCO2e" color="amber" />
          <KPIMini label="Per Month avg" value={Math.round((annualTotals.total / 12) * 100) / 100} unit="tCO2e" color="cyan" />
        </div>

        {/* ─── Monthly Emissions Chart ───────────────────────────────────── */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Emissions Breakdown</h3>
              <p className="text-xs text-gray-400">Click a bar to edit that month&apos;s data · All values in tCO2e</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500" /> Scope 1
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-violet-400" /> Scope 2
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-green-400" /> Scope 3
              </span>
            </div>
          </div>

          <div className="flex items-end gap-2 h-56">
            {monthlyResults.map((r, i) => {
              const s1h = (r.scope1 / maxMonthlyTotal) * 100;
              const s2h = (r.scope2 / maxMonthlyTotal) * 100;
              const s3h = (r.scope3 / maxMonthlyTotal) * 100;
              const isActive = activeMonth === i;
              return (
                <button
                  key={MONTHS[i]}
                  onClick={() => setActiveMonth(isActive ? null : i)}
                  className={`flex-1 flex flex-col items-center gap-1 group cursor-pointer transition-all
                    ${isActive ? "scale-105" : "hover:scale-102"}`}
                >
                  <div className="text-[10px] font-mono text-gray-400 mb-1">
                    {r.total.toFixed(1)}
                  </div>
                  <div
                    className={`w-full flex flex-col gap-0.5 rounded-t-md transition-all
                      ${isActive ? "ring-2 ring-blue-400 ring-offset-1" : ""}`}
                    style={{ height: "180px", justifyContent: "flex-end" }}
                  >
                    <div className="w-full bg-green-400 rounded-t-sm transition-all group-hover:bg-green-500" style={{ height: `${s3h}%` }} />
                    <div className="w-full bg-violet-400 transition-all group-hover:bg-violet-500" style={{ height: `${s2h}%` }} />
                    <div className="w-full bg-blue-500 rounded-b-sm transition-all group-hover:bg-blue-600" style={{ height: `${s1h}%` }} />
                  </div>
                  <span className={`text-xs font-medium ${isActive ? "text-blue-600" : "text-gray-400"}`}>
                    {MONTHS[i]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Monthly detail under chart */}
          {activeMonth !== null && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  {FULL_MONTHS[activeMonth]} {year} — Breakdown
                </h4>
                <Badge variant="blue">{monthlyResults[activeMonth].total.toFixed(2)} tCO2e</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Scope 1: Stationary</p>
                  <p className="font-mono text-blue-600">{monthlyResults[activeMonth].s1_stationary.toFixed(2)} t</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Scope 1: Fleet</p>
                  <p className="font-mono text-blue-600">{monthlyResults[activeMonth].s1_fleet.toFixed(2)} t</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Scope 2: Electricity</p>
                  <p className="font-mono text-violet-600">{monthlyResults[activeMonth].s2_electricity.toFixed(2)} t</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Scope 2: Heating/Steam</p>
                  <p className="font-mono text-violet-600">
                    {(monthlyResults[activeMonth].s2_heating + monthlyResults[activeMonth].s2_steam + monthlyResults[activeMonth].s2_cooling).toFixed(2)} t
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Scope 3: Flights</p>
                  <p className="font-mono text-green-600">{monthlyResults[activeMonth].s3_flights.toFixed(2)} t</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Scope 3: Commute</p>
                  <p className="font-mono text-green-600">{monthlyResults[activeMonth].s3_commute.toFixed(2)} t</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Total (loc)</p>
                  <p className="font-mono font-semibold text-gray-900">{monthlyResults[activeMonth].total.toFixed(2)} t</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">% of Annual</p>
                  <p className="font-mono text-gray-600">
                    {annualTotals.total > 0 ? ((monthlyResults[activeMonth].total / annualTotals.total) * 100).toFixed(1) : "0"}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* ─── Monthly Data Entry Grid ───────────────────────────────────── */}
        {viewMode === "monthly" ? (
          <>
            {/* SCOPE 1 — DIRECT EMISSIONS */}
            <Card>
              <button
                onClick={() => toggleScope("scope1")}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-50">
                    <Flame size={20} className="text-blue-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Scope 1 — Direct Emissions</h3>
                    <p className="text-xs text-gray-400">Stationary combustion + company fleet · DEFRA {year}</p>
                  </div>
                  <Badge variant="blue">{annualTotals.scope1.toFixed(1)} tCO2e</Badge>
                </div>
                {expandedScope === "scope1" ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </button>

              {expandedScope === "scope1" && (
                <div className="mt-6 space-y-4">
                  {/* Stationary combustion */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Thermometer size={14} className="text-orange-400" />
                      <p className="text-sm font-semibold text-gray-700">Stationary Combustion</p>
                      <Badge variant="gray">{annualTotals.s1_stationary.toFixed(1)} t</Badge>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-2 px-2 font-semibold text-gray-500 w-28">Fuel</th>
                            {MONTHS.map(m => (
                              <th key={m} className="text-center py-2 px-1 font-medium text-gray-400 w-20">{m}</th>
                            ))}
                            <th className="text-right py-2 px-2 font-semibold text-gray-600 w-24">Annual</th>
                          </tr>
                        </thead>
                        <tbody>
                          <FuelRow label="Natural Gas" unit="m³" field="naturalGas_m3" data={monthlyData} onChange={updateMonth} />
                          <FuelRow label="Diesel / Gas Oil" unit="L" field="diesel_L" data={monthlyData} onChange={updateMonth} />
                          <FuelRow label="Petrol" unit="L" field="petrol_L" data={monthlyData} onChange={updateMonth} />
                          <FuelRow label="LPG" unit="L" field="lpg_L" data={monthlyData} onChange={updateMonth} />
                          <FuelRow label="Fuel Oil" unit="L" field="fuelOil_L" data={monthlyData} onChange={updateMonth} />
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Fleet */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Car size={14} className="text-blue-400" />
                      <p className="text-sm font-semibold text-gray-700">Company Fleet</p>
                      <Badge variant="gray">{annualTotals.s1_fleet.toFixed(1)} t</Badge>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-2 px-2 font-semibold text-gray-500 w-28">Vehicle</th>
                            {MONTHS.map(m => (
                              <th key={m} className="text-center py-2 px-1 font-medium text-gray-400 w-20">{m}</th>
                            ))}
                            <th className="text-right py-2 px-2 font-semibold text-gray-600 w-24">Annual</th>
                          </tr>
                        </thead>
                        <tbody>
                          <FuelRow label="Diesel fleet" unit="km" field="fleetDiesel_km" data={monthlyData} onChange={updateMonth} />
                          <FuelRow label="Petrol fleet" unit="km" field="fleetPetrol_km" data={monthlyData} onChange={updateMonth} />
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[10px] text-gray-300 mt-2 px-2">
                      Factors: diesel car 0.17304, petrol car 0.16272 kgCO2e/km (DEFRA {year})
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* SCOPE 2 — PURCHASED ENERGY */}
            <Card>
              <button
                onClick={() => toggleScope("scope2")}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-violet-50">
                    <Zap size={20} className="text-violet-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Scope 2 — Purchased Energy</h3>
                    <p className="text-xs text-gray-400">Electricity + district heating + steam + cooling</p>
                  </div>
                  <Badge variant="violet">{annualTotals.scope2.toFixed(1)} tCO2e (loc)</Badge>
                </div>
                {expandedScope === "scope2" ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </button>

              {expandedScope === "scope2" && (
                <div className="mt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-2 px-2 font-semibold text-gray-500 w-28">Source</th>
                          {MONTHS.map(m => (
                            <th key={m} className="text-center py-2 px-1 font-medium text-gray-400 w-20">{m}</th>
                          ))}
                          <th className="text-right py-2 px-2 font-semibold text-gray-600 w-24">Annual</th>
                        </tr>
                      </thead>
                      <tbody>
                        <FuelRow label="Electricity" unit="kWh" field="electricity_kWh" data={monthlyData} onChange={updateMonth} />
                        <FuelRow label="District Heating" unit="kWh" field="districtHeating_kWh" data={monthlyData} onChange={updateMonth} />
                        <FuelRow label="Steam" unit="kg" field="steam_kg" data={monthlyData} onChange={updateMonth} />
                        <FuelRow label="Cooling" unit="kWh" field="cooling_kWh" data={monthlyData} onChange={updateMonth} />
                      </tbody>
                    </table>
                  </div>

                  {/* Scope 2 results table */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-3">Calculated Emissions (tCO2e)</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-2 px-2 font-medium text-gray-500 w-28"></th>
                            {MONTHS.map(m => (
                              <th key={m} className="text-center py-2 px-1 font-medium text-gray-400 w-20">{m}</th>
                            ))}
                            <th className="text-right py-2 px-2 font-semibold text-gray-600 w-24">Annual</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="py-2 px-2 text-gray-600 font-medium">Elec (loc)</td>
                            {monthlyResults.map((r, i) => (
                              <td key={i} className="text-center py-2 px-1 font-mono text-violet-600">{r.s2_electricity.toFixed(1)}</td>
                            ))}
                            <td className="text-right py-2 px-2 font-mono font-semibold text-violet-700">{annualTotals.s2_electricity.toFixed(1)}</td>
                          </tr>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="py-2 px-2 text-gray-600 font-medium">Elec (mkt)</td>
                            {monthlyResults.map((r, i) => (
                              <td key={i} className="text-center py-2 px-1 font-mono text-purple-500">{r.s2_electricityMarket.toFixed(1)}</td>
                            ))}
                            <td className="text-right py-2 px-2 font-mono font-semibold text-purple-600">{annualTotals.s2_electricityMarket.toFixed(1)}</td>
                          </tr>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="py-2 px-2 text-gray-600 font-medium">Heating</td>
                            {monthlyResults.map((r, i) => (
                              <td key={i} className="text-center py-2 px-1 font-mono text-orange-500">{r.s2_heating.toFixed(2)}</td>
                            ))}
                            <td className="text-right py-2 px-2 font-mono font-semibold text-orange-600">{annualTotals.s2_heating.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* SCOPE 3 — VALUE CHAIN (Basic) */}
            <Card>
              <button
                onClick={() => toggleScope("scope3")}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-green-50">
                    <Globe size={20} className="text-green-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Scope 3 — Value Chain (Basic)</h3>
                    <p className="text-xs text-gray-400">Business travel + employee commute · Cat. 6 & 7</p>
                  </div>
                  <Badge variant="green">{annualTotals.scope3.toFixed(1)} tCO2e</Badge>
                </div>
                {expandedScope === "scope3" ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </button>

              {expandedScope === "scope3" && (
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Plane size={14} className="text-sky-400" />
                      <p className="text-sm font-semibold text-gray-700">Business Travel (Cat. 6)</p>
                      <Badge variant="gray">{annualTotals.s3_flights.toFixed(1)} t</Badge>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-2 px-2 font-semibold text-gray-500 w-28">Type</th>
                            {MONTHS.map(m => (
                              <th key={m} className="text-center py-2 px-1 font-medium text-gray-400 w-20">{m}</th>
                            ))}
                            <th className="text-right py-2 px-2 font-semibold text-gray-600 w-24">Annual</th>
                          </tr>
                        </thead>
                        <tbody>
                          <FuelRow label="Short-haul" unit="pkm" field="shortFlights_pkm" data={monthlyData} onChange={updateMonth} />
                          <FuelRow label="Long-haul" unit="pkm" field="longFlights_pkm" data={monthlyData} onChange={updateMonth} />
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Users size={14} className="text-teal-400" />
                      <p className="text-sm font-semibold text-gray-700">Employee Commute (Cat. 7)</p>
                      <Badge variant="gray">{annualTotals.s3_commute.toFixed(1)} t</Badge>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-2 px-2 font-semibold text-gray-500 w-28">Mode</th>
                            {MONTHS.map(m => (
                              <th key={m} className="text-center py-2 px-1 font-medium text-gray-400 w-20">{m}</th>
                            ))}
                            <th className="text-right py-2 px-2 font-semibold text-gray-600 w-24">Annual</th>
                          </tr>
                        </thead>
                        <tbody>
                          <FuelRow label="Car commute" unit="km" field="commuteCar_km" data={monthlyData} onChange={updateMonth} />
                          <FuelRow label="Bus" unit="km" field="commuteBus_km" data={monthlyData} onChange={updateMonth} />
                          <FuelRow label="Train" unit="km" field="commuteTrain_km" data={monthlyData} onChange={updateMonth} />
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </>
        ) : (
          /* ─── Annual Summary View ──────────────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scope Summary */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Summary — {year}</h3>
              <div className="space-y-4">
                {/* Scope 1 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Flame size={14} className="text-blue-500" /> Scope 1
                    </span>
                    <span className="text-lg font-mono font-semibold text-blue-600">{annualTotals.scope1.toFixed(2)} t</span>
                  </div>
                  <div className="pl-6 space-y-1 text-xs text-gray-500">
                    <div className="flex justify-between"><span>Stationary combustion</span><span className="font-mono">{annualTotals.s1_stationary.toFixed(2)} t</span></div>
                    <div className="flex justify-between"><span>Fleet vehicles</span><span className="font-mono">{annualTotals.s1_fleet.toFixed(2)} t</span></div>
                  </div>
                  <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(annualTotals.scope1 / annualTotals.total) * 100}%` }} />
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Scope 2 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Zap size={14} className="text-violet-500" /> Scope 2
                    </span>
                    <span className="text-lg font-mono font-semibold text-violet-600">{annualTotals.scope2.toFixed(2)} t</span>
                  </div>
                  <div className="pl-6 space-y-1 text-xs text-gray-500">
                    <div className="flex justify-between"><span>Electricity (location)</span><span className="font-mono">{annualTotals.s2_electricity.toFixed(2)} t</span></div>
                    <div className="flex justify-between"><span>Electricity (market)</span><span className="font-mono text-gray-400">{annualTotals.s2_electricityMarket.toFixed(2)} t</span></div>
                    <div className="flex justify-between"><span>District heating</span><span className="font-mono">{annualTotals.s2_heating.toFixed(2)} t</span></div>
                    <div className="flex justify-between"><span>Steam</span><span className="font-mono">{annualTotals.s2_steam.toFixed(2)} t</span></div>
                    <div className="flex justify-between"><span>Cooling</span><span className="font-mono">{annualTotals.s2_cooling.toFixed(2)} t</span></div>
                  </div>
                  <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(annualTotals.scope2 / annualTotals.total) * 100}%` }} />
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Scope 3 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Globe size={14} className="text-green-500" /> Scope 3 (basic)
                    </span>
                    <span className="text-lg font-mono font-semibold text-green-600">{annualTotals.scope3.toFixed(2)} t</span>
                  </div>
                  <div className="pl-6 space-y-1 text-xs text-gray-500">
                    <div className="flex justify-between"><span>Business travel (Cat. 6)</span><span className="font-mono">{annualTotals.s3_flights.toFixed(2)} t</span></div>
                    <div className="flex justify-between"><span>Employee commute (Cat. 7)</span><span className="font-mono">{annualTotals.s3_commute.toFixed(2)} t</span></div>
                  </div>
                  <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${(annualTotals.scope3 / annualTotals.total) * 100}%` }} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Monthly trend table */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Trend</h3>
                <button className="text-xs text-blue-500 flex items-center gap-1 hover:text-blue-700">
                  <Download size={12} /> Export CSV
                </button>
              </div>
              <div className="overflow-y-auto max-h-96">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 font-semibold text-gray-600">Month</th>
                      <th className="text-right py-2 px-2 font-semibold text-blue-600">S1</th>
                      <th className="text-right py-2 px-2 font-semibold text-violet-600">S2</th>
                      <th className="text-right py-2 px-2 font-semibold text-green-600">S3</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-700">Total</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-400">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyResults.map((r, i) => {
                      const prev = i > 0 ? monthlyResults[i - 1].total : r.total;
                      const change = prev > 0 ? ((r.total - prev) / prev) * 100 : 0;
                      return (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="py-2.5 px-2 font-medium text-gray-700">{FULL_MONTHS[i]}</td>
                          <td className="text-right py-2.5 px-2 font-mono text-blue-600">{r.scope1.toFixed(1)}</td>
                          <td className="text-right py-2.5 px-2 font-mono text-violet-600">{r.scope2.toFixed(1)}</td>
                          <td className="text-right py-2.5 px-2 font-mono text-green-600">{r.scope3.toFixed(1)}</td>
                          <td className="text-right py-2.5 px-2 font-mono font-semibold text-gray-800">{r.total.toFixed(1)}</td>
                          <td className="text-right py-2.5 px-2">
                            {i > 0 && (
                              <span className={`inline-flex items-center gap-0.5 text-[11px] font-mono ${change > 0 ? "text-red-500" : "text-green-500"}`}>
                                {change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {Math.abs(change).toFixed(1)}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="border-t-2 border-gray-200 bg-gray-50/50">
                      <td className="py-2.5 px-2 font-bold text-gray-800">Total</td>
                      <td className="text-right py-2.5 px-2 font-mono font-bold text-blue-700">{annualTotals.scope1.toFixed(1)}</td>
                      <td className="text-right py-2.5 px-2 font-mono font-bold text-violet-700">{annualTotals.scope2.toFixed(1)}</td>
                      <td className="text-right py-2.5 px-2 font-mono font-bold text-green-700">{annualTotals.scope3.toFixed(1)}</td>
                      <td className="text-right py-2.5 px-2 font-mono font-bold text-gray-900">{annualTotals.total.toFixed(1)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Input summary */}
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Activity Data Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <SummaryCell label="Natural Gas" value={annualInputs.naturalGas} unit="m³" />
                <SummaryCell label="Diesel" value={annualInputs.diesel} unit="L" />
                <SummaryCell label="Fleet Diesel" value={annualInputs.fleetDiesel} unit="km" />
                <SummaryCell label="Fleet Petrol" value={annualInputs.fleetPetrol} unit="km" />
                <SummaryCell label="Electricity" value={annualInputs.electricity} unit="kWh" />
                <SummaryCell label="District Heating" value={annualInputs.districtHeating} unit="kWh" />
                <SummaryCell label="Short Flights" value={annualInputs.shortFlights} unit="pkm" />
                <SummaryCell label="Long Flights" value={annualInputs.longFlights} unit="pkm" />
                <SummaryCell label="Car Commute" value={annualInputs.commuteCar} unit="km" />
              </div>
            </Card>
          </div>
        )}

        {/* ─── Footer ────────────────────────────────────────────────────── */}
        <div className="text-center py-4">
          <p className="text-[10px] text-gray-300">
            Emission factors: DEFRA/DESNZ {year} · Grid: AIB Residual Mix / EEA Production Mix · GHG Protocol Dual Reporting
            · All calculations: kgCO2e incl. CO₂, CH₄, N₂O (IPCC AR5 GWP)
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FuelRow({
  label,
  unit,
  field,
  data,
  onChange,
}: {
  label: string;
  unit: string;
  field: keyof MonthlyRow;
  data: MonthlyRow[];
  onChange: (month: number, field: keyof MonthlyRow, value: number) => void;
}) {
  const total = data.reduce((sum, m) => sum + (m[field] as number), 0);
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/30">
      <td className="py-1.5 px-2">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-gray-300 ml-1">({unit})</span>
      </td>
      {data.map((m, i) => (
        <td key={i} className="py-1 px-0.5">
          <input
            type="number"
            value={(m[field] as number) || ""}
            onChange={e => onChange(i, field, parseFloat(e.target.value) || 0)}
            className="w-full px-1.5 py-1 text-right text-xs font-mono border border-gray-100 rounded-md
              focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white
              hover:border-gray-300 transition-colors"
            min={0}
          />
        </td>
      ))}
      <td className="py-1.5 px-2 text-right font-mono font-semibold text-gray-700 whitespace-nowrap">
        {fmtNum(total)}
      </td>
    </tr>
  );
}

function KPIMini({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50",
    violet: "text-violet-600 bg-violet-50",
    purple: "text-purple-600 bg-purple-50",
    green: "text-green-600 bg-green-50",
    amber: "text-amber-600 bg-amber-50",
    cyan: "text-cyan-600 bg-cyan-50",
    gray: "text-gray-800 bg-gradient-to-br from-blue-50 to-violet-50",
  };
  return (
    <div className={`rounded-xl p-3 ${colorMap[color] || colorMap.gray}`}>
      <p className="text-[10px] font-medium opacity-70 mb-0.5">{label}</p>
      <p className="text-lg font-serif font-semibold">{value.toFixed(1)}</p>
      <p className="text-[10px] font-mono opacity-50">{unit}</p>
    </div>
  );
}

function SummaryCell({ label, value, unit }: { label: string; value: number | string; unit: string }) {
  return (
    <div className="p-3 rounded-xl bg-gray-50">
      <p className="text-[10px] text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-mono font-semibold text-gray-800">{typeof value === "number" ? fmtNum(value) : value}</p>
      <p className="text-[10px] text-gray-400 font-mono">{unit}/year</p>
    </div>
  );
}
