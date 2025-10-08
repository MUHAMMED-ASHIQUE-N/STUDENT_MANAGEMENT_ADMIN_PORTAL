// import React from 'react';
// import type { Coursetype } from '../type/auth';

// function CourseList({
//   onEdit,
//   onDelete,
//   courses
// }: {
//   onEdit: (data: any) => void;
//   onDelete: (dataId: string) => void;
//   courses: Coursetype[] | undefined;
// }) {
//   return (
//     <div className="">
//       {courses && courses.length > 0 ? (
//         <div className="space-y-4">
//           {courses.map((data) => (
//             <div
//               key={data.id}
//               className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="mb-4">
//                 <h2 className="text-xl font-semibold text-gray-800 uppercase">{data.title}</h2>
//                 <p className="text-gray-600 mt-1">{data.description}</p>
//                 <p className=" text-blue-600 mt-2 capitalize">Category: {data.category}</p>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols- gap-1 mb-4">
//                 <div>
//                   <span className="font-medium">Duration:</span> {data.duration} months
//                 </div>
//                 <div>
//                   <span className="font-medium">Course Fee:</span> ₹{data.fees?.courseFee}
//                 </div>
//                 <div>
//                   <span className="font-medium">Admission Fee:</span> ₹{data.fees?.admissionFee}
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <h3 className="font-semibold mb-2">Payment Checkpoints:</h3>
//                 {data.checkpoints && data.checkpoints.length > 0 ? (
//                   <ul className="list-disc list-inside space-y-1">
//                     {data.checkpoints.map((cp, index) => (
//                       <li key={index} className="text-gray-700">
//                         <span className="font-medium">{cp.title}</span> – ₹{cp.amount} (Due Order: {cp.dueOrder})
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-gray-500 italic">No checkpoints added</p>
//                 )}
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={() => onEdit(data)}
//                   className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => data?.id && onDelete(data.id)}
//                   className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition-colors"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500 italic mt-6">No courses available.</p>
//       )}
//     </div>
//   );
// }

// export default CourseList;



import React from 'react';
import type { Coursetype } from '../type/auth';

function CourseList({
  onEdit,
  onDelete,
  courses
}: {
  onEdit: (data: any) => void;
  onDelete: (dataId: string) => void;
  courses: Coursetype[] | undefined;
}) {
  return (
    <div className="w-full">
      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((data) => (
            <div
              key={data.id}
              className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 flex flex-col"
            >
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold uppercase tracking-wide mb-3">
                    {data.category}
                  </span>
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
                    {data.title}
                  </h2>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-gray-600 mb-6 line-clamp-2">
                  {data.description}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                    <p className="text-xs text-gray-500 font-medium mb-1">Duration</p>
                    <p className="text-lg font-bold text-blue-600">{data.duration}</p>
                    <p className="text-xs text-gray-500">months</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                    <p className="text-xs text-gray-500 font-medium mb-1">Course Fee</p>
                    <p className="text-lg font-bold text-green-600">₹{data.fees?.courseFee}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
                    <p className="text-xs text-gray-500 font-medium mb-1">Admission</p>
                    <p className="text-lg font-bold text-purple-600">₹{data.fees?.admissionFee}</p>
                  </div>
                </div>

                {/* Checkpoints Section */}
                <div className="mb-6 flex-1">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                    Payment Checkpoints
                  </h3>
                  {data.checkpoints && data.checkpoints.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                      {data.checkpoints.map((cp, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 text-sm truncate">
                                {cp.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Due Order: {cp.dueOrder}
                              </p>
                            </div>
                            <span className="text-sm font-bold text-blue-600 whitespace-nowrap">
                              ₹{cp.amount}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm italic bg-gray-50 rounded-lg p-3 text-center">
                      No checkpoints added
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => onEdit(data)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => data?.id && onDelete(data.id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">No courses available</p>
          <p className="text-gray-400 text-sm mt-1">Add your first course to get started</p>
        </div>
      )}
    </div>
  );
}

export default CourseList;