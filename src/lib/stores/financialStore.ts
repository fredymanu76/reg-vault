// REG-VAULT Financial Store
// State management for financial projections and capital calculations

import { useState, useEffect } from 'react';
import {
  LicenceType,
  FinancialAssumptions,
  RevenueStream,
  CostItem,
  CostCategory,
  ProfitAndLoss,
  CashFlow,
  BalanceSheet,
  CapitalRequirement,
  SensitivityScenario,
  FinancialProjections,
} from '@/types/journey';

// ==========================================
// Default Values
// ==========================================

const DEFAULT_ASSUMPTIONS: FinancialAssumptions = {
  projectionYears: 3,
  startYear: new Date().getFullYear(),
  revenueGrowthRate: [0, 0.5, 0.3], // Year 1 base, 50% Y2, 30% Y3
  inflationRate: 0.025,
  taxRate: 0.19, // UK Corporation Tax
  workingCapitalDays: {
    receivables: 30,
    payables: 45,
  },
};

const INITIAL_CAPITAL_REQUIREMENTS: Record<LicenceType, number> = {
  SPI: 0,
  API: 125000, // €125,000
  SEMI: 0,
  EMI: 350000, // €350,000
  RAISP: 0,
};

// ==========================================
// Utility Functions
// ==========================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ==========================================
// Financial Store Class
// ==========================================

class FinancialStore {
  private licenceType: LicenceType = 'API';
  private assumptions: FinancialAssumptions = { ...DEFAULT_ASSUMPTIONS };
  private revenueStreams: RevenueStream[] = [];
  private costs: CostItem[] = [];
  private generatedStatements: {
    pnl: ProfitAndLoss[];
    cashFlow: CashFlow[];
    balanceSheet: BalanceSheet[];
  } | null = null;
  private capitalRequirement: CapitalRequirement | null = null;
  private sensitivityScenarios: SensitivityScenario[] = [];
  private listeners: Set<() => void> = new Set();

  // ==========================================
  // Subscription
  // ==========================================

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  // ==========================================
  // Getters
  // ==========================================

  getLicenceType(): LicenceType {
    return this.licenceType;
  }

  getAssumptions(): FinancialAssumptions {
    return { ...this.assumptions };
  }

  getRevenueStreams(): RevenueStream[] {
    return [...this.revenueStreams];
  }

  getCosts(): CostItem[] {
    return [...this.costs];
  }

  getCostsByCategory(): Record<CostCategory, CostItem[]> {
    const categories: Record<CostCategory, CostItem[]> = {
      staff: [],
      technology: [],
      compliance: [],
      professional_fees: [],
      premises: [],
      marketing: [],
      insurance: [],
      other: [],
    };

    this.costs.forEach((cost) => {
      categories[cost.category].push(cost);
    });

    return categories;
  }

  getStatements(): typeof this.generatedStatements {
    return this.generatedStatements;
  }

  getCapitalRequirement(): CapitalRequirement | null {
    return this.capitalRequirement;
  }

  getSensitivityScenarios(): SensitivityScenario[] {
    return [...this.sensitivityScenarios];
  }

  getProjections(): FinancialProjections | null {
    if (!this.generatedStatements || !this.capitalRequirement) {
      return null;
    }

    return {
      assumptions: this.assumptions,
      revenueStreams: this.revenueStreams,
      costs: this.costs,
      statements: this.generatedStatements,
      capitalRequirement: this.capitalRequirement,
      sensitivity: this.sensitivityScenarios,
    };
  }

  // ==========================================
  // Setters
  // ==========================================

  setLicenceType(type: LicenceType): void {
    this.licenceType = type;
    this.recalculateCapital();
    this.notify();
  }

  setAssumptions(assumptions: Partial<FinancialAssumptions>): void {
    this.assumptions = { ...this.assumptions, ...assumptions };
    this.regenerateStatements();
    this.notify();
  }

  // ==========================================
  // Revenue Stream Management
  // ==========================================

  addRevenueStream(stream: Omit<RevenueStream, 'id'>): RevenueStream {
    const newStream: RevenueStream = {
      ...stream,
      id: generateId(),
    };
    this.revenueStreams.push(newStream);
    this.regenerateStatements();
    this.notify();
    return newStream;
  }

  updateRevenueStream(id: string, updates: Partial<RevenueStream>): void {
    this.revenueStreams = this.revenueStreams.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    this.regenerateStatements();
    this.notify();
  }

  removeRevenueStream(id: string): void {
    this.revenueStreams = this.revenueStreams.filter((s) => s.id !== id);
    this.regenerateStatements();
    this.notify();
  }

  // ==========================================
  // Cost Management
  // ==========================================

  addCost(cost: Omit<CostItem, 'id'>): CostItem {
    const newCost: CostItem = {
      ...cost,
      id: generateId(),
    };
    this.costs.push(newCost);
    this.regenerateStatements();
    this.notify();
    return newCost;
  }

  updateCost(id: string, updates: Partial<CostItem>): void {
    this.costs = this.costs.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    this.regenerateStatements();
    this.notify();
  }

  removeCost(id: string): void {
    this.costs = this.costs.filter((c) => c.id !== id);
    this.regenerateStatements();
    this.notify();
  }

  // ==========================================
  // Financial Calculations
  // ==========================================

  private calculateYearlyRevenue(year: number): { streams: { name: string; amount: number }[]; total: number } {
    const yearIndex = year - this.assumptions.startYear;
    const streams: { name: string; amount: number }[] = [];

    this.revenueStreams.forEach((stream) => {
      let amount = stream.baseValue;

      // Apply volume assumptions if available
      if (stream.volumeAssumptions && stream.volumeAssumptions[yearIndex]) {
        amount = stream.baseValue * stream.volumeAssumptions[yearIndex];
      } else {
        // Apply growth rate
        for (let i = 0; i < yearIndex; i++) {
          const growthRate = this.assumptions.revenueGrowthRate[i] || stream.growthRate;
          amount *= (1 + growthRate);
        }
      }

      // Convert based on unit
      if (stream.unit === 'monthly') {
        amount *= 12;
      }

      streams.push({ name: stream.name, amount: Math.round(amount) });
    });

    const total = streams.reduce((sum, s) => sum + s.amount, 0);
    return { streams, total };
  }

  private calculateYearlyCosts(year: number, totalRevenue: number): { byCategory: Record<CostCategory, number>; total: number } {
    const yearIndex = year - this.assumptions.startYear;
    const byCategory: Record<CostCategory, number> = {
      staff: 0,
      technology: 0,
      compliance: 0,
      professional_fees: 0,
      premises: 0,
      marketing: 0,
      insurance: 0,
      other: 0,
    };

    this.costs.forEach((cost) => {
      let amount: number;

      // Use yearly override if available
      if (cost.yearlyAmounts && cost.yearlyAmounts[yearIndex] !== undefined) {
        amount = cost.yearlyAmounts[yearIndex];
      } else if (cost.type === 'variable' && cost.variableRate) {
        // Variable cost based on revenue
        amount = totalRevenue * (cost.variableRate / 100);
      } else {
        // Fixed cost with inflation
        amount = cost.amount;
        if (cost.frequency === 'monthly') {
          amount *= 12;
        }
        // Apply inflation for future years
        for (let i = 0; i < yearIndex; i++) {
          amount *= (1 + this.assumptions.inflationRate);
        }
      }

      byCategory[cost.category] += Math.round(amount);
    });

    const total = Object.values(byCategory).reduce((sum, val) => sum + val, 0);
    return { byCategory, total };
  }

  private generatePnL(): ProfitAndLoss[] {
    const statements: ProfitAndLoss[] = [];

    for (let i = 0; i < this.assumptions.projectionYears; i++) {
      const year = this.assumptions.startYear + i;
      const revenue = this.calculateYearlyRevenue(year);
      const costs = this.calculateYearlyCosts(year, revenue.total);

      const grossProfit = revenue.total - costs.total;
      const operatingProfit = grossProfit; // Simplified - no depreciation/amortization
      const tax = operatingProfit > 0 ? operatingProfit * this.assumptions.taxRate : 0;
      const netProfit = operatingProfit - tax;

      statements.push({
        year,
        revenue,
        costs,
        grossProfit,
        operatingProfit,
        tax: Math.round(tax),
        netProfit: Math.round(netProfit),
      });
    }

    return statements;
  }

  private generateCashFlow(pnlStatements: ProfitAndLoss[]): CashFlow[] {
    const statements: CashFlow[] = [];
    let openingBalance = 0;

    pnlStatements.forEach((pnl, index) => {
      // Simplified cash flow calculation
      const workingCapitalChange = index === 0
        ? -(pnl.revenue.total / 12) * (this.assumptions.workingCapitalDays.receivables / 30)
        : 0;

      const operatingCashFlow = pnl.netProfit + workingCapitalChange;
      const investingCashFlow = index === 0 ? -50000 : 0; // Initial capex
      const financingCashFlow = 0;

      const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
      const closingBalance = openingBalance + netCashFlow;

      statements.push({
        year: pnl.year,
        operatingCashFlow: Math.round(operatingCashFlow),
        investingCashFlow: Math.round(investingCashFlow),
        financingCashFlow,
        netCashFlow: Math.round(netCashFlow),
        openingBalance: Math.round(openingBalance),
        closingBalance: Math.round(closingBalance),
      });

      openingBalance = closingBalance;
    });

    return statements;
  }

  private generateBalanceSheet(
    pnlStatements: ProfitAndLoss[],
    cashFlowStatements: CashFlow[]
  ): BalanceSheet[] {
    const statements: BalanceSheet[] = [];
    let cumulativeRetainedEarnings = 0;

    pnlStatements.forEach((pnl, index) => {
      const cashFlow = cashFlowStatements[index];
      cumulativeRetainedEarnings += pnl.netProfit;

      const receivables = Math.round(
        (pnl.revenue.total / 365) * this.assumptions.workingCapitalDays.receivables
      );
      const payables = Math.round(
        (pnl.costs.total / 365) * this.assumptions.workingCapitalDays.payables
      );

      // Safeguarding estimate (simplified)
      const safeguarded = Math.round(pnl.revenue.total * 0.1);

      const shareCapital = INITIAL_CAPITAL_REQUIREMENTS[this.licenceType] || 125000;

      const currentAssets = {
        cash: cashFlow.closingBalance,
        receivables,
        other: 0,
        total: cashFlow.closingBalance + receivables,
      };

      const fixedAssets = {
        tangible: index === 0 ? 50000 : 50000 - (index * 10000), // Depreciation
        intangible: 0,
        total: index === 0 ? 50000 : 50000 - (index * 10000),
      };

      const totalAssets = currentAssets.total + fixedAssets.total;

      const currentLiabilities = {
        payables,
        safeguarded,
        other: 0,
        total: payables + safeguarded,
      };

      const totalLiabilities = currentLiabilities.total;

      const equity = {
        shareCapital,
        retainedEarnings: cumulativeRetainedEarnings,
        totalEquity: shareCapital + cumulativeRetainedEarnings,
      };

      statements.push({
        year: pnl.year,
        assets: {
          currentAssets,
          fixedAssets,
          totalAssets,
        },
        liabilities: {
          currentLiabilities,
          longTermLiabilities: 0,
          totalLiabilities,
        },
        equity,
      });
    });

    return statements;
  }

  private regenerateStatements(): void {
    if (this.revenueStreams.length === 0 && this.costs.length === 0) {
      this.generatedStatements = null;
      return;
    }

    const pnl = this.generatePnL();
    const cashFlow = this.generateCashFlow(pnl);
    const balanceSheet = this.generateBalanceSheet(pnl, cashFlow);

    this.generatedStatements = { pnl, cashFlow, balanceSheet };
    this.recalculateCapital();
    this.generateSensitivityScenarios();
  }

  // ==========================================
  // Capital Requirement Calculations
  // ==========================================

  private recalculateCapital(): void {
    if (!this.generatedStatements || this.generatedStatements.pnl.length === 0) {
      this.capitalRequirement = null;
      return;
    }

    const pnl = this.generatedStatements.pnl[0]; // Use Year 1 for calculations

    // Method A: 10% of fixed overheads
    const fixedOverheads = Object.entries(pnl.costs.byCategory)
      .filter(([category]) => ['staff', 'premises', 'technology', 'compliance'].includes(category))
      .reduce((sum, [, amount]) => sum + amount, 0);
    const methodA = Math.round(fixedOverheads * 0.1);

    // Method B: Based on payment volume (simplified - assuming 1% of annual volume)
    const estimatedVolume = pnl.revenue.total * 10; // Assume revenue is 10% of volume
    const methodB = this.calculateMethodB(estimatedVolume);

    // Method C: Based on relevant income
    const methodC = this.calculateMethodC(pnl.revenue.total);

    // Method D: 2% of average e-money (EMI only)
    const methodD = this.licenceType === 'EMI' || this.licenceType === 'SEMI'
      ? Math.round(estimatedVolume * 0.02 / 12) // Monthly average
      : undefined;

    // Determine recommended method (lowest for APIs, specific rules for EMIs)
    const methods = { A: methodA, B: methodB, C: methodC };
    let recommendedMethod: 'A' | 'B' | 'C' | 'D' = 'A';
    let minimumOngoing = methodA;

    Object.entries(methods).forEach(([method, value]) => {
      if (value < minimumOngoing) {
        minimumOngoing = value;
        recommendedMethod = method as 'A' | 'B' | 'C';
      }
    });

    // Initial capital based on licence type
    const initialCapital = INITIAL_CAPITAL_REQUIREMENTS[this.licenceType];

    // Safeguarding requirement (simplified)
    const safeguardingRequired = this.licenceType !== 'RAISP'
      ? Math.round(pnl.revenue.total * 0.1)
      : 0;

    // Buffer recommendation (25%)
    const buffer = Math.round(Math.max(initialCapital, minimumOngoing) * 0.25);

    this.capitalRequirement = {
      licenceType: this.licenceType,
      initialCapital,
      ongoingCapital: {
        methodA,
        methodB,
        methodC,
        methodD,
      },
      recommendedMethod,
      minimumCapital: Math.max(initialCapital, minimumOngoing),
      safeguardingRequired,
      buffer,
      totalRequired: Math.max(initialCapital, minimumOngoing) + buffer,
    };
  }

  private calculateMethodB(paymentVolume: number): number {
    // PSR 2017 sliding scale for Method B
    // 4% of first €5m, 2.5% of €5m-€10m, 1% of €10m-€100m, etc.
    let capital = 0;
    let remaining = paymentVolume;

    if (remaining > 0) {
      const tier1 = Math.min(remaining, 5000000);
      capital += tier1 * 0.04;
      remaining -= tier1;
    }
    if (remaining > 0) {
      const tier2 = Math.min(remaining, 5000000);
      capital += tier2 * 0.025;
      remaining -= tier2;
    }
    if (remaining > 0) {
      const tier3 = Math.min(remaining, 90000000);
      capital += tier3 * 0.01;
      remaining -= tier3;
    }
    if (remaining > 0) {
      const tier4 = Math.min(remaining, 150000000);
      capital += tier4 * 0.005;
      remaining -= tier4;
    }
    if (remaining > 0) {
      capital += remaining * 0.0025;
    }

    return Math.round(capital / 12); // Monthly average
  }

  private calculateMethodC(relevantIncome: number): number {
    // PSR 2017 sliding scale for Method C
    // 10% of first €2.5m, 8% of €2.5m-€5m, etc.
    let capital = 0;
    let remaining = relevantIncome;

    if (remaining > 0) {
      const tier1 = Math.min(remaining, 2500000);
      capital += tier1 * 0.1;
      remaining -= tier1;
    }
    if (remaining > 0) {
      const tier2 = Math.min(remaining, 2500000);
      capital += tier2 * 0.08;
      remaining -= tier2;
    }
    if (remaining > 0) {
      const tier3 = Math.min(remaining, 20000000);
      capital += tier3 * 0.06;
      remaining -= tier3;
    }
    if (remaining > 0) {
      const tier4 = Math.min(remaining, 225000000);
      capital += tier4 * 0.03;
      remaining -= tier4;
    }
    if (remaining > 0) {
      capital += remaining * 0.015;
    }

    return Math.round(capital);
  }

  // ==========================================
  // Sensitivity Analysis
  // ==========================================

  private generateSensitivityScenarios(): void {
    if (!this.generatedStatements) {
      this.sensitivityScenarios = [];
      return;
    }

    const baseScenario: SensitivityScenario = {
      name: 'base',
      revenueMultiplier: 1.0,
      costMultiplier: 1.0,
      projections: {
        pnl: this.generatedStatements.pnl,
        cashFlow: this.generatedStatements.cashFlow,
        capitalAdequacy: this.generatedStatements.pnl.map(() => true),
      },
    };

    const optimisticScenario = this.generateScenario('optimistic', 1.2, 0.95);
    const pessimisticScenario = this.generateScenario('pessimistic', 0.7, 1.1);

    this.sensitivityScenarios = [baseScenario, optimisticScenario, pessimisticScenario];
  }

  private generateScenario(
    name: 'optimistic' | 'pessimistic',
    revenueMultiplier: number,
    costMultiplier: number
  ): SensitivityScenario {
    const pnl: ProfitAndLoss[] = [];
    const cashFlow: CashFlow[] = [];
    const capitalAdequacy: boolean[] = [];

    let openingBalance = 0;
    let cumulativeRetainedEarnings = 0;

    for (let i = 0; i < this.assumptions.projectionYears; i++) {
      const year = this.assumptions.startYear + i;
      const baseRevenue = this.calculateYearlyRevenue(year);
      const revenue = {
        streams: baseRevenue.streams.map((s) => ({
          ...s,
          amount: Math.round(s.amount * revenueMultiplier),
        })),
        total: Math.round(baseRevenue.total * revenueMultiplier),
      };

      const baseCosts = this.calculateYearlyCosts(year, baseRevenue.total);
      const costs = {
        byCategory: Object.fromEntries(
          Object.entries(baseCosts.byCategory).map(([k, v]) => [
            k,
            Math.round(v * costMultiplier),
          ])
        ) as Record<CostCategory, number>,
        total: Math.round(baseCosts.total * costMultiplier),
      };

      const grossProfit = revenue.total - costs.total;
      const operatingProfit = grossProfit;
      const tax = operatingProfit > 0 ? Math.round(operatingProfit * this.assumptions.taxRate) : 0;
      const netProfit = operatingProfit - tax;

      pnl.push({
        year,
        revenue,
        costs,
        grossProfit,
        operatingProfit,
        tax,
        netProfit,
      });

      // Cash flow
      const workingCapitalChange = i === 0
        ? -(revenue.total / 12) * (this.assumptions.workingCapitalDays.receivables / 30)
        : 0;
      const operatingCashFlow = netProfit + workingCapitalChange;
      const investingCashFlow = i === 0 ? -50000 : 0;
      const netCashFlowAmount = operatingCashFlow + investingCashFlow;
      const closingBalance = openingBalance + netCashFlowAmount;

      cashFlow.push({
        year,
        operatingCashFlow: Math.round(operatingCashFlow),
        investingCashFlow,
        financingCashFlow: 0,
        netCashFlow: Math.round(netCashFlowAmount),
        openingBalance: Math.round(openingBalance),
        closingBalance: Math.round(closingBalance),
      });

      openingBalance = closingBalance;
      cumulativeRetainedEarnings += netProfit;

      // Capital adequacy check
      const initialCapital = INITIAL_CAPITAL_REQUIREMENTS[this.licenceType];
      const totalCapital = initialCapital + cumulativeRetainedEarnings;
      capitalAdequacy.push(totalCapital >= initialCapital);
    }

    return {
      name,
      revenueMultiplier,
      costMultiplier,
      projections: { pnl, cashFlow, capitalAdequacy },
    };
  }

  // ==========================================
  // Bulk Operations
  // ==========================================

  loadFromProjections(projections: FinancialProjections): void {
    this.assumptions = projections.assumptions;
    this.revenueStreams = projections.revenueStreams;
    this.costs = projections.costs;
    this.regenerateStatements();
    this.notify();
  }

  reset(): void {
    this.assumptions = { ...DEFAULT_ASSUMPTIONS };
    this.revenueStreams = [];
    this.costs = [];
    this.generatedStatements = null;
    this.capitalRequirement = null;
    this.sensitivityScenarios = [];
    this.notify();
  }

  // ==========================================
  // Template Loading
  // ==========================================

  loadTemplate(template: 'payment_institution' | 'emi' | 'raisp'): void {
    switch (template) {
      case 'payment_institution':
        this.licenceType = 'API';
        this.revenueStreams = [
          {
            id: generateId(),
            name: 'Transaction Fees',
            type: 'transaction_fee',
            baseValue: 0.50,
            unit: 'per_transaction',
            volumeAssumptions: [100000, 250000, 500000],
            growthRate: 0.5,
          },
          {
            id: generateId(),
            name: 'FX Margin',
            type: 'fx_margin',
            baseValue: 50000,
            unit: 'monthly',
            volumeAssumptions: [],
            growthRate: 0.3,
          },
        ];
        this.costs = this.getDefaultCosts();
        break;

      case 'emi':
        this.licenceType = 'EMI';
        this.revenueStreams = [
          {
            id: generateId(),
            name: 'E-money Interest',
            type: 'interest',
            baseValue: 200000,
            unit: 'annual',
            volumeAssumptions: [],
            growthRate: 0.25,
          },
          {
            id: generateId(),
            name: 'Card Fees',
            type: 'transaction_fee',
            baseValue: 1.00,
            unit: 'per_transaction',
            volumeAssumptions: [50000, 150000, 300000],
            growthRate: 0.4,
          },
        ];
        this.costs = this.getDefaultCosts();
        break;

      case 'raisp':
        this.licenceType = 'RAISP';
        this.revenueStreams = [
          {
            id: generateId(),
            name: 'API Subscription',
            type: 'subscription',
            baseValue: 500,
            unit: 'monthly',
            volumeAssumptions: [50, 150, 400],
            growthRate: 0.6,
          },
        ];
        this.costs = this.getDefaultCosts().filter(
          (c) => c.category !== 'compliance' || c.name !== 'Safeguarding'
        );
        break;
    }

    this.regenerateStatements();
    this.notify();
  }

  private getDefaultCosts(): CostItem[] {
    return [
      {
        id: generateId(),
        name: 'Staff Costs',
        category: 'staff',
        type: 'fixed',
        amount: 25000,
        frequency: 'monthly',
      },
      {
        id: generateId(),
        name: 'Technology & Infrastructure',
        category: 'technology',
        type: 'fixed',
        amount: 8000,
        frequency: 'monthly',
      },
      {
        id: generateId(),
        name: 'Compliance & Regulatory',
        category: 'compliance',
        type: 'fixed',
        amount: 5000,
        frequency: 'monthly',
      },
      {
        id: generateId(),
        name: 'Professional Fees',
        category: 'professional_fees',
        type: 'fixed',
        amount: 3000,
        frequency: 'monthly',
      },
      {
        id: generateId(),
        name: 'Office & Premises',
        category: 'premises',
        type: 'fixed',
        amount: 4000,
        frequency: 'monthly',
      },
      {
        id: generateId(),
        name: 'Insurance',
        category: 'insurance',
        type: 'fixed',
        amount: 15000,
        frequency: 'annual',
      },
      {
        id: generateId(),
        name: 'Marketing',
        category: 'marketing',
        type: 'variable',
        amount: 0,
        frequency: 'monthly',
        variableRate: 5, // 5% of revenue
      },
    ];
  }
}

// ==========================================
// Singleton Instance
// ==========================================

export const financialStore = new FinancialStore();

// ==========================================
// React Hook
// ==========================================

export function useFinancialStore() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = financialStore.subscribe(() => forceUpdate({}));
    return () => {
      unsubscribe();
    };
  }, []);

  return financialStore;
}

// ==========================================
// Convenience Hooks
// ==========================================

export function useFinancialProjections(): FinancialProjections | null {
  const store = useFinancialStore();
  return store.getProjections();
}

export function useCapitalRequirement(): CapitalRequirement | null {
  const store = useFinancialStore();
  return store.getCapitalRequirement();
}

export function useFinancialStatements() {
  const store = useFinancialStore();
  return store.getStatements();
}
