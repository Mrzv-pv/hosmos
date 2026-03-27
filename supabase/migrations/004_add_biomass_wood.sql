-- Add biomass wood column to monthly_emissions_data
-- Beech wood used for smoking in meat processing (Scope 1 stationary combustion)
-- Per GHG Protocol: biogenic CO₂ reported "outside of scopes"; only CH₄+N₂O in Scope 1
ALTER TABLE monthly_emissions_data ADD COLUMN IF NOT EXISTS biomass_wood_kg NUMERIC DEFAULT 0;
