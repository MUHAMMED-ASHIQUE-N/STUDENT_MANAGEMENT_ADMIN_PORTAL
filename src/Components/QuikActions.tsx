import React from 'react';
import { Plus } from 'lucide-react';
import { useDash } from '../context/DashContext';
import { useNavigate } from 'react-router-dom';

function QuickActions() {
        const { pendingCertificates } = useDash();
    const navigate = useNavigate()
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
        <p className="text-sm text-gray-500 mt-1">Common tasks</p>
      </div>
      <div className="space-y-3">
        <button
          className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium"
             onClick={() => navigate("/institution/students")}        >
          <span>Add Student</span>
          <Plus size={18} />
        </button>
        <button
          className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 font-medium"
            onClick={() => navigate("/institution/courses")}        >
          <span>Add Course</span>
          <Plus size={18} />
        </button>
        <div className="pt-3 border-t border-gray-200">
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 rounded-lg border border-amber-200 hover:bg-amber-100 transition-all duration-300 font-medium"
            // onClick={onCertificatesClick}
          >
            <span>Certificates</span>
            <span className="text-sm font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">
              {pendingCertificates}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuickActions;