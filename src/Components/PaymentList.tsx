import { calculateTotals } from '../utils/paymentUtils';
import type { Coursetype, StudentDetails } from '../type/auth';

import { Link } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';

function PaymentList({ filteredStudents, courses, payments }: { filteredStudents: StudentDetails[], courses: Coursetype[], payments: any }) {

    return (
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
                        {filteredStudents.length > 0 ? filteredStudents.map((student: any) => {
                            const course = courses.find((c: any) => c.id === student.courseId);
                            const studentPayments = payments.filter((p: any) => p.studentId === student.id);
                            const { totalFee, paidAmount, dueAmount } = calculateTotals(student, studentPayments);
                            const status = dueAmount === 0 ? "Paid" : "Partially Paid";
                            if (student.role === 'student')
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
                        }) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                <BsSearch size={32} className="text-slate-400" />
                                            </div>
                                            <p className="text-slate-600 font-medium mb-1">No students found</p>
                                            <p className="text-slate-500 text-sm">Try adjusting your search criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PaymentList