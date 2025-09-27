import React from 'react'
import { BsCashStack } from 'react-icons/bs'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useDash } from '../context/DashContext'

function FinancialGraph() {
    const { totalRevenue, totalDues, revenueGraphData } = useDash()
    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                        <BsCashStack size={24} className="text-green-500" />
                    </div>
                    <div className='flex gap-8'>
                        <div>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-800">£{totalRevenue.toLocaleString()}</h3>

                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Dues</p>
                            <h3 className="text-2xl font-bold text-gray-800">£{totalDues.toLocaleString()}</h3>

                        </div>
                    </div>
                </div>
                <div className="h-48 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueGraphData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="totalRevenue"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#8b5cf6' }}
                                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
                                name="Revenue"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default FinancialGraph