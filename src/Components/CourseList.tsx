import React, { useState } from "react";
import { Trash2, BookOpen } from "lucide-react";
import type { Coursetype } from "../type/auth";
import CourseCard from "./CourseCard";

interface CourseListProps {
  onEdit: (data: Coursetype) => void;
  onDelete: (dataId: string) => void;
  courses: Coursetype[] | undefined;
}

function CourseList({ onEdit, onDelete, courses }: CourseListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null | undefined>(null);

  if (courses && courses.length > 0) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((data) => (
            <CourseCard
              key={data.id}
              data={data}
              onEdit={onEdit}
              setDeleteConfirm={setDeleteConfirm}
            />
          ))}
        </div>

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Delete Course?
                </h3>
                <p className="text-gray-600">
                  This action cannot be undone. Are you sure?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirm) {
                      onDelete(deleteConfirm);
                      setDeleteConfirm(null);
                    }
                  }}
                  className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <BookOpen size={64} className="text-blue-400" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        No Courses Available
      </h2>
      <p className="text-gray-600 text-center max-w-md">
        Add your first course to get started. Create engaging learning
        experiences for your students.
      </p>
    </div>
  );
}

export default CourseList;
