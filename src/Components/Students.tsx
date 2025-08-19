import React, { useEffect, useRef, useState } from 'react'
import { useStudent } from '../context/StudentContext';
import StudentList from './StudentList';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Coursetype } from '../type/auth';

function Students() {

  const { createStudent, loading, error, updatedStudent } = useStudent();

  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState<Coursetype[]>([]);



  useEffect(() => {

    const fetchCourses = async () => {
      const snapshot = await getDocs(collection(db, "courses"));
      setCourses(snapshot.docs.map(doc => ({
        id: doc.id, ...(doc.data() as Omit<Coursetype, "id">)
      })));
    }
    fetchCourses();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editId) {
      updatedStudent(editId, name, email, courseId, paidAmount);
      console.log('student edit success');
      setEditId(null)

    }
    else {
      await createStudent(name, email, password, courseId, paidAmount);
      console.log('student create successfullyyy', name, paidAmount);
    }


    setName("")
    setEmail("")
    setPassword("")
    setCourseId("")
    setPaidAmount(0)

  }

  const formRef = useRef<HTMLDivElement>(null);

  const handleEdit = (student: any) => {
    setEditId(student.id);
    setName(student.name);
    setEmail(student.email);
    setCourseId(student.courseId);
    setPaidAmount(student.paidAmount);
    setPassword("");

    formRef.current?.scrollIntoView({ behavior: "smooth" });

  }

  return (
    <div className='p-8'>
      <div
        ref={formRef}
        className='w-1/2 bg-white border-t-6 rounded-2xl border-blue-500 p-6 '>
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


            <label htmlFor="course">select course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.courseName}
                </option>
              ))}
            </select>


            <label htmlFor="">Amount Paid</label>
            <input type="text"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              placeholder='Amound paid'
              required
              className='border border-gray-400 rounded-md py-2 px-3 ' />
          </div>

          <button type="submit" className='bg-blue-500 px-18 py-2 rounded-xl text-white '>
            {loading ? "Saving..." : editId ? "Update Student" : "Create Student"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>

      <StudentList onEdit={handleEdit} courses={courses} />


    </div>
  )
}

export default Students