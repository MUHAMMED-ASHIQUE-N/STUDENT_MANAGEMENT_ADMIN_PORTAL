import React from 'react'
import { BsBookHalf } from 'react-icons/bs'
import { useDash } from '../context/DashContext'

function ActiveCourse() {
    const { activeCourses, topCourses } = useDash()
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4 mb-4">
                <div className="p-2 md:p-3 bg-purple-100 rounded-full">
                    <BsBookHalf size={24} className="text-purple-500" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Active Courses</p>
                    <h3 className="text-xl sm:text-3xl font-bold text-gray-800">{activeCourses}</h3>
                </div>
            </div>
            <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Top Courses</h4>
                <ul className="space-y-2">
                    {topCourses.length > 0 ? (
                        topCourses.map((course, index) => (
                            <li key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                                <span className="text-gray-800 font-medium">{course.title}</span>
                                <span className="text-sm text-gray-500">{course.students} students</span>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm">No active courses found.</p>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default ActiveCourse