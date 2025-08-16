import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavbar from '../Components/AdminNavbar'
import Sidebar from '../Components/Sidebar'

function Home() {
    return (
        <div className='h-screen'>
            <AdminNavbar/>
            <div className='bg-amber-300 w-full h-[90%] flex'>
                <div className="flex h-full overflow-hidden">

                    <Sidebar />
                </div>
                <div className='bg-sky-50 w-full p-4 overflow-y-auto'>
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default Home