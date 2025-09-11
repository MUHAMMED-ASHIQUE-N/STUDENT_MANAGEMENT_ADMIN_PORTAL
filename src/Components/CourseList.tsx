

import React from 'react'
import type { Coursetype } from '../type/auth'

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
    <div>
      <h1 className="text-xl font-semibold my-4">Course Details</h1>
      {courses?.map((data) => (
        <div
          key={data.id}
          className="bg-white my-4 p-6 rounded-lg shadow-md"
        >
          {/* 🔹 Basic Info */}
          <div className="mb-4">
            <p className="text-lg font-bold">{data.title}</p>
            <p className="text-gray-600">{data.description}</p>
            <p className="text-sm text-blue-600">Category: {data.category}</p>
          </div>

          {/* 🔹 Fees & Duration */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <p><span className="font-semibold">Duration:</span> {data.duration} months</p>
            <p><span className="font-semibold">Course Fee:</span> ₹{data.fees?.courseFee}</p>
            <p><span className="font-semibold">Admission Fee:</span> ₹{data.fees?.admissionFee}</p>
          </div>

          {/* 🔹 Payment Checkpoints */}
          <div className="mb-4">
            <h3 className="font-semibold">Payment Checkpoints:</h3>
            {data.checkpoints?.length > 0 ? (
              <ul className="list-disc list-inside">
                {data.checkpoints.map((cp, index) => (
                  <li key={index}>
                    <span className="font-medium">{cp.title}</span> – ₹{cp.amount} (Due Order: {cp.dueOrder})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No checkpoints added</p>
            )}
          </div>

          {/* 🔹 Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => onEdit(data)}
              className="bg-blue-500 px-4 py-2 rounded-md text-white"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(data.id)}
              className="bg-red-500 px-4 py-2 rounded-md text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CourseList;
