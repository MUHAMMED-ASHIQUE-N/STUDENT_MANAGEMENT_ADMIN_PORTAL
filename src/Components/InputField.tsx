import { AlertCircle } from 'lucide-react'
import React from 'react'

function InputField({ icon: Icon, label, type = "text", value, onChange, placeholder, error, required }: any) {
  return (
             <div className="space-y-2">
       <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
         <Icon size={16} className="text-blue-600" />
         {label}
         {required && <span className="text-red-500">*</span>}
       </label>
       <input
        type={type}
        value={value}
        onChange={onChange}
         placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none ${
          error
            ? "border-red-400 bg-red-50 focus:border-red-500"
            : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />
      {error && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
    </div>

  )
}

export default InputField