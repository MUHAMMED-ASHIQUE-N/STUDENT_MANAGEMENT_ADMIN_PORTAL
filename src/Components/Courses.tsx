import { deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../firebase/config';
import { type Coursetype } from '../type/auth';
import CourseList from './CourseList';
import { createCourse, subscribeCourse, updateCourse } from '../utils/courseUtils';

function Courses() {
  const [courses, setCourses] = useState<Coursetype[] | undefined>(undefined);
  const [editId, setEditId] = useState<string | null>(null)

    const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    duration:0,
    fees: {
      courseFee: 0,
      admissionFee: 0,
    },
    checkpoints: [{ title: "",amount:0, dueOrder: 0}]
  });  

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

   
  const totalFee = Number(course.fees.courseFee ) + Number(course.fees.admissionFee) 
  
    // Add checkpoint row
  const addCheckpoint = () => {
    setCourse((prev:any) => ({
      ...prev,
      checkpoints: [
        ...prev.checkpoints,
        { title: "", amount: 0, dueOrder: prev.checkpoints.length + 1 }
      ]
    }))
  };

  // Handle checkpoint change
  const handleCheckpointChange = (index: number, field: string, value: string | number) => {
    const updated:any = [...course.checkpoints];
    updated[index] = { ...updated[index], [field]: value };
    setCourse((prev) => ({
      ...prev,
      checkpoints:updated
    }))
  };
 

  // ✅ Remove checkpoint
  const removeCheckpoint = (idx: number) => {
    setCourse((prev) => ({
      ...prev,
      checkpoints: prev.checkpoints.filter((_, i) => i !== idx)
    }))
  };

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setCourse((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Handle fee input
  const handleFeeChange = (e:any) => {
    const { name, value } = e.target;
    setCourse((prev) => ({
      ...prev,
      fees: {
        ...prev.fees,
        [name]: value
      }
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    
    try {
      const courseData = { 
        ...course,
            totalFee:
      Number(course.fees.courseFee) 
      // Number(course.fees.admissionFee) +
      // Number(course.fees.cautionDeposit),
  }
      if (editId) {
        updateCourse(editId, courseData);
        setEditId(null);
      }
      else {
        await createCourse(courseData );
      }

    }
    catch (err: any) {
      setError(err.message)
    }
    finally {
      setLoading(false);
      setError("")
    }

       setCourse({
     title: "",
    description: "",
    category: "",
    duration: 0,
    fees: {
      courseFee: 0,
      admissionFee: 0,
    },
    checkpoints: []
    });

  }





  useEffect(() => {
    setLoading(true)
    try {
      const unsubscribe = subscribeCourse((course)=> {
         setCourses(course)
        });
      return () => unsubscribe();
    }
    catch (err: any) {
      setError(err.message)
    }
    finally {
      setLoading(false);
    }

  }, [])


  const formRef = useRef<HTMLDivElement>(null)

    const handleEdit = (selectedCourse:any) => {
    setEditId(selectedCourse.id)
    setCourse(selectedCourse); // fills form with Firestore data
    formRef.current?.scrollIntoView({ behavior: 'smooth' })

  };

  const deleteCourse = async (id: string) => {    
    await deleteDoc(doc(db, "courses", id));
  }



  return (
    <div ref={formRef}>
      <form onSubmit={handleSubmit} action="" className='flex flex-col  items-center'>
        <div className='grid grid-cols-2 gap-4 w-full bg- p-6 space-y-1'>
          <label htmlFor="">Course Name</label>
          <input type="text"
            name='title'
            value={course.title}
            onChange={handleChange }
            placeholder='course Name'
            required
            className='border border-gray-400 rounded-md py-2 px-3' />

          <label>Description</label>
          <textarea
          name='description'
            value={course.description}
            onChange={handleChange}
            placeholder="Course Description"
            className="border border-gray-400 rounded-md py-2 px-3"
          />

          <label>Category/Technology</label>
          <input
            type="text"
            name='category'
            value={course.category}
            onChange={handleChange }
            placeholder="E.g., MERN, Marketing"
            className="border border-gray-400 rounded-md py-2 px-3"
          />

          <label htmlFor="">Course Duration</label>
          <input
            type="text"
            name='duration'
            value={course.duration}
            onChange={handleChange}
            placeholder='course duration in month'
            required
            className='border border-gray-400 rounded-md py-2 px-3' />

          <label htmlFor="">Course Fee </label>
          <input
            type="text"
            name='courseFee'
            value={course.fees.courseFee}
            onChange={handleFeeChange}
            placeholder='course Fees'
            required
            className='border border-gray-400 rounded-md py-2 px-3' />
          <label htmlFor="">Admission Fee </label>
          <input
            type="text"
            name='admissionFee'
            value={course.fees.admissionFee}
            onChange={handleFeeChange}
            placeholder='Admission Fees'
            required
            className='border border-gray-400 rounded-md py-2 px-3' />

            <p>totalFee : {totalFee} </p>

          {/* ✅ Dynamic Payment customCheckpoints */}
          <div className="w-full p-6">
            <h3 className="text-lg font-semibold mb-2">Payment Checkpoints</h3>
            {course.checkpoints.map((cp, idx) => (
              <div key={idx} className="flex gap-2 items-center mb-2">
                <input
                  type="text"
                  value={cp.title}
                  onChange={(e) => handleCheckpointChange(idx, "title", (e.target.value))}
                  placeholder="Checkpoint Title"
                  className="border border-gray-400 rounded-md py-2 px-3"
                />
                <input
                  type="number"
                  value={cp.amount}
                  onChange={(e) => handleCheckpointChange(idx, "amount", Number(e.target.value))}
                  placeholder="Amount"
                  className="border border-gray-400 rounded-md py-2 px-3"
                />
                <input
                  type="number"
                  value={cp.dueOrder}
                  onChange={(e) => handleCheckpointChange(idx, "dueOrder", Number(e.target.value))}
                  placeholder="Due Order"
                  className="border border-gray-400 rounded-md py-2 px-3 w-20"
                />
                <button
                  type="button"
                  onClick={() => removeCheckpoint(idx)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCheckpoint}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              + Add Checkpoint
            </button>
          </div>

        </div>

        <button type="submit" className='bg-blue-500 px-18 py-2 rounded-xl text-white '>
          {loading ? "Saving..." : editId ? "Update course" : "Create course"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <CourseList onEdit={handleEdit} onDelete={deleteCourse} courses={courses} />

    </div>
  )
}

export default Courses  


