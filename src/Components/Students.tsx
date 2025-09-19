






// import React, { useEffect, useRef, useState } from "react";
// import { createStudent, subscribeStudents, updateStudent } from "../utils/studentUtils";
// import StudentList from "./StudentList";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase/config";
// import type { Coursetype } from "../type/auth";
// import { format } from "date-fns";

// function Students() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [admissionFee, setAdmissionFee] = useState(0);
//   const [checkpoint, setCheckpoint] = useState([{ title: "", amount: 0, dueOrder: 0 }]);
//   const [courseId, setCourseId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [editId, setEditId] = useState<string | null>(null);
//   const [courses, setCourses] = useState<Coursetype[]>([]);
//   const [planType, setPlanType] = useState<string>("default");
//   const [formOpen, setFormOpen] = useState(false);

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [students, setStudents] = useState<any[]>([]);



//   const formRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (courseId) {
//       const selectedCourse = courses.find((c) => c.id === courseId);
//       if (selectedCourse) {
//         setCheckpoint(selectedCourse.checkpoints || []);
//       }
//     }
//   }, [courseId, courses]);

//   useEffect(() => {
//     const unsubscribe = subscribeStudents((data) => {
//       setStudents(data);
//     });
//     return () => unsubscribe();
//   }, []);


//   const handleCustomCheckpoint = (cpCount: number) => {
//     if (!selectedCourse) return;
//     const totalFee = selectedCourse.fees.courseFee;
//     const perCheckpoint = Math.round(totalFee / cpCount);

//     const cps = Array.from({ length: cpCount }, (_, i) => ({
//       title: `Installment ${i + 1}`,
//       amount: perCheckpoint,
//       dueOrder: i + 2,
//     }));
//     setCheckpoint(cps);
//   };

//   const selectedCourse = courses.find((c) => c.id === courseId);
//   const totalFee = (selectedCourse?.fees.courseFee || 0) + (selectedCourse?.fees.admissionFee || 0);
//   const duraion = selectedCourse?.duration || 0;

//   useEffect(() => {
//     const fetchCourses = async () => {
//       const snapshot = await getDocs(collection(db, "courses"));
//       setCourses(snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...(doc.data() as Omit<Coursetype, "id">),
//       })));
//     };
//     fetchCourses();
//   }, []);


//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};
//     if (!name.trim()) newErrors.name = "Name is required";
//     if (!email.trim()) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";
//     if (!editId && !password.trim())
//       newErrors.password = "Password is required";
//     if (!courseId) newErrors.courseId = "Please select a course";
//     if (selectedCourse && admissionFee != selectedCourse.fees.admissionFee) {
//       newErrors.admissionFee = `Admission fee must be ₹${selectedCourse.fees.admissionFee}`;
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };



//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) return

//     setLoading(true);
//     try {
//       if (editId) {
//         await updateStudent(editId, name, email, courseId, admissionFee, checkpoint, planType);
//       } else {
//         await createStudent(name, email, password, courseId, admissionFee, checkpoint, planType, totalFee, duraion);
//       }
//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//       setError("");
//       resetForm();
//     }
//   };

//   const resetForm = () => {
//     setName("");
//     setEmail("");
//     setPassword("");
//     setCourseId("");
//     setAdmissionFee(0);
//     setCheckpoint([{ title: "", amount: 0, dueOrder: 0 }]);
//     setPlanType("default");
//     setFormOpen(false);
//     setError("")
//     setErrors({})
//   };

//   const handleEdit = (student: any) => {
//     setEditId(student.id);
//     setName(student.name);
//     setEmail(student.email);
//     setCourseId(student.courseId);
//     setAdmissionFee(student.admissionFee);
//     setPassword("");
//     setFormOpen(true);
//     formRef.current?.scrollIntoView({ behavior: "smooth" });
//   };



//   // ✅ Filtered students based on searchTerm
//   const filteredStudents = students.filter((student) => {
//     const course = courses.find((c) => c.id === student.courseId);
//     const courseTitle = course ? course.title.toLowerCase() : "";
//     const search = searchTerm.toLowerCase();
//     return (
//       student.name.toLowerCase().includes(search) ||
//       student.id.toLowerCase().includes(search) ||
//       courseTitle.includes(search) 
//     );
//   });

//   return (
//     <div className=" sm:p-2">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
//         <div className="w-full sm:w-1/3 px-4 py-2  rounded-md flex justify-between relative bg-white shadow-lg"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <circle cx="11" cy="11" r="8" />
//             <line x1="21" y1="21" x2="16.65" y2="16.65" />
//           </svg>
//           <input  
//             type="search"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder=" Search students...   "
//             className="w-full outline-none pl-6 text-gray-500"
//           />
//         </div>
//         <button
//           onClick={() => setFormOpen(!formOpen)}
//           className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
//         >
//           {formOpen ? "Cancel" : "+ Create New Student"}
//         </button>
//       </div>

//       {/* Form */}
//       <div
//         ref={formRef}
//         className={`max-w-2xl mx-auto text-xs lg:text-sm bg-white border-t-6 rounded-2xl border-blue-500  shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${formOpen ? " opacity-100 p-4 md:p-6" : "max-h-0 opacity-0 p-0"}`}
//       >
//         <h2 className="text-center text-2xl font-bold mb-6 text-blue-600">
//           {editId ? "Edit Student" : "Create New Student"}
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name and Email */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block mb-1 font-medium">Name</label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={e => setName(e.target.value)}
//                 placeholder="Enter name"
//                 required
//                 // className="w-full px-4 py-2 border rounded-md "
//                 className={`w-full px-4 py-2 border rounded-md  ${errors.name ? "border-red-500" : "border-gray-300"
//                   }`}
//               />
//               {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

//             </div>
//             <div>
//               <label className="block mb-1 font-medium">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 placeholder="Enter email"
//                 required
//                 // className="w-full px-4 py-2 border rounded-md "
//                 className={`w-full px-4 py-2 border rounded-md  ${errors.email ? "border-red-500" : "border-gray-300 "
//                   }`}
//               />

//               {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

//             </div>
//           </div>



//           {/* Password */}
//           {!editId && (
//             <div>
//               <label className="block mb-1 font-medium">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 placeholder="Enter password"
//                 required
//                 // className="w-full px-4 py-2 border rounded-md "
//                 className={`w-full px-4 py-2 border rounded-md ${errors.password ? "border-red-500" : "border-gray-300 "
//                   }`}
//               />
//               {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

//             </div>
//           )}

//           {/* Course Selection */}
//           <div>
//             <label className="block mb-1 font-medium">Select Course</label>
//             <select
//               value={courseId}
//               onChange={e => setCourseId(e.target.value)}
//               required
//               // className="w-full px-4 py-2 border rounded-md "
//               className={`w-full px-4 py-2 border rounded-md ${errors.courseId ? "border-red-500" : "border-gray-300 "
//                 }`}
//             >

//               <option value="">Select a course</option>
//               {courses.map(course => (
//                 <option key={course.id} value={course.id}>
//                   {course.title}
//                 </option>
//               ))}
//             </select>
//             {errors.courseId && <p className="text-red-500 text-sm">{errors.courseId}</p>}
//           </div>

//           {/* Plan Type */}
//           <div>
//             <label className="block mb-1 font-medium">Checkpoint Plan</label>
//             <select
//               value={planType}
//               onChange={e => {
//                 const selected = e.target.value;
//                 setPlanType(selected);
//                 if (selected === "default" && selectedCourse) {
//                   setCheckpoint(selectedCourse.checkpoints || []);
//                 } else {
//                   setCheckpoint([]);
//                 }
//               }}
//               className="w-full px-4 py-2 border rounded-md "
//             >
//               <option value="default">Default</option>
//               <option value="custom">Custom</option>
//             </select>
//           </div>

//           {/* Custom Checkpoints */}
//           {planType === "custom" && selectedCourse && (
//             <div>
//               <label className="block mb-1 font-medium">Choose Installments</label>
//               <select
//                 onChange={e => handleCustomCheckpoint(Number(e.target.value))}
//                 className="w-full px-4 py-2 border rounded-md "

//               >

//                 <option value="">Select installment count</option>
//                 {Array.from({ length: selectedCourse.duration }, (_, i) => i + 1).map(cp => (
//                   <option key={cp} value={cp}>
//                     {cp} month{cp > 1 ? "s" : ""} (₹{Math.round(selectedCourse.fees.courseFee / cp)})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {/* Checkpoints Table */}
//           {checkpoint.length > 0 && selectedCourse && (
//             <div>
//               <h3 className="font-semibold mb-2 text-blue-600">Checkpoints</h3>
//               <div className="overflow-x-auto">
//                 <table className="w-full border border-gray-300 rounded-md text-sm">
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
//             </div>
//           )}

//           {/* Admission Fee */}
//           <div>
//             <label className="block mb-1 font-medium">Admission Fee</label>
//             {selectedCourse && (
//               <p className="mb-1 text-gray-600">Required: ₹{selectedCourse.fees.admissionFee}</p>
//             )}
//             <input
//               type="number"
//               value={admissionFee}
//               onChange={e => setAdmissionFee(Number(e.target.value))}
//               placeholder="Enter admission fee"
//               required
//               className={`w-full px-4 py-2 border rounded-md  ${errors.admissionFee ? "border-red-500" : "border-gray-300"
//                 }`}
//             />
//             {errors.admissionFee && <p className="text-red-500 text-sm">{errors.admissionFee}</p>}

//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors disabled:opacity-50"
//           >
//             {loading ? "Saving..." : editId ? "Update Student" : "Create Student"}
//           </button>
//           {error && <p className="text-red-500 text-center">{error}</p>}
//         </form>
//       </div>

//       {/* Student List */}
//       <StudentList onEdit={handleEdit} courses={courses} students={filteredStudents} />
//     </div>
//   );
// }

// export default Students;






// import React, { useEffect, useRef, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase/config";
// import StudentList from "./StudentList";
// import StudentForm from "./StudentForm";
// import { subscribeStudents } from "../utils/studentUtils";
// import type { Coursetype } from "../type/auth";

// function Students() {
//   const [students, setStudents] = useState<any[]>([]);
//   const [courses, setCourses] = useState<Coursetype[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [formOpen, setFormOpen] = useState(false);
//   const [editStudent, setEditStudent] = useState<any | null>(null);

//   const formRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const unsubscribe = subscribeStudents((data) => setStudents(data));
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       const snapshot = await getDocs(collection(db, "courses"));
//       setCourses(snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Coursetype, "id">) })));
//     };
//     fetchCourses();
//   }, []);

//   const filteredStudents = students.filter((student) => {
//     const course = courses.find((c) => c.id === student.courseId);
//     const courseTitle = course ? course.title.toLowerCase() : "";
//     const search = searchTerm.toLowerCase();
//     return (
//       student.name.toLowerCase().includes(search) ||
//       student.id.toLowerCase().includes(search) ||
//       courseTitle.includes(search)
//     );
//   });

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
//         <input
//           type="search"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           placeholder="Search students..."
//           className="w-full sm:w-1/3 px-4 py-2 border rounded-md"
//         />
//         <button
//           onClick={() => {
//             setFormOpen(!formOpen);
//             setEditStudent(null);
//           }}
//           className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
//         >
//           {formOpen ? "Cancel" : "+ Create New Student"}
//         </button>
   
//       </div>

//       {/* Form */}
//       {formOpen && (
//         <div
//           ref={formRef}
//           className={`max-w-2xl mx-auto text-xs lg:text-sm bg-white border-t-6 rounded-2xl border-blue-500 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${formOpen ? "opacity-100 p-4 md:p-6" : "max-h-0 opacity-0 p-0"
//             }`}
//         >
//           <h2 className="text-center text-2xl font-bold mb-6 text-blue-600">
//             {editStudent ? "Edit Student" : "Create New Student"}
//           </h2>
//           <StudentForm
//             editStudent={editStudent}
//             courses={courses}
//             onSaved={() => {
//               setFormOpen(false);
//               setEditStudent(null);
//             }}
//           />
//         </div>
//       )}

//       {/* Student List */}
//       <StudentList
//         onEdit={(student) => {
//           setEditStudent(student);
//           setFormOpen(true);
//           formRef.current?.scrollIntoView({ behavior: "smooth" });
//         }}
//         courses={courses}
//         students={filteredStudents}
//       />
//     </div>
//   );
// }

// export default Students;


import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { subscribeStudents } from "../utils/studentUtils";
import type { Coursetype } from "../type/auth";
import StudentList from "./StudentList";
import StudentForm from "./StudentForm";

function Students() {
  const [courses, setCourses] = useState<Coursetype[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<any | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      const snapshot = await getDocs(collection(db, "courses"));
      setCourses(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Coursetype, "id">),
        }))
      );
    };
    fetchCourses();
  }, []);

  // Subscribe to students
  useEffect(() => {
    const unsubscribe = subscribeStudents((data) => {
      setStudents(data);
    });
    return () => unsubscribe();
  }, []);

  // Search filter
  const filteredStudents = students.filter((student) => {
    const course = courses.find((c) => c.id === student.courseId);
    const courseTitle = course ? course.title.toLowerCase() : "";
    const search = searchTerm.toLowerCase();
    return (
      student.name.toLowerCase().includes(search) ||
      student.id.toLowerCase().includes(search) ||
      courseTitle.includes(search)
    );
  });

  const handleEdit = (student: any) => {
    setEditStudent(student);
    setFormOpen(true);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormClose = () => {
    setEditStudent(null);
    setFormOpen(false);
  };

  return (
    <div className="sm:p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        {/* Search */}
        <div className="w-full sm:w-1/3 px-4 py-2 rounded-md flex justify-between relative bg-white shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder=" Search students..."
            className="w-full outline-none pl-6 text-gray-500"
          />
        </div>

        {/* Toggle Form */}
        <button
          onClick={() => (formOpen ? handleFormClose() : setFormOpen(true))}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {formOpen ? "Cancel" : "+ Create New Student"}
        </button>
      </div>

      {/* Form */}
      <div
        ref={formRef}
        className={`max-w-2xl mx-auto text-xs lg:text-sm bg-white border-t-6 rounded-2xl border-blue-500 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          formOpen ? "opacity-100 p-4 md:p-6" : "max-h-0 opacity-0 p-0"
        }`}
      >
        {formOpen && (
          <>
            <h2 className="text-center text-2xl font-bold mb-6 text-blue-600">
              {editStudent ? "Edit Student" : "Create New Student"}
            </h2>
            <StudentForm
              editStudent={editStudent}
              courses={courses}
              onSaved={handleFormClose}
            />
          </>
        )}
      </div>

      {/* Student List */}
      <StudentList onEdit={handleEdit} courses={courses} students={filteredStudents} />
    </div>
  );
}

export default Students;
