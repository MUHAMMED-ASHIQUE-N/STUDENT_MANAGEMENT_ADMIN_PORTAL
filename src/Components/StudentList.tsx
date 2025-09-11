





import React, { useEffect, useState } from 'react';
import type { StudentDetails, Coursetype } from '../type/auth';
import { subscribeStudents, deleteStudent } from '../utils/studentUtils';
import { format } from 'date-fns';

function StudentList({ onEdit, courses }: { onEdit: (student: any) => void; courses: Coursetype[] }) {
  const [students, setStudents] = useState<StudentDetails[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeStudents((data) => {
      setStudents(data);
    });
    return () => unsubscribe();
  }, []);

  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  const handleDelete = async (student: StudentDetails) => {
    await deleteStudent(student.id, student.name, student.email, student.courseId);
  };

  return (
    <div className="mt-18 bg-white rounded-xl shadow-lg p-6">
      {/* <h2 className="text-2xl font-bold mb-6 text-green-700">Student List</h2> */}
      <div className="">
        <table className="w-full text- text-gray-700">
          <thead>
            <tr className="bg-green-  border-b-3 border-gray-400 text-blue-500 rounded-xl">
              <th></th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Student ID</th>
              <th className="py-3 px-4 text-left">Email ID</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Course</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-blue-50 transition-colors rounded-xl text-sm">
                <td className="py-3 px-4"> <input type="checkbox" /></td>
                <td className="py-3 px-4">{student.name}</td>
                <td className="py-3 px-4 text-blue-500">{student.id}</td>
                <td className="py-3 px-4 text-blue-500">{student.email}</td>
                <td className="py-3 px-4">{student.createdAt ? format(student.createdAt.toDate(), "dd MMM yyyy") : "N/A"} </td>
                <td className="py-3 px-4">{getCourseName(student.courseId)}</td>
                <td className="py-3 px-4 relative group">
                  <div className=" right-0 mt-1 flex ">
                    <button
                      onClick={() => onEdit(student)}
                      className="w- text- px- py-2 hover:bg-blue-100 "
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(student)}
                      className=" px-6 py-2 hover:bg-green-100 text-red-500"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 011-1h6a1 1 0 011 1v1h5a1 1 0 110 2h-1v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5H2a1 1 0 110-2h5V2zm2 4a1 1 0 00-1 1v8a1 1 0 102 0V7a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v8a1 1 0 102 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>

                    </button>

                  </div>
                  {/* 

                  <button className="px-3 py-1 bg-blue-100 text-green-700 rounded hover:bg-blue-200">•••</button>
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible z-10">
                    <button
                      onClick={() => onEdit(student)}
                      className="w-full text-left px-4 py-2 hover:bg-green-100 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student)}
                      className="w-full text-left px-4 py-2 hover:bg-green-100 text-sm text-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => console.log('View', student.id)}
                      className="w-full text-left px-4 py-2 hover:bg-green-100 text-sm"
                    >
                      View
                    </button>
                  </div> */}
                </td>


              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No students available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentList;











