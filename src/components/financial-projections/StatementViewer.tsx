// REG-VAULT Statement Viewer
// View P&L, Cash Flow, Balance Sheet (3-5 years)

import { useState } from 'react';
import { useFinancialStore } from '@/lib/stores/financialStore';
import { ProfitAndLoss, CashFlow, BalanceSheet, CostCategory } from '@/types/journey';
import { FileSpreadsheet, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';

type StatementType = 'pnl' | 'cashflow' | 'balance';

export function StatementViewer() {
  const financialStore = useFinancialStore();
  const statements = financialStore.getStatements();
  const assumptions = financialStore.getAssumptions();

  const [activeStatement, setActiveStatement] = useState<StatementType>('pnl');

  if (!statements) {
    return (
      <div className="text-center py-12">
        <FileSpreadsheet size={48} className="mx-auto text-mist-gray mb-4" />
        <h3 className="text-lg font-medium text-photon-white mb-2">No Statements Generated</h3>
        <p className="text-mist-gray">
          Add revenue streams and costs to generate financial statements.
        </p>
      </div>
    );
  }

  const handleExportCSV = () => {
    // Simple CSV export
    let csv = '';

    if (activeStatement === 'pnl') {
      csv = 'P&L Statement\n';
      csv += 'Item,' + statements.pnl.map((s) => s.year).join(',') + '\n';
      csv += 'Revenue,' + statements.pnl.map((s) => s.revenue.total).join(',') + '\n';
      csv += 'Costs,' + statements.pnl.map((s) => s.costs.total).join(',') + '\n';
      csv += 'Gross Profit,' + statements.pnl.map((s) => s.grossProfit).join(',') + '\n';
      csv += 'Tax,' + statements.pnl.map((s) => s.tax).join(',') + '\n';
      csv += 'Net Profit,' + statements.pnl.map((s) => s.netProfit).join(',') + '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeStatement}-statement.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Statement Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {[
            { id: 'pnl', label: 'Profit & Loss' },
            { id: 'cashflow', label: 'Cash Flow' },
            { id: 'balance', label: 'Balance Sheet' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatement(tab.id as StatementType)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                activeStatement === tab.id
                  ? 'bg-pellucid-cyan/20 text-pellucid-cyan'
                  : 'bg-white/5 text-mist-gray hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-mist-gray
            hover:bg-white/10 hover:text-photon-white transition-colors text-sm"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Statement Content */}
      {activeStatement === 'pnl' && <ProfitLossStatement statements={statements.pnl} />}
      {activeStatement === 'cashflow' && <CashFlowStatement statements={statements.cashFlow} />}
      {activeStatement === 'balance' && <BalanceSheetStatement statements={statements.balanceSheet} />}
    </div>
  );
}

// Profit & Loss Statement
function ProfitLossStatement({ statements }: { statements: ProfitAndLoss[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-mist-gray font-medium">Item</th>
            {statements.map((s) => (
              <th key={s.year} className="text-right py-3 px-4 text-mist-gray font-medium">
                {s.year}
              </th>
            ))}
            <th className="text-right py-3 px-4 text-mist-gray font-medium">Change</th>
          </tr>
        </thead>
        <tbody>
          {/* Revenue */}
          <tr className="bg-deep-teal/10">
            <td className="py-3 px-4 font-medium text-deep-teal">Revenue</td>
            {statements.map((s) => (
              <td key={s.year} className="text-right py-3 px-4 font-medium text-deep-teal">
                £{s.revenue.total.toLocaleString()}
              </td>
            ))}
            <td className="text-right py-3 px-4">
              <ChangeIndicator
                current={statements[statements.length - 1]?.revenue.total || 0}
                previous={statements[0]?.revenue.total || 0}
              />
            </td>
          </tr>

          {/* Revenue breakdown */}
          {statements[0]?.revenue.streams.map((stream, idx) => (
            <tr key={stream.name} className="border-b border-white/5">
              <td className="py-2 px-4 pl-8 text-sm text-mist-gray">{stream.name}</td>
              {statements.map((s) => (
                <td key={s.year} className="text-right py-2 px-4 text-sm text-mist-gray">
                  £{s.revenue.streams[idx]?.amount.toLocaleString() || 0}
                </td>
              ))}
              <td />
            </tr>
          ))}

          {/* Costs */}
          <tr className="bg-red-500/5">
            <td className="py-3 px-4 font-medium text-red-400">Total Costs</td>
            {statements.map((s) => (
              <td key={s.year} className="text-right py-3 px-4 font-medium text-red-400">
                (£{s.costs.total.toLocaleString()})
              </td>
            ))}
            <td className="text-right py-3 px-4">
              <ChangeIndicator
                current={statements[statements.length - 1]?.costs.total || 0}
                previous={statements[0]?.costs.total || 0}
                inverse
              />
            </td>
          </tr>

          {/* Cost breakdown */}
          {(Object.keys(statements[0]?.costs.byCategory || {}) as CostCategory[]).map((category) => {
            const hasValues = statements.some((s) => s.costs.byCategory[category] > 0);
            if (!hasValues) return null;
            return (
              <tr key={category} className="border-b border-white/5">
                <td className="py-2 px-4 pl-8 text-sm text-mist-gray capitalize">
                  {category.replace('_', ' ')}
                </td>
                {statements.map((s) => (
                  <td key={s.year} className="text-right py-2 px-4 text-sm text-mist-gray">
                    (£{s.costs.byCategory[category].toLocaleString()})
                  </td>
                ))}
                <td />
              </tr>
            );
          })}

          {/* Gross Profit */}
          <tr className="border-t-2 border-white/20">
            <td className="py-3 px-4 font-medium text-photon-white">Gross Profit</td>
            {statements.map((s) => (
              <td
                key={s.year}
                className={`text-right py-3 px-4 font-medium ${
                  s.grossProfit >= 0 ? 'text-deep-teal' : 'text-red-400'
                }`}
              >
                £{s.grossProfit.toLocaleString()}
              </td>
            ))}
            <td />
          </tr>

          {/* Tax */}
          <tr className="border-b border-white/10">
            <td className="py-3 px-4 text-mist-gray">Tax</td>
            {statements.map((s) => (
              <td key={s.year} className="text-right py-3 px-4 text-mist-gray">
                (£{s.tax.toLocaleString()})
              </td>
            ))}
            <td />
          </tr>

          {/* Net Profit */}
          <tr className="bg-pellucid-cyan/10">
            <td className="py-3 px-4 font-bold text-pellucid-cyan">Net Profit</td>
            {statements.map((s) => (
              <td
                key={s.year}
                className={`text-right py-3 px-4 font-bold ${
                  s.netProfit >= 0 ? 'text-pellucid-cyan' : 'text-red-400'
                }`}
              >
                £{s.netProfit.toLocaleString()}
              </td>
            ))}
            <td className="text-right py-3 px-4">
              <ChangeIndicator
                current={statements[statements.length - 1]?.netProfit || 0}
                previous={statements[0]?.netProfit || 0}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Cash Flow Statement
function CashFlowStatement({ statements }: { statements: CashFlow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-mist-gray font-medium">Item</th>
            {statements.map((s) => (
              <th key={s.year} className="text-right py-3 px-4 text-mist-gray font-medium">
                {s.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-white/10">
            <td className="py-3 px-4 text-photon-white">Operating Cash Flow</td>
            {statements.map((s) => (
              <td
                key={s.year}
                className={`text-right py-3 px-4 ${
                  s.operatingCashFlow >= 0 ? 'text-deep-teal' : 'text-red-400'
                }`}
              >
                £{s.operatingCashFlow.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr className="border-b border-white/10">
            <td className="py-3 px-4 text-photon-white">Investing Cash Flow</td>
            {statements.map((s) => (
              <td key={s.year} className="text-right py-3 px-4 text-mist-gray">
                £{s.investingCashFlow.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr className="border-b border-white/10">
            <td className="py-3 px-4 text-photon-white">Financing Cash Flow</td>
            {statements.map((s) => (
              <td key={s.year} className="text-right py-3 px-4 text-mist-gray">
                £{s.financingCashFlow.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr className="bg-white/5">
            <td className="py-3 px-4 font-medium text-photon-white">Net Cash Flow</td>
            {statements.map((s) => (
              <td
                key={s.year}
                className={`text-right py-3 px-4 font-medium ${
                  s.netCashFlow >= 0 ? 'text-deep-teal' : 'text-red-400'
                }`}
              >
                £{s.netCashFlow.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr className="border-t-2 border-white/20 bg-pellucid-cyan/10">
            <td className="py-3 px-4 font-bold text-pellucid-cyan">Closing Cash Balance</td>
            {statements.map((s) => (
              <td key={s.year} className="text-right py-3 px-4 font-bold text-pellucid-cyan">
                £{s.closingBalance.toLocaleString()}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Balance Sheet Statement
function BalanceSheetStatement({ statements }: { statements: BalanceSheet[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-mist-gray font-medium">Item</th>
            {statements.map((s) => (
              <th key={s.year} className="text-right py-3 px-4 text-mist-gray font-medium">
                {s.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Assets */}
          <tr className="bg-deep-teal/10">
            <td className="py-3 px-4 font-medium text-deep-teal" colSpan={statements.length + 1}>
              ASSETS
            </td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-2 px-4 pl-8 text-mist-gray">Cash</td>
            {statements.map((s) => (
              <td key={s.year} className="text-right py-2 px-4 text-mist-gray">
                £{s.assets.currentAssets.cash.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-2 px-4 pl-8 text-mist-gray">Receivables</td>
            {statements.map((s) => (
              <td key={s.year} className="text-right py-2 px-4 text-mist-gray">
                £{s.assets.currentAssets.receivables.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-2 px-4 pl-8 text-mist-gray">Fixed Assets</td>
            {statements.map((s) => (
              <td key={s.year} className="text-right py-2 px-4 text-mist-gray">
                £{s.assets.fixedAssets.total.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr className="bg-white/5">
            <td className="py-3 px-4 font-medium text-photon-white">Total Assets</td>
            {statements.map((s) => (
              <td key={s.year} className="text-right py-3 px-4 font-medium text-photon-white">
                £{s.assets.totalAssets.toLocaleString()}
              </td>
            ))}
          </tr>

          {/* Liabilities */}
          <tr className="bg-red-500/10">
            <td className="py-3 px-4 font-medium text-red-400" colSpan={statements.length + 1}>
              LIABILITIES
            </td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-2 px-4 pl-8 text-mist-gray">Payables</td>
            {statements.map((s) => (
              <td key={s.year} className="text-right py-2 px-4 text-mist-gray">
                £{s.liabilities.currentLiabilities.payables.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-2 px-4 pl-8 text-mist-gray">Safeguarded Funds</td>
            {statements.map((s) => (
              <td key={s.year} className="text-right py-2 px-4 text-mist-gray">
                £{s.liabilities.currentLiabilities.safeguarded.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr className="bg-white/5">
            <td className="py-3 px-4 font-medium text-photon-white">Total Liabilities</td>
            {statements.map((s) => (
              <td key={s.year} className="text-right py-3 px-4 font-medium text-photon-white">
                £{s.liabilities.totalLiabilities.toLocaleString()}
              </td>
            ))}
          </tr>

          {/* Equity */}
          <tr className="bg-pellucid-cyan/10">
            <td className="py-3 px-4 font-medium text-pellucid-cyan" colSpan={statements.length + 1}>
              EQUITY
            </td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-2 px-4 pl-8 text-mist-gray">Share Capital</td>
            {statements.map((s) => (
              <td key={s.year} className="text-right py-2 px-4 text-mist-gray">
                £{s.equity.shareCapital.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-2 px-4 pl-8 text-mist-gray">Retained Earnings</td>
            {statements.map((s) => (
              <td
                key={s.year}
                className={`text-right py-2 px-4 ${
                  s.equity.retainedEarnings >= 0 ? 'text-mist-gray' : 'text-red-400'
                }`}
              >
                £{s.equity.retainedEarnings.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr className="bg-pellucid-cyan/20">
            <td className="py-3 px-4 font-bold text-pellucid-cyan">Total Equity</td>
            {statements.map((s) => (
              <td key={s.year} className="text-right py-3 px-4 font-bold text-pellucid-cyan">
                £{s.equity.totalEquity.toLocaleString()}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Change Indicator
function ChangeIndicator({
  current,
  previous,
  inverse = false,
}: {
  current: number;
  previous: number;
  inverse?: boolean;
}) {
  if (previous === 0) return null;

  const change = ((current - previous) / previous) * 100;
  const isPositive = inverse ? change < 0 : change > 0;
  const isNeutral = Math.abs(change) < 1;

  if (isNeutral) {
    return <Minus size={14} className="inline text-mist-gray" />;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${
        isPositive ? 'text-deep-teal' : 'text-red-400'
      }`}
    >
      {change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {Math.abs(change).toFixed(0)}%
    </span>
  );
}
