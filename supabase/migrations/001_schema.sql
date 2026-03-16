-- =============================================================================
-- HOSMOS ESG SaaS — Database Schema
-- =============================================================================

-- ─── 1. Companies ────────────────────────────────────────────────────────────
CREATE TABLE companies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  industry      TEXT,
  nace_code     TEXT,
  country       TEXT,
  country_code  CHAR(2),
  headcount     INT DEFAULT 0,
  plan          TEXT CHECK (plan IN ('trial','starter','pro','enterprise')) DEFAULT 'trial',
  plan_start    DATE,
  reporting_year TEXT DEFAULT '2024',
  currency      CHAR(3) DEFAULT 'EUR',
  logo_url      TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ─── 2. Profiles (linked to Supabase Auth) ───────────────────────────────────
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT,
  role          TEXT CHECK (role IN ('owner','admin','editor','viewer')) DEFAULT 'owner',
  company_id    UUID REFERENCES companies(id) ON DELETE SET NULL,
  locale        TEXT DEFAULT 'en',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ─── 3. Emission Factor Sources (audit trail) ────────────────────────────────
CREATE TABLE emission_factor_sources (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  authority     TEXT NOT NULL,
  publication   TEXT,
  version_year  INT,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ─── 4. Stationary Fuel Factors ──────────────────────────────────────────────
CREATE TABLE stationary_fuel_factors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factor_id     TEXT NOT NULL,
  name          TEXT NOT NULL,
  unit          TEXT NOT NULL,
  year          TEXT NOT NULL,
  kg_co2e       NUMERIC NOT NULL,
  source_id     UUID REFERENCES emission_factor_sources(id),
  UNIQUE(factor_id, year)
);

-- ─── 5. Vehicle Factors ──────────────────────────────────────────────────────
CREATE TABLE vehicle_factors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factor_id     TEXT NOT NULL,
  category      TEXT NOT NULL,
  type          TEXT NOT NULL,
  fuel          TEXT NOT NULL,
  unit          TEXT DEFAULT 'kgCO2e/km',
  year          TEXT NOT NULL,
  kg_co2e_per_km NUMERIC NOT NULL,
  source_id     UUID REFERENCES emission_factor_sources(id),
  UNIQUE(factor_id, year)
);

-- ─── 6. Flight Factors ───────────────────────────────────────────────────────
CREATE TABLE flight_factors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factor_id     TEXT NOT NULL,
  flight_type   TEXT NOT NULL,
  cabin_class   TEXT NOT NULL,
  year          TEXT NOT NULL,
  kg_co2e_with_rf    NUMERIC NOT NULL,
  kg_co2e_without_rf NUMERIC NOT NULL,
  source_id     UUID REFERENCES emission_factor_sources(id),
  UNIQUE(factor_id, year)
);

-- ─── 7. Refrigerant Factors ──────────────────────────────────────────────────
CREATE TABLE refrigerant_factors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factor_id     TEXT NOT NULL,
  name          TEXT NOT NULL,
  gwp_100       NUMERIC NOT NULL,
  kg_co2e_per_kg NUMERIC NOT NULL,
  common_use    TEXT,
  source_id     UUID REFERENCES emission_factor_sources(id),
  UNIQUE(factor_id)
);

-- ─── 8. Grid Electricity Factors ─────────────────────────────────────────────
CREATE TABLE grid_electricity_factors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code  CHAR(2) NOT NULL,
  country_name  TEXT NOT NULL,
  year          TEXT NOT NULL,
  location_kwh  NUMERIC NOT NULL,  -- kgCO2e/kWh (location-based)
  market_kwh    NUMERIC NOT NULL,  -- kgCO2e/kWh (market-based / residual mix)
  source_id     UUID REFERENCES emission_factor_sources(id),
  UNIQUE(country_code, year)
);

-- ─── 9. Heat, Steam & Cooling Factors ────────────────────────────────────────
CREATE TABLE heat_steam_cooling_factors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factor_id     TEXT NOT NULL,
  category      TEXT NOT NULL CHECK (category IN ('district_heating','steam','cooling')),
  name          TEXT NOT NULL,
  unit          TEXT NOT NULL,
  year          TEXT NOT NULL,
  kg_co2e_per_kwh NUMERIC NOT NULL,
  country_code  CHAR(2),
  notes         TEXT,
  source_id     UUID REFERENCES emission_factor_sources(id),
  UNIQUE(factor_id, year)
);

-- ─── 10. Scope 3 Factors ─────────────────────────────────────────────────────
CREATE TABLE scope3_factors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factor_id     TEXT NOT NULL,
  category_id   INT NOT NULL,
  category_name TEXT NOT NULL,
  name          TEXT NOT NULL,
  unit          TEXT NOT NULL,
  year          TEXT NOT NULL,
  kg_co2e       NUMERIC NOT NULL,
  tier          TEXT CHECK (tier IN ('starter','pro')) DEFAULT 'starter',
  source_id     UUID REFERENCES emission_factor_sources(id),
  UNIQUE(factor_id, year)
);

-- ─── 11. Monthly Emissions Data (per company) ────────────────────────────────
CREATE TABLE monthly_emissions_data (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  year          TEXT NOT NULL,
  month         INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  -- Scope 1 Stationary
  natural_gas_m3     NUMERIC DEFAULT 0,
  diesel_litres      NUMERIC DEFAULT 0,
  petrol_litres      NUMERIC DEFAULT 0,
  lpg_litres         NUMERIC DEFAULT 0,
  fuel_oil_litres    NUMERIC DEFAULT 0,
  -- Scope 1 Fleet
  fleet_diesel_km    NUMERIC DEFAULT 0,
  fleet_petrol_km    NUMERIC DEFAULT 0,
  fleet_ev_km        NUMERIC DEFAULT 0,
  -- Scope 2
  electricity_kwh    NUMERIC DEFAULT 0,
  district_heating_kwh NUMERIC DEFAULT 0,
  steam_kg           NUMERIC DEFAULT 0,
  cooling_kwh        NUMERIC DEFAULT 0,
  -- Scope 3 basic
  short_flights_pkm  NUMERIC DEFAULT 0,
  long_flights_pkm   NUMERIC DEFAULT 0,
  commute_car_km     NUMERIC DEFAULT 0,
  commute_bus_km     NUMERIC DEFAULT 0,
  commute_train_km   NUMERIC DEFAULT 0,
  -- Metadata
  status        TEXT DEFAULT 'draft' CHECK (status IN ('draft','submitted','verified')),
  updated_by    UUID REFERENCES profiles(id),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, year, month)
);

-- ─── 12. People Data ─────────────────────────────────────────────────────────
CREATE TABLE people_data (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  year          TEXT NOT NULL,
  headcount     INT,
  fte           NUMERIC,
  female_ratio  NUMERIC,
  mgmt_female_ratio NUMERIC,
  board_female_ratio NUMERIC,
  training_hours NUMERIC,
  turnover_rate NUMERIC,
  accident_rate NUMERIC,
  fatalities    INT DEFAULT 0,
  sick_days     NUMERIC,
  gender_pay_gap NUMERIC,
  enps          INT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, year)
);

-- ─── 13. Emission Results (cached calculations) ──────────────────────────────
CREATE TABLE emission_results (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  year          TEXT NOT NULL,
  scope1_stationary  NUMERIC DEFAULT 0,
  scope1_fleet       NUMERIC DEFAULT 0,
  scope1_total       NUMERIC DEFAULT 0,
  scope2_location    NUMERIC DEFAULT 0,
  scope2_market      NUMERIC DEFAULT 0,
  scope2_total       NUMERIC DEFAULT 0,
  scope3_total       NUMERIC DEFAULT 0,
  total_tco2e        NUMERIC DEFAULT 0,
  per_employee       NUMERIC DEFAULT 0,
  esg_score          INT DEFAULT 0,
  calculated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, year)
);

-- ─── Row-Level Security ──────────────────────────────────────────────────────

-- Emission factor tables: readable by all authenticated users
ALTER TABLE emission_factor_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_sources" ON emission_factor_sources FOR SELECT USING (true);

ALTER TABLE stationary_fuel_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_fuels" ON stationary_fuel_factors FOR SELECT USING (true);

ALTER TABLE vehicle_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_vehicles" ON vehicle_factors FOR SELECT USING (true);

ALTER TABLE flight_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_flights" ON flight_factors FOR SELECT USING (true);

ALTER TABLE refrigerant_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_refrigerants" ON refrigerant_factors FOR SELECT USING (true);

ALTER TABLE grid_electricity_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_grid" ON grid_electricity_factors FOR SELECT USING (true);

ALTER TABLE heat_steam_cooling_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_heat" ON heat_steam_cooling_factors FOR SELECT USING (true);

ALTER TABLE scope3_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_scope3" ON scope3_factors FOR SELECT USING (true);

-- Company-scoped tables: users can only access their own company's data
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_company" ON companies FOR ALL
  USING (id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_profile" ON profiles FOR ALL
  USING (id = auth.uid());

ALTER TABLE monthly_emissions_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_monthly" ON monthly_emissions_data FOR ALL
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

ALTER TABLE people_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_people" ON people_data FOR ALL
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

ALTER TABLE emission_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_results" ON emission_results FOR ALL
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- ─── Auto-create profile on signup ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Updated_at trigger ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_companies_updated BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_monthly_updated BEFORE UPDATE ON monthly_emissions_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_people_updated BEFORE UPDATE ON people_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
