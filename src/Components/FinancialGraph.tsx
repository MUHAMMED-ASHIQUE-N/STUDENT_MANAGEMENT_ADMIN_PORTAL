import React, { useState } from 'react';
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDash } from '../context/DashContext';

function FinancialGraph() {
  const { revenueGraphDataDaily, revenueGraphDataMonthly } = useDash();
  const [view, setView] = useState<'daily' | 'monthly'>('daily');

  const graphData = view === 'monthly' ? revenueGraphDataMonthly : revenueGraphDataDaily;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 ">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Revenue performance</p>
        </div>
        <select
          value={view}
          onChange={(e) => setView(e.target.value as 'daily' | 'monthly')}
          className="px-3 py-2 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div  style={{ height: 300, overflow:'hidden' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis stroke="#888888" tickLine={false} axisLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="totalRevenue"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 5, fill: '#8b5cf6' }}
              activeDot={{ r: 7, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default FinancialGraph;