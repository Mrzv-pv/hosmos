-- =============================================================================
-- 002_seed_emission_factors.sql
-- Seed ALL emission factor data from src/data/emission-factors.ts
-- Sources: DEFRA 2024/2025, AIB 2023/2024, IPCC AR5, IEA, Exiobase, EcoAct
-- =============================================================================

DO $$
DECLARE
  src_defra        UUID;
  src_aib          UUID;
  src_ipcc_ar5     UUID;
  src_iea          UUID;
  src_exiobase     UUID;
  src_ecoact       UUID;
  src_national     UUID;
BEGIN

-- ---------------------------------------------------------------------------
-- 1. Emission Factor Sources
-- ---------------------------------------------------------------------------

INSERT INTO emission_factor_sources (id, code, name, authority, publication, version_year, notes)
VALUES (gen_random_uuid(), 'DEFRA', 'UK Government GHG Conversion Factors', 'UK Department for Energy Security and Net Zero (DESNZ)', 'GHG Conversion Factors for Company Reporting', 2024, 'DEFRA/DESNZ 2024-2025 factors for Scope 1, 2, 3')
RETURNING id INTO src_defra;

INSERT INTO emission_factor_sources (id, code, name, authority, publication, version_year, notes)
VALUES (gen_random_uuid(), 'AIB', 'European Residual Mix', 'Association of Issuing Bodies (AIB)', 'European Residual Mixes', 2024, 'AIB Residual Mix 2023-2024 for market-based Scope 2')
RETURNING id INTO src_aib;

INSERT INTO emission_factor_sources (id, code, name, authority, publication, version_year, notes)
VALUES (gen_random_uuid(), 'IPCC_AR5', 'IPCC Fifth Assessment Report', 'Intergovernmental Panel on Climate Change', 'AR5 Working Group I', 2014, 'GWP-100 values for refrigerants and greenhouse gases')
RETURNING id INTO src_ipcc_ar5;

INSERT INTO emission_factor_sources (id, code, name, authority, publication, version_year, notes)
VALUES (gen_random_uuid(), 'IEA', 'IEA Emission Factors', 'International Energy Agency', 'IEA CO2 Emissions from Fuel Combustion', 2024, 'Steam and cooling factors from IEA data')
RETURNING id INTO src_iea;

INSERT INTO emission_factor_sources (id, code, name, authority, publication, version_year, notes)
VALUES (gen_random_uuid(), 'EXIOBASE', 'Exiobase MRIO Database', 'Exiobase Consortium', 'Exiobase v3', 2024, 'Multi-regional input-output model for spend-based Scope 3 factors')
RETURNING id INTO src_exiobase;

INSERT INTO emission_factor_sources (id, code, name, authority, publication, version_year, notes)
VALUES (gen_random_uuid(), 'ECOACT', 'EcoAct Research', 'EcoAct', 'Homeworking Emissions Whitepaper', 2024, 'Work from home emission factors')
RETURNING id INTO src_ecoact;

INSERT INTO emission_factor_sources (id, code, name, authority, publication, version_year, notes)
VALUES (gen_random_uuid(), 'NATIONAL_STATS', 'National Statistics Agencies', 'Various national energy/statistics agencies', 'National energy statistics and reports', 2024, 'E-Control AT, AGFW/UBA DE, Danish Energy Agency, Energiateollisuus FI, SCB/Energimyndigheten SE, SSB NO, URE/GUS PL, ERU CZ, ARSO SI, EIHP HR, SNCU/ADEME FR, RVO NL, AIRU/GSE IT, Elering/StatEE, LSTA LT, CSP LV, NSI BG, ANRE RO, RZS RS, Euroheat')
RETURNING id INTO src_national;


-- ---------------------------------------------------------------------------
-- 2. Stationary Fuel Factors
-- ---------------------------------------------------------------------------

-- Natural Gas (kWh Gross CV)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('natural_gas_kwh_gross', 'Natural Gas', 'kWh (Gross CV)', 2023, 0.18316, src_defra),
  ('natural_gas_kwh_gross', 'Natural Gas', 'kWh (Gross CV)', 2024, 0.18290, src_defra),
  ('natural_gas_kwh_gross', 'Natural Gas', 'kWh (Gross CV)', 2025, 0.18296, src_defra);

-- Natural Gas (kWh Net CV)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('natural_gas_kwh_net', 'Natural Gas', 'kWh (Net CV)', 2023, 0.20297, src_defra),
  ('natural_gas_kwh_net', 'Natural Gas', 'kWh (Net CV)', 2024, 0.20260, src_defra),
  ('natural_gas_kwh_net', 'Natural Gas', 'kWh (Net CV)', 2025, 0.20270, src_defra);

-- Natural Gas (m3)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('natural_gas_m3', 'Natural Gas', 'm³', 2023, 2.021, src_defra),
  ('natural_gas_m3', 'Natural Gas', 'm³', 2024, 2.018, src_defra),
  ('natural_gas_m3', 'Natural Gas', 'm³', 2025, 2.019, src_defra);

-- Gas Oil / Diesel
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('gas_oil_litre', 'Gas Oil (Diesel)', 'litre', 2023, 2.75776, src_defra),
  ('gas_oil_litre', 'Gas Oil (Diesel)', 'litre', 2024, 2.75660, src_defra),
  ('gas_oil_litre', 'Gas Oil (Diesel)', 'litre', 2025, 2.75541, src_defra);

-- Diesel (avg biofuel blend)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('diesel_biofuel_litre', 'Diesel (avg biofuel blend)', 'litre', 2023, 2.51210, src_defra),
  ('diesel_biofuel_litre', 'Diesel (avg biofuel blend)', 'litre', 2024, 2.51279, src_defra),
  ('diesel_biofuel_litre', 'Diesel (avg biofuel blend)', 'litre', 2025, 2.57082, src_defra);

-- Diesel (100% mineral)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('diesel_mineral_litre', 'Diesel (100% mineral)', 'litre', 2023, 2.66300, src_defra),
  ('diesel_mineral_litre', 'Diesel (100% mineral)', 'litre', 2024, 2.66200, src_defra),
  ('diesel_mineral_litre', 'Diesel (100% mineral)', 'litre', 2025, 2.66155, src_defra);

-- Petrol (avg biofuel blend)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('petrol_biofuel_litre', 'Petrol (avg biofuel blend)', 'litre', 2023, 2.08480, src_defra),
  ('petrol_biofuel_litre', 'Petrol (avg biofuel blend)', 'litre', 2024, 2.08390, src_defra),
  ('petrol_biofuel_litre', 'Petrol (avg biofuel blend)', 'litre', 2025, 2.06916, src_defra);

-- Petrol (100% mineral)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('petrol_mineral_litre', 'Petrol (100% mineral)', 'litre', 2023, 2.34070, src_defra),
  ('petrol_mineral_litre', 'Petrol (100% mineral)', 'litre', 2024, 2.34000, src_defra),
  ('petrol_mineral_litre', 'Petrol (100% mineral)', 'litre', 2025, 2.33984, src_defra);

-- LPG (litre)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('lpg_litre', 'LPG', 'litre', 2023, 1.55780, src_defra),
  ('lpg_litre', 'LPG', 'litre', 2024, 1.55750, src_defra),
  ('lpg_litre', 'LPG', 'litre', 2025, 1.55713, src_defra);

-- LPG (kWh)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('lpg_kwh', 'LPG', 'kWh (Gross CV)', 2023, 0.21460, src_defra),
  ('lpg_kwh', 'LPG', 'kWh (Gross CV)', 2024, 0.21455, src_defra),
  ('lpg_kwh', 'LPG', 'kWh (Gross CV)', 2025, 0.21450, src_defra);

-- LPG (tonne)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('lpg_tonne', 'LPG', 'tonne', 2023, 2939.50, src_defra),
  ('lpg_tonne', 'LPG', 'tonne', 2024, 2939.42, src_defra),
  ('lpg_tonne', 'LPG', 'tonne', 2025, 2939.36, src_defra);

-- Coal (industrial)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('coal_industrial_tonne', 'Coal (industrial)', 'tonne', 2023, 2396.10, src_defra),
  ('coal_industrial_tonne', 'Coal (industrial)', 'tonne', 2024, 2395.70, src_defra),
  ('coal_industrial_tonne', 'Coal (industrial)', 'tonne', 2025, 2395.29, src_defra);

-- Coal (domestic)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('coal_domestic_tonne', 'Coal (domestic)', 'tonne', 2023, 2905.50, src_defra),
  ('coal_domestic_tonne', 'Coal (domestic)', 'tonne', 2024, 2905.20, src_defra),
  ('coal_domestic_tonne', 'Coal (domestic)', 'tonne', 2025, 2904.95, src_defra);

-- Fuel Oil (litre)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('fuel_oil_litre', 'Fuel Oil', 'litre', 2023, 3.17600, src_defra),
  ('fuel_oil_litre', 'Fuel Oil', 'litre', 2024, 3.17550, src_defra),
  ('fuel_oil_litre', 'Fuel Oil', 'litre', 2025, 3.17492, src_defra);

-- Fuel Oil (tonne)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('fuel_oil_tonne', 'Fuel Oil', 'tonne', 2023, 3229.50, src_defra),
  ('fuel_oil_tonne', 'Fuel Oil', 'tonne', 2024, 3229.20, src_defra),
  ('fuel_oil_tonne', 'Fuel Oil', 'tonne', 2025, 3228.89, src_defra);

-- Burning Oil / Kerosene
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('burning_oil_litre', 'Burning Oil / Kerosene', 'litre', 2023, 2.54100, src_defra),
  ('burning_oil_litre', 'Burning Oil / Kerosene', 'litre', 2024, 2.54060, src_defra),
  ('burning_oil_litre', 'Burning Oil / Kerosene', 'litre', 2025, 2.54016, src_defra);

-- Butane
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('butane_litre', 'Butane', 'litre', 2023, 1.74600, src_defra),
  ('butane_litre', 'Butane', 'litre', 2024, 1.74570, src_defra),
  ('butane_litre', 'Butane', 'litre', 2025, 1.74533, src_defra);

-- Propane
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('propane_litre', 'Propane', 'litre', 2023, 1.54420, src_defra),
  ('propane_litre', 'Propane', 'litre', 2024, 1.54390, src_defra),
  ('propane_litre', 'Propane', 'litre', 2025, 1.54358, src_defra);

-- Wood Pellets (biomass)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('wood_pellets_tonne', 'Wood Pellets (biomass)', 'tonne', 2023, 55.30, src_defra),
  ('wood_pellets_tonne', 'Wood Pellets (biomass)', 'tonne', 2024, 55.25, src_defra),
  ('wood_pellets_tonne', 'Wood Pellets (biomass)', 'tonne', 2025, 55.19, src_defra);

-- Wood Chips (biomass)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('wood_chips_tonne', 'Wood Chips (biomass)', 'tonne', 2023, 43.52, src_defra),
  ('wood_chips_tonne', 'Wood Chips (biomass)', 'tonne', 2024, 43.48, src_defra),
  ('wood_chips_tonne', 'Wood Chips (biomass)', 'tonne', 2025, 43.44, src_defra);

-- Wood Logs (biomass)
INSERT INTO stationary_fuel_factors (factor_id, name, unit, year, kg_co2e, source_id) VALUES
  ('wood_logs_tonne', 'Wood Logs (biomass)', 'tonne', 2023, 47.06, src_defra),
  ('wood_logs_tonne', 'Wood Logs (biomass)', 'tonne', 2024, 47.03, src_defra),
  ('wood_logs_tonne', 'Wood Logs (biomass)', 'tonne', 2025, 46.99, src_defra);


-- ---------------------------------------------------------------------------
-- 3. Vehicle Factors
-- ---------------------------------------------------------------------------

-- Cars — Petrol
INSERT INTO vehicle_factors (factor_id, category, type, fuel, unit, year, kg_co2e_per_km, source_id) VALUES
  ('car_petrol_small',  'Car', 'Small',   'Petrol', 'kgCO2e/km', 2024, 0.14308, src_defra),
  ('car_petrol_small',  'Car', 'Small',   'Petrol', 'kgCO2e/km', 2025, 0.14308, src_defra),
  ('car_petrol_medium', 'Car', 'Medium',  'Petrol', 'kgCO2e/km', 2024, 0.17474, src_defra),
  ('car_petrol_medium', 'Car', 'Medium',  'Petrol', 'kgCO2e/km', 2025, 0.17474, src_defra),
  ('car_petrol_large',  'Car', 'Large',   'Petrol', 'kgCO2e/km', 2024, 0.26828, src_defra),
  ('car_petrol_large',  'Car', 'Large',   'Petrol', 'kgCO2e/km', 2025, 0.26828, src_defra),
  ('car_petrol_avg',    'Car', 'Average', 'Petrol', 'kgCO2e/km', 2024, 0.16272, src_defra),
  ('car_petrol_avg',    'Car', 'Average', 'Petrol', 'kgCO2e/km', 2025, 0.16272, src_defra);

-- Cars — Diesel
INSERT INTO vehicle_factors (factor_id, category, type, fuel, unit, year, kg_co2e_per_km, source_id) VALUES
  ('car_diesel_small',  'Car', 'Small',   'Diesel', 'kgCO2e/km', 2024, 0.14340, src_defra),
  ('car_diesel_small',  'Car', 'Small',   'Diesel', 'kgCO2e/km', 2025, 0.14340, src_defra),
  ('car_diesel_medium', 'Car', 'Medium',  'Diesel', 'kgCO2e/km', 2024, 0.17174, src_defra),
  ('car_diesel_medium', 'Car', 'Medium',  'Diesel', 'kgCO2e/km', 2025, 0.17174, src_defra),
  ('car_diesel_large',  'Car', 'Large',   'Diesel', 'kgCO2e/km', 2024, 0.21007, src_defra),
  ('car_diesel_large',  'Car', 'Large',   'Diesel', 'kgCO2e/km', 2025, 0.21007, src_defra),
  ('car_diesel_avg',    'Car', 'Average', 'Diesel', 'kgCO2e/km', 2024, 0.17304, src_defra),
  ('car_diesel_avg',    'Car', 'Average', 'Diesel', 'kgCO2e/km', 2025, 0.17304, src_defra);

-- Cars — Hybrid
INSERT INTO vehicle_factors (factor_id, category, type, fuel, unit, year, kg_co2e_per_km, source_id) VALUES
  ('car_hybrid_small',  'Car', 'Small',   'Hybrid', 'kgCO2e/km', 2024, 0.11413, src_defra),
  ('car_hybrid_small',  'Car', 'Small',   'Hybrid', 'kgCO2e/km', 2025, 0.11413, src_defra),
  ('car_hybrid_medium', 'Car', 'Medium',  'Hybrid', 'kgCO2e/km', 2024, 0.11724, src_defra),
  ('car_hybrid_medium', 'Car', 'Medium',  'Hybrid', 'kgCO2e/km', 2025, 0.11724, src_defra),
  ('car_hybrid_large',  'Car', 'Large',   'Hybrid', 'kgCO2e/km', 2024, 0.15650, src_defra),
  ('car_hybrid_large',  'Car', 'Large',   'Hybrid', 'kgCO2e/km', 2025, 0.15650, src_defra),
  ('car_hybrid_avg',    'Car', 'Average', 'Hybrid', 'kgCO2e/km', 2024, 0.12825, src_defra),
  ('car_hybrid_avg',    'Car', 'Average', 'Hybrid', 'kgCO2e/km', 2025, 0.12825, src_defra);

-- Cars — BEV
INSERT INTO vehicle_factors (factor_id, category, type, fuel, unit, year, kg_co2e_per_km, source_id) VALUES
  ('car_bev_small',  'Car', 'Small',   'BEV', 'kgCO2e/km', 2024, 0.04047, src_defra),
  ('car_bev_small',  'Car', 'Small',   'BEV', 'kgCO2e/km', 2025, 0.03339, src_defra),
  ('car_bev_medium', 'Car', 'Medium',  'BEV', 'kgCO2e/km', 2024, 0.04250, src_defra),
  ('car_bev_medium', 'Car', 'Medium',  'BEV', 'kgCO2e/km', 2025, 0.03513, src_defra),
  ('car_bev_large',  'Car', 'Large',   'BEV', 'kgCO2e/km', 2024, 0.04600, src_defra),
  ('car_bev_large',  'Car', 'Large',   'BEV', 'kgCO2e/km', 2025, 0.03807, src_defra),
  ('car_bev_avg',    'Car', 'Average', 'BEV', 'kgCO2e/km', 2024, 0.04047, src_defra),
  ('car_bev_avg',    'Car', 'Average', 'BEV', 'kgCO2e/km', 2025, 0.03663, src_defra);

-- Cars — CNG & LPG
INSERT INTO vehicle_factors (factor_id, category, type, fuel, unit, year, kg_co2e_per_km, source_id) VALUES
  ('car_cng_avg', 'Car', 'Average', 'CNG', 'kgCO2e/km', 2024, 0.17414, src_defra),
  ('car_cng_avg', 'Car', 'Average', 'CNG', 'kgCO2e/km', 2025, 0.17414, src_defra),
  ('car_lpg_avg', 'Car', 'Average', 'LPG', 'kgCO2e/km', 2024, 0.19599, src_defra),
  ('car_lpg_avg', 'Car', 'Average', 'LPG', 'kgCO2e/km', 2025, 0.19599, src_defra);

-- Motorbikes
INSERT INTO vehicle_factors (factor_id, category, type, fuel, unit, year, kg_co2e_per_km, source_id) VALUES
  ('motorbike_small',  'Motorbike', 'Small',   'Petrol', 'kgCO2e/km', 2024, 0.08319, src_defra),
  ('motorbike_small',  'Motorbike', 'Small',   'Petrol', 'kgCO2e/km', 2025, 0.08319, src_defra),
  ('motorbike_medium', 'Motorbike', 'Medium',  'Petrol', 'kgCO2e/km', 2024, 0.10107, src_defra),
  ('motorbike_medium', 'Motorbike', 'Medium',  'Petrol', 'kgCO2e/km', 2025, 0.10107, src_defra),
  ('motorbike_large',  'Motorbike', 'Large',   'Petrol', 'kgCO2e/km', 2024, 0.13252, src_defra),
  ('motorbike_large',  'Motorbike', 'Large',   'Petrol', 'kgCO2e/km', 2025, 0.13252, src_defra),
  ('motorbike_avg',    'Motorbike', 'Average', 'Petrol', 'kgCO2e/km', 2024, 0.11367, src_defra),
  ('motorbike_avg',    'Motorbike', 'Average', 'Petrol', 'kgCO2e/km', 2025, 0.11367, src_defra);

-- Vans
INSERT INTO vehicle_factors (factor_id, category, type, fuel, unit, year, kg_co2e_per_km, source_id) VALUES
  ('van_diesel_class1', 'Van', 'Class I (<=1.3t)',    'Diesel', 'kgCO2e/km', 2024, 0.15738, src_defra),
  ('van_diesel_class1', 'Van', 'Class I (<=1.3t)',    'Diesel', 'kgCO2e/km', 2025, 0.15738, src_defra),
  ('van_diesel_class2', 'Van', 'Class II (1.3-1.7t)', 'Diesel', 'kgCO2e/km', 2024, 0.19260, src_defra),
  ('van_diesel_class2', 'Van', 'Class II (1.3-1.7t)', 'Diesel', 'kgCO2e/km', 2025, 0.19260, src_defra),
  ('van_diesel_class3', 'Van', 'Class III (1.7-3.5t)','Diesel', 'kgCO2e/km', 2024, 0.27878, src_defra),
  ('van_diesel_class3', 'Van', 'Class III (1.7-3.5t)','Diesel', 'kgCO2e/km', 2025, 0.27878, src_defra),
  ('van_diesel_avg',    'Van', 'Average',             'Diesel', 'kgCO2e/km', 2024, 0.25561, src_defra),
  ('van_diesel_avg',    'Van', 'Average',             'Diesel', 'kgCO2e/km', 2025, 0.25561, src_defra),
  ('van_petrol_avg',    'Van', 'Average',             'Petrol', 'kgCO2e/km', 2024, 0.21335, src_defra),
  ('van_petrol_avg',    'Van', 'Average',             'Petrol', 'kgCO2e/km', 2025, 0.21335, src_defra);

-- HGVs
INSERT INTO vehicle_factors (factor_id, category, type, fuel, unit, year, kg_co2e_per_km, source_id) VALUES
  ('hgv_rigid_small',  'HGV', 'Rigid (3.5-7.5t)',  'Diesel', 'kgCO2e/km', 2024, 0.46138, src_defra),
  ('hgv_rigid_small',  'HGV', 'Rigid (3.5-7.5t)',  'Diesel', 'kgCO2e/km', 2025, 0.46138, src_defra),
  ('hgv_rigid_medium', 'HGV', 'Rigid (7.5-17t)',   'Diesel', 'kgCO2e/km', 2024, 0.55061, src_defra),
  ('hgv_rigid_medium', 'HGV', 'Rigid (7.5-17t)',   'Diesel', 'kgCO2e/km', 2025, 0.55061, src_defra),
  ('hgv_rigid_large',  'HGV', 'Rigid (>17t)',      'Diesel', 'kgCO2e/km', 2024, 0.77400, src_defra),
  ('hgv_rigid_large',  'HGV', 'Rigid (>17t)',      'Diesel', 'kgCO2e/km', 2025, 0.77400, src_defra),
  ('hgv_rigid_avg',    'HGV', 'All Rigids',        'Diesel', 'kgCO2e/km', 2024, 0.67912, src_defra),
  ('hgv_rigid_avg',    'HGV', 'All Rigids',        'Diesel', 'kgCO2e/km', 2025, 0.67912, src_defra),
  ('hgv_artic_small',  'HGV', 'Artic (3.5-33t)',   'Diesel', 'kgCO2e/km', 2024, 0.62775, src_defra),
  ('hgv_artic_small',  'HGV', 'Artic (3.5-33t)',   'Diesel', 'kgCO2e/km', 2025, 0.62775, src_defra),
  ('hgv_artic_large',  'HGV', 'Artic (>33t)',      'Diesel', 'kgCO2e/km', 2024, 0.64734, src_defra),
  ('hgv_artic_large',  'HGV', 'Artic (>33t)',      'Diesel', 'kgCO2e/km', 2025, 0.64734, src_defra),
  ('hgv_artic_avg',    'HGV', 'All Artics',        'Diesel', 'kgCO2e/km', 2024, 0.64659, src_defra),
  ('hgv_artic_avg',    'HGV', 'All Artics',        'Diesel', 'kgCO2e/km', 2025, 0.64659, src_defra),
  ('hgv_avg',          'HGV', 'All HGVs',          'Diesel', 'kgCO2e/km', 2024, 0.65975, src_defra),
  ('hgv_avg',          'HGV', 'All HGVs',          'Diesel', 'kgCO2e/km', 2025, 0.65975, src_defra);


-- ---------------------------------------------------------------------------
-- 4. Flight Factors
-- ---------------------------------------------------------------------------

-- Domestic
INSERT INTO flight_factors (factor_id, flight_type, cabin_class, year, kg_co2e_with_rf, kg_co2e_without_rf, source_id) VALUES
  ('flight_domestic_avg', 'Domestic', 'Average', 2024, 0.27257, 0.16098, src_defra),
  ('flight_domestic_avg', 'Domestic', 'Average', 2025, 0.22928, 0.13552, src_defra);

-- Short-haul
INSERT INTO flight_factors (factor_id, flight_type, cabin_class, year, kg_co2e_with_rf, kg_co2e_without_rf, source_id) VALUES
  ('flight_shorthaul_avg',      'Short-haul (<3700km)', 'Average',  2024, 0.18592, 0.10974, src_defra),
  ('flight_shorthaul_avg',      'Short-haul (<3700km)', 'Average',  2025, 0.12786, 0.07559, src_defra),
  ('flight_shorthaul_economy',  'Short-haul (<3700km)', 'Economy',  2024, 0.18287, 0.10794, src_defra),
  ('flight_shorthaul_economy',  'Short-haul (<3700km)', 'Economy',  2025, 0.12576, 0.07435, src_defra),
  ('flight_shorthaul_business', 'Short-haul (<3700km)', 'Business', 2024, 0.27430, 0.16191, src_defra),
  ('flight_shorthaul_business', 'Short-haul (<3700km)', 'Business', 2025, 0.18863, 0.11152, src_defra);

-- Long-haul
INSERT INTO flight_factors (factor_id, flight_type, cabin_class, year, kg_co2e_with_rf, kg_co2e_without_rf, source_id) VALUES
  ('flight_longhaul_avg',      'Long-haul (>3700km)', 'Average',         2024, 0.26128, 0.15423, src_defra),
  ('flight_longhaul_avg',      'Long-haul (>3700km)', 'Average',         2025, 0.15282, 0.09043, src_defra),
  ('flight_longhaul_economy',  'Long-haul (>3700km)', 'Economy',         2024, 0.20011, 0.11812, src_defra),
  ('flight_longhaul_economy',  'Long-haul (>3700km)', 'Economy',         2025, 0.11704, 0.06926, src_defra),
  ('flight_longhaul_premium',  'Long-haul (>3700km)', 'Premium Economy', 2024, 0.32015, 0.18897, src_defra),
  ('flight_longhaul_premium',  'Long-haul (>3700km)', 'Premium Economy', 2025, 0.18726, 0.11081, src_defra),
  ('flight_longhaul_business', 'Long-haul (>3700km)', 'Business',        2024, 0.58028, 0.34252, src_defra),
  ('flight_longhaul_business', 'Long-haul (>3700km)', 'Business',        2025, 0.33940, 0.20083, src_defra),
  ('flight_longhaul_first',    'Long-haul (>3700km)', 'First',           2024, 0.80040, 0.47246, src_defra),
  ('flight_longhaul_first',    'Long-haul (>3700km)', 'First',           2025, 0.46814, 0.27701, src_defra);

-- International
INSERT INTO flight_factors (factor_id, flight_type, cabin_class, year, kg_co2e_with_rf, kg_co2e_without_rf, source_id) VALUES
  ('flight_intl_avg',      'International', 'Average',         2024, 0.17580, 0.10377, src_defra),
  ('flight_intl_avg',      'International', 'Average',         2025, 0.14253, 0.08420, src_defra),
  ('flight_intl_economy',  'International', 'Economy',         2024, 0.13465, 0.07948, src_defra),
  ('flight_intl_economy',  'International', 'Economy',         2025, 0.10916, 0.06449, src_defra),
  ('flight_intl_premium',  'International', 'Premium Economy', 2024, 0.21542, 0.12716, src_defra),
  ('flight_intl_premium',  'International', 'Premium Economy', 2025, 0.17465, 0.10318, src_defra),
  ('flight_intl_business', 'International', 'Business',        2024, 0.39044, 0.23047, src_defra),
  ('flight_intl_business', 'International', 'Business',        2025, 0.31656, 0.18701, src_defra),
  ('flight_intl_first',    'International', 'First',           2024, 0.53854, 0.31789, src_defra),
  ('flight_intl_first',    'International', 'First',           2025, 0.43663, 0.25794, src_defra);


-- ---------------------------------------------------------------------------
-- 5. Refrigerant Factors
-- ---------------------------------------------------------------------------

INSERT INTO refrigerant_factors (factor_id, name, gwp_100, kg_co2e_per_kg, common_use, source_id) VALUES
  ('r134a', 'R-134a (HFC-134a)',              1430,  1430,  'Car AC, chillers, refrigerators',       src_defra),
  ('r410a', 'R-410A',                          2088,  2088,  'Heat pumps, air conditioning',          src_defra),
  ('r407c', 'R-407C',                          1774,  1774,  'Commercial AC, retrofit for R-22',      src_defra),
  ('r32',   'R-32 (HFC-32)',                   675,   675,   'Modern split AC, heat pumps',           src_defra),
  ('r404a', 'R-404A',                          3922,  3922,  'Commercial refrigeration, cold storage',src_defra),
  ('r507a', 'R-507A',                          3985,  3985,  'Industrial refrigeration',              src_defra),
  ('r449a', 'R-449A (Opteon XP40)',            1397,  1397,  'R-404A replacement, supermarkets',      src_defra),
  ('r448a', 'R-448A (Solstice N40)',           1387,  1387,  'R-404A replacement, commercial',        src_defra),
  ('r290',  'R-290 (Propane)',                 3,     3,     'Natural refrigerant, small systems',    src_defra),
  ('r600a', 'R-600a (Isobutane)',              3,     3,     'Domestic refrigerators',                src_defra),
  ('r744',  'R-744 (CO2)',                     1,     1,     'CO2 transcritical, supermarkets',       src_defra),
  ('r717',  'R-717 (Ammonia)',                 0,     0,     'Industrial refrigeration',              src_defra),
  ('r22',   'R-22 (HCFC-22)',                  1810,  1810,  'Legacy AC (being phased out)',          src_defra),
  ('sf6',   'SF6 (Sulphur hexafluoride)',      22800, 22800, 'Electrical switchgear, insulation',     src_defra);


-- ---------------------------------------------------------------------------
-- 6. Grid Electricity Factors (gCO2/kWh in TS -> kgCO2e/kWh in DB: divide by 1000)
-- ---------------------------------------------------------------------------

-- Western Europe
INSERT INTO grid_electricity_factors (country_code, country_name, year, location_kwh, market_kwh, source_id) VALUES
  ('AT', 'Austria',       2023, 0.0956,  0.227,   src_aib),
  ('AT', 'Austria',       2024, 0.0865,  0.210,   src_aib),
  ('BE', 'Belgium',       2023, 0.112,   0.167,   src_aib),
  ('BE', 'Belgium',       2024, 0.104,   0.131,   src_aib),
  ('CH', 'Switzerland',   2023, 0.00151, 0.128,   src_aib),
  ('CH', 'Switzerland',   2024, 0.00578, 0.120,   src_aib),
  ('DE', 'Germany',       2023, 0.335,   0.719,   src_aib),
  ('DE', 'Germany',       2024, 0.311,   0.724,   src_aib),
  ('FR', 'France',        2023, 0.0308,  0.0407,  src_aib),
  ('FR', 'France',        2024, 0.0180,  0.0235,  src_aib),
  ('LU', 'Luxembourg',    2023, 0.0584,  0.357,   src_aib),
  ('LU', 'Luxembourg',    2024, 0.0461,  0.213,   src_aib),
  ('MC', 'Monaco',        2023, 0.0308,  0.0407,  src_aib),
  ('MC', 'Monaco',        2024, 0.0180,  0.0235,  src_aib),
  ('NL', 'Netherlands',   2023, 0.241,   0.379,   src_aib),
  ('NL', 'Netherlands',   2024, 0.228,   0.382,   src_aib),
  ('LI', 'Liechtenstein', 2023, 0.00151, 0.128,   src_aib),
  ('LI', 'Liechtenstein', 2024, 0.00578, 0.120,   src_aib);

-- Northern Europe
INSERT INTO grid_electricity_factors (country_code, country_name, year, location_kwh, market_kwh, source_id) VALUES
  ('DK', 'Denmark',   2023, 0.0738,  0.582,   src_aib),
  ('DK', 'Denmark',   2024, 0.0511,  0.421,   src_aib),
  ('FI', 'Finland',   2023, 0.0451,  0.565,   src_aib),
  ('FI', 'Finland',   2024, 0.0332,  0.405,   src_aib),
  ('IS', 'Iceland',   2023, 0.00020, 0.595,   src_aib),
  ('IS', 'Iceland',   2024, 0.00017, 0.505,   src_aib),
  ('NO', 'Norway',    2023, 0.0070,  0.598,   src_aib),
  ('NO', 'Norway',    2024, 0.00674, 0.534,   src_aib),
  ('SE', 'Sweden',    2023, 0.00652, 0.0682,  src_aib),
  ('SE', 'Sweden',    2024, 0.00505, 0.0855,  src_aib),
  ('EE', 'Estonia',   2023, 0.464,   0.711,   src_aib),
  ('EE', 'Estonia',   2024, 0.364,   0.611,   src_aib),
  ('LT', 'Lithuania', 2023, 0.151,   0.583,   src_aib),
  ('LT', 'Lithuania', 2024, 0.118,   0.567,   src_aib),
  ('LV', 'Latvia',    2023, 0.120,   0.535,   src_aib),
  ('LV', 'Latvia',    2024, 0.145,   0.504,   src_aib),
  ('IE', 'Ireland',   2023, 0.267,   0.445,   src_aib),
  ('IE', 'Ireland',   2024, 0.245,   0.365,   src_aib);

-- Southern Europe
INSERT INTO grid_electricity_factors (country_code, country_name, year, location_kwh, market_kwh, source_id) VALUES
  ('ES', 'Spain',         2023, 0.121,   0.282,   src_aib),
  ('ES', 'Spain',         2024, 0.100,   0.292,   src_aib),
  ('PT', 'Portugal',      2023, 0.100,   0.539,   src_aib),
  ('PT', 'Portugal',      2024, 0.0433,  0.501,   src_aib),
  ('IT', 'Italy',         2023, 0.273,   0.500,   src_aib),
  ('IT', 'Italy',         2024, 0.235,   0.441,   src_aib),
  ('GR', 'Greece',        2023, 0.259,   0.491,   src_aib),
  ('GR', 'Greece',        2024, 0.231,   0.367,   src_aib),
  ('MT', 'Malta',         2023, 0.365,   0.408,   src_aib),
  ('MT', 'Malta',         2024, 0.345,   0.398,   src_aib),
  ('CY', 'Cyprus',        2023, 0.572,   0.595,   src_aib),
  ('CY', 'Cyprus',        2024, 0.586,   0.613,   src_aib),
  ('AD', 'Andorra',       2023, 0.121,   0.282,   src_aib),
  ('AD', 'Andorra',       2024, 0.100,   0.292,   src_aib),
  ('SM', 'San Marino',    2023, 0.273,   0.500,   src_aib),
  ('SM', 'San Marino',    2024, 0.235,   0.441,   src_aib),
  ('VA', 'Vatican City',  2023, 0.273,   0.500,   src_aib),
  ('VA', 'Vatican City',  2024, 0.235,   0.441,   src_aib);

-- Central Europe
INSERT INTO grid_electricity_factors (country_code, country_name, year, location_kwh, market_kwh, source_id) VALUES
  ('PL', 'Poland',         2023, 0.668,   0.788,   src_aib),
  ('PL', 'Poland',         2024, 0.634,   0.808,   src_aib),
  ('CZ', 'Czech Republic', 2023, 0.577,   0.658,   src_aib),
  ('CZ', 'Czech Republic', 2024, 0.529,   0.584,   src_aib),
  ('SK', 'Slovakia',       2023, 0.123,   0.357,   src_aib),
  ('SK', 'Slovakia',       2024, 0.0991,  0.334,   src_aib),
  ('HU', 'Hungary',        2023, 0.195,   0.322,   src_aib),
  ('HU', 'Hungary',        2024, 0.177,   0.318,   src_aib),
  ('SI', 'Slovenia',       2023, 0.207,   0.486,   src_aib),
  ('SI', 'Slovenia',       2024, 0.212,   0.429,   src_aib),
  ('HR', 'Croatia',        2023, 0.176,   0.550,   src_aib),
  ('HR', 'Croatia',        2024, 0.224,   0.573,   src_aib);

-- Southeast Europe
INSERT INTO grid_electricity_factors (country_code, country_name, year, location_kwh, market_kwh, source_id) VALUES
  ('RO', 'Romania',               2023, 0.212,  0.212,  src_aib),
  ('RO', 'Romania',               2024, 0.216,  0.233,  src_aib),
  ('BG', 'Bulgaria',              2023, 0.332,  0.418,  src_aib),
  ('BG', 'Bulgaria',              2024, 0.310,  0.379,  src_aib),
  ('RS', 'Serbia',                2023, 0.766,  0.966,  src_aib),
  ('RS', 'Serbia',                2024, 0.801,  0.895,  src_aib),
  ('BA', 'Bosnia & Herzegovina',  2023, 0.700,  0.719,  src_aib),
  ('BA', 'Bosnia & Herzegovina',  2024, 0.776,  0.777,  src_aib),
  ('ME', 'Montenegro',            2023, 0.467,  0.747,  src_aib),
  ('ME', 'Montenegro',            2024, 0.482,  0.622,  src_aib),
  ('MK', 'North Macedonia',       2023, 0.550,  0.680,  src_aib),
  ('MK', 'North Macedonia',       2024, 0.520,  0.650,  src_aib),
  ('AL', 'Albania',               2023, 0.0150, 0.350,  src_aib),
  ('AL', 'Albania',               2024, 0.0180, 0.340,  src_aib),
  ('XK', 'Kosovo',                2023, 0.820,  0.850,  src_aib),
  ('XK', 'Kosovo',                2024, 0.790,  0.820,  src_aib);

-- UK
INSERT INTO grid_electricity_factors (country_code, country_name, year, location_kwh, market_kwh, source_id) VALUES
  ('GB', 'United Kingdom', 2023, 0.193, 0.388, src_aib),
  ('GB', 'United Kingdom', 2024, 0.148, 0.420, src_aib);

-- Other European
INSERT INTO grid_electricity_factors (country_code, country_name, year, location_kwh, market_kwh, source_id) VALUES
  ('UA', 'Ukraine',    2023, 0.310, 0.310, src_aib),
  ('UA', 'Ukraine',    2024, 0.330, 0.330, src_aib),
  ('MD', 'Moldova',    2023, 0.420, 0.420, src_aib),
  ('MD', 'Moldova',    2024, 0.400, 0.400, src_aib),
  ('BY', 'Belarus',    2023, 0.370, 0.370, src_aib),
  ('BY', 'Belarus',    2024, 0.360, 0.360, src_aib),
  ('TR', 'Turkey',     2023, 0.420, 0.420, src_aib),
  ('TR', 'Turkey',     2024, 0.395, 0.395, src_aib),
  ('GE', 'Georgia',    2023, 0.095, 0.095, src_aib),
  ('GE', 'Georgia',    2024, 0.100, 0.100, src_aib),
  ('AM', 'Armenia',    2023, 0.180, 0.180, src_aib),
  ('AM', 'Armenia',    2024, 0.175, 0.175, src_aib),
  ('AZ', 'Azerbaijan', 2023, 0.480, 0.480, src_aib),
  ('AZ', 'Azerbaijan', 2024, 0.470, 0.470, src_aib);


-- ---------------------------------------------------------------------------
-- 7. Heat, Steam & Cooling Factors
-- ---------------------------------------------------------------------------

-- District Heating — generic / DEFRA defaults
INSERT INTO heat_steam_cooling_factors (factor_id, category, name, unit, year, kg_co2e_per_kwh, country_code, notes, source_id) VALUES
  ('heat_defra_default',  'district_heating', 'District heat (DEFRA default)',       'kWh', 2023, 0.16630, NULL, 'UK default for purchased heat',               src_defra),
  ('heat_defra_default',  'district_heating', 'District heat (DEFRA default)',       'kWh', 2024, 0.16590, NULL, 'UK default for purchased heat',               src_defra),
  ('heat_gas_boiler',     'district_heating', 'Heat from gas boiler (centralised)',  'kWh', 2023, 0.20297, NULL, 'Natural gas net CV -- centralised boiler',     src_defra),
  ('heat_gas_boiler',     'district_heating', 'Heat from gas boiler (centralised)',  'kWh', 2024, 0.20260, NULL, 'Natural gas net CV -- centralised boiler',     src_defra),
  ('heat_oil_boiler',     'district_heating', 'Heat from oil boiler',               'kWh', 2023, 0.26810, NULL, 'Fuel oil / kerosene boiler',                  src_defra),
  ('heat_oil_boiler',     'district_heating', 'Heat from oil boiler',               'kWh', 2024, 0.26780, NULL, 'Fuel oil / kerosene boiler',                  src_defra),
  ('heat_biomass_boiler', 'district_heating', 'Heat from biomass boiler',           'kWh', 2023, 0.01313, NULL, 'Wood pellets -- non-biogenic only',            src_defra),
  ('heat_biomass_boiler', 'district_heating', 'Heat from biomass boiler',           'kWh', 2024, 0.01310, NULL, 'Wood pellets -- non-biogenic only',            src_defra),
  ('heat_heat_pump',      'district_heating', 'Heat pump (electricity-driven)',     'kWh', 2023, 0.07700, NULL, 'COP ~3.0 x grid factor (EU avg)',             src_defra),
  ('heat_heat_pump',      'district_heating', 'Heat pump (electricity-driven)',     'kWh', 2024, 0.07100, NULL, 'COP ~3.0 x grid factor (EU avg)',             src_defra);

-- District Heating — by country
INSERT INTO heat_steam_cooling_factors (factor_id, category, name, unit, year, kg_co2e_per_kwh, country_code, notes, source_id) VALUES
  ('dh_AT', 'district_heating', 'District heating -- Austria',        'kWh', 2023, 0.105, 'AT', 'High CHP, gas + biomass',                src_national),
  ('dh_AT', 'district_heating', 'District heating -- Austria',        'kWh', 2024, 0.098, 'AT', 'High CHP, gas + biomass',                src_national),
  ('dh_DE', 'district_heating', 'District heating -- Germany',        'kWh', 2023, 0.183, 'DE', 'Mixed CHP + gas boilers',                src_national),
  ('dh_DE', 'district_heating', 'District heating -- Germany',        'kWh', 2024, 0.175, 'DE', 'Mixed CHP + gas boilers',                src_national),
  ('dh_DK', 'district_heating', 'District heating -- Denmark',        'kWh', 2023, 0.060, 'DK', 'Biomass + waste CHP + heat pumps',       src_national),
  ('dh_DK', 'district_heating', 'District heating -- Denmark',        'kWh', 2024, 0.047, 'DK', 'Biomass + waste CHP + heat pumps',       src_national),
  ('dh_FI', 'district_heating', 'District heating -- Finland',        'kWh', 2023, 0.107, 'FI', 'CHP peat/biomass/gas',                   src_national),
  ('dh_FI', 'district_heating', 'District heating -- Finland',        'kWh', 2024, 0.092, 'FI', 'CHP peat/biomass/gas',                   src_national),
  ('dh_SE', 'district_heating', 'District heating -- Sweden',         'kWh', 2023, 0.044, 'SE', 'Biomass + waste + heat pumps',           src_national),
  ('dh_SE', 'district_heating', 'District heating -- Sweden',         'kWh', 2024, 0.040, 'SE', 'Biomass + waste + heat pumps',           src_national),
  ('dh_NO', 'district_heating', 'District heating -- Norway',         'kWh', 2023, 0.038, 'NO', 'Waste CHP + electric boilers',           src_national),
  ('dh_NO', 'district_heating', 'District heating -- Norway',         'kWh', 2024, 0.035, 'NO', 'Waste CHP + electric boilers',           src_national),
  ('dh_PL', 'district_heating', 'District heating -- Poland',         'kWh', 2023, 0.310, 'PL', 'Coal CHP dominant',                      src_national),
  ('dh_PL', 'district_heating', 'District heating -- Poland',         'kWh', 2024, 0.295, 'PL', 'Coal CHP dominant',                      src_national),
  ('dh_CZ', 'district_heating', 'District heating -- Czech Republic', 'kWh', 2023, 0.220, 'CZ', 'Coal + gas CHP',                         src_national),
  ('dh_CZ', 'district_heating', 'District heating -- Czech Republic', 'kWh', 2024, 0.208, 'CZ', 'Coal + gas CHP',                         src_national),
  ('dh_SI', 'district_heating', 'District heating -- Slovenia',       'kWh', 2023, 0.188, 'SI', 'Gas CHP + waste',                        src_national),
  ('dh_SI', 'district_heating', 'District heating -- Slovenia',       'kWh', 2024, 0.180, 'SI', 'Gas CHP + waste',                        src_national),
  ('dh_HR', 'district_heating', 'District heating -- Croatia',        'kWh', 2023, 0.195, 'HR', 'Gas CHP',                                src_national),
  ('dh_HR', 'district_heating', 'District heating -- Croatia',        'kWh', 2024, 0.190, 'HR', 'Gas CHP',                                src_national),
  ('dh_FR', 'district_heating', 'District heating -- France',         'kWh', 2023, 0.115, 'FR', 'Gas + waste + biomass',                  src_national),
  ('dh_FR', 'district_heating', 'District heating -- France',         'kWh', 2024, 0.108, 'FR', 'Gas + waste + biomass',                  src_national),
  ('dh_NL', 'district_heating', 'District heating -- Netherlands',    'kWh', 2023, 0.165, 'NL', 'Gas CHP',                                src_national),
  ('dh_NL', 'district_heating', 'District heating -- Netherlands',    'kWh', 2024, 0.158, 'NL', 'Gas CHP',                                src_national),
  ('dh_IT', 'district_heating', 'District heating -- Italy',          'kWh', 2023, 0.150, 'IT', 'Gas CHP',                                src_national),
  ('dh_IT', 'district_heating', 'District heating -- Italy',          'kWh', 2024, 0.143, 'IT', 'Gas CHP',                                src_national),
  ('dh_GB', 'district_heating', 'District heating -- United Kingdom', 'kWh', 2023, 0.166, 'GB', 'UK default',                             src_defra),
  ('dh_GB', 'district_heating', 'District heating -- United Kingdom', 'kWh', 2024, 0.166, 'GB', 'UK default',                             src_defra),
  ('dh_EE', 'district_heating', 'District heating -- Estonia',        'kWh', 2023, 0.178, 'EE', 'Oil shale + biomass + gas',              src_national),
  ('dh_EE', 'district_heating', 'District heating -- Estonia',        'kWh', 2024, 0.165, 'EE', 'Oil shale + biomass + gas',              src_national),
  ('dh_LT', 'district_heating', 'District heating -- Lithuania',      'kWh', 2023, 0.130, 'LT', 'Biomass transition, was gas',            src_national),
  ('dh_LT', 'district_heating', 'District heating -- Lithuania',      'kWh', 2024, 0.120, 'LT', 'Biomass transition, was gas',            src_national),
  ('dh_LV', 'district_heating', 'District heating -- Latvia',         'kWh', 2023, 0.145, 'LV', 'Gas + biomass',                          src_national),
  ('dh_LV', 'district_heating', 'District heating -- Latvia',         'kWh', 2024, 0.138, 'LV', 'Gas + biomass',                          src_national),
  ('dh_BG', 'district_heating', 'District heating -- Bulgaria',       'kWh', 2023, 0.240, 'BG', 'Gas + coal CHP',                         src_national),
  ('dh_BG', 'district_heating', 'District heating -- Bulgaria',       'kWh', 2024, 0.232, 'BG', 'Gas + coal CHP',                         src_national),
  ('dh_RO', 'district_heating', 'District heating -- Romania',        'kWh', 2023, 0.225, 'RO', 'Gas CHP',                                src_national),
  ('dh_RO', 'district_heating', 'District heating -- Romania',        'kWh', 2024, 0.218, 'RO', 'Gas CHP',                                src_national),
  ('dh_RS', 'district_heating', 'District heating -- Serbia',         'kWh', 2023, 0.265, 'RS', 'Gas + coal',                             src_national),
  ('dh_RS', 'district_heating', 'District heating -- Serbia',         'kWh', 2024, 0.258, 'RS', 'Gas + coal',                             src_national);

-- Steam
INSERT INTO heat_steam_cooling_factors (factor_id, category, name, unit, year, kg_co2e_per_kwh, country_code, notes, source_id) VALUES
  ('steam_defra',   'steam', 'Purchased steam (DEFRA default)', 'kWh', 2023, 0.17864, NULL, 'UK default -- steam from gas CHP',        src_defra),
  ('steam_defra',   'steam', 'Purchased steam (DEFRA default)', 'kWh', 2024, 0.17820, NULL, 'UK default -- steam from gas CHP',        src_defra),
  ('steam_gas_chp', 'steam', 'Steam from gas CHP',              'kWh', 2023, 0.19300, NULL, 'Allocation by energy content',            src_defra),
  ('steam_gas_chp', 'steam', 'Steam from gas CHP',              'kWh', 2024, 0.19250, NULL, 'Allocation by energy content',            src_defra),
  ('steam_coal_chp','steam', 'Steam from coal CHP',             'kWh', 2023, 0.34000, NULL, 'Coal-fired CHP steam allocation',         src_iea),
  ('steam_coal_chp','steam', 'Steam from coal CHP',             'kWh', 2024, 0.33800, NULL, 'Coal-fired CHP steam allocation',         src_iea);

-- Cooling
INSERT INTO heat_steam_cooling_factors (factor_id, category, name, unit, year, kg_co2e_per_kwh, country_code, notes, source_id) VALUES
  ('cooling_defra',      'cooling', 'Purchased cooling (DEFRA default)',  'kWh',         2023, 0.07180, NULL, 'UK default -- chiller on grid electricity',     src_defra),
  ('cooling_defra',      'cooling', 'Purchased cooling (DEFRA default)',  'kWh',         2024, 0.06960, NULL, 'UK default -- chiller on grid electricity',     src_defra),
  ('cooling_electric',   'cooling', 'Electric chiller (COP 4.0)',        'kWh cooling', 2023, 0.05800, NULL, 'Grid electricity / COP 4.0',                   src_defra),
  ('cooling_electric',   'cooling', 'Electric chiller (COP 4.0)',        'kWh cooling', 2024, 0.05300, NULL, 'Grid electricity / COP 4.0',                   src_defra),
  ('cooling_absorption', 'cooling', 'Absorption chiller (gas-fired)',    'kWh cooling', 2023, 0.29000, NULL, 'Gas-fired absorption COP ~0.7',                src_iea),
  ('cooling_absorption', 'cooling', 'Absorption chiller (gas-fired)',    'kWh cooling', 2024, 0.28900, NULL, 'Gas-fired absorption COP ~0.7',                src_iea),
  ('cooling_district',   'cooling', 'District cooling (average EU)',     'kWh cooling', 2023, 0.08500, NULL, 'Centralised electric + absorption mix',        src_national),
  ('cooling_district',   'cooling', 'District cooling (average EU)',     'kWh cooling', 2024, 0.08000, NULL, 'Centralised electric + absorption mix',        src_national);


-- ---------------------------------------------------------------------------
-- 8. Scope 3 Factors
-- ---------------------------------------------------------------------------

-- Category 1: Purchased Goods & Services
INSERT INTO scope3_factors (factor_id, category_id, category_name, name, unit, year, kg_co2e, tier, source_id) VALUES
  ('s3_c1_paper',            1, 'Purchased Goods & Services', 'Paper / cardboard',        'tonne',            2024, 919,    'starter', src_defra),
  ('s3_c1_paper',            1, 'Purchased Goods & Services', 'Paper / cardboard',        'tonne',            2025, 919,    'starter', src_defra),
  ('s3_c1_plastics',         1, 'Purchased Goods & Services', 'Plastics (average)',        'tonne',            2024, 3120,   'starter', src_defra),
  ('s3_c1_plastics',         1, 'Purchased Goods & Services', 'Plastics (average)',        'tonne',            2025, 3120,   'starter', src_defra),
  ('s3_c1_metals_steel',     1, 'Purchased Goods & Services', 'Steel',                    'tonne',            2024, 1820,   'starter', src_defra),
  ('s3_c1_metals_steel',     1, 'Purchased Goods & Services', 'Steel',                    'tonne',            2025, 1820,   'starter', src_defra),
  ('s3_c1_metals_aluminium', 1, 'Purchased Goods & Services', 'Aluminium',                'tonne',            2024, 9700,   'starter', src_defra),
  ('s3_c1_metals_aluminium', 1, 'Purchased Goods & Services', 'Aluminium',                'tonne',            2025, 9700,   'starter', src_defra),
  ('s3_c1_glass',            1, 'Purchased Goods & Services', 'Glass',                    'tonne',            2024, 840,    'starter', src_defra),
  ('s3_c1_glass',            1, 'Purchased Goods & Services', 'Glass',                    'tonne',            2025, 840,    'starter', src_defra),
  ('s3_c1_textiles',         1, 'Purchased Goods & Services', 'Textiles (clothing)',       'tonne',            2024, 22000,  'starter', src_defra),
  ('s3_c1_textiles',         1, 'Purchased Goods & Services', 'Textiles (clothing)',       'tonne',            2025, 22000,  'starter', src_defra),
  ('s3_c1_electronics',      1, 'Purchased Goods & Services', 'Electronics (average)',     'EUR 1000 spent',   2024, 350,    'starter', src_exiobase),
  ('s3_c1_electronics',      1, 'Purchased Goods & Services', 'Electronics (average)',     'EUR 1000 spent',   2025, 350,    'starter', src_exiobase),
  ('s3_c1_food',             1, 'Purchased Goods & Services', 'Food products (average)',   'EUR 1000 spent',   2024, 680,    'starter', src_exiobase),
  ('s3_c1_food',             1, 'Purchased Goods & Services', 'Food products (average)',   'EUR 1000 spent',   2025, 680,    'starter', src_exiobase),
  ('s3_c1_chemicals',        1, 'Purchased Goods & Services', 'Chemicals',                'tonne',            2024, 2500,   'starter', src_defra),
  ('s3_c1_chemicals',        1, 'Purchased Goods & Services', 'Chemicals',                'tonne',            2025, 2500,   'starter', src_defra),
  ('s3_c1_construction',     1, 'Purchased Goods & Services', 'Construction materials',    'EUR 1000 spent',   2024, 520,    'starter', src_exiobase),
  ('s3_c1_construction',     1, 'Purchased Goods & Services', 'Construction materials',    'EUR 1000 spent',   2025, 520,    'starter', src_exiobase),
  ('s3_c1_it_services',      1, 'Purchased Goods & Services', 'IT services / cloud',      'EUR 1000 spent',   2024, 120,    'starter', src_exiobase),
  ('s3_c1_it_services',      1, 'Purchased Goods & Services', 'IT services / cloud',      'EUR 1000 spent',   2025, 120,    'starter', src_exiobase),
  ('s3_c1_consulting',       1, 'Purchased Goods & Services', 'Professional services',    'EUR 1000 spent',   2024, 85,     'starter', src_exiobase),
  ('s3_c1_consulting',       1, 'Purchased Goods & Services', 'Professional services',    'EUR 1000 spent',   2025, 85,     'starter', src_exiobase),
  ('s3_c1_furniture',        1, 'Purchased Goods & Services', 'Furniture',                'EUR 1000 spent',   2024, 310,    'starter', src_exiobase),
  ('s3_c1_furniture',        1, 'Purchased Goods & Services', 'Furniture',                'EUR 1000 spent',   2025, 310,    'starter', src_exiobase),
  ('s3_c1_water',            1, 'Purchased Goods & Services', 'Water supply',             'm3',               2024, 0.344,  'starter', src_defra),
  ('s3_c1_water',            1, 'Purchased Goods & Services', 'Water supply',             'm3',               2025, 0.344,  'starter', src_defra);

-- Category 2: Capital Goods
INSERT INTO scope3_factors (factor_id, category_id, category_name, name, unit, year, kg_co2e, tier, source_id) VALUES
  ('s3_c2_vehicles',     2, 'Capital Goods', 'Vehicles (average car)',     'unit',           2024, 6000, 'pro', src_defra),
  ('s3_c2_vehicles',     2, 'Capital Goods', 'Vehicles (average car)',     'unit',           2025, 6000, 'pro', src_defra),
  ('s3_c2_machinery',    2, 'Capital Goods', 'Machinery / equipment',     'EUR 1000 spent', 2024, 450,  'pro', src_exiobase),
  ('s3_c2_machinery',    2, 'Capital Goods', 'Machinery / equipment',     'EUR 1000 spent', 2025, 450,  'pro', src_exiobase),
  ('s3_c2_buildings',    2, 'Capital Goods', 'Buildings / renovations',   'EUR 1000 spent', 2024, 600,  'pro', src_exiobase),
  ('s3_c2_buildings',    2, 'Capital Goods', 'Buildings / renovations',   'EUR 1000 spent', 2025, 600,  'pro', src_exiobase),
  ('s3_c2_it_equipment', 2, 'Capital Goods', 'IT equipment (computers)',  'unit',           2024, 350,  'pro', src_defra),
  ('s3_c2_it_equipment', 2, 'Capital Goods', 'IT equipment (computers)',  'unit',           2025, 350,  'pro', src_defra);

-- Category 3: Fuel- & Energy-Related (not in Scope 1/2)
INSERT INTO scope3_factors (factor_id, category_id, category_name, name, unit, year, kg_co2e, tier, source_id) VALUES
  ('s3_c3_elec_td',   3, 'Fuel- & Energy-Related (not in Scope 1/2)', 'Electricity T&D losses', 'kWh',   2024, 0.01769, 'pro', src_defra),
  ('s3_c3_elec_td',   3, 'Fuel- & Energy-Related (not in Scope 1/2)', 'Electricity T&D losses', 'kWh',   2025, 0.01769, 'pro', src_defra),
  ('s3_c3_wtt_gas',   3, 'Fuel- & Energy-Related (not in Scope 1/2)', 'WTT natural gas',        'kWh',   2024, 0.02368, 'pro', src_defra),
  ('s3_c3_wtt_gas',   3, 'Fuel- & Energy-Related (not in Scope 1/2)', 'WTT natural gas',        'kWh',   2025, 0.02368, 'pro', src_defra),
  ('s3_c3_wtt_diesel',3, 'Fuel- & Energy-Related (not in Scope 1/2)', 'WTT diesel',             'litre', 2024, 0.60986, 'pro', src_defra),
  ('s3_c3_wtt_diesel',3, 'Fuel- & Energy-Related (not in Scope 1/2)', 'WTT diesel',             'litre', 2025, 0.60986, 'pro', src_defra),
  ('s3_c3_wtt_petrol',3, 'Fuel- & Energy-Related (not in Scope 1/2)', 'WTT petrol',             'litre', 2024, 0.53063, 'pro', src_defra),
  ('s3_c3_wtt_petrol',3, 'Fuel- & Energy-Related (not in Scope 1/2)', 'WTT petrol',             'litre', 2025, 0.53063, 'pro', src_defra);

-- Category 4: Upstream Transportation & Distribution
INSERT INTO scope3_factors (factor_id, category_id, category_name, name, unit, year, kg_co2e, tier, source_id) VALUES
  ('s3_c4_road_hgv',      4, 'Upstream Transportation & Distribution', 'Road freight (HGV avg)',      'tonne-km', 2024, 0.10415, 'pro', src_defra),
  ('s3_c4_road_hgv',      4, 'Upstream Transportation & Distribution', 'Road freight (HGV avg)',      'tonne-km', 2025, 0.10415, 'pro', src_defra),
  ('s3_c4_rail_freight',   4, 'Upstream Transportation & Distribution', 'Rail freight',                'tonne-km', 2024, 0.02728, 'pro', src_defra),
  ('s3_c4_rail_freight',   4, 'Upstream Transportation & Distribution', 'Rail freight',                'tonne-km', 2025, 0.02728, 'pro', src_defra),
  ('s3_c4_sea_container',  4, 'Upstream Transportation & Distribution', 'Sea freight (container)',     'tonne-km', 2024, 0.01613, 'pro', src_defra),
  ('s3_c4_sea_container',  4, 'Upstream Transportation & Distribution', 'Sea freight (container)',     'tonne-km', 2025, 0.01613, 'pro', src_defra),
  ('s3_c4_air_freight',    4, 'Upstream Transportation & Distribution', 'Air freight (long-haul)',     'tonne-km', 2024, 0.60181, 'pro', src_defra),
  ('s3_c4_air_freight',    4, 'Upstream Transportation & Distribution', 'Air freight (long-haul)',     'tonne-km', 2025, 0.60181, 'pro', src_defra);

-- Category 5: Waste Generated in Operations
INSERT INTO scope3_factors (factor_id, category_id, category_name, name, unit, year, kg_co2e, tier, source_id) VALUES
  ('s3_c5_landfill_mixed', 5, 'Waste Generated in Operations', 'Mixed waste (landfill)', 'tonne', 2024, 467,  'pro', src_defra),
  ('s3_c5_landfill_mixed', 5, 'Waste Generated in Operations', 'Mixed waste (landfill)', 'tonne', 2025, 467,  'pro', src_defra),
  ('s3_c5_recycle_mixed',  5, 'Waste Generated in Operations', 'Mixed recycling',        'tonne', 2024, 21.3, 'pro', src_defra),
  ('s3_c5_recycle_mixed',  5, 'Waste Generated in Operations', 'Mixed recycling',        'tonne', 2025, 21.3, 'pro', src_defra),
  ('s3_c5_incineration',   5, 'Waste Generated in Operations', 'Incineration',           'tonne', 2024, 21.4, 'pro', src_defra),
  ('s3_c5_incineration',   5, 'Waste Generated in Operations', 'Incineration',           'tonne', 2025, 21.4, 'pro', src_defra),
  ('s3_c5_compost',        5, 'Waste Generated in Operations', 'Composting',             'tonne', 2024, 10.2, 'pro', src_defra),
  ('s3_c5_compost',        5, 'Waste Generated in Operations', 'Composting',             'tonne', 2025, 10.2, 'pro', src_defra);

-- Category 6: Business Travel
INSERT INTO scope3_factors (factor_id, category_id, category_name, name, unit, year, kg_co2e, tier, source_id) VALUES
  ('s3_c6_taxi',          6, 'Business Travel', 'Taxi (average)',                    'km',         2024, 0.20869, 'starter', src_defra),
  ('s3_c6_taxi',          6, 'Business Travel', 'Taxi (average)',                    'km',         2025, 0.20869, 'starter', src_defra),
  ('s3_c6_bus',           6, 'Business Travel', 'Bus (local, average)',              'km',         2024, 0.10312, 'starter', src_defra),
  ('s3_c6_bus',           6, 'Business Travel', 'Bus (local, average)',              'km',         2025, 0.10312, 'starter', src_defra),
  ('s3_c6_rail_national', 6, 'Business Travel', 'National rail',                    'km',         2024, 0.03549, 'starter', src_defra),
  ('s3_c6_rail_national', 6, 'Business Travel', 'National rail',                    'km',         2025, 0.03549, 'starter', src_defra),
  ('s3_c6_rail_intl',     6, 'Business Travel', 'International rail (Eurostar)',    'km',         2024, 0.00446, 'starter', src_defra),
  ('s3_c6_rail_intl',     6, 'Business Travel', 'International rail (Eurostar)',    'km',         2025, 0.00446, 'starter', src_defra),
  ('s3_c6_hotel_night',   6, 'Business Travel', 'Hotel stay (average)',             'room-night', 2024, 16.5,    'starter', src_defra),
  ('s3_c6_hotel_night',   6, 'Business Travel', 'Hotel stay (average)',             'room-night', 2025, 16.5,    'starter', src_defra);

-- Category 7: Employee Commuting
INSERT INTO scope3_factors (factor_id, category_id, category_name, name, unit, year, kg_co2e, tier, source_id) VALUES
  ('s3_c7_car_avg', 7, 'Employee Commuting', 'Car (average, single occupant)', 'km',  2024, 0.16725, 'starter', src_defra),
  ('s3_c7_car_avg', 7, 'Employee Commuting', 'Car (average, single occupant)', 'km',  2025, 0.16725, 'starter', src_defra),
  ('s3_c7_bus',     7, 'Employee Commuting', 'Bus',                            'km',  2024, 0.10312, 'starter', src_defra),
  ('s3_c7_bus',     7, 'Employee Commuting', 'Bus',                            'km',  2025, 0.10312, 'starter', src_defra),
  ('s3_c7_metro',   7, 'Employee Commuting', 'Metro / tram',                   'km',  2024, 0.02781, 'starter', src_defra),
  ('s3_c7_metro',   7, 'Employee Commuting', 'Metro / tram',                   'km',  2025, 0.02781, 'starter', src_defra),
  ('s3_c7_bicycle', 7, 'Employee Commuting', 'Bicycle / walking',              'km',  2024, 0,       'starter', src_defra),
  ('s3_c7_bicycle', 7, 'Employee Commuting', 'Bicycle / walking',              'km',  2025, 0,       'starter', src_defra),
  ('s3_c7_ebike',   7, 'Employee Commuting', 'E-bike / e-scooter',             'km',  2024, 0.00583, 'starter', src_defra),
  ('s3_c7_ebike',   7, 'Employee Commuting', 'E-bike / e-scooter',             'km',  2025, 0.00583, 'starter', src_defra),
  ('s3_c7_wfh',     7, 'Employee Commuting', 'Work from home',                 'day', 2024, 1.26,    'starter', src_ecoact),
  ('s3_c7_wfh',     7, 'Employee Commuting', 'Work from home',                 'day', 2025, 1.26,    'starter', src_ecoact);

-- Category 8: Upstream Leased Assets
INSERT INTO scope3_factors (factor_id, category_id, category_name, name, unit, year, kg_co2e, tier, source_id) VALUES
  ('s3_c8_office_sqm', 8, 'Upstream Leased Assets', 'Leased office space', 'm2/year', 2024, 50, 'pro', src_defra),
  ('s3_c8_office_sqm', 8, 'Upstream Leased Assets', 'Leased office space', 'm2/year', 2025, 50, 'pro', src_defra);

-- Category 9: Downstream Transportation & Distribution
INSERT INTO scope3_factors (factor_id, category_id, category_name, name, unit, year, kg_co2e, tier, source_id) VALUES
  ('s3_c9_road',      9, 'Downstream Transportation & Distribution', 'Road delivery (avg)',        'tonne-km', 2024, 0.10415, 'pro', src_defra),
  ('s3_c9_road',      9, 'Downstream Transportation & Distribution', 'Road delivery (avg)',        'tonne-km', 2025, 0.10415, 'pro', src_defra),
  ('s3_c9_last_mile', 9, 'Downstream Transportation & Distribution', 'Last-mile delivery (van)',   'parcel',   2024, 0.55,    'pro', src_defra),
  ('s3_c9_last_mile', 9, 'Downstream Transportation & Distribution', 'Last-mile delivery (van)',   'parcel',   2025, 0.55,    'pro', src_defra);

-- Category 11: Use of Sold Products
INSERT INTO scope3_factors (factor_id, category_id, category_name, name, unit, year, kg_co2e, tier, source_id) VALUES
  ('s3_c11_elec_product', 11, 'Use of Sold Products', 'Electricity-consuming product', 'kWh (lifetime)',   2024, 0.233, 'starter', src_aib),
  ('s3_c11_elec_product', 11, 'Use of Sold Products', 'Electricity-consuming product', 'kWh (lifetime)',   2025, 0.233, 'starter', src_aib),
  ('s3_c11_fuel_product', 11, 'Use of Sold Products', 'Fuel-consuming product',        'litre (lifetime)', 2024, 2.54,  'starter', src_defra),
  ('s3_c11_fuel_product', 11, 'Use of Sold Products', 'Fuel-consuming product',        'litre (lifetime)', 2025, 2.54,  'starter', src_defra);

-- Category 12: End-of-Life Treatment of Sold Products
INSERT INTO scope3_factors (factor_id, category_id, category_name, name, unit, year, kg_co2e, tier, source_id) VALUES
  ('s3_c12_landfill', 12, 'End-of-Life Treatment of Sold Products', 'Landfill disposal', 'tonne', 2024, 467,  'pro', src_defra),
  ('s3_c12_landfill', 12, 'End-of-Life Treatment of Sold Products', 'Landfill disposal', 'tonne', 2025, 467,  'pro', src_defra),
  ('s3_c12_recycle',  12, 'End-of-Life Treatment of Sold Products', 'Recycling',         'tonne', 2024, 21.3, 'pro', src_defra),
  ('s3_c12_recycle',  12, 'End-of-Life Treatment of Sold Products', 'Recycling',         'tonne', 2025, 21.3, 'pro', src_defra);

-- Categories 10, 13, 14, 15 have no factors in the TypeScript source (empty factors arrays)
-- They are defined as categories but contain no emission factor data to seed.

END $$;
