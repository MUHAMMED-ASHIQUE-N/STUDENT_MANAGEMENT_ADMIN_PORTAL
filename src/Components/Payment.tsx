
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import type { Coursetype, StudentDetails } from "../type/auth";
import { Outlet, useLocation } from "react-router-dom";
import { calculateTotals } from "../utils/paymentUtils";
import { subscribeStudents, subscribeCourses } from "../utils/paymentUtils";
import PaymentList from "./PaymentList";
import { BsChevronDown, BsSearch, BsX } from "react-icons/bs";

const Payment = () => {

  const [students, setStudents] = useState<StudentDetails[]>([]);
  const [courses, setCourse] = useState<Coursetype[]>([]);
  const [payments, setPayments] = useState<any[]>([])

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial'>('all');
  const [sortOption, setSortOption] = useState<'default' | 'nameAsc' | 'nameDesc' | 'paid' | 'partial'>('default');
  const location = useLocation();

  useEffect(() => {
    const unsubStudents = subscribeStudents(db, setStudents);
    const unsubCourses = subscribeCourses(db, setCourse);

    const unsubPayments = onSnapshot(collection(db, "payments"), (snapshot) => {
      const payment = snapshot.docs.map((doc) => ({
        id: doc.id, ...(doc.data() as any)
      }))
      setPayments(payment)
    });

    return () => {
      unsubStudents();
      unsubCourses();
      unsubPayments();
    };
  }, []);

  const filteredStudents = students
    .filter(student => {
      if (student.role !== 'student') return false;
      const course = courses.find(c => c.id === student.courseId);
      const courseTitle = course?.title?.toLowerCase() || '';
      const nameMatch = student.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const courseMatch = courseTitle.includes(searchTerm.toLowerCase());
      const studentPayments = payments.filter(p => p.studentId === student.id);
      const { dueAmount } = calculateTotals(student, studentPayments);
      const status = dueAmount === 0 ? "Paid" : "Partially Paid";
      if (statusFilter === 'paid' && status !== "Paid") return false;
      if (statusFilter === 'partial' && status !== "Partially Paid") return false;
      return nameMatch || courseMatch;
    })
    .sort((a, b) => {
      const paymentsA = payments.filter(p => p.studentId === a.id);
      const paymentsB = payments.filter(p => p.studentId === b.id);
      const statusA = calculateTotals(a, paymentsA).dueAmount === 0 ? "Paid" : "Partially Paid";
      const statusB = calculateTotals(b, paymentsB).dueAmount === 0 ? "Paid" : "Partially Paid";
      switch (sortOption) {
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        case "paid":
          return statusA === "Paid" && statusB !== "Paid" ? -1 : statusB === "Paid" && statusA !== "Paid" ? 1 : 0;
        case "partial":
          return statusA === "Partially Paid" && statusB !== "Partially Paid" ? -1 : statusB === "Partially Paid" && statusA !== "Partially Paid" ? 1 : 0;
        default:
          return 0;
      }
    });

  return (
    <div className="md:px-6">
      <div className=" ">

        {location.pathname.endsWith("/payment") ? (
          <div>
            <div className="mb-6 space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition w-full">
                    <BsSearch size={20} className="text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search by student name or course..."
                      className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                      >
                        <BsX size={18} />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                        className="appearance-none w-full sm:w-44 px-4 py-3 pr-10 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:border-slate-300 transition text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="partial">Partially Paid</option>
                      </select>
                      <BsChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>

                    <div className="relative w-full sm:w-auto">
                      <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
                        className="appearance-none w-full sm:w-44 px-4 py-3 pr-10 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:border-slate-300 transition text-sm"
                      >
                        <option value="default">Default</option>
                        <option value="nameAsc">Name (A-Z)</option>
                        <option value="nameDesc">Name (Z-A)</option>
                        <option value="paid">Paid First</option>
                        <option value="partial">Partially Paid First</option>
                      </select>
                      <BsChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6  bg-white shadow  rounded-lg">
              <PaymentList filteredStudents={filteredStudents} courses={courses} payments={payments} />
            </div>
          </div>

        ) : (<Outlet />)}
      </div>
    </div>

  );
};

export default Payment;

