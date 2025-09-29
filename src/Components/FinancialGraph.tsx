import React, { useState } from 'react';
import { BsCashStack } from 'react-icons/bs';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDash } from '../context/DashContext';

function FinancialGraph() {
  const { totalRevenue, totalDues, revenueGraphDataDaily, revenueGraphDataMonthly } = useDash();
  const [view, setView] = useState<'daily' | 'monthly'>('daily');

  const graphData = view === 'monthly' ? revenueGraphDataMonthly : revenueGraphDataDaily;

  const chartHeight = graphData.length > 20 ? 300 : 220;
  const xAxisAngle = graphData.length > 12 ? -30 : 0;
  const labelHeight = graphData.length > 12 ? 60 : 40;

  return (
    <div className="w-full">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-green-100 rounded-full flex-shrink-0">
                <BsCashStack size={24} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  £{totalRevenue.toLocaleString()}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-2">
              <div>
                <p className="text-sm text-gray-500">Total Dues</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  £{totalDues.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
          <div className="sm:pr-4">
            <select
              id="view-select"
              value={view}
              onChange={(e) => setView(e.target.value as 'daily' | 'monthly')}
              className="w-full sm:w-auto px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Chart */}
        <div style={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={graphData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                stroke="#888888"
                tickLine={false}
                axisLine={false}
                angle={xAxisAngle}
                textAnchor={xAxisAngle ? 'end' : 'middle'}
                height={labelHeight}
              />
              <YAxis stroke="#888888" tickLine={false} axisLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalRevenue"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 4, fill: '#8b5cf6' }}
                activeDot={{
                  r: 6,
                  stroke: '#8b5cf6',
                  strokeWidth: 2,
                  fill: '#fff',
                }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default FinancialGraph;
