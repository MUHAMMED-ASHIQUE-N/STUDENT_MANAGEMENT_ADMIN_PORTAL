import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext';

function Dashboard() {

  const authContex = useContext(AuthContext);
  if(!authContex) return null;

  const { user, logout } = authContex; 

  return (
    <div>
         <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
        <p>Welcome {user?.email} </p>
        <button onClick={() => logout()} className='cursor-pointer'>Logout </button>

      </div>
    </div>
  )
}

export default Dashboard