import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

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