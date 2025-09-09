import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import StudentStatusPieChart from './StudentStatusRadialChart';

function Dashboard() {


  const authContex = useContext(AuthContext);
  if(!authContex) return null;
  const { user, logout } = authContex; 

const [totalStudents, setTotalStudents] = useState(0)
const [totalRevenue, setTotalRevenue] = useState(0)


  useEffect(()=> {
    const unsubRevenue = onSnapshot(collection(db, "payments"), (snpshot) => {
      let totalrevenue = 0;
      snpshot.forEach((doc) => {
        totalrevenue += Number(doc.data().amount) || 0;
      })
      setTotalRevenue(totalrevenue)
    });

    const unsubTotalStudents = onSnapshot(collection(db, "userDetails"), (snapshot) => {
    
      setTotalStudents(snapshot.size)
    });


    return () =>{
      unsubRevenue();
      unsubTotalStudents();
    } 
  },[])



  return (
    <div>
        {/* <StudentStatusPieChart/> */}
         <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
      <p >total Revenue {totalRevenue} </p>
      <p >total students {totalStudents} </p>
        <p>Welcome {user?.email} </p>
        <button onClick={() => logout()} className='cursor-pointer'>Logout </button>

      </div>
    </div>
  )
}

export default Dashboard








// import { useEffect, useState } from "react";
// import { db } from "../firebase/config";
// import { collection, onSnapshot } from "firebase/firestore";
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//   BarChart, Bar, PieChart, Pie, Cell
// } from "recharts";
// import StudentStatusRadialChart from "./StudentStatusRadialChart";

// interface RevenueData {
//   month: string;
//   total: number;
// }

// interface StudentData {
//   course: string;
//   count: number;
// }

// interface PaymentStatusData {
//   name: string;
//   value: number;
// }

// const COLORS = ["#22c55e", "#ef4444"]; // green = paid, red = pending

// const Dashboard = () => {
//   const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
//   const [studentData, setStudentData] = useState<StudentData[]>([]);
//   const [paymentStatus, setPaymentStatus] = useState<PaymentStatusData[]>([]);

//   // 📌 Fetch Revenue Data
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "payments"), (snapshot) => {
//       const monthlyTotals: Record<string, number> = {};
//       let paid = 0;
//       let pending = 0;

//       snapshot.docs.forEach((doc) => {
//         const payment = doc.data();
//         const date = payment.date?.toDate();
//         if (!date) return;

//         const month = date.toLocaleString("default", { month: "short" });
//         monthlyTotals[month] = (monthlyTotals[month] || 0) + payment.amount;

//         if (payment.status === "paid") {
//           paid += payment.amount;
//         } else {
//           pending += payment.amount;
//         }
//       });

//       setRevenueData(
//         Object.keys(monthlyTotals).map((m) => ({
//           month: m,
//           total: monthlyTotals[m],
//         }))
//       );

//       setPaymentStatus([
//         { name: "Paid", value: paid },
//         { name: "Pending", value: pending },
//       ]);
//     });

//     return () => unsub();
//   }, []);

//   // 📌 Fetch Student Count per Course
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "userDetails"), (snapshot) => {
//       const courseCounts: Record<string, number> = {};

//       snapshot.docs.forEach((doc) => {
//         const student = doc.data();
//         const course = student.courseName || "Unknown";

//         courseCounts[course] = (courseCounts[course] || 0) + 1;
//       });

//       setStudentData(
//         Object.keys(courseCounts).map((course) => ({
//           course,
//           count: courseCounts[course],
//         }))
//       );
//     });

//     return () => unsub();
//   }, []);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

//       <StudentStatusRadialChart/>
//       {/* Revenue Trend */}
//       <div className="bg-white p-4 rounded-2xl shadow">
//         <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={revenueData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Student Count */}
//       <div className="bg-white p-4 rounded-2xl shadow">
//         <h2 className="text-lg font-semibold mb-4">Students per Course</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={studentData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="course" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="count" fill="#f59e0b" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Payment Status */}
//       <div className="bg-white p-4 rounded-2xl shadow md:col-span-2">
//         <h2 className="text-lg font-semibold mb-4">Payment Status</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie
//               data={paymentStatus}
//               cx="50%"
//               cy="50%"
//               outerRadius={100}
//               fill="#8884d8"
//               dataKey="value"
//               label
//             >
//               {paymentStatus.map((entry, index) => (
//                 <Cell key={index} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Legend />
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
