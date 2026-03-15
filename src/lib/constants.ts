import { GRID_FACTORS } from "@/data/emission-factors";

export const COLORS = {
  blue: {
    primary: "#1E6FD9",
    mid: "#5B9CF6",
    light: "#E8F0FD",
  },
  violet: {
    primary: "#6B3FA0",
    mid: "#9B6FD4",
    light: "#F0EAFF",
  },
  white: "#FFFFFF",
  dark: "#1A1A2E",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
  },
} as const;

// ---------------------------------------------------------------------------
// Emission Factors — pulled from DEFRA/DESNZ 2024, AIB, EEA
// See /src/data/emission-factors.ts for full multi-year database
// ---------------------------------------------------------------------------

export const EMISSION_FACTORS = {
  // Scope 2 — Electricity grid factors (kgCO2e/kWh, location-based 2024)
  electricity: Object.fromEntries(
    GRID_FACTORS.map(c => [
      c.name.toLowerCase().replace(/[^a-z]/g, "_"),
      c.locationBased["2024"] / 1000, // gCO2 → kgCO2e
    ])
  ) as Record<string, number>,

  // Scope 1 — Stationary combustion (DEFRA 2024)
  naturalGas: 2.018,    // kgCO2e per m³
  diesel: 2.51279,      // kgCO2e per litre (avg biofuel blend)
  petrol: 2.0839,       // kgCO2e per litre (avg biofuel blend)
  lpg: 1.5575,          // kgCO2e per litre
  gasOil: 2.7566,       // kgCO2e per litre
  fuelOil: 3.1755,      // kgCO2e per litre
  coal: 2395.7,         // kgCO2e per tonne
  burningOil: 2.5406,   // kgCO2e per litre

  // Scope 1 — Vehicles (DEFRA 2024, kgCO2e/km)
  vehicles: {
    car_diesel: 0.17304,
    car_petrol: 0.16272,
    car_hybrid: 0.12825,
    car_bev: 0.04047,
    van_diesel: 0.25561,
    van_petrol: 0.21335,
    motorbike: 0.11367,
    hgv: 0.65975,
  },

  // Flights (DEFRA 2024, kgCO2e per passenger-km, with RF)
  flights: {
    short_haul: 0.18592,   // average passenger
    medium_haul: 0.17580,  // international average
    long_haul: 0.26128,    // average passenger
    domestic: 0.27257,
  },

  // Commute & travel (DEFRA 2024, kgCO2e/km)
  commute: {
    car: 0.16725,     // average unknown fuel
    bus: 0.10312,
    train: 0.03549,
    metro: 0.02781,
    bicycle: 0,
    walking: 0,
    remote: 0,
    ebike: 0.00583,
  },
} as const;

// ---------------------------------------------------------------------------
// All European countries (from grid factors database)
// ---------------------------------------------------------------------------

export const COUNTRIES = GRID_FACTORS
  .map(c => c.name)
  .sort((a, b) => a.localeCompare(b));

export const COUNTRY_CODES = GRID_FACTORS.map(c => ({
  code: c.code,
  name: c.name,
}));

export const INDUSTRIES = [
  "Manufacturing",
  "Construction",
  "Retail & Wholesale",
  "Transport & Logistics",
  "IT & Technology",
  "Food & Agriculture",
  "Healthcare",
  "Professional Services",
  "Energy & Utilities",
  "Financial Services",
  "Education",
  "Hospitality & Tourism",
  "Real Estate",
  "Mining & Quarrying",
  "Water & Waste Management",
  "Telecommunications",
  "Other",
] as const;

export const PRICING_PLANS = [
  {
    id: "trial",
    name: "Trial",
    price: 0,
    period: "30 days",
    description: "Get started with basic carbon calculation",
    features: [
      "Scope 1 + 2 calculator",
      "5-step onboarding wizard",
      "PDF report (1 period)",
      "1 company account",
    ],
    limitations: ["No Scope 3", "No ESG parameters", "No support"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: 20,
    period: "/ month",
    description: "Full ESG data management for one company",
    features: [
      "Scope 1 + 2 + basic Scope 3",
      "All 100 ESG parameters",
      "GRI / ESRS export",
      "1 company account",
      "Email support",
    ],
    limitations: ["No Supply Chain Portal", "No OKR tracker"],
    cta: "Subscribe",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 100,
    period: "/ month",
    description: "Advanced ESG with supply chain and goals",
    features: [
      "Full Scope 3 — all 15 categories",
      "Supply Chain questionnaires",
      "CDP / SBTi / TCFD reports",
      "OKR & goals tracker",
      "3 company accounts",
      "Priority support",
    ],
    limitations: [],
    cta: "Subscribe",
    popular: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 1000,
    period: "/ month",
    description: "Full platform with API and white label",
    features: [
      "Everything in Pro",
      "REST API + ERP integration",
      "White label branding",
      "EU Taxonomy reports",
      "Unlimited entities",
      "Dedicated manager",
      "SSO / SAML",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
  },
] as const;

export const WIZARD_STEPS = [
  { id: 1, title: "Company Profile", description: "Industry, country, headcount, sector" },
  { id: 2, title: "Energy", description: "Electricity, gas, diesel, fuel consumption" },
  { id: 3, title: "Transport", description: "Fleet, flights, commute data" },
  { id: 4, title: "People", description: "Headcount, gender, safety, training" },
  { id: 5, title: "Results", description: "Review Scope 1/2 and download report" },
] as const;
