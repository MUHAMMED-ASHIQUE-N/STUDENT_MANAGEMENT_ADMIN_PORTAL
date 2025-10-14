// import React, { useState, useEffect } from "react";
// import { createStudent, updateStudent } from "../utils/studentUtils";
// import type { Coursetype } from "../type/auth";
// import { AlertCircle, BookOpen, DollarSign, FileText, Mail, Upload, User } from "lucide-react";
// import InputField from "./InputField";

// interface StudentFormProps {
//   editStudent?: any; // student being edited
//   courses: Coursetype[];
//   onSaved: () => void;
// }

// function StudentForm({ editStudent, courses, onSaved }: StudentFormProps) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [courseId, setCourseId] = useState("");
//   const [admissionFee, setAdmissionFee] = useState(0);
//   const [checkpoint, setCheckpoint] = useState([{ title: "", amount: 0, dueOrder: 0 }]);
//   const [planType, setPlanType] = useState("default");
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [error, setError] = useState("");
//   const [profilePic, setProfilePic] = useState<File | null>(null);
// const [profilePicUrl, setProfilePicUrl] = useState<string>("");
//   const selectedCourse = courses?.find((c) => c.id === courseId);
//   const totalFee =
//     (selectedCourse?.fees.courseFee || 0) + (selectedCourse?.fees.admissionFee || 0);
//   const duration = selectedCourse?.duration || 0;

//   useEffect(() => {
//     if (courseId) {
//       const selectedCourse = courses.find((c) => c.id === courseId);
//       if (selectedCourse) {
//         setCheckpoint(selectedCourse.checkpoints || []);
//       }
//     }
//   }, [courseId, courses]);

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

//   useEffect(() => {
//     if (editStudent) {
//       setName(editStudent.name);
//       setEmail(editStudent.email);
//       setCourseId(editStudent.courseId);
//       setAdmissionFee(editStudent.admissionFee);
//       setCheckpoint(editStudent.checkpoint || []);
//       setPlanType(editStudent.planType || "default");
//       setPassword("");
//      setProfilePicUrl(editStudent.profilePicUrl || ""); // <-- Add this line
//     setProfilePic(null);
//     } else {
//       resetForm();
//     }
//   }, [editStudent]);

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};
//     if (!name.trim()) newErrors.name = "Name is required";
//     if (!email.trim()) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";
//     if (!editStudent && !password.trim()) newErrors.password = "Password is required";
//     if (!courseId) newErrors.courseId = "Please select a course";
//     if (selectedCourse && admissionFee != selectedCourse.fees.admissionFee) {
//       newErrors.admissionFee = `Admission fee must be ₹${selectedCourse.fees.admissionFee}`;
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       let uploadedProfilePicUrl = "";
// if (profilePic) {
//   const formData = new FormData();
//   formData.append("file", profilePic);
//   formData.append("upload_preset", "profilePic_preset"); // Replace with your preset

//   const res = await fetch("https://api.cloudinary.com/v1_1/drhqnpnjd/image/upload", {
//     method: "POST",
//     body: formData,
//   });
//   const data = await res.json();
//   if (data.secure_url) {
//     uploadedProfilePicUrl = data.secure_url;
//   }
// }

//       if (editStudent) {
//         await updateStudent(
//           editStudent.id,
//           name,
//           email,
//           courseId,
//           admissionFee,
//           checkpoint,
//           planType,
//          uploadedProfilePicUrl || editStudent.profilePicUrl 
//         );
//       } else {
//         await createStudent(
//           name,
//           email,
//           password,
//           courseId,
//           admissionFee,
//           checkpoint,
//           planType,
//           totalFee,
//           duration,
//           uploadedProfilePicUrl
//         );
//       }
//       resetForm();
//       onSaved();
//     } catch (err: any) {
//       setError(err.message || 'something went wrong')
//     }
//     finally {
//       setLoading(false);
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
//     setErrors({});
//   };


//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 p-4">

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {/* <div>
//           <label className="block mb-1 font-medium">Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Enter Student Name"
//             className={`w-full px-4 py-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300 focus:ring-blue-400"
//               }`}
//           />
//           {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
//         </div>
//         <div>
//           <label className="block mb-1 font-medium">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//              placeholder="Enter Student Email"
//             className={`w-full px-4 py-2 border rounded-md focus:ring-2 ${errors.email ? "border-red-500" : "border-gray-300 focus:ring-blue-400"
//               }`}
//           />
//           {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//         </div> */}
//       </div>


//            {/* Personal Information */}
//              <div>
//                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Personal Information</h2>
//                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                  <InputField
//                   icon={User}
//                   label="Full Name"
//                   value={name}
//                   onChange={(e: any) => setName(e.target.value)}
//                   placeholder="John Doe"
//                   error={errors.name}
//                   required
//                 />
//                 <InputField
//                   icon={Mail}
//                   label="Email Address"
//                   type="email"
//                   value={email}
//                   onChange={(e:any) => setEmail(e.target.value)}
//                   placeholder="student@example.com"
//                   error={errors.email}
//                   required
//                 />
//          <div className="space-y-2">
//        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
//          <User size={16} className="text-blue-600" />
//          Fll Name
//          {/* {required && <span className="text-red-500">*</span>} */}
//        </label>
//        <input
//         type='text'
//         value={name}
//         onChange={(e: any) => setName(e.target.value)}
//          placeholder="John Doe"
//         className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none ${
//           error
//             ? "border-red-400 bg-red-50 focus:border-red-500"
//             : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//         }`}
//       />
//       {error && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
//     </div>


//               </div>

//               {/* {!editStudent && (
//                 <div className="mt-6">
//                   <InputField
//                     icon={Lock}
//                     label="Password"
//                     type="password"
//                     value={password}
//                     onChange={(e:any) => setPassword(e.target.value)}
//                     placeholder="••••••••"
//                     error={errors.password}
//                     required
//                   />
//                 </div>
//               )} */}
//             </div>

//       {!editStudent && (
//         <div>
//           <label className="block mb-1 font-medium">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}

//              placeholder="Enter Password"
//             className={`w-full px-4 py-2 border rounded-md focus:ring-2 ${errors.password ? "border-red-500" : "border-gray-300 focus:ring-blue-400"
//               }`}
//           />
//           {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
//         </div>
//       )}

//       <div>
//         <label className="block mb-1 font-medium">Select Course</label>
//         <select
//           value={courseId}
//           onChange={(e) => setCourseId(e.target.value)}
//           className={`w-full px-4 py-2 border rounded-md focus:ring-2 ${errors.courseId ? "border-red-500" : "border-gray-300 focus:ring-blue-400"
//             }`}
//         >
//           <option value="">Select a course</option>
//           {courses.map((course) => (
//             <option key={course.id} value={course.id}>
//               {course.title}
//             </option>
//           ))}
//         </select>
//         {errors.courseId && <p className="text-red-500 text-sm">{errors.courseId}</p>}
//       </div>
//       <div>
//         <label className="block mb-1 font-medium">Checkpoint Plan</label>
//         <select
//           value={planType}
//           onChange={e => {
//             const selected = e.target.value;
//             setPlanType(selected);
//             if (selected === "default" && selectedCourse) {
//               setCheckpoint(selectedCourse.checkpoints || []);
//             } else {
//               setCheckpoint([]);
//             }
//           }}
//           className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="default">Default</option>
//           <option value="custom">Custom</option>
//         </select>
//       </div>

//       {planType === "custom" && selectedCourse && (
//         <div>
//           <label className="block mb-1 font-medium">Choose Installments</label>
//           <select
//             onChange={e => handleCustomCheckpoint(Number(e.target.value))}
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"

//           >
//             <option value="">Select installment count</option>
//             {Array.from({ length: selectedCourse.duration }, (_, i) => i + 1).map(cp => (
//               <option key={cp} value={cp}>
//                 {cp} month{cp > 1 ? "s" : ""} (₹{Math.round(selectedCourse.fees.courseFee / cp)})
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {checkpoint.length > 0 && selectedCourse && (
//         <div>
//           <h3 className="font-semibold mb-2 text-blue-600">Checkpoints</h3>
//           <div className="overflow-x-auto">
//             <table className="w-full border border-gray-300 rounded-md text-sm">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border px-4 py-2">Title</th>
//                   <th className="border px-4 py-2">Amount</th>
//                   <th className="border px-4 py-2">Due Order</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {checkpoint.map((cp, idx) => (
//                   <tr key={idx}>
//                     <td className="border px-4 py-2">{cp.title}</td>
//                     <td className="border px-4 py-2">₹{cp.amount}</td>
//                     <td className="border px-4 py-2">{cp.dueOrder}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       <div>
//         <label className="block mb-1 font-medium">Admission Fee</label>
//         <input
//           type="number"
//           value={admissionFee === 0 ? "" : admissionFee}
//           placeholder={` Required: ₹${selectedCourse?.fees.admissionFee}`}
//           onChange={(e) => setAdmissionFee(Number(e.target.value))}
//           className={`w-full px-4 py-2 border rounded-md focus:ring-2 ${errors.admissionFee
//               ? "border-red-500"
//               : "border-gray-300 focus:ring-blue-400"
//             }`}
//         />
//         {errors.admissionFee && (
//           <p className="text-red-500 text-sm">{errors.admissionFee}</p>
//         )}
//       </div>
//       <div>
//   <label className="block mb-1 font-medium">Profile Picture</label>
//   <input
//     type="file"
//     accept="image/*"
//     onChange={e => {
//       const file = e.target.files?.[0] || null;
//       setProfilePic(file);
//       if (file) {
//         const reader = new FileReader();
//         reader.onloadend = () => setProfilePicUrl(reader.result as string);
//         reader.readAsDataURL(file);
//       } else {
//         setProfilePicUrl("");
//       }
//     }}
//     className="w-full px-4 py-2 border rounded-md"
//   />
//   {profilePicUrl && (
//     <img
//       src={profilePicUrl}
//       alt="Profile Preview"
//       className="mt-2 rounded-md"
//       style={{ maxWidth: "120px", maxHeight: "120px" }}
//     />
//   )}
// </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors disabled:opacity-50"
//       >
//         {loading ? "Saving..." : editStudent ? "Update Student" : "Create Student"}
//       </button>
//       {error && <p className="text-red-500 text-center">{error}</p>}
//     </form>







//   );
// }

// export default StudentForm;








// import React, { useState, useEffect } from "react";
// import { Upload, User, Mail, Lock, BookOpen, DollarSign, FileText, AlertCircle, CheckCircle } from "lucide-react";
// import type { Coursetype } from "../type/auth";
// import { createStudent, updateStudent } from "../utils/studentUtils";

// interface StudentFormProps {
//   editStudent?: any; // student being edited
//   courses: Coursetype[];
//   onSaved: () => void;
// }

// function StudentForm({ editStudent, courses = [], onSaved }: StudentFormProps) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [courseId, setCourseId] = useState("");
//   const [admissionFee, setAdmissionFee] = useState(0);
//   const [checkpoint, setCheckpoint] = useState([{ title: "", amount: 0, dueOrder: 0 }]);
//   const [planType, setPlanType] = useState("default");
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [error, setError] = useState("");
//   const [profilePic, setProfilePic] = useState(null);
//   const [profilePicUrl, setProfilePicUrl] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const selectedCourse = courses?.find((c) => c.id === courseId);
//   const totalFee = (selectedCourse?.fees?.courseFee || 0) + (selectedCourse?.fees?.admissionFee || 0);
//   const duration = selectedCourse?.duration || 0;

//   useEffect(() => {
//     if (courseId) {
//       const selected = courses.find((c) => c.id === courseId);
//       if (selected) {
//         setCheckpoint(selected.checkpoints || []);
//       }
//     }
//   }, [courseId, courses]);

//   useEffect(() => {
//     if (editStudent) {
//       setName(editStudent.name);
//       setEmail(editStudent.email);
//       setCourseId(editStudent.courseId);
//       setAdmissionFee(editStudent.admissionFee);
//       setCheckpoint(editStudent.checkpoint || []);
//       setPlanType(editStudent.planType || "default");
//       setPassword("");
//       setProfilePicUrl(editStudent.profilePicUrl || "");
//       setProfilePic(null);
//     } else {
//       resetForm();
//     }
//   }, [editStudent]);

//   const handleCustomCheckpoint = (cpCount:any) => {
//     if (!selectedCourse) return;
//     const total = selectedCourse.fees.courseFee;
//     const perCheckpoint = Math.round(total / cpCount);
//     const cps = Array.from({ length: cpCount }, (_, i) => ({
//       title: `Installment ${i + 1}`,
//       amount: perCheckpoint,
//       dueOrder: i + 2,
//     }));
//     setCheckpoint(cps);
//   };

//     const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};
//     if (!name.trim()) newErrors.name = "Name is required";
//     if (!email.trim()) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";
//     if (!editStudent && !password.trim()) newErrors.password = "Password is required";
//     if (!courseId) newErrors.courseId = "Please select a course";
//     if (selectedCourse && admissionFee != selectedCourse.fees.admissionFee) {
//       newErrors.admissionFee = `Admission fee must be ₹${selectedCourse.fees.admissionFee}`;
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // const handleSubmit = async (e:any) => {
//   //   e.preventDefault();
//   //   if (!validateForm()) return;

//   //   setLoading(true);
//   //   setError("");
//   //   setSuccessMessage("");
    
//   //   try {
//   //     setSuccessMessage(editStudent ? "Student updated successfully!" : "Student created successfully!");
//   //     setTimeout(() => {
//   //       resetForm();
//   //       onSaved?.();
//   //     }, 1500);
//   //   } catch (err) {
//   //     setError(err.message || 'Something went wrong');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // const resetForm = () => {
//   //   setName("");
//   //   setEmail("");
//   //   setPassword("");
//   //   setCourseId("");
//   //   setAdmissionFee(0);
//   //   setCheckpoint([{ title: "", amount: 0, dueOrder: 0 }]);
//   //   setPlanType("default");
//   //   setProfilePic(null);
//   //   setProfilePicUrl("");
//   //   setErrors({});
//   //   setSuccessMessage("");
//   // };



  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       let uploadedProfilePicUrl = "";
// if (profilePic) {
//   const formData = new FormData();
//   formData.append("file", profilePic);
//   formData.append("upload_preset", "profilePic_preset"); // Replace with your preset

//   const res = await fetch("https://api.cloudinary.com/v1_1/drhqnpnjd/image/upload", {
//     method: "POST",
//     body: formData,
//   });
//   const data = await res.json();
//   if (data.secure_url) {
//     uploadedProfilePicUrl = data.secure_url;
//   }
// }
//       setSuccessMessage(editStudent ? "Student updated successfully!" : "Student created successfully!");

//       if (editStudent) {
//         await updateStudent(
//           editStudent.id,
//           name,
//           email,
//           courseId,
//           admissionFee,
//           checkpoint,
//           planType,
//          uploadedProfilePicUrl || editStudent.profilePicUrl 
//         );
//       } else {
//         await createStudent(
//           name,
//           email,
//           password,
//           courseId,
//           admissionFee,
//           checkpoint,
//           planType,
//           totalFee,
//           duration,
//           uploadedProfilePicUrl
//         );
//       }
//       resetForm();
//       onSaved();
//     } catch (err: any) {
//       setError(err.message || 'something went wrong')
//     }
//     finally {
//       setLoading(false);
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
//     setErrors({});
//      setProfilePic(null);
//     setProfilePicUrl("");
//     setSuccessMessage("");
//   };



//   const handleProfilePicChange = (e:any) => {
//     const file = e.target.files?.[0] || null;
//     setProfilePic(file);
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setProfilePicUrl(reader.result);
//       reader.readAsDataURL(file);
//     } else {
//       setProfilePicUrl("");
//     }
//   };

//   const InputField = ({ icon: Icon, label, type = "text", value, onChange, placeholder, error, required }:any) => (
//     <div className="space-y-2">
//       <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
//         <Icon size={16} className="text-blue-600" />
//         {label}
//         {required && <span className="text-red-500">*</span>}
//       </label>
//       <input
//         type={type}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none ${
//           error
//             ? "border-red-400 bg-red-50 focus:border-red-500"
//             : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//         }`}
//       />
//       {error && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
//     </div>
//   );

//   const SelectField = ({ label, value, onChange, options, error }:any) => (
//     <div className="space-y-2">
//       <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
//         <BookOpen size={16} className="text-blue-600" />
//         {label}
//         <span className="text-red-500">*</span>
//       </label>
//       <select
//         value={value}
//         onChange={onChange}
//         className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none appearance-none ${
//           error
//             ? "border-red-400 bg-red-50"
//             : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//         }`}
//       >
//         {options.map((opt:any) => (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         ))}
//       </select>
//       {error && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//       <div className="max-w-2xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
//             <div className="flex items-center gap-3 mb-2">
//               <User size={32} />
//               <h1 className="text-3xl font-bold">{editStudent ? "Edit Student" : "Add New Student"}</h1>
//             </div>
//             <p className="text-blue-100">Complete the form below to {editStudent ? "update" : "register"} a student</p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="p-8 space-y-8">
//             {/* Personal Information */}
//             <div>
//               <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Personal Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <InputField
//                   icon={User}
//                   label="Full Name"
//                   value={name}
//                   onChange={(e:any) => setName(e.target.value)}
//                   placeholder="John Doe"
//                   error={errors.name}
//                   required
//                 />
//                 <InputField
//                   icon={Mail}
//                   label="Email Address"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="student@example.com"
//                   error={errors.email}
//                   required
//                 />
//               </div>

//               {!editStudent && (
//                 <div className="mt-6">
//                   <InputField
//                     icon={Lock}
//                     label="Password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="••••••••"
//                     error={errors.password}
//                     required
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Course Information */}
//             <div>
//               <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Course Details</h2>
//               <SelectField
//                 label="Select Course"
//                 value={courseId}
//                 onChange={(e) => setCourseId(e.target.value)}
//                 options={[
//                   { value: "", label: "Choose a course..." },
//                   ...courses.map((c) => ({ value: c.id, label: c.title }))
//                 ]}
//                 error={errors.courseId}
//               />
//             </div>

//             {/* Payment Information */}
//             {selectedCourse && (
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Payment Plan</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                   <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
//                     <p className="text-sm text-gray-600">Course Fee</p>
//                     <p className="text-2xl font-bold text-blue-600">₹{selectedCourse.fees.courseFee}</p>
//                   </div>
//                   <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-600">
//                     <p className="text-sm text-gray-600">Admission Fee</p>
//                     <p className="text-2xl font-bold text-indigo-600">₹{selectedCourse.fees.admissionFee}</p>
//                   </div>
//                   <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
//                     <p className="text-sm text-gray-600">Total</p>
//                     <p className="text-2xl font-bold text-purple-600">₹{totalFee}</p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <SelectField
//                     label="Payment Plan Type"
//                     value={planType}
//                     onChange={(e:any) => {
//                       const selected = e.target.value;
//                       setPlanType(selected);
//                       if (selected === "default" && selectedCourse) {
//                         setCheckpoint(selectedCourse.checkpoints || []);
//                       } else {
//                         setCheckpoint([]);
//                       }
//                     }}
//                     options={[
//                       { value: "default", label: "Default Plan" },
//                       { value: "custom", label: "Custom Installments" }
//                     ]}
//                   />

//                   <InputField
//                     icon={DollarSign}
//                     label="Admission Fee"
//                     type="number"
//                     value={admissionFee === 0 ? "" : admissionFee}
//                     onChange={(e:any) => setAdmissionFee(Number(e.target.value))}
//                     placeholder={`₹${selectedCourse.fees.admissionFee}`}
//                     error={errors.admissionFee}
//                     required
//                   />
//                 </div>

//                 {planType === "custom" && (
//                   <div className="mt-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <FileText size={16} className="text-blue-600" />
//                       Choose Number of Installments
//                     </label>
//                     <select
//                       onChange={(e) => handleCustomCheckpoint(Number(e.target.value))}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     >
//                       <option value="">Select installment count...</option>
//                       {Array.from({ length: selectedCourse.duration }, (_, i) => i + 1).map((cp) => (
//                         <option key={cp} value={cp}>
//                           {cp} month{cp > 1 ? "s" : ""} → ₹{Math.round(selectedCourse.fees.courseFee / cp)} per installment
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 {checkpoint.length > 0 && (
//                   <div className="mt-6">
//                     <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                       <FileText size={18} className="text-blue-600" />
//                       Payment Checkpoints
//                     </h3>
//                     <div className="overflow-x-auto">
//                       <table className="w-full text-sm">
//                         <thead>
//                           <tr className="bg-gray-100 border-b-2 border-gray-300">
//                             <th className="px-4 py-3 text-left font-semibold text-gray-700">Installment</th>
//                             <th className="px-4 py-3 text-left font-semibold text-gray-700">Amount</th>
//                             <th className="px-4 py-3 text-left font-semibold text-gray-700">Due Order</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {checkpoint.map((cp, idx) => (
//                             <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
//                               <td className="px-4 py-3 text-gray-800">{cp.title}</td>
//                               <td className="px-4 py-3 font-semibold text-blue-600">₹{cp.amount}</td>
//                               <td className="px-4 py-3 text-gray-600">Month {cp.dueOrder}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Profile Picture */}
//             <div>
//               <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Profile Picture</h2>
//               <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
//                 <Upload size={16} className="text-blue-600" />
//                 Upload Photo
//               </label>
//               <div className="relative">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleProfilePicChange}
//                   className="hidden"
//                   id="profilePic"
//                 />
//                 <label
//                   htmlFor="profilePic"
//                   className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
//                 >
//                   {profilePicUrl ? (
//                     <div className="flex flex-col items-center gap-3">
//                       <img src={profilePicUrl} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
//                       <p className="text-sm text-blue-600">Click to change photo</p>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center gap-2">
//                       <Upload size={32} className="text-gray-400" />
//                       <p className="text-gray-600">Click to upload or drag and drop</p>
//                       <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                     </div>
//                   )}
//                 </label>
//               </div>
//             </div>

//             {/* Messages */}
//             {error && (
//               <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
//                 <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
//                 <p className="text-red-700">{error}</p>
//               </div>
//             )}

//             {successMessage && (
//               <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-start gap-3">
//                 <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
//                 <p className="text-green-700">{successMessage}</p>
//               </div>
//             )}

//             {/* Submit Button */}
//             <div className="flex gap-3 pt-6 border-t border-gray-200">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
//               >
//                 {loading ? "Processing..." : (editStudent ? "Update Student" : "Create Student")}
//               </button>
//               {editStudent && (
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-all"
//                 >
//                   Reset
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default StudentForm;









import React, { useState, useEffect } from "react";
import { Upload, User, Mail, Lock, BookOpen, DollarSign, FileText, AlertCircle, CheckCircle } from "lucide-react";
import type { Coursetype } from "../type/auth";
import { createStudent, updateStudent } from "../utils/studentUtils";
import InputField from "./InputField";
import SelectField from "./SelectField";

interface StudentFormProps {
  editStudent?: any;
  courses: Coursetype[];
  onSaved: () => void;
}

const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

function StudentForm({ editStudent, courses = [], onSaved }: StudentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [courseId, setCourseId] = useState("");
  const [admissionFee, setAdmissionFee] = useState(0);
  const [checkpoint, setCheckpoint] = useState([{ title: "", amount: 0, dueOrder: 0 }]);
  const [planType, setPlanType] = useState("default");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedCourse = courses?.find((c) => c.id === courseId);
  const totalFee = Number(selectedCourse?.fees?.courseFee || 0) + Number(selectedCourse?.fees?.admissionFee || 0);
  const duration = selectedCourse?.duration || 0;

  useEffect(() => {
    if (courseId) {
      const selected = courses.find((c) => c.id === courseId);
      if (selected) {
        setCheckpoint(selected.checkpoints || []);
      }
    }
  }, [courseId, courses]);

  useEffect(() => {
    if (editStudent) {
      setName(editStudent.name);
      setEmail(editStudent.email);
      setCourseId(editStudent.courseId);
      setAdmissionFee(editStudent.admissionFee);
      setCheckpoint(editStudent.checkpoint || []);
      setPlanType(editStudent.planType || "default");
      setPassword("");
      setProfilePicUrl(editStudent.profilePicUrl || "");
      setProfilePic(null);
    }
     else {
      resetForm();
    }
  }, [editStudent]);

  const handleCustomCheckpoint = (cpCount: number) => {
    if (!selectedCourse) return;
    const total = selectedCourse.fees.courseFee;
    const perCheckpoint = Math.round(total / cpCount);
    const cps = Array.from({ length: cpCount }, (_, i) => ({
      title: `Installment ${i + 1}`,
      amount: perCheckpoint,
      dueOrder: i + 2,
    }));
    setCheckpoint(cps);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Enter a valid email";
    if (!editStudent && !password.trim()) newErrors.password = "Password is required";
    else if (!editStudent && !passwordRegex.test(password)) newErrors.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
    if (!courseId) newErrors.courseId = "Please select a course";
    if (selectedCourse && admissionFee != selectedCourse.fees.admissionFee) {
      newErrors.admissionFee = `Admission fee must be ₹${selectedCourse.fees.admissionFee}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      let uploadedProfilePicUrl = "";
      if (profilePic) {
        const formData = new FormData();
        formData.append("file", profilePic);
        formData.append("upload_preset", "profilePic_preset"); 

        const res = await fetch("https://api.cloudinary.com/v1_1/drhqnpnjd/image/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) {
          uploadedProfilePicUrl = data.secure_url;
        }
      }

      setSuccessMessage(editStudent ? "Student updated successfully!" : "Student created successfully!");

      if (editStudent) {
        await updateStudent(
          editStudent.id,
          name,
          email,
          courseId,
          admissionFee,
          checkpoint,
          planType,
          uploadedProfilePicUrl || editStudent.profilePicUrl
        );
      } else {
        await createStudent(
          name,
          email,
          password,
          courseId,
          admissionFee,
          checkpoint,
          planType,
          totalFee,
          duration,
          uploadedProfilePicUrl
        );
      }
      resetForm();
      onSaved();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setCourseId("");
    setAdmissionFee(0);
    setCheckpoint([{ title: "", amount: 0, dueOrder: 0 }]);
    setPlanType("default");
    setProfilePic(null);
    setProfilePicUrl("");
    setErrors({});
    setSuccessMessage("");
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePic(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setProfilePicUrl("");
    }
  };

  return (
    <div className="min-h-screen p">
      <div className="">
        <div className="bg-white rounded-2xl shadow-md md:shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <User size={32} />
              <h1 className="text-3xl font-bold">{editStudent ? "Edit Student" : "Add New Student"}</h1>
            </div>
            <p className="text-blue-100">Complete the form below to {editStudent ? "update" : "register"} a student</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  icon={User}
                  label="Full Name"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                  placeholder="John Doe"
                  error={errors.name}
                  required
                />
                <InputField
                  icon={Mail}
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e:any) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  error={errors.email}
                  required
                />
              </div>

              {!editStudent && (
                <div className="mt-6">
                  <InputField
                    icon={Lock}
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e:any) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    error={errors.password}
                    required
                  />
                </div>
              )}
            </div>

            {/* Course Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Course Details</h2>
              <SelectField
                label="Select Course"
                value={courseId}
                onChange={(e:any) => setCourseId(e.target.value)}
                options={[
                  { value: "", label: "Choose a course..." },
                  ...courses.map((c) => ({ value: c.id, label: c.title }))
                ]}
                error={errors.courseId}
              />
            </div>

            {/* Payment Information */}
            {selectedCourse && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Payment Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                    <p className="text-sm text-gray-600">Course Fee</p>
                    <p className="text-2xl font-bold text-blue-600">₹{selectedCourse.fees.courseFee}</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-600">
                    <p className="text-sm text-gray-600">Admission Fee</p>
                    <p className="text-2xl font-bold text-indigo-600">₹{selectedCourse.fees.admissionFee}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-purple-600">₹{totalFee}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    label="Payment Plan Type"
                    value={planType}
                    onChange={(e: any) => {
                      const selected = e.target.value;
                      setPlanType(selected);
                      if (selected === "default" && selectedCourse) {
                        setCheckpoint(selectedCourse.checkpoints || []);
                      } else {
                        setCheckpoint([]);
                      }
                    }}
                    options={[
                      { value: "default", label: "Default Plan" },
                      { value: "custom", label: "Custom Installments" }
                    ]}
                  />

                  <InputField
                    icon={DollarSign}
                    label="Admission Fee"
                    type="number"
                    value={admissionFee === 0 ? "" : admissionFee}
                    onChange={(e: any) => setAdmissionFee(Number(e.target.value))}
                    placeholder={`₹${selectedCourse.fees.admissionFee}`}
                    error={errors.admissionFee}
                    required
                  />
                </div>

                {planType === "custom" && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FileText size={16} className="text-blue-600" />
                      Choose Number of Installments
                    </label>
                    <select
                      onChange={(e) => handleCustomCheckpoint(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select installment count...</option>
                      {Array.from({ length: selectedCourse.duration }, (_, i) => i + 1).map((cp) => (
                        <option key={cp} value={cp}>
                          {cp} month{cp > 1 ? "s" : ""} → ₹{Math.round(selectedCourse.fees.courseFee / cp)} per installment
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {checkpoint.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FileText size={18} className="text-blue-600" />
                      Payment Checkpoints
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100 border-b-2 border-gray-300">
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Installment</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Amount</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Due Order</th>
                          </tr>
                        </thead>
                        <tbody>
                          {checkpoint.map((cp, idx) => (
                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-800">{cp.title}</td>
                              <td className="px-4 py-3 font-semibold text-blue-600">₹{cp.amount}</td>
                              <td className="px-4 py-3 text-gray-600">Month {cp.dueOrder}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Picture */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Profile Picture</h2>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Upload size={16} className="text-blue-600" />
                Upload Photo
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                  id="profilePic"
                />
                <label
                  htmlFor="profilePic"
                  className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  {profilePicUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <img src={profilePicUrl} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
                      <p className="text-sm text-blue-600">Click to change photo</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={32} className="text-gray-400" />
                      <p className="text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-start gap-3">
                <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-green-700">{successMessage}</p>
              </div>
            )}

            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : (editStudent ? "Update Student" : "Create Student")}
              </button>
              {editStudent && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentForm;