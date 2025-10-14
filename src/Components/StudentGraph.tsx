import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDash } from '../context/DashContext';

function StudentGraph() {
  const {studentGraphDataDaily, studentGraphDataMonthly } = useDash()
  const [view, setView] = useState<'daily' | 'monthly'>('daily')

  const graphData =
    view === 'monthly' ? studentGraphDataMonthly : studentGraphDataDaily


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Student Enrollment</h2>
          <p className="text-sm text-gray-500 mt-1">Enrollment trend</p>
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
      <div style={{ height: 300, overflow:'hidden' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={graphData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} fontSize={12}/>
            <YAxis stroke="#888888" tickLine={false} axisLine={false} width={40} />
            <Tooltip />
            <Bar dataKey="students" fill="#3b82f6" name="Students" barSize={30} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StudentGraph;

