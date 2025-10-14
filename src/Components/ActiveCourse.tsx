import React from 'react';
import { useDash } from '../context/DashContext';

function TopCourses() {
  const { topCourses } = useDash()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Top Courses</h2>
        <p className="text-sm text-gray-500 mt-1">Most enrolled courses</p>
      </div>
      <div className="space-y-3">
        {topCourses?.map((course: any, index: any) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-lg border border-gray-100 hover:border-blue-200 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{course.title}</p>
                <p className="text-xs text-gray-500 mt-1">{course.students} enrolled</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-blue-600">{course.students}</p>
              <p className="text-xs text-gray-500">students</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopCourses;