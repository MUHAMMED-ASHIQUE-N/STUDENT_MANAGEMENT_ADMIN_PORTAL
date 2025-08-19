import React, { useEffect, useState } from 'react'
import type { StudentDetails, Coursetype } from '../type/auth';
import { subscribeStudents, deleteStudent } from '../utils/studentUtils';


function StudentList({ onEdit, courses }: { onEdit: (student: any) => void; courses: Coursetype[]; }) {

  const [students, setStudents] = useState<StudentDetails[]>([])
  useEffect(() => {
    const unsubscribe = subscribeStudents((data) => {
      setStudents(data);
    })
    return () => unsubscribe();
  }, []);

  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.courseName : 'unknow course';

  };

  const handleDelete = async (id: string) => {
    await deleteStudent(id)
  }

  return (
    <div>
      <h1>Student Details</h1>
      {students?.map((student) => (
        <div
          key={student.id}
          className='bg-white my-4 p-6 flex justify-between items-center'>
          <div>
            <p>{student.name} </p>
            <p>{getCourseName(student.courseId)} </p>
            <p>{student.email} </p>
          </div>
          <button
            onClick={() => onEdit(student)}
            className='bg-red-500/80 px-4 py-2 rounded-md text-white'>edit</button>
          <button
            onClick={() => handleDelete(student.id)}
            className='bg-red-500/80 px-4 py-2 rounded-md text-white'>delete</button>
        </div>
      ))}

    </div>
  )
}

export default StudentList



