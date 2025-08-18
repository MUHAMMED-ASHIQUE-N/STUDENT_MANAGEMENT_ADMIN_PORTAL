import React, { useEffect, useState } from 'react'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Coursetype, StudentDetails } from '../type/auth'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'

function PaymentDetails() {
    const { id } = useParams()

    const [students, setStudents] = useState<StudentDetails[]>([])
    const [courses, setCourses] = useState<Coursetype[]>([])
    const [payments, setPayments] = useState<any[]>([])
    const [showForm, setShowForm] = useState(false);
    const [amount, setAmount] = useState(0);
    const [checkpoint, setCheckpoint] = useState("");
    const [receipturl, setReceipturl] = useState("");

    const currentId = students.find((s) => s.id === id)
    const course = courses.find((c) => c.id === currentId?.courseId)
    const expected = parseInt((course?.fees || 0)) / (course?.duration || 0)
    const totalFess = (parseInt(course?.fees)) + (parseInt(course?.admissionfee) || 0)
    const coursePaidAmount = payments.reduce((sum, p) => sum + p.amount, 0)
    const totalypaidAmount = coursePaidAmount + currentId?.paidAmount
    const balanceAmount = totalFess - totalypaidAmount


    useEffect(() => {
        const unsubStudents = onSnapshot(collection(db, "userDetails"), (snapshot) => {
            const student = snapshot.docs.map(doc => ({
                id: doc.id, ...(doc.data() as Omit<StudentDetails, "id">)
            }))
            setStudents(student)
        });

        const unsubCourses = onSnapshot(collection(db, "courses"), (snapshot) => {
            const course = snapshot.docs.map(doc => ({
                id: doc.id, ...(doc.data() as Omit<Coursetype, "id">)
            }))
            setCourses(course)
        });


        if (id) {
            const unsubPayments = onSnapshot(collection(db, `userDetails/${id}/payment`), (snapshot) => {
                const pay = snapshot.docs.map(doc => ({
                    id: doc.id, ...(doc.data())
                }))
                setPayments(pay)
            })
            return () => {
                unsubStudents(), unsubCourses(), unsubPayments()
            }
        }
        return () => {
            unsubStudents();
            unsubCourses();
        }
    }, [id]);


    const handleAddPayment = async () => {
        if (!id && amount <= 0) return null;

        await addDoc(collection(db, `userDetails/${id}/payment`), {
            date: new Date(),
            checkpoint,
            amount,
            receipturl: ""
        })
        setAmount(0)
        setCheckpoint("")
        setShowForm(false)

    }

    return (
        <div >

            <h1 className='text-center text-xl font-bold'>All payment Details  </h1>
            <div className=''>
                <h1>Student Name: {currentId?.name} </h1>
                <p>Course:{course?.courseName} </p>
                <p>Course fee:{course?.fees} </p>
                <p>Admission fee:{course?.admissionfee} </p>
                <p>total fee:{totalFess} </p>
                <p>totaly paid Amount : {totalypaidAmount} </p>
                <p>Balance Amount : {balanceAmount} </p>
            </div>
            <div className='w-'>
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Date</th>
                            <th className="border border-gray-300 px-4 py-2">checkpoint</th>
                            <th className="border border-gray-300 px-4 py-2">expected</th>
                            <th className="border border-gray-300 px-4 py-2">Paid</th>
                            <th className="border border-gray-300 px-4 py-2">Due</th>
                            <th className="border border-gray-300 px-4 py-2">Receipt</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">{currentId?.createdAt && format(currentId?.createdAt.toDate(), "dd MMM yyyy")} date</td>
                            <td className="border border-gray-300 px-4 py-2">{ } Admission fee</td>
                            <td className="border border-gray-300 px-4 py-2">₹{course?.admissionfee}</td>
                            <td className="border border-gray-300 px-4 py-2">₹{currentId?.paidAmount}</td>
                            <td className="border border-gray-300 px-4 py-2">₹{parseInt(course?.admissionfee) - currentId?.paidAmount}</td>
                            <td className="border border-gray-300 px-4 py-2 text-blue-600 underline">
                                <a href={''} target="_blank" rel="noopener noreferrer">
                                    View
                                </a>
                            </td>
                        </tr>
                        {payments.map((p) => (
                                <tr key={p.id} >
                                    <td className="border border-gray-300 px-4 py-2">{format(p.date.toDate(), "dd MMM yyyy")} </td>
                                    <td className="border border-gray-300 px-4 py-2">{p.checkpoint || "unknow"} </td>
                                    <td className="border border-gray-300 px-4 py-2">₹{expected}</td>
                                    <td className="border border-gray-300 px-4 py-2">₹{p.amount}</td>
                                    <td className="border border-gray-300 px-4 py-2">₹{expected - p.amount}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-blue-600 underline">
                                        {p.receiptUrl ? (
                                            <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer">
                                                View
                                            </a>
                                        ) : (<p>upload</p>)}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                {balanceAmount === 0 ? (
                    <p className='text-green-500 text-xl'>transaction compleated </p>
                ) : (
                    <button
                        onClick={() => setShowForm(true)}
                        className='text-blue-500 mt-2'>
                        New Payment</button>
                )}

            </div>

            {showForm && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                    <h2 className="font-bold mb-2">Add New Payment</h2>
                    <input
                        type="text"
                        placeholder="Enter a checkpoint"
                        value={checkpoint}
                        onChange={(e) => setCheckpoint(e.target.value)}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="file"
                        placeholder="upload Receipt"
                        value={receipturl}
                        onChange={(e) => setReceipturl(e.target.value)}
                        className="border p-2 w-full mb-2"
                    />
                    <button
                        onClick={handleAddPayment}
                        className="bg-blue-500 text-white px-4 py-2 rounded">
                        Save
                    </button>
                    <button
                        onClick={() => setShowForm(false)}
                        className="ml-2 text-gray-600">
                        Cancel
                    </button>
                </div>
            )}

        </div>
    )
}

export default PaymentDetails

