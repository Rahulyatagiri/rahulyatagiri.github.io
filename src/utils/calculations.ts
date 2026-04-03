import type { Supplier } from '../types';

// ─── Landed Cost ─────────────────────────────────────────────────────────────

export function landedCostPerKg(supplier: Supplier): number {
  const { unitCostPerKg, freightCostPerKg, dutyRate } = supplier;
  const dutyAmount = unitCostPerKg * dutyRate;
  return unitCostPerKg + freightCostPerKg + dutyAmount;
}

export function totalTariffExposureUSD(suppliers: Supplier[]): number {
  return suppliers.reduce((sum, s) => {
    if (s.dutyRate > 0 && s.annualVolumeKg > 0) {
      const tariff = s.unitCostPerKg * s.dutyRate * s.annualVolumeKg;
      return sum + tariff;
    }
    return sum;
  }, 0);
}

// ─── IRA 45X Credit Calculations ─────────────────────────────────────────────

/**
 * 45X Production Tax Credit amounts (Inflation Reduction Act, Section 45X):
 * - Battery cells (capacity > 12 Wh): $35/kWh
 * - Battery modules (capacity > 7 kWh): $10/kWh
 * - Electrode active materials: 10% of production cost
 * Credits phase down: 75% in 2030, 50% in 2031, 25% in 2032, 0% after 2032
 */

export const IRA_45X_RATES = {
  cellPerKwh: 35,       // $/kWh for manufactured cells
  modulePerKwh: 10,     // $/kWh for manufactured modules
  electrodeMatPct: 0.1, // 10% of electrode material production cost
} as const;

export const IRA_PHASEDOWN = {
  2025: 1.0,
  2026: 1.0,
  2027: 1.0,
  2028: 1.0,
  2029: 1.0,
  2030: 0.75,
  2031: 0.5,
  2032: 0.25,
} as const;

export interface IRAScenario {
  volumeGwh: number;
  domesticCellPct: number;    // 0–1
  domesticModulePct: number;  // 0–1
  electrodeMatCostPerKwh: number;
  year: number;
}

export interface IRACredit {
  cellCredit: number;
  moduleCredit: number;
  electrodeCredit: number;
  totalCreditPerKwh: number;
  totalCreditAnnual: number;
  phasedownFactor: number;
}

export function calculateIRACredit(scenario: IRAScenario): IRACredit {
  const phasedownFactor = IRA_PHASEDOWN[scenario.year as keyof typeof IRA_PHASEDOWN] ?? 0;
  const volumeKwh = scenario.volumeGwh * 1_000_000; // GWh → kWh

  const cellCredit = IRA_45X_RATES.cellPerKwh * scenario.domesticCellPct * phasedownFactor;
  const moduleCredit = IRA_45X_RATES.modulePerKwh * scenario.domesticModulePct * phasedownFactor;
  const electrodeCredit = scenario.electrodeMatCostPerKwh * IRA_45X_RATES.electrodeMatPct * scenario.domesticCellPct * phasedownFactor;

  const totalCreditPerKwh = cellCredit + moduleCredit + electrodeCredit;
  const totalCreditAnnual = totalCreditPerKwh * volumeKwh;

  return { cellCredit, moduleCredit, electrodeCredit, totalCreditPerKwh, totalCreditAnnual, phasedownFactor };
}

// ─── BOM / Should-Cost ────────────────────────────────────────────────────────

export function costGap(target: number, actual: number): number {
  return actual - target;
}

export function costGapPct(target: number, actual: number): number {
  if (target === 0) return 0;
  return ((actual - target) / target) * 100;
}

// ─── Capex ───────────────────────────────────────────────────────────────────

export function capexVariance(budgeted: number, forecast: number): number {
  return forecast - budgeted;
}

export function capexBurnPct(spent: number, budgeted: number): number {
  if (budgeted === 0) return 0;
  return (spent / budgeted) * 100;
}

// ─── Supply Chain Concentration Risk ─────────────────────────────────────────

export interface ConcentrationRisk {
  country: string;
  totalSpend: number;
  pct: number;
}

export function concentrationRisk(suppliers: Supplier[]): ConcentrationRisk[] {
  const byCountry: Record<string, number> = {};
  let totalSpend = 0;

  suppliers.forEach((s) => {
    if (s.annualVolumeKg > 0) {
      const spend = landedCostPerKg(s) * s.annualVolumeKg;
      byCountry[s.region] = (byCountry[s.region] ?? 0) + spend;
      totalSpend += spend;
    }
  });

  return Object.entries(byCountry)
    .map(([country, spend]) => ({
      country,
      totalSpend: spend,
      pct: totalSpend > 0 ? (spend / totalSpend) * 100 : 0,
    }))
    .sort((a, b) => b.totalSpend - a.totalSpend);
}

// ─── Formatting Helpers ───────────────────────────────────────────────────────

export function formatUSD(value: number, decimals = 0): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatGwh(value: number): string {
  if (value >= 1) return `${value.toFixed(1)} GWh`;
  return `${(value * 1000).toFixed(0)} MWh`;
}
