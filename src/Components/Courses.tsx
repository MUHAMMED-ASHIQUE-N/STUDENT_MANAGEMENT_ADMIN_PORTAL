import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../firebase/config';
import type { Coursetype } from '../type/auth';
import CourseList from './CourseList';

function Courses() {
  const [ course, setCourse] = useState<Coursetype[] | undefined> (undefined);
  const [ editId, setEditId] = useState<string | null>(null)
  const [ courseName, setCourseName] = useState("");
  const [ duration, setDuration] = useState("");
  const [ fees, setFees] = useState("");
  const [ error, setError] = useState(null);
  const [ loading, setLoading ] = useState(false);

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();

    if(editId){
      updateCourse(editId, courseName, duration, fees );
      setEditId(null);
    }
    else{
       await addDoc(collection(db, "courses"), {
        courseName,
        duration,
        fees,
      });
      console.log('course created');
    }
    setCourseName("");
    setDuration("");
    setFees("");
  }


 const subscribeStudents = () => {
    const courseCollection  = collection(db, "courses");
    const unsubscribe = onSnapshot(courseCollection, (snapshot) => {
      const course: Coursetype[] = snapshot.docs.map(doc => ({
        id: doc.id, ...(doc.data() as Omit<Coursetype, "id">)
       
      }));

      setCourse(course)
    });

    return unsubscribe;
  }

  const updateCourse = async (id:string, courseName:string, duration:string, fees:string) => {
    setLoading(true)
    try  {
      const courseRef = doc(db, "courses", id);
      await updateDoc(courseRef, { courseName, duration, fees });

    }
    catch(err:any) {
      setError(err.message);
    }
    finally{
      setLoading(false)
    }
  }


  useEffect(() => {
    setLoading(true)
    try {
      const unsubscribe = subscribeStudents();
      return () => unsubscribe();
    }
    catch(err:any) {
      setError(err.message)
    }
    finally {
      setLoading(false);
    }

  },[])


  const formRef = useRef<HTMLDivElement>(null)

 const handleEdit = (data:any) => {
  setEditId(data.id)
  setCourseName(data.courseName);
  setDuration(data.duration);
  setFees(data.fees)
  formRef.current?.scrollIntoView({ behavior: 'smooth' })
 }

    
const deleteCourse = async (id:string) => {

  await deleteDoc(doc(db, "courses", id)) ;

}



  return (
    <div ref={formRef}>
     <form onSubmit={handleSubmit} action="" className='flex flex-col  items-center'>
          <div className='grid grid-cols-2 gap-4 w-full bg- p-6 space-y-1'>
            <label htmlFor="">Course Name</label>
            <input type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder='course Name'
              required
              className='border border-gray-400 rounded-md py-2 px-3' />
            <label htmlFor="">Course Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder='course duration in month'
              required
              className='border border-gray-400 rounded-md py-2 px-3' />
           
                <label htmlFor="">Course Fee </label>
                <input
                  type="text"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  placeholder='course Fees'
                  required
                  className='border border-gray-400 rounded-md py-2 px-3' />
          </div>

          <button type="submit" className='bg-blue-500 px-18 py-2 rounded-xl text-white '>
            {loading ? "Saving..." : editId ? "Update course" : "Create course"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
   {/* <div>
        <h1>course Details</h1>
        {course?.map((data) => (
          <div
          key={data.id}
           className='bg-white my-4 p-6 flex justify-between items-center'>
            <div>
            <p>{data.courseName} </p>
            <p>{data.duration} </p>
            <p>{data.fees} </p>
            </div>
            <button 
            onClick={() => handleEdit(data)}
            className='bg-red-500/80 px-4 py-2 rounded-md text-white'>edit</button>
            <button 
            onClick={() => deleteCourse(data.id)}
            className='bg-red-500/80 px-4 py-2 rounded-md text-white'>delete</button>
          </div>
        ))}

      </div> */}
        <CourseList onEdit={handleEdit} onDelete={deleteCourse} course={course} />

    </div>
  )
}

export default Courses