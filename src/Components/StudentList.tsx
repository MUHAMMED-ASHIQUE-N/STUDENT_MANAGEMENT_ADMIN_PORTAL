
import React from 'react';
import type { StudentDetails, Coursetype } from '../type/auth';
import { deleteStudent } from '../utils/studentUtils';
import { format } from 'date-fns';
import Edit from '../assets/edit2.png'
import Delete from '../assets/delete.png'

function StudentList({ onEdit, courses, students }: { onEdit: (student: any) => void; courses: Coursetype[]; students: StudentDetails[] }) {

  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  const handleDelete = async (student: StudentDetails) => {
    await deleteStudent(student.id, student.name, student.email, student.courseId);
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
      <div className="overflow-x-auto">
        <table className="w-full text- text-gray-700">
          <thead>
            <tr className=" border-b-3 border-gray-400 text-blue-500 rounded-xl">
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
            {students.length > 0 ? students.map((student) => (
              <tr key={student.id} className="hover:bg-blue-100 transition-colors rounded-xl text-sm lg:text-md overflow-hidden nth-[odd]:bg-blue-50">
                <td className="py-3 px-4"> <input type="checkbox" /></td>
                <td className="py-3 px-4">{student.name}</td>
                <td className="py-3 px-4 text-blue-500">{student.id}</td>
                <td className="py-3 px-4 text-blue-500">{student.email}</td>
                <td className="py-3 px-4">{student.createdAt ? format(student.createdAt.toDate(), "dd MMM yyyy") : "N/A"} </td>
                <td className="py-3 px-4">{getCourseName(student.courseId)}</td>
                <td className="py-3 px-4 relative group">
                  <div className="  mt- flex justify-  items-start bg-amber- px-2 py-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="w-full px- py- hover:bg-blue-100 hover:text-teal-700 cursor-pointer "
                    >
                      <img src={Edit} alt="" className="w-5 h-5 " />
                    </button>
                    <button
                      onClick={() => handleDelete(student)}
                      className="w-full px- py- hover:bg-blue-100 text-red-500  cursor-pointer"
                    >
                      <img src={Delete} alt="" className="w-6 h-5 " />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No students found!!
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