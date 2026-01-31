// REG-VAULT Financial Calculation Service
// Core financial calculation logic for FCA capital requirements

import {
  LicenceType,
  FinancialAssumptions,
  RevenueStream,
  CostItem,
  ProfitAndLoss,
  CashFlow,
  BalanceSheet,
  CapitalRequirement,
  SensitivityScenario,
  FinancialStatements,
} from '@/types/journey';
import { LICENCE_REQUIREMENTS } from '@/data/licence-requirements';

/**
 * Calculate sliding scale for Method B (Payment Volume)
 * Per PSR 2017 Reg 18(3)(b)
 */
export function calculateMethodB(paymentVolume: number): number {
  let capital = 0;

  if (paymentVolume <= 5000000) {
    capital = paymentVolume * 0.04;
  } else if (paymentVolume <= 10000000) {
    capital = 200000 + (paymentVolume - 5000000) * 0.025;
  } else if (paymentVolume <= 100000000) {
    capital = 325000 + (paymentVolume - 10000000) * 0.01;
  } else if (paymentVolume <= 250000000) {
    capital = 1225000 + (paymentVolume - 100000000) * 0.005;
  } else {
    capital = 1975000 + (paymentVolume - 250000000) * 0.0025;
  }

  return Math.round(capital);
}

/**
 * Calculate sliding scale for Method C (Relevant Income)
 * Per PSR 2017 Reg 18(3)(c)
 */
export function calculateMethodC(relevantIncome: number): number {
  return Math.round(relevantIncome * 0.1);
}

/**
 * Calculate Method D for EMI (Average Outstanding E-money)
 * Per EMR 2011 Reg 6(4)
 */
export function calculateMethodD(averageEMoney: number): number {
  return Math.round(averageEMoney * 0.02);
}

/**
 * Calculate Method A (Fixed Overheads)
 * Per PSR 2017 Reg 18(3)(a)
 */
export function calculateMethodA(fixedOverheads: number): number {
  return Math.round(fixedOverheads * 0.1);
}

/**
 * Generate P&L statements for projection period
 */
export function generateProfitAndLoss(
  years: number,
  revenueStreams: RevenueStream[],
  costs: CostItem[],
  assumptions: FinancialAssumptions,
  startYear: number = new Date().getFullYear()
): ProfitAndLoss[] {
  const statements: ProfitAndLoss[] = [];

  for (let i = 0; i < years; i++) {
    const year = startYear + i;
    const growthFactor = Math.pow(1 + assumptions.annualGrowthRate / 100, i);

    // Calculate revenue
    const revenueByStream = revenueStreams.map((stream) => ({
      name: stream.name,
      amount: Math.round(stream.projectedRevenue[i] || stream.baseAmount * growthFactor),
    }));
    const totalRevenue = revenueByStream.reduce((sum, s) => sum + s.amount, 0);

    // Calculate costs by category
    const costsByCategory: Record<string, number> = {};
    let totalCosts = 0;

    costs.forEach((cost) => {
      const costGrowthFactor = cost.isVariable
        ? growthFactor * (1 + assumptions.inflationRate / 100)
        : Math.pow(1 + assumptions.inflationRate / 100, i);

      const amount = Math.round(cost.amount * costGrowthFactor);
      costsByCategory[cost.category] = (costsByCategory[cost.category] || 0) + amount;
      totalCosts += amount;
    });

    // Calculate profit
    const grossProfit = totalRevenue - totalCosts;
    const taxAmount = grossProfit > 0 ? Math.round(grossProfit * (assumptions.corporateTaxRate / 100)) : 0;
    const netProfit = grossProfit - taxAmount;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    statements.push({
      year,
      revenue: {
        streams: revenueByStream,
        total: totalRevenue,
      },
      costs: {
        byCategory: costsByCategory as Record<string, number>,
        total: totalCosts,
      },
      grossProfit,
      operatingProfit: grossProfit,
      netProfit,
      profitMargin,
    });
  }

  return statements;
}

/**
 * Generate Cash Flow statements
 */
export function generateCashFlow(
  pnl: ProfitAndLoss[],
  assumptions: FinancialAssumptions,
  initialCash: number
): CashFlow[] {
  const statements: CashFlow[] = [];
  let previousClosingBalance = initialCash;

  pnl.forEach((pl, index) => {
    // Operating cash flow adjustments
    const workingCapitalChange = index === 0
      ? -(pl.revenue.total * (assumptions.receivableDays / 365))
      : (pl.revenue.total - (pnl[index - 1]?.revenue.total || 0)) * (assumptions.receivableDays / 365);

    const operatingCashFlow = Math.round(
      pl.netProfit + workingCapitalChange - (pl.revenue.total * 0.02) // Depreciation add-back
    );

    // Investing cash flow (CAPEX)
    const investingCashFlow = index === 0 ? -Math.round(initialCash * 0.3) : -Math.round(pl.revenue.total * 0.05);

    // Financing cash flow
    const financingCashFlow = index === 0 ? initialCash : 0;

    // Net cash flow and balances
    const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
    const closingBalance = previousClosingBalance + netCashFlow;

    statements.push({
      year: pl.year,
      operatingCashFlow,
      investingCashFlow,
      financingCashFlow,
      netCashFlow,
      openingBalance: previousClosingBalance,
      closingBalance,
    });

    previousClosingBalance = closingBalance;
  });

  return statements;
}

/**
 * Generate Balance Sheet statements
 */
export function generateBalanceSheet(
  pnl: ProfitAndLoss[],
  cashFlow: CashFlow[],
  assumptions: FinancialAssumptions,
  initialCapital: number
): BalanceSheet[] {
  const statements: BalanceSheet[] = [];
  let retainedEarnings = 0;

  pnl.forEach((pl, index) => {
    const cf = cashFlow[index];

    // Assets
    const cash = cf.closingBalance;
    const receivables = Math.round(pl.revenue.total * (assumptions.receivableDays / 365));
    const fixedAssets = Math.round(initialCapital * 0.2 + index * (pl.revenue.total * 0.03));
    const totalAssets = cash + receivables + fixedAssets;

    // Liabilities
    const payables = Math.round(pl.costs.total * (assumptions.payableDays / 365));
    const totalLiabilities = payables;

    // Equity
    retainedEarnings += pl.netProfit;
    const shareCapital = initialCapital;
    const totalEquity = shareCapital + retainedEarnings;

    statements.push({
      year: pl.year,
      assets: {
        cash,
        receivables,
        fixedAssets,
        totalAssets,
      },
      liabilities: {
        payables,
        loans: 0,
        totalLiabilities,
      },
      equity: {
        shareCapital,
        retainedEarnings,
        totalEquity,
      },
    });
  });

  return statements;
}

/**
 * Calculate FCA capital requirements
 */
export function calculateCapitalRequirement(
  licenceType: LicenceType,
  pnl: ProfitAndLoss[],
  paymentVolume: number = 0,
  averageEMoney: number = 0
): CapitalRequirement {
  const licenceReq = LICENCE_REQUIREMENTS[licenceType];
  const relevantIncome = pnl[0]?.revenue.total || 0;
  const fixedOverheads = pnl[0]?.costs.total || 0;

  // Calculate each method
  const methodA = calculateMethodA(fixedOverheads);
  const methodB = calculateMethodB(paymentVolume);
  const methodC = calculateMethodC(relevantIncome);
  const methodD = licenceType === 'EMI' || licenceType === 'SEMI' ? calculateMethodD(averageEMoney) : undefined;

  // Determine highest method
  let minimumCapital = Math.max(methodA, methodB, methodC);
  let recommendedMethod: 'A' | 'B' | 'C' | 'D' = 'A';

  if (methodB > methodA && methodB >= methodC) {
    recommendedMethod = 'B';
    minimumCapital = methodB;
  } else if (methodC > methodA && methodC > methodB) {
    recommendedMethod = 'C';
    minimumCapital = methodC;
  }

  if (methodD !== undefined && methodD > minimumCapital) {
    recommendedMethod = 'D';
    minimumCapital = methodD;
  }

  // Apply minimum thresholds
  minimumCapital = Math.max(minimumCapital, licenceReq.minimumCapital);

  // Calculate buffer (25% recommended)
  const buffer = Math.round(minimumCapital * 0.25);

  // Safeguarding (simplified - actual would be based on customer funds)
  const safeguardingRequired = licenceType === 'EMI' || licenceType === 'SEMI' ? averageEMoney : paymentVolume * 0.01;

  return {
    licenceType,
    initialCapital: licenceReq.minimumCapital,
    ongoingCapital: {
      methodA,
      methodB,
      methodC,
      methodD,
    },
    minimumCapital,
    recommendedMethod,
    buffer,
    totalRequired: minimumCapital + buffer,
    safeguardingRequired: Math.round(safeguardingRequired),
  };
}

/**
 * Generate sensitivity scenarios
 */
export function generateSensitivityScenarios(
  baseStatements: FinancialStatements,
  assumptions: FinancialAssumptions,
  revenueStreams: RevenueStream[],
  costs: CostItem[],
  capitalRequirement: CapitalRequirement
): SensitivityScenario[] {
  const scenarios: SensitivityScenario[] = [];
  const multipliers = [
    { name: 'pessimistic' as const, revenue: 0.7, cost: 1.2 },
    { name: 'base' as const, revenue: 1.0, cost: 1.0 },
    { name: 'optimistic' as const, revenue: 1.3, cost: 0.9 },
  ];

  multipliers.forEach(({ name, revenue: revMult, cost: costMult }) => {
    // Adjust revenue streams
    const adjustedRevenue = revenueStreams.map((stream) => ({
      ...stream,
      baseAmount: Math.round(stream.baseAmount * revMult),
      projectedRevenue: stream.projectedRevenue.map((r) => Math.round(r * revMult)),
    }));

    // Adjust costs
    const adjustedCosts = costs.map((cost) => ({
      ...cost,
      amount: Math.round(cost.amount * costMult),
    }));

    // Generate statements
    const pnl = generateProfitAndLoss(
      assumptions.projectionYears,
      adjustedRevenue,
      adjustedCosts,
      assumptions
    );
    const cashFlow = generateCashFlow(pnl, assumptions, capitalRequirement.totalRequired);
    const balanceSheet = generateBalanceSheet(pnl, cashFlow, assumptions, capitalRequirement.totalRequired);

    // Check capital adequacy
    const capitalAdequacy = balanceSheet.map(
      (bs) => bs.equity.totalEquity >= capitalRequirement.minimumCapital
    );

    scenarios.push({
      name,
      revenueMultiplier: revMult,
      costMultiplier: costMult,
      projections: {
        pnl,
        cashFlow,
        balanceSheet,
        capitalAdequacy,
      },
    });
  });

  return scenarios;
}

/**
 * Validate financial projections against FCA requirements
 */
export function validateFinancialProjections(
  statements: FinancialStatements,
  capitalRequirement: CapitalRequirement,
  licenceType: LicenceType
): { isValid: boolean; warnings: string[]; errors: string[] } {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check capital adequacy for each year
  statements.balanceSheet.forEach((bs, index) => {
    if (bs.equity.totalEquity < capitalRequirement.minimumCapital) {
      errors.push(`Year ${index + 1}: Equity (€${bs.equity.totalEquity.toLocaleString()}) below minimum capital requirement (€${capitalRequirement.minimumCapital.toLocaleString()})`);
    } else if (bs.equity.totalEquity < capitalRequirement.totalRequired) {
      warnings.push(`Year ${index + 1}: Equity meets minimum but below recommended buffer`);
    }
  });

  // Check cash position
  statements.cashFlow.forEach((cf, index) => {
    if (cf.closingBalance < 0) {
      errors.push(`Year ${index + 1}: Negative cash position projected`);
    }
  });

  // Check profitability timeline
  const firstProfitableYear = statements.pnl.findIndex((p) => p.netProfit > 0);
  if (firstProfitableYear === -1) {
    warnings.push('Business does not reach profitability within projection period');
  } else if (firstProfitableYear > 2) {
    warnings.push(`Profitability not achieved until Year ${firstProfitableYear + 1}`);
  }

  // Check revenue growth assumptions
  const avgGrowth = statements.pnl.length > 1
    ? ((statements.pnl[statements.pnl.length - 1].revenue.total / statements.pnl[0].revenue.total) - 1) / (statements.pnl.length - 1) * 100
    : 0;

  if (avgGrowth > 50) {
    warnings.push(`High revenue growth assumption (${avgGrowth.toFixed(0)}% annual) - FCA may require justification`);
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Calculate break-even point
 */
export function calculateBreakEven(
  revenueStreams: RevenueStream[],
  costs: CostItem[]
): { units?: number; revenue: number; months?: number } {
  const fixedCosts = costs
    .filter((c) => !c.isVariable)
    .reduce((sum, c) => sum + c.amount, 0);

  const totalRevenue = revenueStreams.reduce((sum, s) => sum + s.baseAmount, 0);
  const variableCosts = costs
    .filter((c) => c.isVariable)
    .reduce((sum, c) => sum + c.amount, 0);

  const contributionMargin = totalRevenue > 0 ? (totalRevenue - variableCosts) / totalRevenue : 0;
  const breakEvenRevenue = contributionMargin > 0 ? fixedCosts / contributionMargin : 0;

  // Estimate months to break-even (assuming linear growth)
  const monthlyRevenue = totalRevenue / 12;
  const monthsToBreakEven = monthlyRevenue > 0 ? Math.ceil(breakEvenRevenue / monthlyRevenue) : undefined;

  return {
    revenue: Math.round(breakEvenRevenue),
    months: monthsToBreakEven,
  };
}

/**
 * Export financial data to CSV format
 */
export function exportToCSV(statements: FinancialStatements): string {
  const lines: string[] = [];

  // P&L section
  lines.push('PROFIT & LOSS');
  lines.push(['Year', ...statements.pnl.map((p) => p.year.toString())].join(','));
  lines.push(['Total Revenue', ...statements.pnl.map((p) => p.revenue.total)].join(','));
  lines.push(['Total Costs', ...statements.pnl.map((p) => p.costs.total)].join(','));
  lines.push(['Gross Profit', ...statements.pnl.map((p) => p.grossProfit)].join(','));
  lines.push(['Net Profit', ...statements.pnl.map((p) => p.netProfit)].join(','));
  lines.push(['Profit Margin %', ...statements.pnl.map((p) => p.profitMargin.toFixed(1))].join(','));
  lines.push('');

  // Cash Flow section
  lines.push('CASH FLOW');
  lines.push(['Year', ...statements.cashFlow.map((c) => c.year.toString())].join(','));
  lines.push(['Operating', ...statements.cashFlow.map((c) => c.operatingCashFlow)].join(','));
  lines.push(['Investing', ...statements.cashFlow.map((c) => c.investingCashFlow)].join(','));
  lines.push(['Financing', ...statements.cashFlow.map((c) => c.financingCashFlow)].join(','));
  lines.push(['Closing Balance', ...statements.cashFlow.map((c) => c.closingBalance)].join(','));
  lines.push('');

  // Balance Sheet section
  lines.push('BALANCE SHEET');
  lines.push(['Year', ...statements.balanceSheet.map((b) => b.year.toString())].join(','));
  lines.push(['Total Assets', ...statements.balanceSheet.map((b) => b.assets.totalAssets)].join(','));
  lines.push(['Total Liabilities', ...statements.balanceSheet.map((b) => b.liabilities.totalLiabilities)].join(','));
  lines.push(['Total Equity', ...statements.balanceSheet.map((b) => b.equity.totalEquity)].join(','));

  return lines.join('\n');
}
