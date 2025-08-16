import React, { useContext, useEffect, useState } from 'react'
import { useStudent } from '../context/StudentContext';
import StudentList from './StudentList';

function Students() {

  // const { createStudent } = useContext(StudentContext)!;
  const { createStudent, loading, error, updatedStudent, stdDetails } = useStudent();

  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editId) {
      updatedStudent(editId, name, email, course);
      console.log('student edit success');
      setEditId(null)

    }
    else {
      await createStudent(name, email, password, course);
      console.log('student create successfullyyy', name, email, course);
    }


    setName("")
    setEmail("")
    setPassword("")
    setCourse("")

  }

  const handleEdit = (student: any) => {
    setEditId(student.id);
    setName(student.name);
    setEmail(student.email);
    setCourse(student.course);
    setPassword("");

  }

  return (
    <div className='p-8'>
      <div className='w-1/2 bg-white border-t-6 rounded-2xl border-blue-500 p-6 '>
        <h1 className='text-center text-2xl'>
          {editId ? "Edit Student" : "Create New Student"}

        </h1>
        <form onSubmit={handleSubmit} action="" className='flex flex-col  items-center'>
          <div className='grid grid-cols-2 gap-4 w-full bg- p-6 space-y-1'>
            <label htmlFor="name">Student Name</label>
            <input type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='name'
              required
              className='border border-gray-400 rounded-md py-2 px-3' />
            <label htmlFor="email">Student Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='email'
              required
              className='border border-gray-400 rounded-md py-2 px-3' />
            {!editId && (
              <>
                <label htmlFor="password">Student Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='password'
                  required
                  className='border border-gray-400 rounded-md py-2 px-3' />
              </>

            )}

            <label htmlFor="course">Student course</label>
            <input type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder='course'
              required
              className='border border-gray-400 rounded-md py-2 px-3 ' />
          </div>

          <button type="submit" className='bg-blue-500 px-18 py-2 rounded-xl text-white '>
            {loading ? "Saving..." : editId ? "Update Student" : "Create Student"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>

      <StudentList onEdit={handleEdit} />


    </div>
  )
}

export default Students