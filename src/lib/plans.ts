// =============================================================================
// Plan definitions & access control
// =============================================================================

export type PlanId = 'trial' | 'starter' | 'pro' | 'enterprise';

export interface PlanFeatures {
  id: PlanId;
  name: string;
  price: number;
  scope3: boolean;
  scope3Full: boolean;         // all 15 categories
  reports: string[];           // allowed report IDs
  maxReportsPerMonth: number;
  socialParams: boolean;
  governanceParams: boolean;
  supplyChain: boolean;
  goals: boolean;
  integrations: string[];      // allowed tiers
  maxCompanies: number;
  maxTeamMembers: number;
  dataExport: boolean;
  apiAccess: boolean;
}

export const PLAN_FEATURES: Record<PlanId, PlanFeatures> = {
  trial: {
    id: 'trial',
    name: 'Trial',
    price: 0,
    scope3: false,
    scope3Full: false,
    reports: ['gri'],
    maxReportsPerMonth: 3,
    socialParams: false,
    governanceParams: false,
    supplyChain: false,
    goals: false,
    integrations: ['starter'],
    maxCompanies: 1,
    maxTeamMembers: 1,
    dataExport: false,
    apiAccess: false,
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 20,
    scope3: true,
    scope3Full: false,
    reports: ['gri', 'esrs'],
    maxReportsPerMonth: 10,
    socialParams: true,
    governanceParams: true,
    supplyChain: false,
    goals: false,
    integrations: ['starter'],
    maxCompanies: 1,
    maxTeamMembers: 5,
    dataExport: true,
    apiAccess: false,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 100,
    scope3: true,
    scope3Full: true,
    reports: ['gri', 'esrs', 'cdp', 'ungc'],
    maxReportsPerMonth: 50,
    socialParams: true,
    governanceParams: true,
    supplyChain: true,
    goals: true,
    integrations: ['starter', 'pro'],
    maxCompanies: 3,
    maxTeamMembers: 15,
    dataExport: true,
    apiAccess: false,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 1000,
    scope3: true,
    scope3Full: true,
    reports: ['gri', 'esrs', 'cdp', 'ungc', 'taxonomy', 'tcfd'],
    maxReportsPerMonth: -1,  // unlimited
    socialParams: true,
    governanceParams: true,
    supplyChain: true,
    goals: true,
    integrations: ['starter', 'pro', 'enterprise'],
    maxCompanies: -1,
    maxTeamMembers: -1,
    dataExport: true,
    apiAccess: true,
  },
};

export function getPlanFeatures(planId: string | null | undefined): PlanFeatures {
  return PLAN_FEATURES[(planId as PlanId) || 'trial'] || PLAN_FEATURES.trial;
}

export function canAccessFeature(plan: PlanId, feature: keyof PlanFeatures): boolean {
  const features = PLAN_FEATURES[plan] || PLAN_FEATURES.trial;
  const val = features[feature];
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val !== 0;
  if (Array.isArray(val)) return val.length > 0;
  return true;
}

export function canAccessReport(plan: PlanId, reportId: string): boolean {
  const features = PLAN_FEATURES[plan] || PLAN_FEATURES.trial;
  return features.reports.includes(reportId);
}

export function getRequiredPlan(reportId: string): PlanId {
  for (const plan of ['trial', 'starter', 'pro', 'enterprise'] as PlanId[]) {
    if (PLAN_FEATURES[plan].reports.includes(reportId)) return plan;
  }
  return 'enterprise';
}

// Plan hierarchy for upgrade comparison
const PLAN_ORDER: PlanId[] = ['trial', 'starter', 'pro', 'enterprise'];

export function isPlanHigherOrEqual(current: PlanId, required: PlanId): boolean {
  return PLAN_ORDER.indexOf(current) >= PLAN_ORDER.indexOf(required);
}
