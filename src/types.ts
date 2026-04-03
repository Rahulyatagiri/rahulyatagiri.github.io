// ─── Supplier ─────────────────────────────────────────────────────────────────

export interface Supplier {
  id: string;
  component: string;
  subsystem: string;
  supplier: string;
  country: string;
  region: string;
  leadTimeDays: number;
  moqKg: number;
  unitCostPerKg: number;
  freightCostPerKg: number;
  dutyRate: number;
  ira45xEligible: boolean;
  riskTier: 'Low' | 'Medium' | 'High';
  domesticAlternative: string | null;
  annualVolumeKg: number;
  notes: string;
  unitCostEach?: number;
  moqEach?: number;
}

// ─── BOM ──────────────────────────────────────────────────────────────────────

export interface BOMItem {
  id: string;
  level: number;
  parent: string | null;
  name: string;
  category: string;
  targetCostPerKwh: number;
  actualCostPerKwh: number;
  unit: string;
  supplierId?: string | null;
  costDriver?: string;
}

export interface BOMData {
  systemName: string;
  systemCapacityKwh: number;
  targetCostPerKwh: number;
  items: BOMItem[];
}

// ─── Cost-Down Initiatives ────────────────────────────────────────────────────

export type InitiativeStatus = 'Pipeline' | 'In Progress' | 'Committed' | 'Complete' | 'On Hold';

export interface Initiative {
  id: string;
  name: string;
  category: 'Supplier' | 'Design' | 'Yield';
  description: string;
  owner: string;
  status: InitiativeStatus;
  targetSavingsPerKwh: number;
  realizedSavingsPerKwh: number;
  targetVolumeGwh: number;
  startDate: string;
  targetDate: string;
  completionPct: number;
  tags: string[];
}

// ─── Capex ───────────────────────────────────────────────────────────────────

export type ApprovalStatus = 'Approved' | 'Pending' | 'Under Review' | 'Rejected';

export interface CapexItem {
  id: string;
  category: 'Equipment' | 'Tooling' | 'Infrastructure';
  name: string;
  vendor: string;
  approvalStatus: ApprovalStatus;
  budgeted: number;
  committed: number;
  spent: number;
  forecast: number;
  poNumber: string | null;
  expectedDelivery: string | null;
  notes: string;
  capitalizationDate: string | null;
  usefulLifeYears: number | null;
}

export interface CapexData {
  facility: string;
  fiscalYear: string;
  totalBudget: number;
  items: CapexItem[];
}
