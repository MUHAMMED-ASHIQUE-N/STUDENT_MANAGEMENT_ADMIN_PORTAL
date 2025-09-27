import React from 'react'
import { BsPersonFill } from 'react-icons/bs'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useDash } from '../context/DashContext'

function StudentGraph() {
    const { totalStudents, studentGraphData } = useDash()
    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <BsPersonFill size={24} className="text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Students</p>
                        <h3 className="text-3xl font-bold text-gray-800">{totalStudents}</h3>
                    </div>
                </div>
                <div className="h-48 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={studentGraphData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Bar dataKey="students" fill="#8884d8" name="Student Count" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default StudentGraph