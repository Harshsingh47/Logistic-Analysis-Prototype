import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, AlertCircle } from 'lucide-react';

interface ResultsDisplayProps {
  query: string;
  result: {
    type: 'bar' | 'line' | 'pie' | 'table' | 'metric';
    data: any[];
    title: string;
    description: string;
    chartConfig?: {
      xKey: string;
      yKey: string;
      label?: string;
    };
    metrics?: {
      label: string;
      value: string | number;
      trend?: string;
    }[];
  };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function ResultsDisplay({ query, result }: ResultsDisplayProps) {
  // Ensure data has unique keys by adding index and timestamp
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const chartData = result.data.map((item, idx) => ({
    ...item,
    _uniqueId: `${uniquePrefix}-${idx}`,
    _key: `${uniquePrefix}-${idx}`
  }));

  const renderChart = () => {
    if (result.type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={400} key={`bar-${uniquePrefix}`}>
          <BarChart data={chartData} key={`bar-chart-${uniquePrefix}`}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey={result.chartConfig?.xKey}
              tick={{ fill: '#64748b', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
            />
            <Legend />
            <Bar
              dataKey={result.chartConfig?.yKey}
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              name={result.chartConfig?.label || result.chartConfig?.yKey}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (result.type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={400} key={`line-${uniquePrefix}`}>
          <LineChart data={chartData} key={`line-chart-${uniquePrefix}`}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey={result.chartConfig?.xKey}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={result.chartConfig?.yKey}
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              name={result.chartConfig?.label || result.chartConfig?.yKey}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (result.type === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={400} key={`pie-${uniquePrefix}`}>
          <PieChart key={`pie-chart-${uniquePrefix}`}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={entry._uniqueId} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (result.type === 'table') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                {Object.keys(result.data[0] || {}).map((key, idx) => (
                  <th key={`header-${idx}-${key}`} className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.data.slice(0, 10).map((row, idx) => (
                <tr key={`row-${idx}-${JSON.stringify(row).substring(0, 20)}`} className="border-b border-slate-100 hover:bg-slate-50">
                  {Object.entries(row).map(([key, value]: [string, any], cellIdx) => (
                    <td key={`cell-${idx}-${cellIdx}-${key}`} className="px-4 py-3 text-sm text-slate-600">
                      {typeof value === 'number' ? value.toLocaleString() : value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {result.data.length > 10 && (
            <p className="text-sm text-slate-500 mt-3 text-center">
              Showing 10 of {result.data.length} results
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  const getIcon = () => {
    switch (result.type) {
      case 'bar':
        return <BarChart3 className="w-5 h-5 text-white" />;
      case 'line':
        return <TrendingUp className="w-5 h-5 text-white" />;
      case 'pie':
        return <PieChartIcon className="w-5 h-5 text-white" />;
      default:
        return <AlertCircle className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-lg p-2 mt-1">
            {getIcon()}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">{result.title}</h3>
            <p className="text-sm text-blue-100">{result.description}</p>
            <div className="mt-2 px-3 py-1 bg-white/20 rounded-lg inline-block">
              <p className="text-xs text-white">Query: "{query}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      {result.metrics && result.metrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50 border-b border-slate-200">
          {result.metrics.map((metric, idx) => (
            <div key={`metric-${idx}-${metric.label}`} className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
              {metric.trend && (
                <p className="text-xs text-green-600 mt-1">{metric.trend}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Chart/Table */}
      <div className="p-6">
        {renderChart()}
      </div>
    </div>
  );
}
