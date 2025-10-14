import React from 'react';

function StatCard({ title, value, icon, iconBg, iconColor }:any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${iconBg}`}>
          {React.cloneElement(icon, { size: 28, className: iconColor })}
        </div>
      </div>
    </div>
  );
}

export default StatCard;