import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AggregatedDataPoint } from '@analytics-dashboard/shared-types';

interface AnalyticsChartProps {
  data: AggregatedDataPoint[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>No data available for the selected date range.</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: 'var(--color-gray-600)' }}
            tickLine={{ stroke: 'var(--color-gray-300)' }}
            axisLine={{ stroke: 'var(--color-gray-300)' }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12, fill: 'var(--color-gray-600)' }}
            tickLine={{ stroke: 'var(--color-gray-300)' }}
            axisLine={{ stroke: 'var(--color-gray-300)' }}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Sales']}
            labelStyle={{ color: 'var(--color-gray-900)' }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid var(--color-gray-200)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ fill: 'var(--color-primary)', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: 'var(--color-primary-dark)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
