import React, { useEffect, useRef, useState } from 'react'
import { createStudent, updatedStudent } from '../utils/studentUtils';
import StudentList from './StudentList';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Coursetype } from '../type/auth';

function Students() {


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admissionFee, setAdmissionFee] = useState(0);
  const [advanceFee, setAdvanceFee] = useState(0);
  // const [checkpoint, setCheckpoint] = useState('');
  const [checkpointNO, setCheckpointNO] = useState(0);
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<string | null>(null)
  const [courses, setCourses] = useState<Coursetype[]>([]);


  useEffect(() => {
    if (courseId) {
      const selectedCourse = courses.find(c => c.id === courseId);
      if (selectedCourse) {
        setCheckpointNO(selectedCourse.defaultCheckpoint || 1);
      }
    }
  }, [courseId, courses]);


  const selectedCourse = courses.find(c => c.id === courseId);
  const totalFee = (Number(selectedCourse?.fees) || 0) + (Number(selectedCourse?.admissionfee) || 0);
  const totalCoursefee = Number(selectedCourse?.fees) || 0
  // const perCheckpointFee = checkpointNO > 0 ? Math.round(totalFee / checkpointNO) : 0;


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
    setLoading(true)
    try {
      if (editId) {
        await updatedStudent(editId, name, email, courseId, admissionFee, advanceFee);
        console.log('student edit success');
        setEditId(null)

      }
      else {
        await createStudent(name, email, password, courseId, admissionFee, advanceFee, checkpointNO)
        console.log('student created successfully');

      }
    }
    catch (err: any) {
      setError(err.message,), console.log('somthing worng cannot create srudent');

    }
    finally {
      setLoading(false)
      setError("")
    }

    setName("")
    setEmail("")
    setPassword("")
    setCourseId("")
    setAdmissionFee(0)
    setAdvanceFee(0)
  }


  const formRef = useRef<HTMLDivElement>(null);

  const handleEdit = (student: any) => {
    setEditId(student.id);
    setName(student.name);
    setEmail(student.email);
    setCourseId(student.courseId);
    setAdmissionFee(student.admissionFee);
    setAdvanceFee(student.advanceFee);
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

            <label className="block mb-2 font-semibold">Checkpoint</label>
            <select
              value={checkpointNO}
              onChange={(e) => setCheckpointNO(Number(e.target.value))}
              className="border px-2 py-1 rounded"
            >
              {Array.from({ length: (selectedCourse?.defaultCheckpoint || selectedCourse?.duration) || 0 }, (_, i) => i + 1).map((cp) => (
                <option key={cp} value={cp}>
                  {cp} month{cp > 1 ? 's' : ''} (₹{Math.round(totalCoursefee / cp)})
                </option>
              ))}
            </select>
            <label htmlFor="">Admission Fee</label>
            <input type="text"
              value={admissionFee}
              onChange={(e) => setAdmissionFee(Number(e.target.value))}
              placeholder='Admission fee'
              className='border border-gray-400 rounded-md py-2 px-3 ' />

            <label htmlFor="">Advance Fee</label>
            <input type="text"
              value={advanceFee}
              onChange={(e) => setAdvanceFee(Number(e.target.value))}
              placeholder='Advance fee'
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