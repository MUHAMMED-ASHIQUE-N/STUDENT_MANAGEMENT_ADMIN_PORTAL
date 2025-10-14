import React from 'react';
import { Users, TrendingUp,  Zap, Clock } from 'lucide-react';
import StatCard from './StartCard';
import StudentGraph from './StudentGraph';
import FinancialGraph from './FinancialGraph';
import TopCourses from './ActiveCourse';
import QuickActions from './QuikActions';
import { useDash } from '../context/DashContext';


function Dashboard() {
  const {totalStudents, pendingCertificates, totalDues, totalRevenue} = useDash()

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto sm:px-6 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={totalStudents}
            icon={<Users />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Total Revenue"
            value={`£${totalRevenue}`}
            icon={<TrendingUp />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="Total Dues"
            value={`£${totalDues}`}
            icon={<Clock />}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
          />
          <StatCard
            title="Pending Certificates"
            value={pendingCertificates}
            icon={<Zap />}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
          />
        </div>
        
        <div className="grid grid-cols-1  gap-6 mb-8">
          <FinancialGraph />
          <StudentGraph/>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TopCourses />
          </div>
          <QuickActions/>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;