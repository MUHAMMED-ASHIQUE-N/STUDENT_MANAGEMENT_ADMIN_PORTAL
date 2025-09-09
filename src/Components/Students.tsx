import React, { useEffect, useRef, useState } from 'react'
import { createStudent, updateStudent, } from '../utils/studentUtils';
import StudentList from './StudentList';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Coursetype } from '../type/auth';

function Students() {


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admissionFee, setAdmissionFee] = useState(0);
  const [cautionDeposit, setCautionDeposit] = useState(0);
  const [checkpoint, setCheckpoint] = useState([{ title: "", amount: 0, dueOrder: 0 }]);
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<string | null>(null)
  const [courses, setCourses] = useState<Coursetype[]>([]);
  const [planType, setPlanType] = useState<string>("default");

  const [formOpen, setFormOpen] = useState(false);
  

  useEffect(() => {
    if (courseId) {
      const selectedCourse = courses.find(c => c.id === courseId);
      if (selectedCourse) {
        setCheckpoint(selectedCourse.checkpoints || []);
      }
    }
  }, [courseId, courses]);



  const handleCustomCheckpoint = (cpCount: number) => {
    if (!selectedCourse) return;
    const totalFee = selectedCourse.fees.courseFee
    const perCheckpoint = Math.round(totalFee / cpCount);

    const cps = Array.from({ length: cpCount }, (_, i) => ({
      title: `Installment ${i + 1}`,
      amount: perCheckpoint,
      dueOrder: i + 2,
    }));

    // add admission fee separately if course has it
    // if (selectedCourse.fees.admissionFee > 0) {
    //   cps.unshift({
    //     title: "Admission Fee",
    //     amount: selectedCourse.fees.admissionFee,
    //     dueOrder: 0,
    //   });
    // }
    // if (selectedCourse.fees.cautionDeposit > 0) {
    //   cps.unshift({
    //     title: "Caution Deposit",
    //     amount: selectedCourse.fees.cautionDeposit,
    //     dueOrder: 1,
    //   });
    // }

    setCheckpoint(cps);
  };




  const selectedCourse = courses.find(c => c.id === courseId);
  selectedCourse?.checkpoints
  const totalFee = (Number(selectedCourse?.fees.courseFee) || 0) + (Number(selectedCourse?.fees.admissionFee) || 0) + (Number(selectedCourse?.fees.cautionDeposit) || 0);
  const duraion = Number(selectedCourse?.duration)


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
        await updateStudent(editId, name, email, courseId, admissionFee, cautionDeposit, checkpoint, planType);
        console.log('student edit success');
        setEditId(null)

      }
      else {
        await createStudent(name, email, password, courseId, admissionFee, cautionDeposit, checkpoint, planType, totalFee, duraion)
        console.log('student created successfully');

      }
    }
    catch (err: any) {
      setError(err.message,), alert('somthing worng cannot create srudent');

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
    setCautionDeposit(0)
    setCheckpoint([{ title: "", amount: 0, dueOrder: 0 }])
  }


  const formRef = useRef<HTMLDivElement>(null);

  const handleEdit = (student: any) => {
    setEditId(student.id);
    setName(student.name);
    setEmail(student.email);
    setCourseId(student.courseId);
    setAdmissionFee(student.admissionFee);
    setCautionDeposit(student.cautionDeposit);

    setPassword("");

    formRef.current?.scrollIntoView({ behavior: "smooth" });

  }


  return (
    <div className='p-8'>
      <div className='w-1/4   -4'>
        <input type="search" placeholder='🔍 search student here...' className='outline outline-gray-400 float-left w-full  px-4 py-1 rounded-md ' />
      </div>
    <button 
    onClick={() => setFormOpen( formOpen ? false : true)}
    className='bg-blue-500 text-white rounded-xl px-4 py-2  float-end '> {formOpen ? "Cancel" : "Create New Student +"}  </button>

  {formOpen && (

  
      <div
        ref={formRef}
        className='w-1/2 bg-white border-t-6 rounded-2xl border-blue-500 p-6 m-auto my-18  '>
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
                  {course.title}
                </option>
              ))}
            </select>

            <label className="block mb-2 font-semibold">Checkpoint Plan Type</label>
            <select
              value={planType}
              onChange={(e) => {
                const selectedType = e.target.value;
                setPlanType(selectedType);

                if (selectedType === "default" && selectedCourse) {
                  // load default checkpoints from course
                  setCheckpoint(selectedCourse.checkpoints || []);
                } else {
                  setCheckpoint([]);
                }
              }}
              className="border px-2 py-1 rounded mb-4"
            >
              <option value="default">Default</option>
              <option value="custom">Custom</option>
            </select>

            {planType === "custom" && selectedCourse &&  (
              <div>
                <label className="block mb-2 font-semibold">Choose Custom Installments</label>
                <select
                  onChange={(e) => handleCustomCheckpoint(Number(e.target.value))}
                  className="border px-2 py-1 rounded"
                >
                  <option value="">Select Installments</option>
                  {Array.from({ length: selectedCourse?.duration || 0 }, (_, i) => i + 1).map((cp) => (
                    <option key={cp} value={cp}>
                      {/* {cp} installment(s) */}
                      {cp} month{cp > 1 ? "s" : ""} (₹{Math.round(Number(selectedCourse?.fees.courseFee) / cp)})

                    </option>
                  ))}
                </select>
              </div>
            )}

            {checkpoint.length > 0 && selectedCourse && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">
                  {planType === "default" ? "Default Checkpoints" : "Custom Checkpoints"}
                </h3>
                <table className="w-full border border-gray-300 rounded-md">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Title</th>
                      <th className="border px-4 py-2">Amount</th>
                      <th className="border px-4 py-2">Due Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkpoint.map((cp, idx) => (
                      <tr key={idx}>
                        <td className="border px-4 py-2">{cp.title}</td>
                        <td className="border px-4 py-2">₹{cp.amount}</td>
                        <td className="border px-4 py-2">{cp.dueOrder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <label htmlFor="">Admission Fee</label>
            <input type="text"
              value={admissionFee}
              onChange={(e) => setAdmissionFee(Number(e.target.value))}
              placeholder='Admission fee'
              className='border border-gray-400 rounded-md py-2 px-3 ' />

            <label htmlFor="">Caution Deposit</label>
            <input type="text"
              value={cautionDeposit}
              onChange={(e) => setCautionDeposit(Number(e.target.value))}
              placeholder='Advance fee'
              className='border border-gray-400 rounded-md py-2 px-3 ' />
          </div>

          <button type="submit" className='bg-blue-500 px-18 py-2 rounded-xl text-white '>
            {loading ? "Saving..." : editId ? "Update Student" : "Create Student"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
      )}

      <StudentList onEdit={handleEdit} courses={courses} />


    </div>
  )
}

export default Students
















// import React, { useEffect, useRef, useState } from 'react'
// import { createStudent, updateStudent, } from '../utils/studentUtils';
// import StudentList from './StudentList';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../firebase/config';
// import type { Coursetype } from '../type/auth';

// function Students() {


//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [admissionFee, setAdmissionFee] = useState(0);
//   const [advanceFee, setAdvanceFee] = useState(0);
//   const [checkpoint, setCheckpoint] = useState([{ title: "", amount: 0, dueOrder: 0 }]);
//   const [courseId, setCourseId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [editId, setEditId] = useState<string | null>(null)
//   const [courses, setCourses] = useState<Coursetype[]>([]);
//   const [planType, setPlanType] = useState<string>("default");

//   const [formOpen, setFormOpen] = useState(false);


//   useEffect(() => {
//     if (courseId) {
//       const selectedCourse = courses.find(c => c.id === courseId);
//       if (selectedCourse) {
//         setCheckpoint(selectedCourse.checkpoints || []);
//       }
//     }
//   }, [courseId, courses]);



//   const handleCustomCheckpoint = (cpCount: number) => {
//     if (!selectedCourse) return;
//     const totalFee = selectedCourse.fees.courseFee
//     const perCheckpoint = Math.round(totalFee / cpCount);

//     const cps = Array.from({ length: cpCount }, (_, i) => ({
//       title: `Installment ${i + 1}`,
//       amount: perCheckpoint,
//       dueOrder: i + 1,
//     }));

//     // add admission fee separately if course has it
//     if (selectedCourse.fees.admissionFee > 0) {
//       cps.unshift({
//         title: "Admission Fee",
//         amount: selectedCourse.fees.admissionFee,
//         dueOrder: 0,
//       });
//     }

//     setCheckpoint(cps);
//   };




//   const selectedCourse = courses.find(c => c.id === courseId);
//   selectedCourse?.checkpoints
//   const totalFee = (Number(selectedCourse?.fees.courseFee) || 0) + (Number(selectedCourse?.fees.admissionFee) || 0);
//   // const totalfees.Coursefee = Number(selectedCourse?.totalFee) || 0
//   const duraion = Number(selectedCourse?.duration)


//   useEffect(() => {

//     const fetchCourses = async () => {
//       const snapshot = await getDocs(collection(db, "courses"));
//       setCourses(snapshot.docs.map(doc => ({
//         id: doc.id, ...(doc.data() as Omit<Coursetype, "id">)
//       })));
//     }
//     fetchCourses();
//   }, [])



//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true)
//     try {
//       if (editId) {
//         await updateStudent(editId, name, email, courseId, admissionFee, advanceFee, checkpoint, planType);
//         console.log('student edit success');
//         setEditId(null)

//       }
//       else {
//         await createStudent(name, email, password, courseId, admissionFee, advanceFee, checkpoint, planType, totalFee, duraion)
//         console.log('student created successfully');

//       }
//     }
//     catch (err: any) {
//       setError(err.message,), alert('somthing worng cannot create srudent');

//     }
//     finally {
//       setLoading(false)
//       setError("")
//     }

//     setName("")
//     setEmail("")
//     setPassword("")
//     setCourseId("")
//     setAdmissionFee(0)
//     setAdvanceFee(0)
//     setCheckpoint([{ title: "", amount: 0, dueOrder: 0 }])
//   }


//   const formRef = useRef<HTMLDivElement>(null);

//   const handleEdit = (student: any) => {
//     setEditId(student.id);
//     setName(student.name);
//     setEmail(student.email);
//     setCourseId(student.courseId);
//     setAdmissionFee(student.admissionFee);
//     setAdvanceFee(student.advanceFee);

//     setPassword("");

//     formRef.current?.scrollIntoView({ behavior: "smooth" });

//   }


//   return (
//     <div className='p-8'>
//       <div className='w-1/4   -4'>
//         <input type="search" placeholder='🔍 search student here...' className='outline outline-gray-400 float-left w-full  px-4 py-1 rounded-md ' />
//       </div>
//     <button 
//     onClick={() => setFormOpen( formOpen ? false : true)}
//     className='bg-blue-500 text-white rounded-xl px-4 py-2  float-end '> {formOpen ? "Cancel" : "Create New Student +"}  </button>

//   {formOpen && (

  
//       <div
//         ref={formRef}
//         className='w-1/2 bg-white border-t-6 rounded-2xl border-blue-500 p-6 m-auto my-18  '>
//         <h1 className='text-center text-2xl'>
//           {editId ? "Edit Student" : "Create New Student"}

//         </h1>
//         <form onSubmit={handleSubmit} action="" className='flex flex-col  items-center'>
//           <div className='grid grid-cols-2 gap-4 w-full bg- p-6 space-y-1'>
//             <label htmlFor="name">Student Name</label>
//             <input type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder='name'
//               required
//               className='border border-gray-400 rounded-md py-2 px-3' />
//             <label htmlFor="email">Student Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder='email'
//               required
//               className='border border-gray-400 rounded-md py-2 px-3' />

//             {!editId && (
//               <>
//                 <label htmlFor="password">Student Password</label>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder='password'
//                   required
//                   className='border border-gray-400 rounded-md py-2 px-3' />
//               </>

//             )}


//             <label htmlFor="course">select course</label>
//             <select
//               value={courseId}
//               onChange={(e) => setCourseId(e.target.value)}
//               className="border p-2 w-full rounded"
//               required
//             >
//               <option value="">Select Course</option>
//               {courses.map(course => (
//                 <option key={course.id} value={course.id}>
//                   {course.title}
//                 </option>
//               ))}
//             </select>

//             <label className="block mb-2 font-semibold">Checkpoint Plan Type</label>
//             <select
//               value={planType}
//               onChange={(e) => {
//                 const selectedType = e.target.value;
//                 setPlanType(selectedType);

//                 if (selectedType === "default" && selectedCourse) {
//                   // load default checkpoints from course
//                   setCheckpoint(selectedCourse.checkpoints || []);
//                 } else {
//                   setCheckpoint([]);
//                 }
//               }}
//               className="border px-2 py-1 rounded mb-4"
//             >
//               <option value="default">Default</option>
//               <option value="custom">Custom</option>
//             </select>

//             {planType === "custom" && selectedCourse &&  (
//               <div>
//                 <label className="block mb-2 font-semibold">Choose Custom Installments</label>
//                 <select
//                   onChange={(e) => handleCustomCheckpoint(Number(e.target.value))}
//                   className="border px-2 py-1 rounded"
//                 >
//                   <option value="">Select Installments</option>
//                   {Array.from({ length: selectedCourse?.duration || 0 }, (_, i) => i + 1).map((cp) => (
//                     <option key={cp} value={cp}>
//                       {/* {cp} installment(s) */}
//                       {cp} month{cp > 1 ? "s" : ""} (₹{Math.round(Number(selectedCourse?.fees.courseFee) / cp)})

//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             {checkpoint.length > 0 && selectedCourse && (
//               <div className="mt-4">
//                 <h3 className="font-semibold mb-2">
//                   {planType === "default" ? "Default Checkpoints" : "Custom Checkpoints"}
//                 </h3>
//                 <table className="w-full border border-gray-300 rounded-md">
//                   <thead>
//                     <tr className="bg-gray-100">
//                       <th className="border px-4 py-2">Title</th>
//                       <th className="border px-4 py-2">Amount</th>
//                       <th className="border px-4 py-2">Due Order</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {checkpoint.map((cp, idx) => (
//                       <tr key={idx}>
//                         <td className="border px-4 py-2">{cp.title}</td>
//                         <td className="border px-4 py-2">₹{cp.amount}</td>
//                         <td className="border px-4 py-2">{cp.dueOrder}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//             <label htmlFor="">Admission Fee</label>
//             <input type="text"
//               value={admissionFee}
//               onChange={(e) => setAdmissionFee(Number(e.target.value))}
//               placeholder='Admission fee'
//               className='border border-gray-400 rounded-md py-2 px-3 ' />

//             <label htmlFor="">Advance Fee</label>
//             <input type="text"
//               value={advanceFee}
//               onChange={(e) => setAdvanceFee(Number(e.target.value))}
//               placeholder='Advance fee'
//               className='border border-gray-400 rounded-md py-2 px-3 ' />
//           </div>

//           <button type="submit" className='bg-blue-500 px-18 py-2 rounded-xl text-white '>
//             {loading ? "Saving..." : editId ? "Update Student" : "Create Student"}
//           </button>
//           {error && <p className="text-red-500">{error}</p>}
//         </form>
//       </div>
//       )}

//       <StudentList onEdit={handleEdit} courses={courses} />


//     </div>
//   )
// }

// export default Students
















