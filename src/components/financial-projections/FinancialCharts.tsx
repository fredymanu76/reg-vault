// REG-VAULT Financial Charts
// Visual analytics using recharts library

import { useFinancialStore } from '@/lib/stores/financialStore';
import { CostCategory } from '@/types/journey';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const COLORS = {
  revenue: '#00D4AA',
  costs: '#FF6B6B',
  profit: '#4ECDC4',
  cash: '#45B7D1',
  categories: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
};

const CATEGORY_COLORS: Record<CostCategory, string> = {
  staff: '#FF6B6B',
  technology: '#9B59B6',
  compliance: '#F39C12',
  professional_fees: '#2ECC71',
  premises: '#E74C3C',
  marketing: '#3498DB',
  insurance: '#8E44AD',
  other: '#95A5A6',
};

export function FinancialCharts() {
  const financialStore = useFinancialStore();
  const statements = financialStore.getStatements();
  const assumptions = financialStore.getAssumptions();

  if (!statements) {
    return (
      <div className="text-center py-12">
        <PieChartIcon size={48} className="mx-auto text-mist-gray mb-4" />
        <h3 className="text-lg font-medium text-photon-white mb-2">Financial Charts</h3>
        <p className="text-mist-gray">
          Complete your financial projections to view charts.
        </p>
      </div>
    );
  }

  // Prepare data for charts
  const pnlData = statements.pnl.map((s) => ({
    year: s.year.toString(),
    Revenue: s.revenue.total,
    Costs: s.costs.total,
    'Net Profit': s.netProfit,
  }));

  const cashFlowData = statements.cashFlow.map((s) => ({
    year: s.year.toString(),
    'Operating': s.operatingCashFlow,
    'Investing': s.investingCashFlow,
    'Financing': s.financingCashFlow,
    'Closing Balance': s.closingBalance,
  }));

  // Cost breakdown for pie chart (Year 1)
  const costBreakdown = Object.entries(statements.pnl[0]?.costs.byCategory || {})
    .filter(([, value]) => value > 0)
    .map(([category, value]) => ({
      name: category.replace('_', ' '),
      value,
      color: CATEGORY_COLORS[category as CostCategory],
    }));

  // Revenue streams for pie chart (Year 1)
  const revenueBreakdown = statements.pnl[0]?.revenue.streams.map((stream) => ({
    name: stream.name,
    value: stream.amount,
  })) || [];

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `£${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `£${(value / 1000).toFixed(0)}K`;
    }
    return `£${value.toFixed(0)}`;
  };

  return (
    <div className="space-y-8">
      {/* Revenue & Profit Trend */}
      <div>
        <h4 className="text-sm font-medium text-photon-white mb-4">Revenue & Profit Trend</h4>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pnlData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.revenue} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.revenue} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.profit} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.profit} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={formatCurrency} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a2e',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="Revenue"
                stroke={COLORS.revenue}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="Net Profit"
                stroke={COLORS.profit}
                fillOpacity={1}
                fill="url(#colorProfit)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue vs Costs Bar Chart */}
      <div>
        <h4 className="text-sm font-medium text-photon-white mb-4">Revenue vs Costs</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pnlData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={formatCurrency} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a2e',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Legend />
              <Bar dataKey="Revenue" fill={COLORS.revenue} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Costs" fill={COLORS.costs} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cash Flow Trend */}
      <div>
        <h4 className="text-sm font-medium text-photon-white mb-4">Cash Position</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cashFlowData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={formatCurrency} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a2e',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Closing Balance"
                stroke={COLORS.cash}
                strokeWidth={3}
                dot={{ fill: COLORS.cash, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <div>
          <h4 className="text-sm font-medium text-photon-white mb-4">Cost Breakdown (Year 1)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: '#666' }}
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div>
          <h4 className="text-sm font-medium text-photon-white mb-4">Revenue Breakdown (Year 1)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: '#666' }}
                >
                  {revenueBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.categories[index % COLORS.categories.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Year 1 Revenue"
          value={statements.pnl[0]?.revenue.total || 0}
          format={formatCurrency}
        />
        <MetricCard
          label="Year 1 Profit Margin"
          value={
            statements.pnl[0]
              ? (statements.pnl[0].netProfit / statements.pnl[0].revenue.total) * 100
              : 0
          }
          format={(v) => `${v.toFixed(1)}%`}
          isPercentage
        />
        <MetricCard
          label="Total Growth"
          value={
            statements.pnl[0] && statements.pnl.slice(-1)[0]
              ? ((statements.pnl.slice(-1)[0].revenue.total - statements.pnl[0].revenue.total) /
                  statements.pnl[0].revenue.total) *
                100
              : 0
          }
          format={(v) => `${v >= 0 ? '+' : ''}${v.toFixed(0)}%`}
          isPercentage
        />
        <MetricCard
          label="Final Cash Position"
          value={statements.cashFlow.slice(-1)[0]?.closingBalance || 0}
          format={formatCurrency}
        />
      </div>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  label: string;
  value: number;
  format: (value: number) => string;
  isPercentage?: boolean;
}

function MetricCard({ label, value, format, isPercentage }: MetricCardProps) {
  const isPositive = value >= 0;

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <p className="text-xs text-mist-gray mb-1">{label}</p>
      <p
        className={`text-xl font-bold ${
          isPercentage
            ? isPositive
              ? 'text-deep-teal'
              : 'text-red-400'
            : 'text-photon-white'
        }`}
      >
        {format(value)}
      </p>
    </div>
  );
}
