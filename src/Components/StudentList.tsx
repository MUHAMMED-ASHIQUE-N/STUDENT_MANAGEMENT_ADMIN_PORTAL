import React, { useEffect } from 'react'
import { useStudent } from '../context/StudentContext'
import type { Coursetype } from '../type/auth';

function StudentList( {onEdit, courses} : {onEdit: (student:any) => void; courses:Coursetype[];}) {
    const { subscribeStudents, deleteStudent, stdDetails} = useStudent()

      useEffect(()=>{
        const unsubscribe = subscribeStudents();
        return () => unsubscribe();
      },[]);
    
      const getCourseName = (courseId:string) => {
        const course = courses.find((c) => c.id === courseId );
        return course? course.courseName : 'unknow course';

      };
    
  return (
      <div>
        <h1>Student Details</h1>
        {stdDetails?.map((student) => (
          <div
          key={student.id}
           className='bg-white my-4 p-6 flex justify-between items-center'>
            <div>
            <p>{student.name} </p>
            <p>{getCourseName(student.courseId)} </p>
            <p>{student.email} </p>
            <p>{student.paidAmount}fees </p>
            </div>
            <button 
            onClick={() => onEdit(student)}
            className='bg-red-500/80 px-4 py-2 rounded-md text-white'>edit</button>
            <button 
            onClick={() => deleteStudent(student.id)}
            className='bg-red-500/80 px-4 py-2 rounded-md text-white'>delete</button>
          </div>
        ))}

      </div>
  )
}

export default StudentList



