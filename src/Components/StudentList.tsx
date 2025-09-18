
import React from 'react';
import type { StudentDetails, Coursetype } from '../type/auth';
import {  deleteStudent } from '../utils/studentUtils';
import { format } from 'date-fns';
import Edit from '../assets/edit2.png'
import Delete from '../assets/delete.png'

function StudentList({ onEdit, courses, students }: { onEdit: (student: any) => void; courses: Coursetype[]; students:StudentDetails[] }) {

  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  const handleDelete = async (student: StudentDetails) => {
    await deleteStudent(student.id, student.name, student.email, student.courseId);
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
      {/* <h2 className="text-2xl font-bold mb-6 text-green-700">Student List</h2> */}
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
              <tr key={student.id} className="hover:bg-blue-50 transition-colors rounded-xl text-sm lg:text-md overflow-hidden">
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
                          {/* <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      </svg> */}

                      
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
            )): (
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









// import React, { useEffect, useState } from 'react';
// import type { StudentDetails, Coursetype } from '../type/auth';
// import { subscribeStudents, deleteStudent } from '../utils/studentUtils';
// import { format } from 'date-fns';

// function StudentList({ onEdit, courses }: { onEdit: (student: any) => void; courses: Coursetype[] }) {
//   const [students, setStudents] = useState<StudentDetails[]>([]);

//   useEffect(() => {
//     const unsubscribe = subscribeStudents((data) => {
//       setStudents(data);
//     });
//     return () => unsubscribe();
//   }, []);

//   const getCourseName = (courseId: string) => {
//     const course = courses.find((c) => c.id === courseId);
//     return course ? course.title : 'Unknown Course';
//   };

//   const handleDelete = async (student: StudentDetails) => {
//     await deleteStudent(student.id, student.name, student.email, student.courseId);
//   };

//   return (
//     <div className="mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6">
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[600px] text-gray-700 text-sm sm:text-base">
//           <thead>
//             <tr className="bg-blue-50 text-blue-600 uppercase text-xs sm:text-sm">
//               <th className="p-3"> </th>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Student ID</th>
//               <th className="p-3 text-left">Email ID</th>
//               <th className="p-3 text-left">Date</th>
//               <th className="p-3 text-left">Course</th>
//               <th className="p-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.map((student) => (
//               <tr key={student.id} className="hover:bg-blue-50 transition-colors text-sm sm:text-base">
//                 <td className="p-3">
//                   <input type="checkbox" className="w-4 h-4 sm:w-5 sm:h-5" />
//                 </td>
//                 <td className="p-3">{student.name}</td>
//                 <td className="p-3 text-blue-500">{student.id}</td>
//                 <td className="p-3 text-blue-500 break-all">{student.email}</td>
//                 <td className="p-3 whitespace-nowrap">
//                   {student.createdAt ? format(student.createdAt.toDate(), "dd MMM yyyy") : "N/A"}
//                 </td>
//                 <td className="p-3">{getCourseName(student.courseId)}</td>
//                 <td className="p-3 relative group">
//                   <div className="flex space-x-1">
//                     <button
//                       onClick={() => onEdit(student)}
//                       className="p-2 hover:bg-blue-100 rounded-md transition-colors"
//                     >
//                       <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                         <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={() => handleDelete(student)}
//                       className="p-2 hover:bg-blue-100 rounded-md transition-colors"
//                     >
//                       <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M6 2a1 1 0 011-1h6a1 1 0 011 1v1h5a1 1 0 110 2h-1v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5H2a1 1 0 110-2h5V2zm2 4a1 1 0 00-1 1v8a1 1 0 102 0V7a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v8a1 1 0 102 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
//                       </svg>
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {students.length === 0 && (
//               <tr>
//                 <td colSpan={7} className="text-center py-6 text-gray-500">
//                   No students available.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default StudentList;


