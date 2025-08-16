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

function Router() {
    return (
        <Routes>
            <Route path='/institution/login' element={<AdminLogin />} />

            <Route path='/institution' element={ <Home />}>                   
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='students' element={<Students />} />
                <Route path='courses' element={<Courses />} />
                <Route path='certificate' element={<Certificates />} />
                <Route path='payment' element={<Payment />} />
            </Route>
        </Routes>
    )
}

export default Router