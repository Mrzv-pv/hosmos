// =============================================================================
// HOSMOS — Test / Demo Company (Starter Plan)
// =============================================================================

export interface Company {
  id: string;
  name: string;
  industry: string;
  naceCode: string;
  country: string;
  countryCode: string;
  headcount: number;
  plan: "trial" | "starter" | "pro" | "enterprise";
  planStartDate: string;
  reportingYear: string;
  currency: string;
  logo?: string;
}

export interface EnergyData {
  electricity_kwh: number;
  naturalGas_kwh: number;
  diesel_litres: number;
  lpg_litres: number;
  fuelOil_litres: number;
  renewableElectricity_pct: number;
  greenTariff: boolean;
}

export interface TransportData {
  companyFleet: FleetVehicle[];
  flights: FlightRecord[];
  employeeCommute: CommuteProfile;
}

export interface FleetVehicle {
  id: string;
  type: string;
  fuel: string;
  factorId: string;
  count: number;
  annualKm: number;
}

export interface FlightRecord {
  id: string;
  type: string;
  class: string;
  factorId: string;
  trips: number;
  avgDistanceKm: number;
}

export interface CommuteProfile {
  totalEmployees: number;
  workingDaysPerYear: number;
  modes: {
    mode: string;
    factorId: string;
    pctEmployees: number;
    avgDistanceOneWayKm: number;
  }[];
}

export interface PeopleData {
  headcount: number;
  fullTimeEquivalent: number;
  femaleRatio: number;
  mgmtFemaleRatio: number;
  boardFemaleRatio: number;
  avgTrainingHoursPerEmployee: number;
  turnoverRate: number;
  accidentRate: number;
  fatalities: number;
  sickDaysPerEmployee: number;
  genderPayGapPct: number;
  eNPS: number;
}

export interface Scope1Result {
  stationaryCombustion_tCO2e: number;
  mobileFleet_tCO2e: number;
  total_tCO2e: number;
}

export interface Scope2Result {
  locationBased_tCO2e: number;
  marketBased_tCO2e: number;
  total_tCO2e: number;
}

export interface Scope3Result {
  categories: { id: number; name: string; tCO2e: number }[];
  total_tCO2e: number;
}

// ---------------------------------------------------------------------------
// DEMO COMPANY: GreenTech Solutions d.o.o. (Slovenia, Starter plan)
// ---------------------------------------------------------------------------

export const DEMO_COMPANY: Company = {
  id: "demo-greentech-001",
  name: "GreenTech Solutions d.o.o.",
  industry: "Manufacturing — Electronic Components",
  naceCode: "C26.1",
  country: "Slovenia",
  countryCode: "SI",
  headcount: 85,
  plan: "starter",
  planStartDate: "2025-01-15",
  reportingYear: "2024",
  currency: "EUR",
};

export const DEMO_ENERGY: EnergyData = {
  electricity_kwh: 420000,        // 420 MWh / year
  naturalGas_kwh: 180000,         // 180 MWh for heating
  diesel_litres: 3200,            // backup generator + some equipment
  lpg_litres: 0,
  fuelOil_litres: 0,
  renewableElectricity_pct: 0,    // no green tariff on Starter
  greenTariff: false,
};

export const DEMO_TRANSPORT: TransportData = {
  companyFleet: [
    {
      id: "fleet-1",
      type: "Car — Diesel",
      fuel: "Diesel",
      factorId: "car_diesel_avg",
      count: 4,
      annualKm: 25000,
    },
    {
      id: "fleet-2",
      type: "Car — Petrol",
      fuel: "Petrol",
      factorId: "car_petrol_avg",
      count: 2,
      annualKm: 18000,
    },
    {
      id: "fleet-3",
      type: "Van — Diesel",
      fuel: "Diesel",
      factorId: "van_diesel_avg",
      count: 1,
      annualKm: 30000,
    },
  ],
  flights: [
    {
      id: "flight-1",
      type: "Short-haul",
      class: "Economy",
      factorId: "flight_shorthaul_economy",
      trips: 12,
      avgDistanceKm: 1200,
    },
    {
      id: "flight-2",
      type: "Long-haul",
      class: "Economy",
      factorId: "flight_longhaul_economy",
      trips: 4,
      avgDistanceKm: 6500,
    },
  ],
  employeeCommute: {
    totalEmployees: 85,
    workingDaysPerYear: 230,
    modes: [
      { mode: "Car (single)",   factorId: "s3_c7_car_avg", pctEmployees: 55, avgDistanceOneWayKm: 15 },
      { mode: "Bus",            factorId: "s3_c7_bus",     pctEmployees: 20, avgDistanceOneWayKm: 12 },
      { mode: "Bicycle / walk", factorId: "s3_c7_bicycle", pctEmployees: 15, avgDistanceOneWayKm: 5 },
      { mode: "E-bike",         factorId: "s3_c7_ebike",   pctEmployees: 10, avgDistanceOneWayKm: 8 },
    ],
  },
};

export const DEMO_PEOPLE: PeopleData = {
  headcount: 85,
  fullTimeEquivalent: 82,
  femaleRatio: 0.38,
  mgmtFemaleRatio: 0.30,
  boardFemaleRatio: 0.25,
  avgTrainingHoursPerEmployee: 24,
  turnoverRate: 0.12,
  accidentRate: 0.02,
  fatalities: 0,
  sickDaysPerEmployee: 8.5,
  genderPayGapPct: 6.2,
  eNPS: 42,
};

// ---------------------------------------------------------------------------
// Pre-calculated results for the demo company (2024 reporting year)
// Using: Slovenia grid SI, DEFRA 2024 factors
// ---------------------------------------------------------------------------

export const DEMO_SCOPE1: Scope1Result = {
  // Stationary: Natural gas 180,000 kWh × 0.18290 = 32.92 tCO2e
  //           + Diesel 3,200 L × 2.51279 / 1000 = 8.04 tCO2e
  stationaryCombustion_tCO2e: 40.96,

  // Fleet: 4 diesel cars × 25,000 km × 0.17304 = 17.30 tCO2e
  //      + 2 petrol cars × 18,000 km × 0.16272 = 5.86 tCO2e
  //      + 1 diesel van  × 30,000 km × 0.25561 = 7.67 tCO2e
  mobileFleet_tCO2e: 30.83,

  total_tCO2e: 71.79,
};

export const DEMO_SCOPE2: Scope2Result = {
  // Location-based: 420,000 kWh × 212 gCO2/kWh / 1,000,000 = 89.04 tCO2e
  locationBased_tCO2e: 89.04,

  // Market-based (residual mix SI 2024): 420,000 × 429 / 1,000,000 = 180.18 tCO2e
  marketBased_tCO2e: 180.18,

  // Default to location-based for display
  total_tCO2e: 89.04,
};

export const DEMO_SCOPE3: Scope3Result = {
  categories: [
    {
      id: 1,
      name: "Purchased Goods & Services",
      // Paper: 5t × 919 + IT services: EUR 25k × 0.12 + Water: 800m³ × 0.344
      tCO2e: 7.87,
    },
    {
      id: 6,
      name: "Business Travel",
      // Short-haul: 12 trips × 1,200km × 0.18287 = 2.63 tCO2e
      // Long-haul: 4 trips × 6,500km × 0.20011 = 5.20 tCO2e
      // Hotels: ~40 nights × 16.5 = 0.66 tCO2e
      tCO2e: 8.49,
    },
    {
      id: 7,
      name: "Employee Commuting",
      // Car: 85 × 55% × 230 days × 30km × 0.16725 / 1000 = 54.02 tCO2e
      // Bus: 85 × 20% × 230 × 24km × 0.10312 / 1000 = 9.72 tCO2e
      // Bike: 0
      // E-bike: 85 × 10% × 230 × 16km × 0.00583 / 1000 = 0.18 tCO2e
      tCO2e: 63.92,
    },
    {
      id: 11,
      name: "Use of Sold Products",
      // Estimated based on product portfolio
      tCO2e: 12.40,
    },
  ],
  total_tCO2e: 92.68,
};

// ---------------------------------------------------------------------------
// Dashboard KPI Summary
// ---------------------------------------------------------------------------

export const DEMO_DASHBOARD = {
  company: DEMO_COMPANY,
  reportingYear: "2024",

  scope1: DEMO_SCOPE1.total_tCO2e,          // 71.79 tCO2e
  scope2: DEMO_SCOPE2.total_tCO2e,          // 89.04 tCO2e
  scope3: DEMO_SCOPE3.total_tCO2e,          // 92.68 tCO2e
  totalEmissions: 253.51,                    // tCO2e total

  emissionsPerEmployee: 2.98,               // 253.51 / 85
  emissionsPerRevenue: 0.084,               // tCO2e per EUR 1000 revenue (est. EUR 3M revenue)

  esgScore: 62,                             // out of 100
  completionPct: 68,                        // % of data fields filled

  people: DEMO_PEOPLE,

  // Year-on-year comparison (dummy previous year)
  previousYear: {
    scope1: 78.50,
    scope2: 95.20,
    scope3: 98.10,
    total: 271.80,
  },

  // Trend: reduction %
  yoyChange: -6.7,

  // Starter plan features available
  availableModules: ["carbon-calculator", "basic-scope3", "pdf-report"],
  lockedModules: ["supply-chain", "okr-goals", "full-scope3", "api", "white-label"],

  // Last updated
  lastUpdated: "2025-02-28T14:30:00Z",
};

// ---------------------------------------------------------------------------
// User account
// ---------------------------------------------------------------------------

export const DEMO_USER = {
  id: "user-demo-001",
  email: "demo@greentech-solutions.si",
  password: "Hosmos2025!", // for demo only
  name: "Ana Kovač",
  role: "admin" as const,
  company: DEMO_COMPANY.id,
  locale: "en",
  createdAt: "2025-01-15T10:00:00Z",
};
