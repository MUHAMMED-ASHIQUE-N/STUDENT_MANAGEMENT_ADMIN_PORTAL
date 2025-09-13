import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from '../Pages/AdminLogin'
import Home from '../Pages/Home'
import Dashboard from '../Components/Dashboard'
import Students from '../Components/Students'
import Courses from '../Components/Courses'
import Certificates from '../Components/Certificates'
import Payment from '../Components/Payment'
import ProtectedRoute from '../Components/ProtectedRoute'
import PaymentDetails from '../Components/PaymentDetails'

function Router() {
    return (
        <Routes>
            <Route path='/institution/login' element={<AdminLogin />} />

            <Route path='/institution' element={    <Home />
}
                // <ProtectedRoute requiredRole='admin'>
                //      <Home />
                // </ProtectedRoute>
                >                   
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='students' element={<Students />} />
                <Route path='courses' element={<Courses />} />
                <Route path='certificate' element={<Certificates />} />
                <Route path='payment' element={<Payment />} >
                <Route path='all-details/:id' element={<PaymentDetails/>} />
                </Route>
            </Route>
        </Routes>
    )
}

export default Router