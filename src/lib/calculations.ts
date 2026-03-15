import { EMISSION_FACTORS } from "./constants";
import { getGridFactor, GRID_FACTORS } from "@/data/emission-factors";

export interface CompanyProfile {
  name: string;
  industry: string;
  country: string;
  countryCode: string;
  headcount: number;
  naceCode: string;
}

export interface EnergyData {
  electricityKwh: number;
  electricityCountry: string;
  naturalGasM3: number;
  dieselLitres: number;
  petrolLitres: number;
  lpgLitres: number;
  otherFuelKg: number;
}

export interface TransportData {
  fleetDieselKm: number;
  fleetPetrolKm: number;
  fleetEvKm: number;
  shortHaulFlightsKm: number;
  mediumHaulFlightsKm: number;
  longHaulFlightsKm: number;
  commuteCarKm: number;
  commuteBusKm: number;
  commuteTrainKm: number;
  commuteRemoteEmployees: number;
}

export interface PeopleData {
  totalEmployees: number;
  femaleEmployees: number;
  maleEmployees: number;
  accidents: number;
  trainingHoursPerEmployee: number;
  turnoverRate: number;
}

export interface EmissionResult {
  scope1: number;
  scope2: number;
  scope2MarketBased: number;
  scope1Breakdown: {
    naturalGas: number;
    diesel: number;
    petrol: number;
    lpg: number;
    otherFuel: number;
    fleet: number;
  };
  scope2Breakdown: {
    electricity: number;
    electricityMarket: number;
  };
  total: number;
  perEmployee: number;
  gridCountry: string;
  gridFactor: number;
  year: string;
}

/**
 * Calculate Scope 1 + 2 emissions using DEFRA 2024 / AIB factors
 */
export function calculateEmissions(
  energy: EnergyData,
  transport: TransportData,
  headcount: number,
  country: string,
  year: string = "2024"
): EmissionResult {
  const r = (v: number) => Math.round(v * 100) / 100;

  // --- Scope 1: Direct emissions ---

  // Stationary combustion (DEFRA 2024)
  const naturalGas = (energy.naturalGasM3 * EMISSION_FACTORS.naturalGas) / 1000;
  const diesel = (energy.dieselLitres * EMISSION_FACTORS.diesel) / 1000;
  const petrol = (energy.petrolLitres * EMISSION_FACTORS.petrol) / 1000;
  const lpg = (energy.lpgLitres * EMISSION_FACTORS.lpg) / 1000;
  const otherFuel = (energy.otherFuelKg * 2.5) / 1000;

  // Fleet vehicles (DEFRA 2024 kgCO2e/km)
  const fleetDiesel = (transport.fleetDieselKm * EMISSION_FACTORS.vehicles.car_diesel) / 1000;
  const fleetPetrol = (transport.fleetPetrolKm * EMISSION_FACTORS.vehicles.car_petrol) / 1000;

  const scope1 = naturalGas + diesel + petrol + lpg + otherFuel + fleetDiesel + fleetPetrol;

  // --- Scope 2: Purchased electricity ---

  // Find country code from name
  const countryEntry = GRID_FACTORS.find(
    c => c.name.toLowerCase() === country.toLowerCase()
  );
  const countryCode = countryEntry?.code ?? "SI";

  // Location-based (Production Mix / EEA)
  const gridFactorLocation = getGridFactor(countryCode, year, "location");
  const electricityLocation = (energy.electricityKwh * gridFactorLocation) / 1000;

  // Market-based (Residual Mix / AIB)
  const gridFactorMarket = getGridFactor(countryCode, year, "market");
  const electricityMarket = (energy.electricityKwh * gridFactorMarket) / 1000;

  const scope2 = electricityLocation;
  const scope2Market = electricityMarket;

  const total = scope1 + scope2;

  return {
    scope1: r(scope1),
    scope2: r(scope2),
    scope2MarketBased: r(scope2Market),
    scope1Breakdown: {
      naturalGas: r(naturalGas),
      diesel: r(diesel),
      petrol: r(petrol),
      lpg: r(lpg),
      otherFuel: r(otherFuel),
      fleet: r(fleetDiesel + fleetPetrol),
    },
    scope2Breakdown: {
      electricity: r(electricityLocation),
      electricityMarket: r(electricityMarket),
    },
    total: r(total),
    perEmployee: headcount > 0 ? r(total / headcount) : 0,
    gridCountry: countryEntry?.name ?? country,
    gridFactor: Math.round(gridFactorLocation * 1000), // display as gCO2/kWh
    year,
  };
}

export function calculateESGScore(
  emissions: EmissionResult,
  people: PeopleData
): number {
  let score = 50;

  // Environmental (40 points max)
  if (emissions.perEmployee < 2) score += 40;
  else if (emissions.perEmployee < 5) score += 30;
  else if (emissions.perEmployee < 10) score += 20;
  else if (emissions.perEmployee < 20) score += 10;

  // Social (30 points max)
  const femaleRatio = people.totalEmployees > 0
    ? people.femaleEmployees / people.totalEmployees
    : 0;
  if (femaleRatio >= 0.4 && femaleRatio <= 0.6) score += 15;
  else if (femaleRatio >= 0.3) score += 10;
  else score += 5;

  if (people.accidents === 0) score += 10;
  else if (people.accidents < 3) score += 5;

  if (people.trainingHoursPerEmployee >= 40) score += 5;
  else if (people.trainingHoursPerEmployee >= 20) score += 3;

  return Math.min(100, Math.max(0, score));
}

export function formatTonnes(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toFixed(1);
}
