import React, { useState } from 'react'
import { BsPersonFill } from 'react-icons/bs'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useDash } from '../context/DashContext'

function StudentGraph() {
  const { totalStudents, studentGraphDataDaily, studentGraphDataMonthly } = useDash()
  const [view, setView] = useState<'daily' | 'monthly'>('daily')

  const graphData =
    view === 'monthly' ? studentGraphDataMonthly : studentGraphDataDaily

  const chartHeight = graphData.length > 20 ? 300 : 220

  return (
    <div className="w-full">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex gap-3 sm:gap-4 items-center sm:pl-6">
            <div className="p-2 md:p-3 bg-blue-100 rounded-full flex-shrink-0">
              <BsPersonFill size={24} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <h3 className="text-xl sm:text-3xl font-bold text-gray-800">
                {totalStudents}
              </h3>
            </div>
          </div>
          <div className="sm:pr-4">
            <select
              id="view-select"
              value={view}
              onChange={(e) =>
                setView(e.target.value as 'daily' | 'monthly')
              }
              className="w-full sm:w-auto px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Chart Section */}
        <div className="w-full" style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={graphData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                stroke="#888888"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#888888"
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip />
              <Bar
                dataKey="students"
                fill="#8884d8"
                name="Student Count"
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default StudentGraph



