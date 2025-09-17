// import React, { useContext, useEffect, useState } from 'react'
// import { AuthContext } from '../context/AuthContext';
// import { collection, onSnapshot } from 'firebase/firestore';
// import { db } from '../firebase/config';
// import StudentStatusPieChart from './StudentStatusRadialChart';

// function Dashboard() {


//   const authContex = useContext(AuthContext);
//   if(!authContex) return null;
//   const { user, logout } = authContex; 

// const [totalStudents, setTotalStudents] = useState(0)
// const [totalRevenue, setTotalRevenue] = useState(0)


//   useEffect(()=> {
//     const unsubRevenue = onSnapshot(collection(db, "payments"), (snpshot) => {
//       let totalrevenue = 0;
//       snpshot.forEach((doc) => {
//         totalrevenue += Number(doc.data().amount) || 0;
//       })
//       setTotalRevenue(totalrevenue)
//     });

//     const unsubTotalStudents = onSnapshot(collection(db, "userDetails"), (snapshot) => {

//       setTotalStudents(snapshot.size)
//     });


//     return () =>{
//       unsubRevenue();
//       unsubTotalStudents();
//     } 
//   },[])



//   return (
//     <div>
//         {/* <StudentStatusPieChart/> */}
//          <div className="bg-white p-6 shadow-md rounded-lg">
//         <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
//       <p >total Revenue {totalRevenue} </p>
//       <p >total students {totalStudents} </p>
//         <p>Welcome {user?.email} </p>
//         <button onClick={() => logout()} className='cursor-pointer'>Logout </button>

//       </div>
//     </div>
//   )
// }

// export default Dashboard







// import  { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { collection, onSnapshot } from 'firebase/firestore';
// import { db } from '../firebase/config';
// import { BsPersonFill, BsCashStack, BsBookHalf, BsPlusCircleFill, BsLightningFill } from 'react-icons/bs';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   BarChart,
//   Bar
// } from 'recharts';

// // Sample data for the student count chart
// const studentData = [
//   { name: 'Jan', students: 100 },
//   { name: 'Feb', students: 120 },
//   { name: 'Mar', students: 150 },
//   { name: 'Apr', students: 140 },
//   { name: 'May', students: 180 },
//   { name: 'Jun', students: 200 },
// ];

// // Sample data for the revenue chart
// const revenueData = [
//   { name: 'Jan', totalRevenue: 4000 },
//   { name: 'Feb', totalRevenue: 3000 },
//   { name: 'Mar', totalRevenue: 5000 },
//   { name: 'Apr', totalRevenue: 4500 },
//   { name: 'May', totalRevenue: 6000 },
//   { name: 'Jun', totalRevenue: 5500 },
// ];

// function Dashboard() {
//   const authContex = useContext(AuthContext);
//   if (!authContex) return null;
//   const { user, logout } = authContex;

//   const [totalStudents, setTotalStudents] = useState(0);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [totalDues, setTotalDues] = useState(0);
//   const [activeCourses, setActiveCourses] = useState(0);
//   const [pendingCertificates, setPendingCertificates] = useState(12);
//   const [topCourses, setTopCourses] = useState<any[]> ([]); // New state for top courses

//   useEffect(() => {
//     const unsubPayments = onSnapshot(collection(db, 'payments'), (snapshot) => {
//       let currentTotalRevenue = 0;
//       let currentTotalDues = 0;
//       snapshot.forEach((doc) => {
//         const paymentData = doc.data();
//         currentTotalRevenue += Number(paymentData.amount) || 0;
//         if (paymentData.status === 'pending') {
//           currentTotalDues += Number(paymentData.amount) || 0;
//         }
//       });
//       setTotalRevenue(currentTotalRevenue);
//       setTotalDues(currentTotalDues);
//     });

//     const unsubTotalStudents = onSnapshot(collection(db, 'userDetails'), (snapshot) => {
//       setTotalStudents(snapshot.size);
//     });

//     const unsubActiveCourses = onSnapshot(collection(db, 'courses'), (snapshot) => {
//       let activeCount = 0;
//       let coursesList:any[] = [];
//       snapshot.forEach(doc => {
//         const courseData = doc.data();
//         if (courseData) {
//           activeCount++;
//           coursesList.push({ id: doc.id, title: courseData.title, students: courseData.studentsCount || 0 });
//         }
//       });
//       setActiveCourses(activeCount);
//       // Sort courses by student count and take the top 3
//       setTopCourses(coursesList.sort((a, b) => b.students - a.students).slice(0, 3));
//     });

//     return () => {
//       unsubPayments();
//       unsubTotalStudents();
//       unsubActiveCourses();
//     };
//   }, []);

//   return (
//     <div className="flex flex-col bg-gray-100 min-h-screen p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={() => logout()}
//             className="text-gray-600 hover:text-red-500 transition-colors duration-200"
//           >
//             Logout
//           </button>
//           <span className="text-gray-800 font-medium">{user?.email}</span>
//           <BsPersonFill size={24} className="text-gray-500" />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">

//         {/* Total Students Widget with Graph */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center space-x-4 mb-4">
//             <div className="p-3 bg-blue-100 rounded-full">
//               <BsPersonFill size={24} className="text-blue-500" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total Students</p>
//               <h3 className="text-3xl font-bold text-gray-800">{totalStudents}</h3>
//             </div>
//           </div>
//           <div className="h-48 mt-4">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={studentData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//                 <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} />
//                 <YAxis stroke="#888888" tickLine={false} axisLine={false} />
//                 <Tooltip />
//                 <Bar dataKey="students" fill="#8884d8" name="Student Count" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Financial Overview Widget with Graph */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center space-x-4 mb-4">
//             <div className="p-3 bg-green-100 rounded-full">
//               <BsCashStack size={24} className="text-green-500" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total Revenue</p>
//               <h3 className="text-3xl font-bold text-gray-800">£{totalRevenue.toLocaleString()}</h3>
//             </div>
//           </div>
//           <div className="h-48 mt-4">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//                 <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} />
//                 <YAxis stroke="#888888" tickLine={false} axisLine={false} />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="totalRevenue"
//                   stroke="#8b5cf6"
//                   strokeWidth={2}
//                   dot={{ r: 4, fill: '#8b5cf6' }}
//                   activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
//                   name="Revenue"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Detailed Active Courses Widget */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center space-x-4 mb-4">
//             <div className="p-3 bg-purple-100 rounded-full">
//               <BsBookHalf size={24} className="text-purple-500" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Active Courses</p>
//               <h3 className="text-3xl font-bold text-gray-800">{activeCourses}</h3>
//             </div>
//           </div>
//           <div className="mt-4">
//             <h4 className="text-lg font-semibold text-gray-700 mb-2">Top Courses</h4>
//             <ul className="space-y-2">
//               {topCourses.length > 0 ? (
//                 topCourses.map((course, index) => (
//                   <li key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
//                     <span className="text-gray-800 font-medium">{course.title}</span>
//                     <span className="text-sm text-gray-500">{course.students} students</span>
//                   </li>
//                 ))
//               ) : (
//                 <p className="text-gray-400 text-sm">No active courses found.</p>
//               )}
//             </ul>
//           </div>
//         </div>

//         {/* Standarized Quick Actions Widget */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center space-x-4 mb-4">
//             <div className="p-3 bg-yellow-100 rounded-full">
//               <BsLightningFill size={24} className="text-yellow-500" />
//             </div>
//             <h4 className="text-lg font-semibold text-gray-700">Quick Actions</h4>
//           </div>
//           <div className="space-y-4">
//             <a href="#" className="flex items-center justify-between px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md">
//               <span className="font-medium">Add New Student</span>
//               <BsPlusCircleFill size={20} />
//             </a>
//               <a href="#" className="flex items-center justify-between px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md">
//                 <span className="font-medium">Add New Course</span>
//                 <BsPlusCircleFill size={20} />
//               </a>
//             <a href="#" className="flex items-center justify-between px-4 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 shadow-md">
//               <span className="font-medium">Pending Certificates</span>
//               <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{pendingCertificates}</span>
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;


import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'; // Added query and orderBy
import { db } from '../firebase/config';
import { BsPersonFill, BsCashStack, BsBookHalf, BsPlusCircleFill, BsLightningFill } from 'react-icons/bs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { format } from 'date-fns';
import { DashContext } from '../context/DashContext';

function Dashboard() {
  const authContex = useContext(AuthContext);
  if (!authContex) return null;

  const dashContext = useContext(DashContext);
  if (!dashContext) return null

  const {
    totalStudents,
    totalRevenue,
    totalDues,
    activeCourses,
    pendingCertificates,
    topCourses,
    studentGraphData,
    revenueGraphData
  } = dashContext;

  const { user, logout } = authContex;


  return (
    <div className="flex flex-col min-h-screen md:p-6 overflow-hidden">
      {/* <div className="flex justify-between items-center mb-6">
        <h1 className="sm:text-3xl font-semibold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => logout()}
            className="text-gray-600 hover:text-red-500 transition-colors duration-200"
          >
            Logout
          </button>
          <span className="text-gray-800 font-medium">{user?.email}</span>
          <BsPersonFill size={24} className="text-gray-500" />
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">

        {/* Total Students Widget with Graph */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <BsPersonFill size={24} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <h3 className="text-3xl font-bold text-gray-800">{totalStudents}</h3>
            </div>
          </div>
          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentGraphData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="students" fill="#8884d8" name="Student Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Overview Widget with Graph */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <BsCashStack size={24} className="text-green-500" />
            </div>
            <div className='flex gap-8'>
              <div>
        <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">£{totalRevenue.toLocaleString()}</h3>
             
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Dues</p>
              <h3 className="text-2xl font-bold text-gray-800">£{totalDues.toLocaleString()}</h3>
           
              </div>
                </div>
          </div>
          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueGraphData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#8b5cf6' }}
                  activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* ... Rest of your components */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <BsBookHalf size={24} className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Courses</p>
              <h3 className="text-3xl font-bold text-gray-800">{activeCourses}</h3>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Top Courses</h4>
            <ul className="space-y-2">
              {topCourses.length > 0 ? (
                topCourses.map((course, index) => (
                  <li key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                    <span className="text-gray-800 font-medium">{course.title}</span>
                    <span className="text-sm text-gray-500">{course.students} students</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No active courses found.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Standarized Quick Actions Widget */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <BsLightningFill size={24} className="text-yellow-500" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700">Quick Actions</h4>
          </div>
          <div className="space-y-4">
            <a href="#" className="flex items-center justify-between px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md">
              <span className="font-medium">Add New Student</span>
              <BsPlusCircleFill size={20} />
            </a>
            <a href="#" className="flex items-center justify-between px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md">
              <span className="font-medium">Add New Course</span>
              <BsPlusCircleFill size={20} />
            </a>
            <a href="#" className="flex items-center justify-between px-4 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 shadow-md">
              <span className="font-medium">Pending Certificates</span>
              <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{pendingCertificates}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;