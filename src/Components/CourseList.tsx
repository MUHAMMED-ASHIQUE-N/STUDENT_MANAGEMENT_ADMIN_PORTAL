import React from 'react'
import type { Coursetype } from '../type/auth'

function CourseList({onEdit, onDelete ,course} : {onEdit: (data:any) => void , onDelete: (dataId:string) => void ,course: Coursetype[] | undefined} ) {

  return (
   <div>
        <h1>course Details</h1>
        {course?.map((data) => (
          <div
          key={data.id}
           className='bg-white my-4 p-6 flex justify-between items-center'>
            <div>
            <p>{data.courseName} </p>
            <p>{data.duration} </p>
            <p>{data.fees} </p>
            <p>Admission Fee: {data.admissionfee} </p>
            </div>
            <button 
            onClick={() => onEdit(data)}
            className='bg-red-500/80 px-4 py-2 rounded-md text-white'>edit</button>
            <button 
            onClick={() => onDelete(data.id)}
            className='bg-red-500/80 px-4 py-2 rounded-md text-white'>delete</button>
          </div>
        ))}

      </div>
  )
}

export default CourseList