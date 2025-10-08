
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import type { Coursetype, StudentDetails } from "../type/auth";
import { Link, Outlet, useLocation } from "react-router-dom";
import { calculateTotals } from "../utils/paymentUtils";
import { subscribeStudents, subscribeCourses } from "../utils/paymentUtils";

const Payment = () => {

  const [students, setStudents] = useState<StudentDetails[]>([]);
  const [courses, setCourse] = useState<Coursetype[]>([]);
  const [payments, setPayments] = useState<any[]>([])
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

  return (
    <div className="md:px-6">
      <div className="p-6  bg-white shadow rounded-lg ">
        {location.pathname.endsWith("/payment") ? (
          <div>
            <h2 className="text-2xl font-bold mb-4 md:text-center">Payment </h2>
            <div className="overflow-auto">
              <table className="w-full border-collapse border border-gray-300 ">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Student Name</th>
                    <th className="border border-gray-300 px-4 py-2">Course</th>
                    <th className="border border-gray-300 px-4 py-2">Total Fee
                      <p>(coursefee + admissionfee)</p>
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Paid Amount</th>
                    <th className="border border-gray-300 px-4 py-2">Due Amount</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const course = courses.find((c) => c.id === student.courseId);
                    const studentPayments = payments.filter((p) => p.studentId === student.id);
                    const { totalFee, paidAmount, dueAmount } = calculateTotals(student, studentPayments);
                    const status = dueAmount === 0 ? "Paid" : "Partially Paid";
                    if(student.role === 'student')
                    return (
                      <tr key={student.id} className="text-blue-700 text-center nth-[even]:bg-blue-50">
                        <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{course?.title || 'unknow course'}</td>
                        <td className="border border-gray-300 px-4 py-2">₹{totalFee}</td>
                        <td className="border border-gray-300 px-4 py-2 text-green-600">₹{paidAmount} </td>
                        <td className="border border-gray-300 px-4 py-2 text-red-600">₹{dueAmount}</td>
                        <td
                          className={`border border-gray-300 px-4 py-2 font-semibold ${status === "Paid" ? "text-green-600" : "text-yellow-600"
                            }`}
                        >
                          {status}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 space-x-2">
                          <Link to={`all-details/${student.id}`}>View</Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>


        ) : (<Outlet />)}
      </div>
    </div>

  );
};

export default Payment;

