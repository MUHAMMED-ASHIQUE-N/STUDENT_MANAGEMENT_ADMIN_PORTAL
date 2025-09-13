




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
    <div className="max-w-6xl mx-auto md:px-4">
      <h1 className="text-2xl font-bold my-6 text-center text-blue-700">Course Details</h1>
      
      {courses && courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map((data) => (
            <div
              key={data.id}
              className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Basic Info */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 uppercase">{data.title}</h2>
                <p className="text-gray-600 mt-1">{data.description}</p>
                <p className=" text-blue-600 mt-2 capitalize">Category: {data.category}</p>
              </div>

              {/* Fees & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols- gap-1 mb-4">
                <div>
                  <span className="font-medium">Duration:</span> {data.duration} months
                </div>
                <div>
                  <span className="font-medium">Course Fee:</span> ₹{data.fees?.courseFee}
                </div>
                <div>
                  <span className="font-medium">Admission Fee:</span> ₹{data.fees?.admissionFee}
                </div>
              </div>

              {/* Payment Checkpoints */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Payment Checkpoints:</h3>
                {data.checkpoints && data.checkpoints.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {data.checkpoints.map((cp, index) => (
                      <li key={index} className="text-gray-700">
                        <span className="font-medium">{cp.title}</span> – ₹{cp.amount} (Due Order: {cp.dueOrder})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No checkpoints added</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => onEdit(data)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(data.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic mt-6">No courses available.</p>
      )}
    </div>
  );
}

export default CourseList;

