


import React, { useContext, useState } from 'react'
import {  useNavigate } from 'react-router-dom';
import AdminNavbar from '../Components/AdminNavbar';
import { AuthContext } from '../context/AuthContext';

function AdminLogin() {



  // const authContex = useContext(AuthContext);
  // if(!authContex) throw new Error('Authcontex not founddd');

  const { login } = useContext(AuthContext)!;

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      await login( email, password);
      console.log(email, password);
      
      navigate("/institution/dashboard")
    }
    catch (err) {
      setError('invalid credentials');
      console.log('invalid credddd' ,email, password);
      
    }

  }


  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="bg-white w-full max-w-md px-6 py-8 rounded-2xl shadow-lg">
          <h1 className="text-center text-2xl font-bold mb-6">Login</h1>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <label htmlFor="email" className="block text-blue-500 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                required
                className="w-full border border-gray-400 rounded-sm px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-blue-500 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
                className="w-full border border-gray-400 rounded-sm px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >Login
            

            </button>
            
            {error && <p className='text-red-500'> {error} </p> }
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
