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
      cautionDeposit: 0
    },
    checkpoints: [{ title: "",amount:0, dueOrder: 0}]
  });  

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

   
  const totalFee = Number(course.fees.courseFee ) + Number(course.fees.admissionFee) + Number( course.fees.cautionDeposit )
  
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
      cautionDeposit: 0
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
          <label htmlFor="">Caution Deposit </label>
          <input
            type="text"
            name='cautionDeposit'
            value={course.fees.cautionDeposit}
            onChange={handleFeeChange}
            placeholder='cautionDeposit'
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




// import { deleteDoc, doc } from 'firebase/firestore';
// import React, { useEffect, useRef, useState } from 'react'
// import { db } from '../firebase/config';
// import { type Coursetype } from '../type/auth';
// import CourseList from './CourseList';
// import { createCourse, subscribeCourse, updateCourse } from '../utils/courseUtils';
// import { id } from 'date-fns/locale';

// function Courses() {
//   const [course, setCourse] = useState<Coursetype[] | undefined>(undefined);
//   const [editId, setEditId] = useState<string | null>(null)

//   const [courseName, setCourseName] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [duration, setDuration] = useState(0);
//   const [courseFee, setCourseFee] = useState(0);
//   // const [totalFee, setTotalFee] = useState(0);
//   const [admissionFee, setAdmissionFee] = useState(0);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [customCheckpoints, setcustomCheckpoints] = useState<{ title: string; amount: number; dueOrder: number }[]>([{ title: "", amount: 0, dueOrder: 0 }]);

   
//   const totalFee = Number(courseFee + admissionFee )
  
//     // Add checkpoint row
//   const addCheckpoint = () => {
//     setcustomCheckpoints([...customCheckpoints, { title: "", amount: 0, dueOrder: customCheckpoints.length + 1 }]);
//   };

//   // Handle checkpoint change
//   const handleCheckpointChange = (index: number, field: string, value: string | number) => {
//     const updated = [...customCheckpoints];
//     updated[index] = { ...updated[index], [field]: value };
//     setcustomCheckpoints(updated);
//   };
 

//   // ✅ Remove checkpoint
//   const removeCheckpoint = (idx: number) => {
//     setcustomCheckpoints(customCheckpoints.filter((_, i) => i !== idx));
//   };


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true)
//     try {
//       const courseData = { courseName, description, category, duration ,totalFee, admissionFee, paymentcustomCheckpoints:customCheckpoints }
//       if (editId) {
//         updateCourse(editId, courseData);
//         setEditId(null);
//       }
//       else {
//         await createCourse(courseName, description, category, duration, admissionFee, courseFee,totalFee, customCheckpoints );
//       }

//     }
//     catch (err: any) {
//       setError(err.message)
//     }
//     finally {
//       setLoading(false);
//       setError("")
//     }

//     setCourseName("");
//     setDescription("")
//     setCategory("")
//     setDuration(0);
//     setCourseFee(0);
//     setAdmissionFee(0);
//     setcustomCheckpoints([{ title: "", amount: 0, dueOrder: 1 }]);
//   }


//   // const subscribeCourse = () => {
//   //   const courseCollection = collection(db, "courses");
//   //   const unsubscribe = onSnapshot(courseCollection, (snapshot) => {
//   //     const course: Coursetype[] = snapshot.docs.map(doc => ({
//   //       id: doc.id, ...(doc.data() as Omit<Coursetype, "id">)

//   //     }));

//   //     setCourse(course)
//   //   });

//   //   return unsubscribe;
//   // }

//   // const updateCourse = async (id: string, data: Partial<Coursetype>) => {
//   //   setLoading(true)
//   //   try {
//   //     await updateDoc(doc(db, "courses", id), data);

//   //   }
//   //   catch (err: any) {
//   //     setError(err.message);
//   //   }
//   //   finally {
//   //     setLoading(false)
//   //   }
//   // }


//   useEffect(() => {
//     setLoading(true)
//     try {
//       const unsubscribe = subscribeCourse((course)=> {
//          setCourse(course)
//         });
//       return () => unsubscribe();
//     }
//     catch (err: any) {
//       setError(err.message)
//     }
//     finally {
//       setLoading(false);
//     }

//   }, [])


//   const formRef = useRef<HTMLDivElement>(null)

//   const handleEdit = (data: any) => {
//     setEditId(data.id)
//     setCourseName(data.courseName);
//     setDescription(data.description || "")
//     setCategory(data.category || "")
//     setDuration(data.duration);
//     setCourseFee(data.courseFee);
//     setAdmissionFee(data.admissionFee);
//     setcustomCheckpoints(data.paymentCheckpoints || []);
//     formRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }


//   const deleteCourse = async (id: string) => {
//     await deleteDoc(doc(db, "courses", id));
//   }



//   return (
//     <div ref={formRef}>
//       <form onSubmit={handleSubmit} action="" className='flex flex-col  items-center'>
//         <div className='grid grid-cols-2 gap-4 w-full bg- p-6 space-y-1'>
//           <label htmlFor="">Course Name</label>
//           <input type="text"
//             value={courseName}
//             onChange={(e) => setCourseName(e.target.value)}
//             placeholder='course Name'
//             required
//             className='border border-gray-400 rounded-md py-2 px-3' />

//           <label>Description</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Course Description"
//             className="border border-gray-400 rounded-md py-2 px-3"
//           />

//           <label>Category/Technology</label>
//           <input
//             type="text"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             placeholder="E.g., MERN, Marketing"
//             className="border border-gray-400 rounded-md py-2 px-3"
//           />

//           <label htmlFor="">Course Duration</label>
//           <input
//             type="text"
//             value={duration}
//             onChange={(e) => setDuration(Number(e.target.value))}
//             placeholder='course duration in month'
//             required
//             className='border border-gray-400 rounded-md py-2 px-3' />

//           <label htmlFor="">Course Fee </label>
//           <input
//             type="text"
//             value={courseFee}
//             onChange={(e) => setCourseFee(Number((e.target.value)))}
//             placeholder='course Fees'
//             required
//             className='border border-gray-400 rounded-md py-2 px-3' />
//           <label htmlFor="">Admission Fee </label>
//           <input
//             type="text"
//             value={admissionFee}
//             onChange={(e) => setAdmissionFee(Number(e.target.value))}
//             placeholder='Admission Fees'
//             required
//             className='border border-gray-400 rounded-md py-2 px-3' />

//           {/* ✅ Dynamic Payment customCheckpoints */}
//           <div className="w-full p-6">
//             <h3 className="text-lg font-semibold mb-2">Payment Checkpoints</h3>
//             {customCheckpoints.map((cp, idx) => (
//               <div key={idx} className="flex gap-2 items-center mb-2">
//                 <input
//                   type="text"
//                   value={cp.title}
//                   onChange={(e) => handleCheckpointChange(idx, "title", (e.target.value))}
//                   placeholder="Checkpoint Title"
//                   className="border border-gray-400 rounded-md py-2 px-3"
//                 />
//                 <input
//                   type="number"
//                   value={cp.amount}
//                   onChange={(e) => handleCheckpointChange(idx, "amount", Number(e.target.value))}
//                   placeholder="Amount"
//                   className="border border-gray-400 rounded-md py-2 px-3"
//                 />
//                 <input
//                   type="number"
//                   value={cp.dueOrder}
//                   onChange={(e) => handleCheckpointChange(idx, "dueOrder", Number(e.target.value))}
//                   placeholder="Due Order"
//                   className="border border-gray-400 rounded-md py-2 px-3 w-20"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeCheckpoint(idx)}
//                   className="bg-red-500 text-white px-2 py-1 rounded-md"
//                 >
//                   X
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={addCheckpoint}
//               className="bg-green-500 text-white px-4 py-2 rounded-md"
//             >
//               + Add Checkpoint
//             </button>
//           </div>

//         </div>

//         <button type="submit" className='bg-blue-500 px-18 py-2 rounded-xl text-white '>
//           {loading ? "Saving..." : editId ? "Update course" : "Create course"}
//         </button>
//         {error && <p className="text-red-500">{error}</p>}
//       </form>
//       <CourseList onEdit={handleEdit} onDelete={deleteCourse} course={course} />

//     </div>
//   )
// }

// export default Courses  














// import { addDoc, collection, doc, setDoc } from "firebase/firestore";
// import React, { useState } from "react";
// import { db } from "../firebase/config";

// export default function CreateCourse() {
//   const [course, setCourse] = useState({
//     title: "",
//     description: "",
//     duration: "",
//     instructor: "",
//     fees: {
//       courseFee: "",
//       admissionFee: "",
//       cautionDeposit: ""
//     },
//     installments: [] // checkpoints will be stored here
//   });

//   // Handle normal fields
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCourse((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle fee fields
//   const handleFeeChange = (e:any) => {
//     const { name, value } = e.target;
//     setCourse((prev) => ({
//       ...prev,
//       fees: {
//         ...prev.fees,
//         [name]: value
//       }
//     }));
//   };

//   // Calculate total fee
//   const totalFee =
//     Number(course.fees.courseFee) +
//     Number(course.fees.admissionFee) +
//     Number(course.fees.cautionDeposit);

//   // Generate default installments (equal division)
//   const generateInstallments = (count:number) => {
//     if (!totalFee || count <= 0) return;

//     const remainingFee =
//       totalFee -
//       (Number(course.fees.admissionFee) + Number(course.fees.cautionDeposit));

//     const perInstallment = Math.floor(remainingFee / count);

//     const checkpoints = Array.from({ length: count }, (_, i) => ({
//       title: `Installment ${i + 1}`,
//       amount: perInstallment,
//       dueOrder: i + 1
//     }));

//     setCourse((prev:any) => ({
//       ...prev,
//       installments: checkpoints
//     }));
//   };

//   // Add a custom installment row
//   const addCustomInstallment = () => {
//     setCourse((prev:any) => ({
//       ...prev,
//       installments: [
//         ...prev.installments,
//         { title: `Installment ${prev.installments.length + 1}`, amount: 0, dueOrder: prev.installments.length + 1 }
//       ]
//     }));
//   };

//   // Handle custom installment update
//   const handleInstallmentChange = (index, field, value) => {
//     const updated = [...course.installments];
//     updated[index][field] = field === "amount" ? Number(value) : value;

//     setCourse((prev) => ({
//       ...prev,
//       installments: updated
//     }));
//   };

//   const handleSubmit = async (e:any) => {
//     e.preventDefault();
//     const courseData = {
//       ...course,
//       totalFee
//     };
//     console.log("Course Created:", courseData);
//    await addDoc(collection(db, "course"), {
//     courseData,
//      date: Date(),
//    })


//     // 👉 here you can push to Firebase/DB
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Create New Course</h2>

//       {/* Course Info */}
//       <input
//         type="text"
//         name="title"
//         placeholder="Course Title"
//         value={course.title}
//         onChange={handleChange}
//       />
//       <textarea
//         name="description"
//         placeholder="Course Description"
//         value={course.description}
//         onChange={handleChange}
//       />
//       <input
//         type="text"
//         name="duration"
//         placeholder="Course Duration"
//         value={course.duration}
//         onChange={handleChange}
//       />
//       <input
//         type="text"
//         name="instructor"
//         placeholder="Instructor Name"
//         value={course.instructor}
//         onChange={handleChange}
//       />

//       {/* Fee Section */}
//       <h3>Fee Details</h3>
//       <input
//         type="number"
//         name="courseFee"
//         placeholder="Course Fee"
//         value={course.fees.courseFee}
//         onChange={handleFeeChange}
//       />
//       <input
//         type="number"
//         name="admissionFee"
//         placeholder="Admission Fee"
//         value={course.fees.admissionFee}
//         onChange={handleFeeChange}
//       />
//       <input
//         type="number"
//         name="cautionDeposit"
//         placeholder="Caution Deposit"
//         value={course.fees.cautionDeposit}
//         onChange={handleFeeChange}
//       />

//       <h4>Total Fee: {totalFee}</h4>

//       {/* Installments Section */}
//       <h3>Installments</h3>
//       <button type="button" onClick={() => generateInstallments(3)}>
//         Generate 3 Equal Installments
//       </button>
//       <button type="button" onClick={addCustomInstallment}>
//         Add Custom Installment
//       </button>

//       {course.installments.map((inst, index) => (
//         <div key={index}>
//           <input
//             type="text"
//             value={inst.title}
//             onChange={(e) =>
//               handleInstallmentChange(index, "title", e.target.value)
//             }
//           />
//           <input
//             type="number"
//             value={inst.amount}
//             onChange={(e) =>
//               handleInstallmentChange(index, "amount", e.target.value)
//             }
//           />
//         </div>
//       ))}

//       <button type="submit">Create Course</button>
//     </form>
//   );
// }
