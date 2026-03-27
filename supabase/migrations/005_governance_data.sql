-- Add governance_data JSONB column to companies
ALTER TABLE companies ADD COLUMN IF NOT EXISTS governance_data JSONB DEFAULT '{}';

COMMENT ON COLUMN companies.governance_data IS 'Stores governance checklist state: { "Board composition documented": true, ... }';
