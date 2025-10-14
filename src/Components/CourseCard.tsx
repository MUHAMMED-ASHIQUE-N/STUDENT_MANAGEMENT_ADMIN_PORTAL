import React, { useState } from "react";
import {
  Edit,
  Trash2,
  Clock,
  DollarSign,   
  BookOpen,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import type { Coursetype } from "../type/auth";

interface CourseCardProps {
  data: Coursetype;
  onEdit: (data: Coursetype) => void;
  setDeleteConfirm: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

const CourseCard: React.FC<CourseCardProps> = ({
  data,
  onEdit,
  setDeleteConfirm,
}) => {
  const [expandedCard, setExpandedCard] = useState<string | null | undefined>(null);
  const isExpanded = expandedCard === data.id;

 
  const totalFee =
    Number(data.fees?.courseFee || 0) + Number(data.fees?.admissionFee || 0);
    

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300 flex flex-col h-full">
      <div className={`bg-gradient-to-r from-blue-600 to-indigo-600 p-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
        <div className="relative z-10">
          <span
            className={`inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3`}
          >
            {data.category}
          </span>
          <h2 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">
            {data.title}
          </h2>
          <div className="flex items-center gap-2 text-blue-100 text-sm">
            <Sparkles size={14} />
            <span>Premium Course</span>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-2 group-hover:line-clamp-none">
          {data.description}
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center border border-blue-200 hover:border-blue-300 transition-colors">
            <Clock size={16} className="text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600 font-semibold mb-1">Duration</p>
            <p className="text-xl font-bold text-blue-700">{data.duration}</p>
            <p className="text-xs text-gray-500">months</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 text-center border border-green-200 hover:border-green-300 transition-colors">
            <DollarSign size={16} className="text-green-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600 font-semibold mb-1">Course</p>
            <p className="text-xl font-bold text-green-700">
              ₹{data.fees?.courseFee}
            </p>
            <p className="text-xs text-gray-500">fee</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 text-center border border-purple-200 hover:border-purple-300 transition-colors">
            <DollarSign size={16} className="text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600 font-semibold mb-1">Admission</p>
            <p className="text-xl font-bold text-purple-700">
              ₹{data.fees?.admissionFee}
            </p>
            <p className="text-xs text-gray-500">fee</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-3 mb-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              Total Investment
            </span>
            <span className="text-xl font-bold text-slate-900">₹{totalFee}</span>
          </div>
        </div>

        <div className="mb-6 flex-1">
          <button
            onClick={() => setExpandedCard(isExpanded ? null : data.id)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 transition-all"
          >
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600" />
              <span className="font-semibold text-gray-700">
                Payment Checkpoints ({data.checkpoints?.length || 0})
              </span>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-all ${
                isExpanded ? "rotate-180 text-blue-600" : ""
              }`}
            />
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
              {data.checkpoints && data.checkpoints.length > 0 ? (
                data.checkpoints.map((cp, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm">
                            {cp.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Due: Month {cp.dueOrder}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-blue-600 whitespace-nowrap bg-blue-50 px-2 py-1 rounded">
                        ₹{cp.amount}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic bg-gray-50 rounded-lg p-4 text-center">
                  No checkpoints added
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={() => onEdit(data)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Edit size={18} />
            Edit
          </button>
          <button
            onClick={() => setDeleteConfirm(data.id)}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;









