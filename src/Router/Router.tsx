import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLogin from '../Pages/AdminLogin'
import Home from '../Pages/Home'
import Dashboard from '../Components/Dashboard'
import Students from '../Components/Students'
import Courses from '../Components/Courses'
import Certificates from '../Components/Certificates'
import Payment from '../Components/Payment'
import ProtectedRoute from '../Components/ProtectedRoute'
import PaymentDetails from '../Components/PaymentDetails'
import { useAuth } from '../context/AuthContext'

function Router() {
    const { user } = useAuth()
    return (
        <Routes>
            <Route path="/" element={ user ? <Navigate to="/institution/dashboard" replace />: <Navigate to="/institution/login" replace />} />

            <Route path='/institution/login' element={<AdminLogin />} />
            {/* <Route path='/institution' element={<Home/>} */}

            <Route path='/institution' element={
                <ProtectedRoute >
                    <Home />
                </ProtectedRoute>}

                >
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='students' element={<Students />} />
                <Route path='courses' element={<Courses />} />
                <Route path='certificate' element={<Certificates />} />
                <Route path='payment' element={<Payment />} >
                    <Route path='all-details/:id' element={<PaymentDetails />} />
                </Route>
            </Route>
            <Route path='*' element={<Navigate to="/" replace />}  />
        </Routes>
    )
}

export default Router



