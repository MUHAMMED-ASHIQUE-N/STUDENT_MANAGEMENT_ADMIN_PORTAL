import StudentGraph from './StudentGraph';
import FinancialGraph from './FinancialGraph';
import ActiveCourse from './ActiveCourse';
import QuikActions from './QuikActions';

function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen md:p-6 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <StudentGraph />
        <FinancialGraph />
        <ActiveCourse />
        <QuikActions />
      </div>
    </div>
  );
}

export default Dashboard;