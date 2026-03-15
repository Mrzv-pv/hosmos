// =============================================================================
// HOSMOS — Emission Factor Database
// Sources: DEFRA/DESNZ 2024-2025, AIB Residual Mix 2023-2024, EEA/IEA
// =============================================================================

export type FuelCategory = "stationary" | "transport" | "vehicle" | "flight";
export type Scope = 1 | 2 | 3;

// ---------------------------------------------------------------------------
// SCOPE 1 — Stationary Combustion (DEFRA 2024 / 2025)
// ---------------------------------------------------------------------------

export interface StationaryFuel {
  id: string;
  name: string;
  unit: string;
  factors: Record<string, number>; // year -> kgCO2e per unit
  source: string;
}

export const STATIONARY_FUELS: StationaryFuel[] = [
  // Natural Gas
  {
    id: "natural_gas_kwh_gross",
    name: "Natural Gas",
    unit: "kWh (Gross CV)",
    factors: { "2023": 0.18316, "2024": 0.18290, "2025": 0.18296 },
    source: "DEFRA",
  },
  {
    id: "natural_gas_kwh_net",
    name: "Natural Gas",
    unit: "kWh (Net CV)",
    factors: { "2023": 0.20297, "2024": 0.20260, "2025": 0.20270 },
    source: "DEFRA",
  },
  {
    id: "natural_gas_m3",
    name: "Natural Gas",
    unit: "m³",
    factors: { "2023": 2.021, "2024": 2.018, "2025": 2.019 },
    source: "DEFRA",
  },
  // Gas Oil / Diesel
  {
    id: "gas_oil_litre",
    name: "Gas Oil (Diesel)",
    unit: "litre",
    factors: { "2023": 2.75776, "2024": 2.75660, "2025": 2.75541 },
    source: "DEFRA",
  },
  {
    id: "diesel_biofuel_litre",
    name: "Diesel (avg biofuel blend)",
    unit: "litre",
    factors: { "2023": 2.51210, "2024": 2.51279, "2025": 2.57082 },
    source: "DEFRA",
  },
  {
    id: "diesel_mineral_litre",
    name: "Diesel (100% mineral)",
    unit: "litre",
    factors: { "2023": 2.66300, "2024": 2.66200, "2025": 2.66155 },
    source: "DEFRA",
  },
  // Petrol
  {
    id: "petrol_biofuel_litre",
    name: "Petrol (avg biofuel blend)",
    unit: "litre",
    factors: { "2023": 2.08480, "2024": 2.08390, "2025": 2.06916 },
    source: "DEFRA",
  },
  {
    id: "petrol_mineral_litre",
    name: "Petrol (100% mineral)",
    unit: "litre",
    factors: { "2023": 2.34070, "2024": 2.34000, "2025": 2.33984 },
    source: "DEFRA",
  },
  // LPG
  {
    id: "lpg_litre",
    name: "LPG",
    unit: "litre",
    factors: { "2023": 1.55780, "2024": 1.55750, "2025": 1.55713 },
    source: "DEFRA",
  },
  {
    id: "lpg_kwh",
    name: "LPG",
    unit: "kWh (Gross CV)",
    factors: { "2023": 0.21460, "2024": 0.21455, "2025": 0.21450 },
    source: "DEFRA",
  },
  {
    id: "lpg_tonne",
    name: "LPG",
    unit: "tonne",
    factors: { "2023": 2939.50, "2024": 2939.42, "2025": 2939.36 },
    source: "DEFRA",
  },
  // Coal
  {
    id: "coal_industrial_tonne",
    name: "Coal (industrial)",
    unit: "tonne",
    factors: { "2023": 2396.10, "2024": 2395.70, "2025": 2395.29 },
    source: "DEFRA",
  },
  {
    id: "coal_domestic_tonne",
    name: "Coal (domestic)",
    unit: "tonne",
    factors: { "2023": 2905.50, "2024": 2905.20, "2025": 2904.95 },
    source: "DEFRA",
  },
  // Fuel Oil
  {
    id: "fuel_oil_litre",
    name: "Fuel Oil",
    unit: "litre",
    factors: { "2023": 3.17600, "2024": 3.17550, "2025": 3.17492 },
    source: "DEFRA",
  },
  {
    id: "fuel_oil_tonne",
    name: "Fuel Oil",
    unit: "tonne",
    factors: { "2023": 3229.50, "2024": 3229.20, "2025": 3228.89 },
    source: "DEFRA",
  },
  // Burning Oil / Kerosene
  {
    id: "burning_oil_litre",
    name: "Burning Oil / Kerosene",
    unit: "litre",
    factors: { "2023": 2.54100, "2024": 2.54060, "2025": 2.54016 },
    source: "DEFRA",
  },
  // Butane / Propane
  {
    id: "butane_litre",
    name: "Butane",
    unit: "litre",
    factors: { "2023": 1.74600, "2024": 1.74570, "2025": 1.74533 },
    source: "DEFRA",
  },
  {
    id: "propane_litre",
    name: "Propane",
    unit: "litre",
    factors: { "2023": 1.54420, "2024": 1.54390, "2025": 1.54358 },
    source: "DEFRA",
  },
  // Biomass
  {
    id: "wood_pellets_tonne",
    name: "Wood Pellets (biomass)",
    unit: "tonne",
    factors: { "2023": 55.30, "2024": 55.25, "2025": 55.19 },
    source: "DEFRA",
  },
  {
    id: "wood_chips_tonne",
    name: "Wood Chips (biomass)",
    unit: "tonne",
    factors: { "2023": 43.52, "2024": 43.48, "2025": 43.44 },
    source: "DEFRA",
  },
  {
    id: "wood_logs_tonne",
    name: "Wood Logs (biomass)",
    unit: "tonne",
    factors: { "2023": 47.06, "2024": 47.03, "2025": 46.99 },
    source: "DEFRA",
  },
];

// ---------------------------------------------------------------------------
// SCOPE 1 — Transport: Vehicle Emission Factors (DEFRA 2024 / 2025)
// ---------------------------------------------------------------------------

export interface VehicleFactor {
  id: string;
  category: string;
  type: string;
  fuel: string;
  unit: "kgCO2e/km";
  factors: Record<string, number>;
  source: string;
}

export const VEHICLE_FACTORS: VehicleFactor[] = [
  // --- Cars ---
  { id: "car_petrol_small",    category: "Car", type: "Small",   fuel: "Petrol",  unit: "kgCO2e/km", factors: { "2024": 0.14308, "2025": 0.14308 }, source: "DEFRA" },
  { id: "car_petrol_medium",   category: "Car", type: "Medium",  fuel: "Petrol",  unit: "kgCO2e/km", factors: { "2024": 0.17474, "2025": 0.17474 }, source: "DEFRA" },
  { id: "car_petrol_large",    category: "Car", type: "Large",   fuel: "Petrol",  unit: "kgCO2e/km", factors: { "2024": 0.26828, "2025": 0.26828 }, source: "DEFRA" },
  { id: "car_petrol_avg",      category: "Car", type: "Average", fuel: "Petrol",  unit: "kgCO2e/km", factors: { "2024": 0.16272, "2025": 0.16272 }, source: "DEFRA" },

  { id: "car_diesel_small",    category: "Car", type: "Small",   fuel: "Diesel",  unit: "kgCO2e/km", factors: { "2024": 0.14340, "2025": 0.14340 }, source: "DEFRA" },
  { id: "car_diesel_medium",   category: "Car", type: "Medium",  fuel: "Diesel",  unit: "kgCO2e/km", factors: { "2024": 0.17174, "2025": 0.17174 }, source: "DEFRA" },
  { id: "car_diesel_large",    category: "Car", type: "Large",   fuel: "Diesel",  unit: "kgCO2e/km", factors: { "2024": 0.21007, "2025": 0.21007 }, source: "DEFRA" },
  { id: "car_diesel_avg",      category: "Car", type: "Average", fuel: "Diesel",  unit: "kgCO2e/km", factors: { "2024": 0.17304, "2025": 0.17304 }, source: "DEFRA" },

  { id: "car_hybrid_small",    category: "Car", type: "Small",   fuel: "Hybrid",  unit: "kgCO2e/km", factors: { "2024": 0.11413, "2025": 0.11413 }, source: "DEFRA" },
  { id: "car_hybrid_medium",   category: "Car", type: "Medium",  fuel: "Hybrid",  unit: "kgCO2e/km", factors: { "2024": 0.11724, "2025": 0.11724 }, source: "DEFRA" },
  { id: "car_hybrid_large",    category: "Car", type: "Large",   fuel: "Hybrid",  unit: "kgCO2e/km", factors: { "2024": 0.15650, "2025": 0.15650 }, source: "DEFRA" },
  { id: "car_hybrid_avg",      category: "Car", type: "Average", fuel: "Hybrid",  unit: "kgCO2e/km", factors: { "2024": 0.12825, "2025": 0.12825 }, source: "DEFRA" },

  { id: "car_bev_small",       category: "Car", type: "Small",   fuel: "BEV",     unit: "kgCO2e/km", factors: { "2024": 0.04047, "2025": 0.03339 }, source: "DEFRA" },
  { id: "car_bev_medium",      category: "Car", type: "Medium",  fuel: "BEV",     unit: "kgCO2e/km", factors: { "2024": 0.04250, "2025": 0.03513 }, source: "DEFRA" },
  { id: "car_bev_large",       category: "Car", type: "Large",   fuel: "BEV",     unit: "kgCO2e/km", factors: { "2024": 0.04600, "2025": 0.03807 }, source: "DEFRA" },
  { id: "car_bev_avg",         category: "Car", type: "Average", fuel: "BEV",     unit: "kgCO2e/km", factors: { "2024": 0.04047, "2025": 0.03663 }, source: "DEFRA" },

  { id: "car_cng_avg",         category: "Car", type: "Average", fuel: "CNG",     unit: "kgCO2e/km", factors: { "2024": 0.17414, "2025": 0.17414 }, source: "DEFRA" },
  { id: "car_lpg_avg",         category: "Car", type: "Average", fuel: "LPG",     unit: "kgCO2e/km", factors: { "2024": 0.19599, "2025": 0.19599 }, source: "DEFRA" },

  // --- Motorbikes ---
  { id: "motorbike_small",     category: "Motorbike", type: "Small",   fuel: "Petrol", unit: "kgCO2e/km", factors: { "2024": 0.08319, "2025": 0.08319 }, source: "DEFRA" },
  { id: "motorbike_medium",    category: "Motorbike", type: "Medium",  fuel: "Petrol", unit: "kgCO2e/km", factors: { "2024": 0.10107, "2025": 0.10107 }, source: "DEFRA" },
  { id: "motorbike_large",     category: "Motorbike", type: "Large",   fuel: "Petrol", unit: "kgCO2e/km", factors: { "2024": 0.13252, "2025": 0.13252 }, source: "DEFRA" },
  { id: "motorbike_avg",       category: "Motorbike", type: "Average", fuel: "Petrol", unit: "kgCO2e/km", factors: { "2024": 0.11367, "2025": 0.11367 }, source: "DEFRA" },

  // --- Vans ---
  { id: "van_diesel_class1",   category: "Van", type: "Class I (≤1.3t)",   fuel: "Diesel", unit: "kgCO2e/km", factors: { "2024": 0.15738, "2025": 0.15738 }, source: "DEFRA" },
  { id: "van_diesel_class2",   category: "Van", type: "Class II (1.3-1.7t)", fuel: "Diesel", unit: "kgCO2e/km", factors: { "2024": 0.19260, "2025": 0.19260 }, source: "DEFRA" },
  { id: "van_diesel_class3",   category: "Van", type: "Class III (1.7-3.5t)", fuel: "Diesel", unit: "kgCO2e/km", factors: { "2024": 0.27878, "2025": 0.27878 }, source: "DEFRA" },
  { id: "van_diesel_avg",      category: "Van", type: "Average",          fuel: "Diesel", unit: "kgCO2e/km", factors: { "2024": 0.25561, "2025": 0.25561 }, source: "DEFRA" },
  { id: "van_petrol_avg",      category: "Van", type: "Average",          fuel: "Petrol", unit: "kgCO2e/km", factors: { "2024": 0.21335, "2025": 0.21335 }, source: "DEFRA" },

  // --- HGVs ---
  { id: "hgv_rigid_small",     category: "HGV", type: "Rigid (3.5-7.5t)",   fuel: "Diesel", unit: "kgCO2e/km", factors: { "2024": 0.46138, "2025": 0.46138 }, source: "DEFRA" },
  { id: "hgv_rigid_medium",    category: "HGV", type: "Rigid (7.5-17t)",    fuel: "Diesel", unit: "kgCO2e/km", factors: { "2024": 0.55061, "2025": 0.55061 }, source: "DEFRA" },
  { id: "hgv_rigid_large",     category: "HGV", type: "Rigid (>17t)",       fuel: "Diesel", unit: "kgCO2e/km", factors: { "2024": 0.77400, "2025": 0.77400 }, source: "DEFRA" },
  { id: "hgv_rigid_avg",       category: "HGV", type: "All Rigids",         fuel: "Diesel", unit: "kgCO2e/km", factors: { "2024": 0.67912, "2025": 0.67912 }, source: "DEFRA" },
  { id: "hgv_artic_small",     category: "HGV", type: "Artic (3.5-33t)",    fuel: "Diesel", unit: "kgCO2e/km", factors: { "2024": 0.62775, "2025": 0.62775 }, source: "DEFRA" },
  { id: "hgv_artic_large",     category: "HGV", type: "Artic (>33t)",       fuel: "Diesel", unit: "kgCO2e/km", factors: { "2024": 0.64734, "2025": 0.64734 }, source: "DEFRA" },
  { id: "hgv_artic_avg",       category: "HGV", type: "All Artics",         fuel: "Diesel", unit: "kgCO2e/km", factors: { "2024": 0.64659, "2025": 0.64659 }, source: "DEFRA" },
  { id: "hgv_avg",             category: "HGV", type: "All HGVs",           fuel: "Diesel", unit: "kgCO2e/km", factors: { "2024": 0.65975, "2025": 0.65975 }, source: "DEFRA" },
];

// ---------------------------------------------------------------------------
// SCOPE 1 — Flights (DEFRA 2024 / 2025, kgCO2e per passenger-km)
// ---------------------------------------------------------------------------

export interface FlightFactor {
  id: string;
  type: string;
  class: string;
  withRF: Record<string, number>;   // with Radiative Forcing
  withoutRF: Record<string, number>;
  source: string;
}

export const FLIGHT_FACTORS: FlightFactor[] = [
  // Domestic
  { id: "flight_domestic_avg",        type: "Domestic",              class: "Average",         withRF: { "2024": 0.27257, "2025": 0.22928 }, withoutRF: { "2024": 0.16098, "2025": 0.13552 }, source: "DEFRA" },

  // Short-haul
  { id: "flight_shorthaul_avg",       type: "Short-haul (<3700km)",  class: "Average",         withRF: { "2024": 0.18592, "2025": 0.12786 }, withoutRF: { "2024": 0.10974, "2025": 0.07559 }, source: "DEFRA" },
  { id: "flight_shorthaul_economy",   type: "Short-haul (<3700km)",  class: "Economy",         withRF: { "2024": 0.18287, "2025": 0.12576 }, withoutRF: { "2024": 0.10794, "2025": 0.07435 }, source: "DEFRA" },
  { id: "flight_shorthaul_business",  type: "Short-haul (<3700km)",  class: "Business",        withRF: { "2024": 0.27430, "2025": 0.18863 }, withoutRF: { "2024": 0.16191, "2025": 0.11152 }, source: "DEFRA" },

  // Long-haul
  { id: "flight_longhaul_avg",        type: "Long-haul (>3700km)",   class: "Average",         withRF: { "2024": 0.26128, "2025": 0.15282 }, withoutRF: { "2024": 0.15423, "2025": 0.09043 }, source: "DEFRA" },
  { id: "flight_longhaul_economy",    type: "Long-haul (>3700km)",   class: "Economy",         withRF: { "2024": 0.20011, "2025": 0.11704 }, withoutRF: { "2024": 0.11812, "2025": 0.06926 }, source: "DEFRA" },
  { id: "flight_longhaul_premium",    type: "Long-haul (>3700km)",   class: "Premium Economy", withRF: { "2024": 0.32015, "2025": 0.18726 }, withoutRF: { "2024": 0.18897, "2025": 0.11081 }, source: "DEFRA" },
  { id: "flight_longhaul_business",   type: "Long-haul (>3700km)",   class: "Business",        withRF: { "2024": 0.58028, "2025": 0.33940 }, withoutRF: { "2024": 0.34252, "2025": 0.20083 }, source: "DEFRA" },
  { id: "flight_longhaul_first",      type: "Long-haul (>3700km)",   class: "First",           withRF: { "2024": 0.80040, "2025": 0.46814 }, withoutRF: { "2024": 0.47246, "2025": 0.27701 }, source: "DEFRA" },

  // International (non-UK origin)
  { id: "flight_intl_avg",            type: "International",         class: "Average",         withRF: { "2024": 0.17580, "2025": 0.14253 }, withoutRF: { "2024": 0.10377, "2025": 0.08420 }, source: "DEFRA" },
  { id: "flight_intl_economy",        type: "International",         class: "Economy",         withRF: { "2024": 0.13465, "2025": 0.10916 }, withoutRF: { "2024": 0.07948, "2025": 0.06449 }, source: "DEFRA" },
  { id: "flight_intl_premium",        type: "International",         class: "Premium Economy", withRF: { "2024": 0.21542, "2025": 0.17465 }, withoutRF: { "2024": 0.12716, "2025": 0.10318 }, source: "DEFRA" },
  { id: "flight_intl_business",       type: "International",         class: "Business",        withRF: { "2024": 0.39044, "2025": 0.31656 }, withoutRF: { "2024": 0.23047, "2025": 0.18701 }, source: "DEFRA" },
  { id: "flight_intl_first",          type: "International",         class: "First",           withRF: { "2024": 0.53854, "2025": 0.43663 }, withoutRF: { "2024": 0.31789, "2025": 0.25794 }, source: "DEFRA" },
];

// ---------------------------------------------------------------------------
// SCOPE 1 — Fugitive Emissions: Refrigerants (DEFRA 2024, kgCO2e per kg)
// ---------------------------------------------------------------------------

export interface RefrigerantFactor {
  id: string;
  name: string;
  gwp100: number;        // Global Warming Potential (100-year)
  kgCO2ePerKg: number;   // same as GWP for refrigerants
  commonUse: string;
  source: string;
}

export const REFRIGERANT_FACTORS: RefrigerantFactor[] = [
  // HFCs (most common in commercial/industrial)
  { id: "r134a",   name: "R-134a (HFC-134a)",   gwp100: 1430,  kgCO2ePerKg: 1430,  commonUse: "Car AC, chillers, refrigerators",        source: "DEFRA/IPCC AR5" },
  { id: "r410a",   name: "R-410A",               gwp100: 2088,  kgCO2ePerKg: 2088,  commonUse: "Heat pumps, air conditioning",            source: "DEFRA/IPCC AR5" },
  { id: "r407c",   name: "R-407C",               gwp100: 1774,  kgCO2ePerKg: 1774,  commonUse: "Commercial AC, retrofit for R-22",       source: "DEFRA/IPCC AR5" },
  { id: "r32",     name: "R-32 (HFC-32)",        gwp100: 675,   kgCO2ePerKg: 675,   commonUse: "Modern split AC, heat pumps",             source: "DEFRA/IPCC AR5" },
  { id: "r404a",   name: "R-404A",               gwp100: 3922,  kgCO2ePerKg: 3922,  commonUse: "Commercial refrigeration, cold storage",  source: "DEFRA/IPCC AR5" },
  { id: "r507a",   name: "R-507A",               gwp100: 3985,  kgCO2ePerKg: 3985,  commonUse: "Industrial refrigeration",                source: "DEFRA/IPCC AR5" },
  { id: "r449a",   name: "R-449A (Opteon XP40)", gwp100: 1397,  kgCO2ePerKg: 1397,  commonUse: "R-404A replacement, supermarkets",        source: "DEFRA/IPCC AR5" },
  { id: "r448a",   name: "R-448A (Solstice N40)",gwp100: 1387,  kgCO2ePerKg: 1387,  commonUse: "R-404A replacement, commercial",          source: "DEFRA/IPCC AR5" },
  { id: "r290",    name: "R-290 (Propane)",       gwp100: 3,     kgCO2ePerKg: 3,     commonUse: "Natural refrigerant, small systems",      source: "DEFRA/IPCC AR5" },
  { id: "r600a",   name: "R-600a (Isobutane)",   gwp100: 3,     kgCO2ePerKg: 3,     commonUse: "Domestic refrigerators",                  source: "DEFRA/IPCC AR5" },
  { id: "r744",    name: "R-744 (CO₂)",          gwp100: 1,     kgCO2ePerKg: 1,     commonUse: "CO₂ transcritical, supermarkets",         source: "DEFRA/IPCC AR5" },
  { id: "r717",    name: "R-717 (Ammonia)",       gwp100: 0,     kgCO2ePerKg: 0,     commonUse: "Industrial refrigeration",                source: "DEFRA/IPCC AR5" },
  // Legacy (still in some EU systems)
  { id: "r22",     name: "R-22 (HCFC-22)",       gwp100: 1810,  kgCO2ePerKg: 1810,  commonUse: "Legacy AC (being phased out)",             source: "DEFRA/IPCC AR5" },
  // SF6 (electrical switchgear)
  { id: "sf6",     name: "SF₆ (Sulphur hexafluoride)", gwp100: 22800, kgCO2ePerKg: 22800, commonUse: "Electrical switchgear, insulation", source: "DEFRA/IPCC AR5" },
];

/** Get refrigerant emission factor (kgCO2e per kg leaked) */
export function getRefrigerantFactor(refrigerantId: string): number {
  const r = REFRIGERANT_FACTORS.find(f => f.id === refrigerantId);
  return r?.kgCO2ePerKg ?? 0;
}

// ---------------------------------------------------------------------------
// SCOPE 2 — Grid Electricity Emission Factors (gCO2/kWh)
// Sources: AIB Residual Mix, AIB Production Mix (location-based proxy)
// ---------------------------------------------------------------------------

export interface CountryGridFactor {
  code: string;        // ISO 3166-1 alpha-2
  name: string;
  /** Location-based = Production Mix (AIB / EEA) */
  locationBased: Record<string, number>;
  /** Market-based = Residual Mix (AIB) */
  residualMix: Record<string, number>;
}

export const GRID_FACTORS: CountryGridFactor[] = [
  // Western Europe
  { code: "AT", name: "Austria",         locationBased: { "2023": 95.6,  "2024": 86.5  }, residualMix: { "2023": 227,   "2024": 210   } },
  { code: "BE", name: "Belgium",         locationBased: { "2023": 112,   "2024": 104   }, residualMix: { "2023": 167,   "2024": 131   } },
  { code: "CH", name: "Switzerland",     locationBased: { "2023": 1.51,  "2024": 5.78  }, residualMix: { "2023": 128,   "2024": 120   } },
  { code: "DE", name: "Germany",         locationBased: { "2023": 335,   "2024": 311   }, residualMix: { "2023": 719,   "2024": 724   } },
  { code: "FR", name: "France",          locationBased: { "2023": 30.8,  "2024": 18.0  }, residualMix: { "2023": 40.7,  "2024": 23.5  } },
  { code: "LU", name: "Luxembourg",      locationBased: { "2023": 58.4,  "2024": 46.1  }, residualMix: { "2023": 357,   "2024": 213   } },
  { code: "MC", name: "Monaco",          locationBased: { "2023": 30.8,  "2024": 18.0  }, residualMix: { "2023": 40.7,  "2024": 23.5  } },
  { code: "NL", name: "Netherlands",     locationBased: { "2023": 241,   "2024": 228   }, residualMix: { "2023": 379,   "2024": 382   } },
  { code: "LI", name: "Liechtenstein",   locationBased: { "2023": 1.51,  "2024": 5.78  }, residualMix: { "2023": 128,   "2024": 120   } },

  // Northern Europe
  { code: "DK", name: "Denmark",         locationBased: { "2023": 73.8,  "2024": 51.1  }, residualMix: { "2023": 582,   "2024": 421   } },
  { code: "FI", name: "Finland",         locationBased: { "2023": 45.1,  "2024": 33.2  }, residualMix: { "2023": 565,   "2024": 405   } },
  { code: "IS", name: "Iceland",         locationBased: { "2023": 0.20,  "2024": 0.17  }, residualMix: { "2023": 595,   "2024": 505   } },
  { code: "NO", name: "Norway",          locationBased: { "2023": 7.0,   "2024": 6.74  }, residualMix: { "2023": 598,   "2024": 534   } },
  { code: "SE", name: "Sweden",          locationBased: { "2023": 6.52,  "2024": 5.05  }, residualMix: { "2023": 68.2,  "2024": 85.5  } },
  { code: "EE", name: "Estonia",         locationBased: { "2023": 464,   "2024": 364   }, residualMix: { "2023": 711,   "2024": 611   } },
  { code: "LT", name: "Lithuania",       locationBased: { "2023": 151,   "2024": 118   }, residualMix: { "2023": 583,   "2024": 567   } },
  { code: "LV", name: "Latvia",          locationBased: { "2023": 120,   "2024": 145   }, residualMix: { "2023": 535,   "2024": 504   } },
  { code: "IE", name: "Ireland",         locationBased: { "2023": 267,   "2024": 245   }, residualMix: { "2023": 445,   "2024": 365   } },

  // Southern Europe
  { code: "ES", name: "Spain",           locationBased: { "2023": 121,   "2024": 100   }, residualMix: { "2023": 282,   "2024": 292   } },
  { code: "PT", name: "Portugal",        locationBased: { "2023": 100,   "2024": 43.3  }, residualMix: { "2023": 539,   "2024": 501   } },
  { code: "IT", name: "Italy",           locationBased: { "2023": 273,   "2024": 235   }, residualMix: { "2023": 500,   "2024": 441   } },
  { code: "GR", name: "Greece",          locationBased: { "2023": 259,   "2024": 231   }, residualMix: { "2023": 491,   "2024": 367   } },
  { code: "MT", name: "Malta",           locationBased: { "2023": 365,   "2024": 345   }, residualMix: { "2023": 408,   "2024": 398   } },
  { code: "CY", name: "Cyprus",          locationBased: { "2023": 572,   "2024": 586   }, residualMix: { "2023": 595,   "2024": 613   } },
  { code: "AD", name: "Andorra",         locationBased: { "2023": 121,   "2024": 100   }, residualMix: { "2023": 282,   "2024": 292   } },
  { code: "SM", name: "San Marino",      locationBased: { "2023": 273,   "2024": 235   }, residualMix: { "2023": 500,   "2024": 441   } },
  { code: "VA", name: "Vatican City",    locationBased: { "2023": 273,   "2024": 235   }, residualMix: { "2023": 500,   "2024": 441   } },

  // Central Europe
  { code: "PL", name: "Poland",          locationBased: { "2023": 668,   "2024": 634   }, residualMix: { "2023": 788,   "2024": 808   } },
  { code: "CZ", name: "Czech Republic",  locationBased: { "2023": 577,   "2024": 529   }, residualMix: { "2023": 658,   "2024": 584   } },
  { code: "SK", name: "Slovakia",        locationBased: { "2023": 123,   "2024": 99.1  }, residualMix: { "2023": 357,   "2024": 334   } },
  { code: "HU", name: "Hungary",         locationBased: { "2023": 195,   "2024": 177   }, residualMix: { "2023": 322,   "2024": 318   } },
  { code: "SI", name: "Slovenia",        locationBased: { "2023": 207,   "2024": 212   }, residualMix: { "2023": 486,   "2024": 429   } },
  { code: "HR", name: "Croatia",         locationBased: { "2023": 176,   "2024": 224   }, residualMix: { "2023": 550,   "2024": 573   } },

  // Southeast Europe
  { code: "RO", name: "Romania",         locationBased: { "2023": 212,   "2024": 216   }, residualMix: { "2023": 212,   "2024": 233   } },
  { code: "BG", name: "Bulgaria",        locationBased: { "2023": 332,   "2024": 310   }, residualMix: { "2023": 418,   "2024": 379   } },
  { code: "RS", name: "Serbia",          locationBased: { "2023": 766,   "2024": 801   }, residualMix: { "2023": 966,   "2024": 895   } },
  { code: "BA", name: "Bosnia & Herzegovina", locationBased: { "2023": 700, "2024": 776 }, residualMix: { "2023": 719, "2024": 777 } },
  { code: "ME", name: "Montenegro",      locationBased: { "2023": 467,   "2024": 482   }, residualMix: { "2023": 747,   "2024": 622   } },
  { code: "MK", name: "North Macedonia", locationBased: { "2023": 550,   "2024": 520   }, residualMix: { "2023": 680,   "2024": 650   } },
  { code: "AL", name: "Albania",         locationBased: { "2023": 15.0,  "2024": 18.0  }, residualMix: { "2023": 350,   "2024": 340   } },
  { code: "XK", name: "Kosovo",          locationBased: { "2023": 820,   "2024": 790   }, residualMix: { "2023": 850,   "2024": 820   } },

  // UK
  { code: "GB", name: "United Kingdom",  locationBased: { "2023": 193,   "2024": 148   }, residualMix: { "2023": 388,   "2024": 420   } },

  // Other European
  { code: "UA", name: "Ukraine",         locationBased: { "2023": 310,   "2024": 330   }, residualMix: { "2023": 310,   "2024": 330   } },
  { code: "MD", name: "Moldova",         locationBased: { "2023": 420,   "2024": 400   }, residualMix: { "2023": 420,   "2024": 400   } },
  { code: "BY", name: "Belarus",         locationBased: { "2023": 370,   "2024": 360   }, residualMix: { "2023": 370,   "2024": 360   } },
  { code: "TR", name: "Turkey",          locationBased: { "2023": 420,   "2024": 395   }, residualMix: { "2023": 420,   "2024": 395   } },
  { code: "GE", name: "Georgia",         locationBased: { "2023": 95,    "2024": 100   }, residualMix: { "2023": 95,    "2024": 100   } },
  { code: "AM", name: "Armenia",         locationBased: { "2023": 180,   "2024": 175   }, residualMix: { "2023": 180,   "2024": 175   } },
  { code: "AZ", name: "Azerbaijan",      locationBased: { "2023": 480,   "2024": 470   }, residualMix: { "2023": 480,   "2024": 470   } },
];

// ---------------------------------------------------------------------------
// SCOPE 2 — District Heating, Steam & Cooling (kgCO2e per kWh)
// Sources: DEFRA 2024, IEA, National statistics
// ---------------------------------------------------------------------------

export interface HeatFactor {
  id: string;
  name: string;
  unit: string;
  factors: Record<string, number>; // year -> kgCO2e per kWh
  source: string;
  notes: string;
}

export const HEAT_STEAM_COOLING_FACTORS: HeatFactor[] = [
  // District Heating — varies significantly by country (fuel mix, CHP efficiency)
  { id: "heat_defra_default",     name: "District heat (DEFRA default)",        unit: "kWh", factors: { "2023": 0.16630, "2024": 0.16590 }, source: "DEFRA 2024", notes: "UK default for purchased heat" },
  { id: "heat_gas_boiler",        name: "Heat from gas boiler (centralised)",   unit: "kWh", factors: { "2023": 0.20297, "2024": 0.20260 }, source: "DEFRA 2024", notes: "Natural gas net CV — centralised boiler" },
  { id: "heat_oil_boiler",        name: "Heat from oil boiler",                unit: "kWh", factors: { "2023": 0.26810, "2024": 0.26780 }, source: "DEFRA 2024", notes: "Fuel oil / kerosene boiler" },
  { id: "heat_biomass_boiler",    name: "Heat from biomass boiler",            unit: "kWh", factors: { "2023": 0.01313, "2024": 0.01310 }, source: "DEFRA 2024", notes: "Wood pellets — non-biogenic only" },
  { id: "heat_heat_pump",         name: "Heat pump (electricity-driven)",      unit: "kWh", factors: { "2023": 0.07700, "2024": 0.07100 }, source: "Derived",    notes: "COP ~3.0 × grid factor (EU avg)" },

  // District Heating by country (typical factors, IEA / national statistics)
  { id: "dh_AT", name: "District heating — Austria",        unit: "kWh", factors: { "2023": 0.105, "2024": 0.098 }, source: "E-Control AT",      notes: "High CHP, gas + biomass" },
  { id: "dh_DE", name: "District heating — Germany",        unit: "kWh", factors: { "2023": 0.183, "2024": 0.175 }, source: "AGFW / UBA",        notes: "Mixed CHP + gas boilers" },
  { id: "dh_DK", name: "District heating — Denmark",        unit: "kWh", factors: { "2023": 0.060, "2024": 0.047 }, source: "Danish Energy Agency", notes: "Biomass + waste CHP + heat pumps" },
  { id: "dh_FI", name: "District heating — Finland",        unit: "kWh", factors: { "2023": 0.107, "2024": 0.092 }, source: "Energiateollisuus", notes: "CHP peat/biomass/gas" },
  { id: "dh_SE", name: "District heating — Sweden",         unit: "kWh", factors: { "2023": 0.044, "2024": 0.040 }, source: "SCB / Energimyndigheten", notes: "Biomass + waste + heat pumps" },
  { id: "dh_NO", name: "District heating — Norway",         unit: "kWh", factors: { "2023": 0.038, "2024": 0.035 }, source: "SSB",               notes: "Waste CHP + electric boilers" },
  { id: "dh_PL", name: "District heating — Poland",         unit: "kWh", factors: { "2023": 0.310, "2024": 0.295 }, source: "URE / GUS",         notes: "Coal CHP dominant" },
  { id: "dh_CZ", name: "District heating — Czech Republic", unit: "kWh", factors: { "2023": 0.220, "2024": 0.208 }, source: "ERÚ",               notes: "Coal + gas CHP" },
  { id: "dh_SI", name: "District heating — Slovenia",       unit: "kWh", factors: { "2023": 0.188, "2024": 0.180 }, source: "ARSO",              notes: "Gas CHP + waste" },
  { id: "dh_HR", name: "District heating — Croatia",        unit: "kWh", factors: { "2023": 0.195, "2024": 0.190 }, source: "EIHP",              notes: "Gas CHP" },
  { id: "dh_FR", name: "District heating — France",         unit: "kWh", factors: { "2023": 0.115, "2024": 0.108 }, source: "SNCU / ADEME",      notes: "Gas + waste + biomass" },
  { id: "dh_NL", name: "District heating — Netherlands",    unit: "kWh", factors: { "2023": 0.165, "2024": 0.158 }, source: "RVO",               notes: "Gas CHP" },
  { id: "dh_IT", name: "District heating — Italy",          unit: "kWh", factors: { "2023": 0.150, "2024": 0.143 }, source: "AIRU / GSE",        notes: "Gas CHP" },
  { id: "dh_GB", name: "District heating — United Kingdom", unit: "kWh", factors: { "2023": 0.166, "2024": 0.166 }, source: "DEFRA 2024",        notes: "UK default" },
  { id: "dh_EE", name: "District heating — Estonia",        unit: "kWh", factors: { "2023": 0.178, "2024": 0.165 }, source: "Elering / Stat EE", notes: "Oil shale + biomass + gas" },
  { id: "dh_LT", name: "District heating — Lithuania",      unit: "kWh", factors: { "2023": 0.130, "2024": 0.120 }, source: "LSTA",              notes: "Biomass transition, was gas" },
  { id: "dh_LV", name: "District heating — Latvia",         unit: "kWh", factors: { "2023": 0.145, "2024": 0.138 }, source: "CSP",               notes: "Gas + biomass" },
  { id: "dh_BG", name: "District heating — Bulgaria",       unit: "kWh", factors: { "2023": 0.240, "2024": 0.232 }, source: "NSI BG",            notes: "Gas + coal CHP" },
  { id: "dh_RO", name: "District heating — Romania",        unit: "kWh", factors: { "2023": 0.225, "2024": 0.218 }, source: "ANRE",              notes: "Gas CHP" },
  { id: "dh_RS", name: "District heating — Serbia",         unit: "kWh", factors: { "2023": 0.265, "2024": 0.258 }, source: "RZS",               notes: "Gas + coal" },

  // Purchased Steam
  { id: "steam_defra",            name: "Purchased steam (DEFRA default)",     unit: "kWh", factors: { "2023": 0.17864, "2024": 0.17820 }, source: "DEFRA 2024", notes: "UK default — steam from gas CHP" },
  { id: "steam_gas_chp",          name: "Steam from gas CHP",                 unit: "kWh", factors: { "2023": 0.19300, "2024": 0.19250 }, source: "DEFRA 2024", notes: "Allocation by energy content" },
  { id: "steam_coal_chp",         name: "Steam from coal CHP",                unit: "kWh", factors: { "2023": 0.34000, "2024": 0.33800 }, source: "IEA",        notes: "Coal-fired CHP steam allocation" },

  // Purchased Cooling
  { id: "cooling_defra",          name: "Purchased cooling (DEFRA default)",   unit: "kWh", factors: { "2023": 0.07180, "2024": 0.06960 }, source: "DEFRA 2024", notes: "UK default — chiller on grid electricity" },
  { id: "cooling_electric",       name: "Electric chiller (COP 4.0)",         unit: "kWh cooling", factors: { "2023": 0.05800, "2024": 0.05300 }, source: "Derived", notes: "Grid electricity / COP 4.0" },
  { id: "cooling_absorption",     name: "Absorption chiller (gas-fired)",     unit: "kWh cooling", factors: { "2023": 0.29000, "2024": 0.28900 }, source: "IEA",     notes: "Gas-fired absorption COP ~0.7" },
  { id: "cooling_district",       name: "District cooling (average EU)",      unit: "kWh cooling", factors: { "2023": 0.08500, "2024": 0.08000 }, source: "Euroheat",notes: "Centralised electric + absorption mix" },
];

/** Get heat/steam/cooling factor (kgCO2e per kWh) */
export function getHeatFactor(factorId: string, year: string = "2024"): number {
  const f = HEAT_STEAM_COOLING_FACTORS.find(x => x.id === factorId);
  if (!f) return 0.166; // DEFRA default fallback
  return f.factors[year] ?? f.factors["2024"] ?? 0.166;
}

/** Get district heating factor by country code */
export function getDistrictHeatingFactor(countryCode: string, year: string = "2024"): number {
  const f = HEAT_STEAM_COOLING_FACTORS.find(x => x.id === `dh_${countryCode}`);
  if (f) return f.factors[year] ?? f.factors["2024"] ?? 0.166;
  return 0.166; // DEFRA default
}

// ---------------------------------------------------------------------------
// SCOPE 3 — Simplified Categories (DEFRA / industry averages)
// ---------------------------------------------------------------------------

export interface Scope3Category {
  id: number;
  name: string;
  description: string;
  /** Simplified emission factors for quick estimation */
  factors: Scope3Factor[];
  tier: "starter" | "pro";
}

export interface Scope3Factor {
  id: string;
  name: string;
  unit: string;
  kgCO2e: Record<string, number>; // year -> factor
  source: string;
}

export const SCOPE3_CATEGORIES: Scope3Category[] = [
  {
    id: 1,
    name: "Purchased Goods & Services",
    description: "Emissions from cradle-to-gate production of goods and services purchased",
    tier: "starter",
    factors: [
      { id: "s3_c1_paper", name: "Paper / cardboard", unit: "tonne", kgCO2e: { "2024": 919, "2025": 919 }, source: "DEFRA" },
      { id: "s3_c1_plastics", name: "Plastics (average)", unit: "tonne", kgCO2e: { "2024": 3120, "2025": 3120 }, source: "DEFRA" },
      { id: "s3_c1_metals_steel", name: "Steel", unit: "tonne", kgCO2e: { "2024": 1820, "2025": 1820 }, source: "DEFRA" },
      { id: "s3_c1_metals_aluminium", name: "Aluminium", unit: "tonne", kgCO2e: { "2024": 9700, "2025": 9700 }, source: "DEFRA" },
      { id: "s3_c1_glass", name: "Glass", unit: "tonne", kgCO2e: { "2024": 840, "2025": 840 }, source: "DEFRA" },
      { id: "s3_c1_textiles", name: "Textiles (clothing)", unit: "tonne", kgCO2e: { "2024": 22000, "2025": 22000 }, source: "DEFRA" },
      { id: "s3_c1_electronics", name: "Electronics (average)", unit: "EUR 1000 spent", kgCO2e: { "2024": 350, "2025": 350 }, source: "Exiobase" },
      { id: "s3_c1_food", name: "Food products (average)", unit: "EUR 1000 spent", kgCO2e: { "2024": 680, "2025": 680 }, source: "Exiobase" },
      { id: "s3_c1_chemicals", name: "Chemicals", unit: "tonne", kgCO2e: { "2024": 2500, "2025": 2500 }, source: "DEFRA" },
      { id: "s3_c1_construction", name: "Construction materials", unit: "EUR 1000 spent", kgCO2e: { "2024": 520, "2025": 520 }, source: "Exiobase" },
      { id: "s3_c1_it_services", name: "IT services / cloud", unit: "EUR 1000 spent", kgCO2e: { "2024": 120, "2025": 120 }, source: "Exiobase" },
      { id: "s3_c1_consulting", name: "Professional services", unit: "EUR 1000 spent", kgCO2e: { "2024": 85, "2025": 85 }, source: "Exiobase" },
      { id: "s3_c1_furniture", name: "Furniture", unit: "EUR 1000 spent", kgCO2e: { "2024": 310, "2025": 310 }, source: "Exiobase" },
      { id: "s3_c1_water", name: "Water supply", unit: "m³", kgCO2e: { "2024": 0.344, "2025": 0.344 }, source: "DEFRA" },
    ],
  },
  {
    id: 2,
    name: "Capital Goods",
    description: "Emissions from cradle-to-gate production of capital goods",
    tier: "pro",
    factors: [
      { id: "s3_c2_vehicles", name: "Vehicles (average car)", unit: "unit", kgCO2e: { "2024": 6000, "2025": 6000 }, source: "Industry avg" },
      { id: "s3_c2_machinery", name: "Machinery / equipment", unit: "EUR 1000 spent", kgCO2e: { "2024": 450, "2025": 450 }, source: "Exiobase" },
      { id: "s3_c2_buildings", name: "Buildings / renovations", unit: "EUR 1000 spent", kgCO2e: { "2024": 600, "2025": 600 }, source: "Exiobase" },
      { id: "s3_c2_it_equipment", name: "IT equipment (computers)", unit: "unit", kgCO2e: { "2024": 350, "2025": 350 }, source: "Industry avg" },
    ],
  },
  {
    id: 3,
    name: "Fuel- & Energy-Related (not in Scope 1/2)",
    description: "Upstream emissions from fuel production, T&D losses",
    tier: "pro",
    factors: [
      { id: "s3_c3_elec_td", name: "Electricity T&D losses", unit: "kWh", kgCO2e: { "2024": 0.01769, "2025": 0.01769 }, source: "DEFRA" },
      { id: "s3_c3_wtt_gas", name: "WTT natural gas", unit: "kWh", kgCO2e: { "2024": 0.02368, "2025": 0.02368 }, source: "DEFRA" },
      { id: "s3_c3_wtt_diesel", name: "WTT diesel", unit: "litre", kgCO2e: { "2024": 0.60986, "2025": 0.60986 }, source: "DEFRA" },
      { id: "s3_c3_wtt_petrol", name: "WTT petrol", unit: "litre", kgCO2e: { "2024": 0.53063, "2025": 0.53063 }, source: "DEFRA" },
    ],
  },
  {
    id: 4,
    name: "Upstream Transportation & Distribution",
    description: "Emissions from transportation of purchased goods",
    tier: "pro",
    factors: [
      { id: "s3_c4_road_hgv", name: "Road freight (HGV avg)", unit: "tonne-km", kgCO2e: { "2024": 0.10415, "2025": 0.10415 }, source: "DEFRA" },
      { id: "s3_c4_rail_freight", name: "Rail freight", unit: "tonne-km", kgCO2e: { "2024": 0.02728, "2025": 0.02728 }, source: "DEFRA" },
      { id: "s3_c4_sea_container", name: "Sea freight (container)", unit: "tonne-km", kgCO2e: { "2024": 0.01613, "2025": 0.01613 }, source: "DEFRA" },
      { id: "s3_c4_air_freight", name: "Air freight (long-haul)", unit: "tonne-km", kgCO2e: { "2024": 0.60181, "2025": 0.60181 }, source: "DEFRA" },
    ],
  },
  {
    id: 5,
    name: "Waste Generated in Operations",
    description: "Emissions from disposal and treatment of waste",
    tier: "pro",
    factors: [
      { id: "s3_c5_landfill_mixed", name: "Mixed waste (landfill)", unit: "tonne", kgCO2e: { "2024": 467, "2025": 467 }, source: "DEFRA" },
      { id: "s3_c5_recycle_mixed", name: "Mixed recycling", unit: "tonne", kgCO2e: { "2024": 21.3, "2025": 21.3 }, source: "DEFRA" },
      { id: "s3_c5_incineration", name: "Incineration", unit: "tonne", kgCO2e: { "2024": 21.4, "2025": 21.4 }, source: "DEFRA" },
      { id: "s3_c5_compost", name: "Composting", unit: "tonne", kgCO2e: { "2024": 10.2, "2025": 10.2 }, source: "DEFRA" },
    ],
  },
  {
    id: 6,
    name: "Business Travel",
    description: "Emissions from employee business travel (not company vehicles)",
    tier: "starter",
    factors: [
      { id: "s3_c6_taxi", name: "Taxi (average)", unit: "km", kgCO2e: { "2024": 0.20869, "2025": 0.20869 }, source: "DEFRA" },
      { id: "s3_c6_bus", name: "Bus (local, average)", unit: "km", kgCO2e: { "2024": 0.10312, "2025": 0.10312 }, source: "DEFRA" },
      { id: "s3_c6_rail_national", name: "National rail", unit: "km", kgCO2e: { "2024": 0.03549, "2025": 0.03549 }, source: "DEFRA" },
      { id: "s3_c6_rail_intl", name: "International rail (Eurostar)", unit: "km", kgCO2e: { "2024": 0.00446, "2025": 0.00446 }, source: "DEFRA" },
      { id: "s3_c6_hotel_night", name: "Hotel stay (average)", unit: "room-night", kgCO2e: { "2024": 16.5, "2025": 16.5 }, source: "DEFRA" },
    ],
  },
  {
    id: 7,
    name: "Employee Commuting",
    description: "Emissions from employees commuting to/from work",
    tier: "starter",
    factors: [
      { id: "s3_c7_car_avg", name: "Car (average, single occupant)", unit: "km", kgCO2e: { "2024": 0.16725, "2025": 0.16725 }, source: "DEFRA" },
      { id: "s3_c7_bus", name: "Bus", unit: "km", kgCO2e: { "2024": 0.10312, "2025": 0.10312 }, source: "DEFRA" },
      { id: "s3_c7_metro", name: "Metro / tram", unit: "km", kgCO2e: { "2024": 0.02781, "2025": 0.02781 }, source: "DEFRA" },
      { id: "s3_c7_bicycle", name: "Bicycle / walking", unit: "km", kgCO2e: { "2024": 0, "2025": 0 }, source: "Zero" },
      { id: "s3_c7_ebike", name: "E-bike / e-scooter", unit: "km", kgCO2e: { "2024": 0.00583, "2025": 0.00583 }, source: "Estimate" },
      { id: "s3_c7_wfh", name: "Work from home", unit: "day", kgCO2e: { "2024": 1.26, "2025": 1.26 }, source: "EcoAct" },
    ],
  },
  {
    id: 8,
    name: "Upstream Leased Assets",
    description: "Emissions from leased assets not in Scope 1/2",
    tier: "pro",
    factors: [
      { id: "s3_c8_office_sqm", name: "Leased office space", unit: "m²/year", kgCO2e: { "2024": 50, "2025": 50 }, source: "Industry avg" },
    ],
  },
  {
    id: 9,
    name: "Downstream Transportation & Distribution",
    description: "Emissions from transport of sold products to customers",
    tier: "pro",
    factors: [
      { id: "s3_c9_road", name: "Road delivery (avg)", unit: "tonne-km", kgCO2e: { "2024": 0.10415, "2025": 0.10415 }, source: "DEFRA" },
      { id: "s3_c9_last_mile", name: "Last-mile delivery (van)", unit: "parcel", kgCO2e: { "2024": 0.55, "2025": 0.55 }, source: "Industry avg" },
    ],
  },
  {
    id: 10,
    name: "Processing of Sold Products",
    description: "Emissions from processing of intermediate products",
    tier: "pro",
    factors: [],
  },
  {
    id: 11,
    name: "Use of Sold Products",
    description: "Emissions from use of goods and services sold",
    tier: "starter",
    factors: [
      { id: "s3_c11_elec_product", name: "Electricity-consuming product", unit: "kWh (lifetime)", kgCO2e: { "2024": 0.233, "2025": 0.233 }, source: "EU avg grid" },
      { id: "s3_c11_fuel_product", name: "Fuel-consuming product", unit: "litre (lifetime)", kgCO2e: { "2024": 2.54, "2025": 2.54 }, source: "DEFRA" },
    ],
  },
  {
    id: 12,
    name: "End-of-Life Treatment of Sold Products",
    description: "Emissions from disposal of products sold",
    tier: "pro",
    factors: [
      { id: "s3_c12_landfill", name: "Landfill disposal", unit: "tonne", kgCO2e: { "2024": 467, "2025": 467 }, source: "DEFRA" },
      { id: "s3_c12_recycle", name: "Recycling", unit: "tonne", kgCO2e: { "2024": 21.3, "2025": 21.3 }, source: "DEFRA" },
    ],
  },
  {
    id: 13,
    name: "Downstream Leased Assets",
    description: "Emissions from assets owned and leased to others",
    tier: "pro",
    factors: [],
  },
  {
    id: 14,
    name: "Franchises",
    description: "Emissions from franchise operations",
    tier: "pro",
    factors: [],
  },
  {
    id: 15,
    name: "Investments",
    description: "Emissions from investments (financial institutions)",
    tier: "pro",
    factors: [],
  },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/** Get Scope 2 grid factor for a country (gCO2/kWh → kgCO2e/kWh) */
export function getGridFactor(
  countryCode: string,
  year: string = "2024",
  method: "location" | "market" = "location"
): number {
  const country = GRID_FACTORS.find(c => c.code === countryCode);
  if (!country) return 0.233; // EU average fallback

  const factors = method === "location" ? country.locationBased : country.residualMix;
  const gCO2 = factors[year] ?? factors["2024"] ?? factors["2023"] ?? 233;
  return gCO2 / 1000; // convert gCO2 → kgCO2e
}

/** Get stationary fuel factor (kgCO2e per unit) */
export function getFuelFactor(fuelId: string, year: string = "2024"): number {
  const fuel = STATIONARY_FUELS.find(f => f.id === fuelId);
  if (!fuel) return 0;
  return fuel.factors[year] ?? fuel.factors["2024"] ?? 0;
}

/** Get vehicle factor (kgCO2e/km) */
export function getVehicleFactor(vehicleId: string, year: string = "2024"): number {
  const v = VEHICLE_FACTORS.find(f => f.id === vehicleId);
  if (!v) return 0;
  return v.factors[year] ?? v.factors["2024"] ?? 0;
}

/** Get flight factor (kgCO2e per passenger-km) */
export function getFlightFactor(
  flightId: string,
  year: string = "2024",
  includeRF: boolean = true
): number {
  const f = FLIGHT_FACTORS.find(x => x.id === flightId);
  if (!f) return 0;
  const factors = includeRF ? f.withRF : f.withoutRF;
  return factors[year] ?? factors["2024"] ?? 0;
}

/** List all European countries */
export function getAllCountries() {
  return GRID_FACTORS.map(c => ({ code: c.code, name: c.name }));
}

/** List available years for grid factors */
export function getAvailableYears(): string[] {
  return ["2023", "2024"];
}
