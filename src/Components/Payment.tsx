
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import type { Coursetype, StudentDetails } from "../type/auth";
import { Link, Outlet, useLocation } from "react-router-dom";

const Payment = () => {


  const [students, setStudents] = useState<StudentDetails[]>([]);
  const [courses, setCourse] = useState<Coursetype[]>([]);
  const [payments, setPayments] = useState<any[]>([])

  const location = useLocation();



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

    students.map((student) => {
      const unsubPayments = onSnapshot(collection(db, `userDetails/${student.id}/payment`), (snapshot) => {
        setPayments((prev) => ({
          ...prev,
          [student.id]: snapshot.docs.map(doc => ({
            id: doc.id, ...(doc.data())
          }))
        }))
        unsubPayments()

        // const pay = snapshot.docs.map(doc => ({
        //   id: doc.id, ...(doc.data())
        // }))

        // setPayments(pay)
        // setPayments((prev) => ({
        //       ...prev,
        //       [student.id]: snapshot.docs.map((d) => ({
        //         id: d.id,
        //         ...(d.data()),
        //       })),
        //     }));

      })
    })






    return () => {
      unsubStudents()
      unsubCourses()

    }
  }, [])



  return (
    <div className="p-6 bg-white shadow rounded-lg">
      {location.pathname.endsWith("/payment") ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Payment </h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
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
                const totalAmount = Number(course?.fees || 0) + Number(course?.admissionfee || 0);
                const coursePaidAmount = payments.reduce((sum, p) => sum + p.amount, 0)
                console.log(coursePaidAmount, 'coure total paid amount');
                // console.log(payments.map((p) => ),'payment object');
                console.log(
                  payments.map((p) => (
                  <p>{p.amount} </p>
                ))
                );
                
                
                
                const paidAmounttotal = coursePaidAmount + student.paidAmount
                console.log(paidAmounttotal, "total paid amount");

                const paidAmount = student.paidAmount || 0;
                const due = (totalAmount - paidAmount);
                const status = due === 0 ? "Paid" : "Partially Paid";
                return (
                  <tr key={student.id}>
                    <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{course?.courseName || 'unknow course'}</td>
                    <td className="border border-gray-300 px-4 py-2">₹{totalAmount}</td>
                    <td className="border border-gray-300 px-4 py-2">₹{paidAmounttotal} </td>
                    <td className="border border-gray-300 px-4 py-2">₹{due}</td>
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
      ) : (<Outlet />)}


    </div>
  );
};

export default Payment;
