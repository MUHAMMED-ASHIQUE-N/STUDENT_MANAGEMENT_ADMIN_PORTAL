import React from 'react';
import type { StudentDetails, Coursetype } from '../type/auth';
import { deleteStudent } from '../utils/studentUtils';
import { format } from 'date-fns';
import Edit from '../assets/edit2.png'
import Delete from '../assets/delete.png'
import { BsSearch } from 'react-icons/bs';
import altUser from '../assets/user.jpg'

function StudentList({ onEdit, courses, students }: { onEdit: (student: any) => void; courses: Coursetype[]; students: StudentDetails[] }) {

  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  const handleDelete = async (student: StudentDetails) => {
    await deleteStudent(student.id, student.name, student.email, student.courseId);
  };

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-lg p-2 sm:p-4">
      <div className="overflow-x-auto ">
        <div className="rounded-t-2xl px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-sm font-semibold text-slate-700">
              {students.length} Students
            </span>
          </div>
        </div>
        <table className="w-full text-gray-700 text-sm sm:text-base">
          <thead>
            <tr className="bg-slate-100 border-b-3 border-gray-400 text-blue-500 rounded-xl">
              <th></th>
              <th></th> 
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Student ID</th>
              <th className="py-3 px-4 text-left">Email ID</th>
              <th className="py-3 px-4 text-left">Course</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody >
            {students.length > 0 ? students.map((student) => (
              <tr key={student.id} className="p hover:bg-blue-100 transition-colors rounded-xl text-sm lg:text-md overflow-hidden nth-[even]:bg-slate-100 nth-[even]:hover:bg-blue-100 ">
                <td className="py-3 px-4"> <input type="checkbox" className='size-4 '/></td>
                <td className='py-3 '> <img  className='w-8 h-8  rounded-full' src={student?.profilePicUrl || altUser} alt="" /> </td>
                <td className="py-3 px-4">{student.name}</td>
                <td className="py-3 px-4 text-blue-500">{student.studentSeqId}</td>
                <td className="py-3 px-4 ">{student.email}</td>
                <td className="py-3 px-4 text-blue-500">{getCourseName(student.courseId)}</td>
                <td className="py-3 px-4">{student.createdAt ? format(student.createdAt.toDate(), "dd MMM yyyy") : "N/A"} </td>
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
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <BsSearch size={32} className="text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium mb-1">No students found</p>
                    <p className="text-slate-500 text-sm">Try adjusting your search criteria</p>
                  </div>
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