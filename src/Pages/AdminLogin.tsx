


// import  { useContext, useState } from 'react'
// import {  useNavigate } from 'react-router-dom';
// import AdminNavbar from '../Components/AdminNavbar';
// import { AuthContext } from '../context/AuthContext';

// function AdminLogin() {

//   const { login } = useContext(AuthContext)!;

//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e:React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await login( email, password);
//       console.log(email, password);

//       navigate("/institution/dashboard")
//     }
//     catch (err) {
//       setError('invalid credentials');
//       console.log('invalid credddd' ,email, password);

//     }

//   }


//   return (
//     <div className="min-h-screen bg-sky-100 flex flex-col">
//       <AdminNavbar />
//       <div className="flex flex-1 items-center justify-center p-4">
//         <div className="bg-white w-full max-w-md px-6 py-8 rounded-2xl shadow-lg">
//           <h1 className="text-center text-2xl font-bold mb-6">Login</h1>

//           <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
//             <div>
//               <label htmlFor="email" className="block text-blue-500 mb-1">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter Email"
//                 required
//                 className="w-full border border-gray-400 rounded-sm px-3 py-2 focus:outline-none focus:border-blue-500"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-blue-500 mb-1">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter Password"
//                 required
//                 className="w-full border border-gray-400 rounded-sm px-3 py-2 focus:outline-none focus:border-blue-500"
//               />
//             </div>

//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
//             >Login


//             </button>

//             {error && <p className='text-red-500'> {error} </p> }
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AdminLogin




import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../Components/AdminNavbar';

function AdminLogin() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (email && password) {
        await login(email, password);
        navigate("/institution/dashboard")
      }
    }
    catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  }

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <div className="min-h-screen bg-blue-00 flex flex-col relative overflow-hidden">
      <AdminNavbar />
      <div className="flex flex-1 items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative flex items-center justify-center">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
              </div>
              <div className="relative text-center">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/30">
                  <LogIn size={40} className="text-white" />
                </div>
              </div>
            </div>

            <div className="px-8 py-8">
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Welcome Back</h1>
              <p className="text-gray-600 text-center mb-8 text-sm">Sign in to access your courses and certificates</p>

              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email or ID
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email or ID"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors duration-200 bg-gray-50 hover:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      {error}
                    </p>
                  </div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid || isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${isFormValid && !isLoading
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-800 shadow-lg hover:shadow-xl transform hover:scale-105"
                    : "bg-gray-400  opacity-60"
                    }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </>
                  ) :
                   (
                    <>
                      <LogIn size={20} />
                      Sign In
                    </>
                  )}
                </button>
              </div>
              <p className="text-center text-xs text-gray-500 mt-6">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>🔒 Your data is encrypted and secure</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin