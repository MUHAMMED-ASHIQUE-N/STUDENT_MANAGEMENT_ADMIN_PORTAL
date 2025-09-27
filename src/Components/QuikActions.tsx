import React from 'react'
import { BsLightningFill, BsPlusCircleFill } from 'react-icons/bs'
import { useDash } from '../context/DashContext'
import { useNavigate } from 'react-router-dom';

function QuikActions() {
    const { pendingCertificates } = useDash();
    const navigate = useNavigate()
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                    <BsLightningFill size={24} className="text-yellow-500" />
                </div>
                <h4 className="text-lg font-semibold text-gray-700">Quick Actions</h4>
            </div>
            <div className="space-y-4">
                <button
                    onClick={() => navigate("/institution/students")} // go to students page
                    className="w-full flex items-center justify-between px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer"
                >
                    <span className="font-medium">Add New Student</span>
                    <BsPlusCircleFill size={20} />
                </button>
                <button
                    onClick={() => navigate("/institution/courses")} // go to students page
                    className="w-full flex items-center justify-between px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer"
                >
                    <span className="font-medium">Add New Courses</span>
                    <BsPlusCircleFill size={20} />
                </button>
                <a href="#" className="flex items-center justify-between px-4 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 shadow-md">
                    <span className="font-medium">Pending Certificates</span>
                    <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{pendingCertificates}</span>
                </a>
            </div>
        </div>
    )
}

export default QuikActions