import { AlertCircle, BookOpen } from 'lucide-react'
import React from 'react'

function SelectField({ label, value, onChange, options, error }: any) {
  return (
    <div className="space-y-2">
      <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
        <BookOpen size={16} className="text-blue-600" />
        {label}
        <span className="text-red-500">*</span>
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none appearance-none ${
          error
            ? "border-red-400 bg-red-50"
            : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
    </div>
)}

export default SelectField