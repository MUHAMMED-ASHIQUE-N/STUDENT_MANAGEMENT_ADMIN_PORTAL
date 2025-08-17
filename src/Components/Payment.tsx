
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import type { Coursetype, StudentDetails } from "../type/auth";

type Payment = {
  id: number;
  name: string;
  course: string;
  lastPayment: string;
  amountPaid: number;
  totalAmount: number;
  receiptUrl?: string;
};


const paymentStudents: Payment[] = [
  {
    id: 1,
    name: 'fathima',
    course: 'mern stack',
    lastPayment: "2025-01-15",
    amountPaid: 6500,
    totalAmount: 10000,
    receiptUrl: "/receipts/receipt1.pdf",
  },
  {
    id: 2,
    name: 'shahana',
    course: 'full stack',
    lastPayment: "2025-03-10",
    amountPaid: 3500,
    totalAmount: 10000,
    receiptUrl: "/receipts/receipt2.pdf",
  },
  {
    id: 3,
    name: "Meera K",
    course: "UI/UX",
    totalAmount: 8000,
    amountPaid: 2000,
    lastPayment: "2025-01-25-",
    receiptUrl: "",
  },
];

const Payment: React.FC = () => {

  const [students, setStudents] = useState<StudentDetails[]>([]);
  const [courses, setCourse] = useState<Coursetype[]>([]);


  useEffect(() => {
    const unsubStudents = onSnapshot(collection(db, "userDetails"), (snapshot) => {

      const studentData = snapshot.docs.map((doc) => ({
        id: doc.id, ...(doc.data() as Omit<StudentDetails, "id">)
      }))
      setStudents(studentData)
    })

    const unsubCourses = onSnapshot(collection(db, "courses"), (snapshot) => {

      const courseData = snapshot.docs.map((doc) => ({
        id: doc.id, ...(doc.data() as Omit<Coursetype, "id">)
      }))
      setCourse(courseData)
    })

    return () => {
      unsubStudents();
      unsubCourses();
    }


  }, [])



  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Payment </h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Student Name</th>
            <th className="border border-gray-300 px-4 py-2">Course</th>
            <th className="border border-gray-300 px-4 py-2">Total Fee</th>
            <th className="border border-gray-300 px-4 py-2">Paid Amount</th>
            <th className="border border-gray-300 px-4 py-2">Due Amount</th>
            <th className="border border-gray-300 px-4 py-2">Last Payment Date</th>
            <th className="border border-gray-300 px-4 py-2">Receipt</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>


          {students.map((student) => {
            const course = courses.find((c) => c.id === student.id);
            // const lastDate = course?.duration || 0;
            const totalAmount = course?.fees || 0;
            const paidAmount= student.paidAmount || 0;
            const due = totalAmount - paidAmount;

            return (
                <tr key={student.id}>
                <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                <td className="border border-gray-300 px-4 py-2">{student.course}</td>
                <td className="border border-gray-300 px-4 py-2">₹{totalAmount}</td>
                <td className="border border-gray-300 px-4 py-2">₹{paidAmount}</td>
                <td className="border border-gray-300 px-4 py-2">₹{due}</td>
                <td className="border border-gray-300 px-4 py-2">{student.lastdate} date</td>

                <td className="border border-gray-300 px-4 py-2 text-blue-600 underline">
                  {student.receiptUrl ? (
                    <a href={student.receiptUrl} target="_blank" rel="noreferrer">
                      📎 View
                    </a>
                  ) : (
                    "📎 Upload"
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button className="px-2 py-1 bg-yellow-500 text-white rounded">
                    Edit
                  </button>
                  <button className="px-2 py-1 bg-green-500 text-white rounded">
                    Add Payment
                  </button>
                </td>
              </tr>
            )
          })}

          {paymentStudents.map((student) => {
            const due = student.totalAmount - student.amountPaid;


            return (
              <tr key={student.id}>
                <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                <td className="border border-gray-300 px-4 py-2">{student.course}</td>
                <td className="border border-gray-300 px-4 py-2">₹{student.totalAmount}</td>
                <td className="border border-gray-300 px-4 py-2">₹{student.amountPaid}</td>
                <td className="border border-gray-300 px-4 py-2">₹{due}</td>
                <td className="border border-gray-300 px-4 py-2">{student.lastPayment}</td>

                <td className="border border-gray-300 px-4 py-2 text-blue-600 underline">
                  {student.receiptUrl ? (
                    <a href={student.receiptUrl} target="_blank" rel="noreferrer">
                      📎 View
                    </a>
                  ) : (
                    "📎 Upload"
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button className="px-2 py-1 bg-yellow-500 text-white rounded">
                    Edit
                  </button>
                  <button className="px-2 py-1 bg-green-500 text-white rounded">
                    Add Payment
                  </button>
                </td>
              </tr>
            );
          })}



        </tbody>
      </table>



    </div>
  );
};

export default Payment;
