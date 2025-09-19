// import { deleteDoc, doc } from 'firebase/firestore';
// import React, { useEffect, useRef, useState } from 'react';
// import { db } from '../firebase/config';
// import { type Coursetype } from '../type/auth';
// import CourseList from './CourseList';
// import { createCourse, subscribeCourse, updateCourse } from '../utils/courseUtils';

// function Courses() {
//   const [courses, setCourses] = useState<Coursetype[] | undefined>(undefined);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [course, setCourse] = useState({
//     title: "",
//     description: "",
//     category: "",
//     duration: 0,
//     fees: {
//       courseFee: 0,
//       admissionFee: 0,
//     },
//     checkpoints: [{ title: "", amount: 0, dueOrder: 0 }]
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [formOpen, setFormOpen] = useState(false)


//   const totalFee = Number(course.fees.courseFee) + Number(course.fees.admissionFee);

//   const addCheckpoint = () => {
//     setCourse((prev: any) => ({
//       ...prev,
//       checkpoints: [
//         ...prev.checkpoints,
//         { title: "", amount: 0, dueOrder: prev.checkpoints.length + 1 }
//       ]
//     }));
//   };

//   const handleCheckpointChange = (index: number, field: string, value: string | number) => {
//     const updated: any = [...course.checkpoints];
//     updated[index] = { ...updated[index], [field]: value };
//     setCourse((prev) => ({
//       ...prev,
//       checkpoints: updated
//     }));
//   };

//   const removeCheckpoint = (idx: number) => {
//     setCourse((prev) => ({
//       ...prev,
//       checkpoints: prev.checkpoints.filter((_, i) => i !== idx)
//     }));
//   };

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setCourse((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFeeChange = (e: any) => {
//     const { name, value } = e.target;
//     setCourse((prev) => ({
//       ...prev,
//       fees: {
//         ...prev.fees,
//         [name]: value
//       }
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const courseData = {
//         ...course,
//         totalFee: totalFee
//       };
//       if (editId) {
//         await updateCourse(editId, courseData);
//         setEditId(null);
//       } else {
//         await createCourse(courseData);
//       }
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//       setError("");
//     }
//     setCourse({
//       title: "",
//       description: "",
//       category: "",
//       duration: 0,
//       fees: {
//         courseFee: 0,
//         admissionFee: 0,
//       },
//       checkpoints: []
//     });
//   };

//   useEffect(() => {
//     setLoading(true);
//     try {
//       const unsubscribe = subscribeCourse((course) => {
//         setCourses(course);
//       });
//       return () => unsubscribe();
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//   if (formOpen && formRef.current) {
//     formRef.current.scrollIntoView({ behavior: 'smooth' });
//   }
// }, [formOpen]);


//   const formRef = useRef<HTMLDivElement>(null);

//   const handleEdit = (selectedCourse: any) => {
//     setFormOpen(true)
//     setEditId(selectedCourse.id);
//     setCourse(selectedCourse);
//     formRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const deleteCourse = async (id: string) => {
//     await deleteDoc(doc(db, "courses", id));
//   };

//   return (
//     <div className="md:p-4 ">
//       <div className='flex justify-end'>
//         <button
//           onClick={() => setFormOpen(!formOpen)}
//           className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors  capitalize"
//         >
//           {formOpen ? "Cancel" : "+ Create New course"}
//         </button>
//       </div>
      
//       {formOpen && (
//       <div ref={formRef}
//   //      className={`bg-white border-t-6 border-blue-500 p-6 rounded-3xl shadow-md overflow-hidden transition-all duration-300 ease-in-out ${
//   //   formOpen ? " opacity-100 p-4 md:p-6" : "max-h-0 opacity-0 p-0"}
//   // }`}

//         className={`overflow-hidden transition-all duration-700 ease-in-out ${
//           formOpen ? "max-h-[2000px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"
//         }`}
//       //  className="bg-white border-t-6 border-blue-500 p-6 rounded-3xl shadow-md max-w-6xl mx-auto mt-6  " 
//        >
//         <h2 className="text-2xl font-bold mb-4 text-center">{editId ? "Edit Course" : "Create New Course"}</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="flex flex-col">
//               <label className="mb-1 font-medium">Course Name</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={course.title}
//                 onChange={handleChange}
//                 placeholder="Course Name"
//                 required
//                 className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium">Category/Technology</label>
//               <input
//                 type="text"
//                 name="category"
//                 value={course.category}
//                 onChange={handleChange}
//                 placeholder="E.g., MERN, Marketing"
//                 className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium">Course Duration (Months)</label>
//               <input
//                 type="number"
//                 name="duration"
//                 value={course.duration}
//                 onChange={handleChange}
//                 placeholder="Duration in months"
//                 required
//                 className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium">Course Fee</label>
//               <input
//                 type="number"
//                 name="courseFee"
//                 value={course.fees.courseFee}
//                 onChange={handleFeeChange}
//                 placeholder="Course Fee"
//                 required
//                 className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium">Admission Fee</label>
//               <input
//                 type="number"
//                 name="admissionFee"
//                 value={course.fees.admissionFee}
//                 onChange={handleFeeChange}
//                 placeholder="Admission Fee"
//                 required
//                 className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex flex-col sm:col-span-2">
//               <label className="mb-1 font-medium">Description</label>
//               <textarea
//                 name="description"
//                 value={course.description}
//                 onChange={handleChange}
//                 placeholder="Course Description"
//                 rows={4}
//                 className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <p className="text-lg font-semibold">Total Fee: ₹{totalFee}</p>

//           <div className="bg-gray-50 p-4 rounded-md">
//             <h3 className="font-bold mb-2">Payment Checkpoints</h3>
//             {course.checkpoints.map((cp, idx) => (
//               <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-3 items-center">
//                 <input
//                   type="text"
//                   value={cp.title}
//                   onChange={(e) => handleCheckpointChange(idx, "title", e.target.value)}
//                   placeholder="Checkpoint Title"
//                   className="border border-gray-300 rounded-md py-2 px-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="number"
//                   value={cp.amount}
//                   onChange={(e) => handleCheckpointChange(idx, "amount", Number(e.target.value))}
//                   placeholder="Amount"
//                   className="border border-gray-300 rounded-md py-2 px-3 w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="number"
//                   value={cp.dueOrder}
//                   onChange={(e) => handleCheckpointChange(idx, "dueOrder", Number(e.target.value))}
//                   placeholder="Due Order"
//                   className="border border-gray-300 rounded-md py-2 px-3 w-full sm:w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeCheckpoint(idx)}
//                   className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={addCheckpoint}
//               className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
//             >
//               + Add Checkpoint
//             </button>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors font-semibold"
//           >
//             {loading ? "Saving..." : editId ? "Update Course" : "Create Course"}
//           </button>

//           {error && <p className="text-red-500 text-center">{error}</p>}
//         </form>
//       </div>
//        )}

//       <div className="mt-8">
//         <CourseList onEdit={handleEdit} onDelete={deleteCourse} courses={courses} />
//       </div>
//     </div>
//   );
// }

// export default Courses;





import { deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { db } from '../firebase/config';
import { type Coursetype } from '../type/auth';
import CourseList from './CourseList';
import { createCourse, subscribeCourse, updateCourse } from '../utils/courseUtils';
import CourseForm from './CourseForm';

function Courses() {
  const [courses, setCourses] = useState<Coursetype[] | undefined>(undefined);
  const [editId, setEditId] = useState<string | null>(null);
  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    duration: 0,
    fees: {
      courseFee: 0,
      admissionFee: 0,
    },
    checkpoints: [{ title: "", amount: 0, dueOrder: 0 }]
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const unsubscribe = subscribeCourse((course) => {
        setCourses(course);
      });
      return () => unsubscribe();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (formOpen && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [formOpen]);

  const handleEdit = (selectedCourse: any) => {
    setEditId(selectedCourse.id);
    setCourse(selectedCourse);
    setFormOpen(true);
  };

  const deleteCourse = async (id: string) => {
    await deleteDoc(doc(db, "courses", id));
  };

  return (
    <div className="md:p-4">
      <div className="flex justify-end">
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors capitalize"
        >
          {formOpen ? "Cancel" : "+ Create New course"}
        </button>
      </div>

      {/* Smooth open/close form container */}
      <div
        ref={formRef}
        className={`overflow-hidden transition-all duration-400 ease-in-out  ${
          formOpen ? "max-h-[2000px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="bg-white border-t-6 border-blue-500 p-6 rounded-3xl shadow-md max-w-6xl mx-auto mb-4">
          <h2 className="text-2xl font-bold mb-4 text-center">{editId ? "Edit Course" : "Create New Course"}</h2>
          <CourseForm  editId={editId} setEditId={setEditId} course={course} setCourse={setCourse} error={error} setError={setError} loading={loading} setLoading={setLoading} />
        </div>
      </div>

      <div className="mt-8">
        <CourseList onEdit={handleEdit} onDelete={deleteCourse} courses={courses} />
      </div>
    </div>
  );
}

export default Courses;
