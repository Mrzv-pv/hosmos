// =============================================================================
// HOSMOS — Automatic Data Collection Architecture
// =============================================================================
//
// Two main data ingestion paths:
//
// 1. ACCOUNTING INTEGRATION (ERP / Bookkeeping sync)
//    - Direct API connections to accounting systems
//    - Automatic extraction of fuel, energy, travel expenses
//    - Scheduled sync (daily/weekly)
//
// 2. DOCUMENT SCANNING (PDF / image invoice upload)
//    - OCR + AI extraction of invoice line items
//    - Auto-classification into emission categories
//    - Human review + approval workflow
//
// =============================================================================

// ---------------------------------------------------------------------------
// 1. Accounting System Integration
// ---------------------------------------------------------------------------

/**
 * SUPPORTED ACCOUNTING SYSTEMS & TECHNOLOGY:
 *
 * Tier 1 — Direct API (OAuth 2.0):
 *   - Xero           → xero-node SDK, OAuth 2.0
 *   - QuickBooks     → intuit-oauth, REST API
 *   - FreeAgent      → OAuth 2.0 REST
 *   - Sage           → Sage Business Cloud API
 *
 * Tier 2 — File Import (CSV/Excel):
 *   - SAP Business One → CSV export of GL accounts
 *   - 1C:Enterprise    → XML/CSV exchange format
 *   - Odoo            → JSON-RPC API or CSV
 *   - DATEV           → CSV/ASCII export (German market)
 *   - e-Računi (SI)   → UBL XML invoices
 *
 * Tier 3 — Banking / Fintech:
 *   - Open Banking API (PSD2) → via Plaid, GoCardless, Salt Edge
 *   - Categorize transactions by merchant → emission mapping
 *
 * TECHNOLOGY STACK:
 *   - Integration layer: Merge.dev Accounting API (unified API for 30+ systems)
 *     OR build custom connectors per system
 *   - Queue: BullMQ (Redis) for async sync jobs
 *   - Storage: PostgreSQL + Supabase Storage for raw files
 */

export interface AccountingConnection {
  id: string;
  provider: AccountingProvider;
  status: "connected" | "disconnected" | "syncing" | "error";
  lastSyncAt: string | null;
  syncFrequency: "daily" | "weekly" | "monthly" | "manual";
  credentials: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: string;
  };
  mapping: AccountMapping;
}

export type AccountingProvider =
  | "xero"
  | "quickbooks"
  | "sage"
  | "freeagent"
  | "odoo"
  | "sap_b1"
  | "1c_enterprise"
  | "datev"
  | "csv_import"
  | "open_banking";

export interface AccountMapping {
  /** GL account codes that map to fuel purchases */
  fuelAccounts: string[];
  /** GL account codes for electricity bills */
  electricityAccounts: string[];
  /** GL account codes for gas bills */
  gasAccounts: string[];
  /** GL account codes for travel expenses */
  travelAccounts: string[];
  /** GL account codes for fleet/vehicle expenses */
  fleetAccounts: string[];
  /** GL account codes for waste management */
  wasteAccounts: string[];
  /** GL account codes for purchased goods (Scope 3) */
  purchaseAccounts: string[];
}

/**
 * Transaction extracted from accounting system.
 * Each transaction is classified into an emission category.
 */
export interface AccountingTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  accountCode: string;
  accountName: string;
  supplierName?: string;
  /** Auto-classified emission category */
  emissionCategory: EmissionCategory | null;
  /** Extracted quantity (litres, kWh, km, etc.) */
  quantity?: number;
  unit?: string;
  /** Confidence of auto-classification (0-1) */
  confidence: number;
  /** User has verified this classification */
  verified: boolean;
}

export type EmissionCategory =
  | "electricity"
  | "natural_gas"
  | "diesel"
  | "petrol"
  | "lpg"
  | "fuel_oil"
  | "fleet_fuel"
  | "flight"
  | "rail_travel"
  | "hotel"
  | "taxi"
  | "waste_disposal"
  | "water"
  | "purchased_goods"
  | "it_services"
  | "unknown";

// ---------------------------------------------------------------------------
// 2. PDF / Invoice Scanning (OCR + AI)
// ---------------------------------------------------------------------------

/**
 * TECHNOLOGY FOR PDF/INVOICE PROCESSING:
 *
 * Option A — Cloud AI OCR (recommended for MVP):
 *   - Google Document AI (Form Parser + Invoice Parser)
 *     → Pre-trained for invoices, receipts, utility bills
 *     → Extracts: supplier, date, line items, amounts, quantities
 *     → Price: $0.01-0.065 per page
 *
 * Option B — Azure AI Document Intelligence:
 *   - Pre-built invoice model
 *   - Custom models for utility bills (electricity, gas)
 *   - Price: $0.01-0.05 per page
 *
 * Option C — Open Source:
 *   - Tesseract OCR + LLM (Claude/GPT) for extraction
 *   - pdf.js for PDF parsing
 *   - Slower but no per-page cost
 *
 * RECOMMENDED APPROACH (Hybrid):
 *   1. Upload PDF → Supabase Storage
 *   2. Run Google Document AI / Azure for OCR
 *   3. Send structured text to Claude API for:
 *      - Identify document type (electricity bill, fuel receipt, etc.)
 *      - Extract quantities (kWh, litres, m³)
 *      - Map to emission factor
 *   4. Present to user for review
 *   5. Auto-fill emission calculator
 *
 * DOCUMENT TYPES TO HANDLE:
 *   - Electricity bills  → extract kWh consumed, supplier
 *   - Gas bills          → extract m³ or kWh, supplier
 *   - Fuel receipts      → extract litres, fuel type
 *   - Fleet fuel cards   → extract litres per vehicle
 *   - Travel invoices    → extract flights, hotels, rail
 *   - Waste invoices     → extract tonnes, waste type
 *   - Water bills        → extract m³
 *   - Purchase invoices  → extract amount for spend-based Scope 3
 */

export interface DocumentUpload {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: "application/pdf" | "image/jpeg" | "image/png";
  uploadedAt: string;
  status: DocumentStatus;
  processingResult?: DocumentResult;
}

export type DocumentStatus =
  | "uploaded"
  | "processing"
  | "extracted"
  | "review"
  | "approved"
  | "rejected"
  | "error";

export interface DocumentResult {
  /** Detected document type */
  documentType: DocumentType;
  /** Confidence of detection */
  confidence: number;
  /** Supplier / vendor name */
  supplierName: string;
  /** Invoice date */
  invoiceDate: string;
  /** Invoice number */
  invoiceNumber?: string;
  /** Total amount */
  totalAmount: number;
  currency: string;
  /** Extracted emission-relevant line items */
  lineItems: ExtractedLineItem[];
  /** Raw OCR text (for debugging) */
  rawText?: string;
}

export type DocumentType =
  | "electricity_bill"
  | "gas_bill"
  | "fuel_receipt"
  | "fleet_fuel_card"
  | "travel_invoice"
  | "waste_invoice"
  | "water_bill"
  | "purchase_invoice"
  | "unknown";

export interface ExtractedLineItem {
  description: string;
  quantity: number;
  unit: string;           // kWh, litres, m³, tonne, km, nights
  unitPrice?: number;
  totalPrice: number;
  /** Mapped emission category */
  emissionCategory: EmissionCategory;
  /** Mapped emission factor ID from our database */
  emissionFactorId?: string;
  /** Calculated emissions (kgCO2e) */
  calculatedEmissions?: number;
  /** AI confidence (0-1) */
  confidence: number;
}

// ---------------------------------------------------------------------------
// 3. Processing Pipeline
// ---------------------------------------------------------------------------

/**
 * FULL PIPELINE ARCHITECTURE:
 *
 * ┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
 * │  Upload PDF     │────▶│  OCR Engine  │────▶│  AI Extract  │
 * │  (Supabase)     │     │  (Doc AI)    │     │  (Claude API)│
 * └─────────────────┘     └──────────────┘     └──────┬───────┘
 *                                                      │
 * ┌─────────────────┐     ┌──────────────┐     ┌──────▼───────┐
 * │  Auto-fill      │◀────│  User Review │◀────│  Match to    │
 * │  Calculator     │     │  & Approve   │     │  EF Database │
 * └─────────────────┘     └──────────────┘     └──────────────┘
 *
 * ┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
 * │  Accounting API │────▶│  Classify    │────▶│  Queue for   │
 * │  (Merge/Xero)   │     │  Transactions│     │  Review      │
 * └─────────────────┘     └──────────────┘     └──────────────┘
 *
 * QUEUE SYSTEM:
 *   - BullMQ with Redis
 *   - Jobs: ocr-process, ai-extract, accounting-sync
 *   - Retry: 3 attempts with exponential backoff
 *   - Webhook on completion → notify user
 *
 * AI EXTRACTION PROMPT (for Claude API):
 *   System: "You are an ESG data extraction assistant.
 *   Given OCR text from a utility bill or invoice, extract:
 *   1. Document type (electricity, gas, fuel, etc.)
 *   2. Supplier name
 *   3. Billing period
 *   4. Consumption quantities with units (kWh, m³, litres)
 *   5. Total amount
 *   Return as structured JSON."
 */

export interface ProcessingJob {
  id: string;
  type: "ocr_extract" | "accounting_sync" | "ai_classify";
  status: "queued" | "processing" | "completed" | "failed";
  input: {
    documentId?: string;
    connectionId?: string;
  };
  result?: DocumentResult | AccountingTransaction[];
  attempts: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// 4. Keyword / Pattern Matching for Auto-Classification
// ---------------------------------------------------------------------------

/**
 * Rules for auto-classifying accounting transactions and invoice text.
 * Used before AI as a fast first-pass classifier.
 */
export const CLASSIFICATION_RULES: {
  category: EmissionCategory;
  keywords: string[];
  accountPatterns: string[];
}[] = [
  {
    category: "electricity",
    keywords: ["electricity", "electric", "power", "kwh", "elektrika", "električna", "strom", "électricité"],
    accountPatterns: ["6010", "6011", "502*"],
  },
  {
    category: "natural_gas",
    keywords: ["natural gas", "gas supply", "plin", "zemeljski plin", "erdgas", "gaz naturel", "metano"],
    accountPatterns: ["6012", "6013", "503*"],
  },
  {
    category: "diesel",
    keywords: ["diesel", "gasoil", "gas oil", "dizel", "nafta", "gazole"],
    accountPatterns: ["6020", "6021"],
  },
  {
    category: "petrol",
    keywords: ["petrol", "gasoline", "benzin", "essence", "бензин"],
    accountPatterns: ["6020", "6022"],
  },
  {
    category: "fleet_fuel",
    keywords: ["fleet card", "fuel card", "shell card", "omv", "petrol card", "gorivo"],
    accountPatterns: ["6030", "6031"],
  },
  {
    category: "flight",
    keywords: ["flight", "airline", "air ticket", "boarding pass", "letalska", "flug"],
    accountPatterns: ["6200", "6210"],
  },
  {
    category: "hotel",
    keywords: ["hotel", "accommodation", "booking.com", "prenočitev", "unterkunft"],
    accountPatterns: ["6220", "6221"],
  },
  {
    category: "rail_travel",
    keywords: ["train", "railway", "rail ticket", "sbb", "öbb", "sncf", "vlak", "bahn"],
    accountPatterns: ["6200", "6215"],
  },
  {
    category: "taxi",
    keywords: ["taxi", "uber", "bolt", "lyft", "taksi"],
    accountPatterns: ["6200", "6225"],
  },
  {
    category: "waste_disposal",
    keywords: ["waste", "disposal", "recycling", "odpadki", "müll", "déchets"],
    accountPatterns: ["6040", "6041"],
  },
  {
    category: "water",
    keywords: ["water supply", "vodovod", "wasser", "eau", "acqua"],
    accountPatterns: ["6014", "6015"],
  },
  {
    category: "purchased_goods",
    keywords: ["material", "supplies", "raw material", "components", "surovine"],
    accountPatterns: ["400*", "401*", "500*"],
  },
  {
    category: "it_services",
    keywords: ["cloud", "hosting", "saas", "software", "aws", "azure", "google cloud"],
    accountPatterns: ["6100", "6110"],
  },
];

/**
 * Auto-classify a transaction description using keyword matching.
 * Returns the best-matching category and confidence.
 */
export function classifyTransaction(
  description: string,
  accountCode?: string
): { category: EmissionCategory; confidence: number } {
  const desc = description.toLowerCase();

  for (const rule of CLASSIFICATION_RULES) {
    // Check keywords
    const keywordMatch = rule.keywords.some(kw => desc.includes(kw));
    // Check account code patterns
    const accountMatch = accountCode
      ? rule.accountPatterns.some(pat => {
          if (pat.endsWith("*")) return accountCode.startsWith(pat.slice(0, -1));
          return accountCode === pat;
        })
      : false;

    if (keywordMatch && accountMatch) return { category: rule.category, confidence: 0.95 };
    if (keywordMatch) return { category: rule.category, confidence: 0.75 };
    if (accountMatch) return { category: rule.category, confidence: 0.60 };
  }

  return { category: "unknown", confidence: 0 };
}

/**
 * Map classified category to emission factor ID for auto-calculation.
 */
export function mapCategoryToFactor(
  category: EmissionCategory,
  quantity: number,
  _unit: string
): { factorId: string; kgCO2e: number } | null {
  const factorMap: Record<string, { factorId: string; perUnit: number }> = {
    electricity: { factorId: "grid_factor", perUnit: 0.212 },       // Slovenia default, override per country
    natural_gas: { factorId: "natural_gas_kwh_gross", perUnit: 0.18290 },
    diesel: { factorId: "diesel_biofuel_litre", perUnit: 2.51279 },
    petrol: { factorId: "petrol_biofuel_litre", perUnit: 2.08390 },
    lpg: { factorId: "lpg_litre", perUnit: 1.55750 },
    fuel_oil: { factorId: "fuel_oil_litre", perUnit: 3.17550 },
    fleet_fuel: { factorId: "diesel_biofuel_litre", perUnit: 2.51279 },
    water: { factorId: "s3_c1_water", perUnit: 0.344 },
  };

  const mapping = factorMap[category];
  if (!mapping) return null;

  return {
    factorId: mapping.factorId,
    kgCO2e: quantity * mapping.perUnit,
  };
}

// ---------------------------------------------------------------------------
// 5. Integration Settings UI Data
// ---------------------------------------------------------------------------

export const AVAILABLE_INTEGRATIONS = [
  {
    id: "xero",
    name: "Xero",
    logo: "/integrations/xero.svg",
    type: "api" as const,
    description: "Cloud accounting for small business",
    regions: ["EU", "UK", "Global"],
    tier: "starter" as const,
  },
  {
    id: "quickbooks",
    name: "QuickBooks Online",
    logo: "/integrations/qb.svg",
    type: "api" as const,
    description: "Intuit's cloud accounting",
    regions: ["EU", "UK", "US", "Global"],
    tier: "starter" as const,
  },
  {
    id: "sage",
    name: "Sage Business Cloud",
    logo: "/integrations/sage.svg",
    type: "api" as const,
    description: "Accounting and payroll",
    regions: ["EU", "UK"],
    tier: "pro" as const,
  },
  {
    id: "odoo",
    name: "Odoo",
    logo: "/integrations/odoo.svg",
    type: "api" as const,
    description: "Open-source ERP",
    regions: ["Global"],
    tier: "pro" as const,
  },
  {
    id: "datev",
    name: "DATEV",
    logo: "/integrations/datev.svg",
    type: "csv" as const,
    description: "German tax & accounting",
    regions: ["DE", "AT", "CH"],
    tier: "pro" as const,
  },
  {
    id: "sap_b1",
    name: "SAP Business One",
    logo: "/integrations/sap.svg",
    type: "csv" as const,
    description: "SAP for SMEs",
    regions: ["Global"],
    tier: "enterprise" as const,
  },
  {
    id: "1c",
    name: "1C:Enterprise",
    logo: "/integrations/1c.svg",
    type: "csv" as const,
    description: "CIS accounting standard",
    regions: ["RU", "KZ", "UA", "BY"],
    tier: "enterprise" as const,
  },
  {
    id: "csv_import",
    name: "CSV / Excel Import",
    logo: "/integrations/csv.svg",
    type: "csv" as const,
    description: "Manual file upload from any system",
    regions: ["Global"],
    tier: "starter" as const,
  },
  {
    id: "open_banking",
    name: "Open Banking (PSD2)",
    logo: "/integrations/bank.svg",
    type: "api" as const,
    description: "Auto-categorize bank transactions",
    regions: ["EU", "UK"],
    tier: "pro" as const,
  },
  {
    id: "pdf_scan",
    name: "Invoice Scanner",
    logo: "/integrations/scan.svg",
    type: "ocr" as const,
    description: "Upload PDF/photo invoices — AI extracts data",
    regions: ["Global"],
    tier: "starter" as const,
  },
] as const;
