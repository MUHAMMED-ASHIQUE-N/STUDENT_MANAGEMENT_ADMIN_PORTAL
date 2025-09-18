import { useEffect, useState } from 'react'
import { db } from '../firebase/config'
import type { Coursetype, StudentDetails } from '../type/auth'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { subscribeStudents, subscribeCourses, subscribePayments, addPayment, calculateTotals } from '../utils/paymentUtils'
import { getNextDueCheckpoint } from '../utils/paymentUtils'

function PaymentDetails() {
    const { id } = useParams()

    const [students, setStudents] = useState<StudentDetails[]>([])
    const [courses, setCourses] = useState<Coursetype[]>([])
    const [payments, setPayments] = useState<any[]>([])
    const [showForm, setShowForm] = useState(false);
    const [amount, setAmount] = useState(0);
    const [checkpoint, setCheckpoint] = useState("");
    const [receiptUrl, setReceiptUrl] = useState<string | null>("");


    const currentId = students.find((s) => s.id === id)
    const course = courses.find((c) => c.id === currentId?.courseId)

    const { totalFee, paidAmount, dueAmount } = currentId ? calculateTotals(currentId!, payments) : { totalFee: 0, paidAmount: 0, dueAmount: 0 };

    useEffect(() => {
        const unsubStudents = subscribeStudents(db, setStudents);
        const unsubCourses = subscribeCourses(db, setCourses);
        let unsubPayments: (() => void) | undefined

        if (id) {
            unsubPayments = subscribePayments(db, id, setPayments)
        }

        return () => {
            unsubStudents();
            unsubCourses();
            unsubPayments && unsubPayments();
        }
    }, [id])


    const nextDue = currentId ? getNextDueCheckpoint(currentId, payments) : null;
    const handleAddPayment = async () => {
        if (!id || !course || !nextDue) return alert("No Checkpoint Due!")   //    return null;
        await addPayment(db, currentId!, receiptUrl)

        // setAmount(0)
        // setCheckpoint("")
        setShowForm(false)

    }

    return (
        <div className=''>
            <h1 className='text-center text-xl font-bold'> Payment History  </h1>
            <div className=''>
                <h2 className="text-lg font-semibold border-b pb-1">Student Info :</h2>
                <p><strong>Name:</strong> {currentId?.name}</p>
                <p><strong>Course:</strong> {course?.title}</p>
                <p><strong>Course Fee:</strong> ₹{course?.fees.courseFee}</p>
                <p><strong>Admission Fee:</strong> ₹{course?.fees.admissionFee}</p>
                <p><strong>Total Fee:</strong> ₹{totalFee}</p>
                <p><strong>Paid Amount:</strong> ₹{paidAmount}</p>
                <p><strong>Due Amount:</strong> ₹{dueAmount}</p>
            </div>
            <div className='overflow-auto mt-4'>
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Date</th>
                            <th className="border border-gray-300 px-4 py-2">checkpoint</th>
                            <th className="border border-gray-300 px-4 py-2">Amount</th>
                            <th className="border border-gray-300 px-4 py-2">status</th>
                            <th className="border border-gray-300 px-4 py-2">Receipt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentId?.checkpoints.map((checkpoint, index) => {
                            const paid = payments.find(
                                (p) => (p.checkpointType === (checkpoint.title || "Admission Fee")) || p.checkpointDueOrder === checkpoint.dueOrder
                            );
                            return (
                                <tr key={index} >
                                    <td className="border border-gray-300 px-4 py-2">
                                        {paid ? format(paid.date.toDate(), "dd MMM yyyy") : "-"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{checkpoint.title || "unknow"} </td>
                                    <td className="border border-gray-300 px-4 py-2">₹{checkpoint.amount}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {paid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-blue-600 underline">

                                        {/* {paid.receiptUrl? (
                                            
                                            <a href={paid.receiptUrl} target="_blank" rel="noopener noreferrer">
                                                View
                                            </a>
                                        ) :
                                         (<p>upload</p>)} */}

                                        upload
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

          
            {nextDue && !payments.find(p => p.checkpointDueOrder === nextDue.dueOrder && p.status === "pending" && showForm == true) ? (
                <div>
                      <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 cursor-pointer">Add New Payment</button>
                    {showForm && (
                        <div className="mt-4 p-4 border rounded bg-gray-100">
                            <h2 className="font-bold mb-2">Add New Payment</h2>
                            <h2 className="font-bold">Next Payment: {nextDue.title} - ₹{nextDue.amount}</h2>

                            <input
                                type="file"
                                placeholder="upload Receipt"
                                accept="image/*,.pdf"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setReceiptUrl(e.target.files[0].name); // just store file name for now
                                    } else {
                                        setReceiptUrl(null);
                                    }
                                }}
                                className="border p-2 w-full mb-2"
                            />
                            <button
                                onClick={handleAddPayment}
                                className="bg-blue-500 text-white px-4 py-2 rounded">
                                mark paid
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="ml-2 text-gray-600">
                                Cancel
                            </button>
                        </div>
                    )}

                </div>
            ) : (
                <p className="text-green-600 mt-4">All checkpoints completed 🎉</p>

            )}
        </div>



    )
}

export default PaymentDetails

