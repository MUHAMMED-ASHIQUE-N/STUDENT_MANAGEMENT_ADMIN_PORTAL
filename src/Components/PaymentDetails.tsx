import { useEffect, useRef, useState } from 'react'
import { db } from '../firebase/config'
import type { Coursetype, StudentDetails } from '../type/auth'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { subscribeStudents, subscribeCourses, subscribePayments, addPayment, calculateTotals } from '../utils/paymentUtils'
import { getNextDueCheckpoint } from '../utils/paymentUtils'
import { generateAndUploadReceipt } from '../utils/generateAndUploadReceipt '
import ReceiptTemplate from './ReceiptTemplate'
import CertificateTemplate from './CertificateTemplate'
import ProgressTracker from './ProgressTracker'

function PaymentDetails() {
    const { id } = useParams()

    const [students, setStudents] = useState<StudentDetails[]>([])
    const [courses, setCourses] = useState<Coursetype[]>([])
    const [payments, setPayments] = useState<any[]>([])
    const [showForm, setShowForm] = useState(false);
    const [receiptUrl, setReceiptUrl] = useState<string | null>("");
    const [selectedPayment, setSelectedPayment] = useState(null);

    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [certificateStudent, setCertificateStudent] = useState<StudentDetails | null>(null);
    const [certificateCourse, setCertificateCourse] = useState<Coursetype | null>(null);
    const [certificateIssued, setCertificateIssued] = useState(false);
    // Progress tracking states
    const [isGenerating, setIsGenerating] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleGenerateReceipt = async (payment: any) => {
        if (!payment) {
            alert("No payment found for this checkpoint!");
            return;
        }

        setSelectedPayment(payment);
        setIsGenerating(true);
        setUploadProgress(0);

        // Wait for DOM to render the receipt
        setTimeout(async () => {
            try {
                await generateAndUploadReceipt(payment, (progress) => {
                    setUploadProgress(progress);
                });
                alert("✅ Receipt generated successfully!");
            } catch (error) {
                console.error("Receipt generation failed:", error);
            } finally {
                setIsGenerating(false);
                setSelectedPayment(null);
                setUploadProgress(0);
            }
        }, 100);
    };



    const formRef = useRef<HTMLDivElement>(null);

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

    const handleFormOpen = () => {
        setShowForm(true)
        formRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const handleIssuCertificate = () => {
        if (!currentId || !course) {
            alert("No student or course found!");
            return;
        }
        setCertificateStudent(currentId);
        setCertificateCourse(course);
        setShowCertificateModal(true);
    };


    return (
        <div className=''>
            <ProgressTracker isGenerating={isGenerating} uploadProgress={uploadProgress} />
            <h1 className='md:text-center text-xl font-bold'> Payment History  </h1>
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
                    <thead className="bg-blue-50">
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
                                <tr key={index} className='text-center nth-[even]:bg-blue-50  text-gray-700'>
                                    <td className={`border border-gray-300 px-4 py-2 ${paid ? "font-medium" : "text-gray-400 font-normal"}`}>
                                        {paid ? format(paid.date.toDate(), "dd MMM yyyy")
                                            : checkpoint.dueDate && typeof checkpoint.dueDate.toDate === "function"
                                                ? format(checkpoint.dueDate.toDate(), "dd MMM yyyy")
                                                : "-"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{checkpoint.title || "unknow"} </td>
                                    <td className="border border-gray-300 px-4 py-2">₹{checkpoint.amount}</td>
                                    <td className="border border-gray-300 px-2 py-2">
                                        <span className={`px-4 py-1 rounded text-xs font-semibold ${paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {paid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-blue-600 underline">

                                        {paid?.receiptUrl ? (
                                            <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
                                                <a href={paid.receiptUrl} target="_blank" rel="noopener noreferrer">
                                                    View
                                                </a>
                                                <a
                                                    href={paid.receiptUrl}
                                                    download={`receipt_${currentId?.name}_${checkpoint.title}.pdf`}
                                                    className="text-blue-500 underline"
                                                >
                                                    Download
                                                </a>
                                            </div>

                                        ) :
                                            (
                                                <button
                                                    onClick={() => handleGenerateReceipt(paid)}
                                                    disabled={isGenerating}>

                                                    {isGenerating ? "Generating..." : "Generate Receipt"}
                                                </button>
                                            )}
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
                        onClick={() => handleFormOpen()}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 cursor-pointer">Add New Payment</button>
                    {showForm && (
                        <div
                            ref={formRef}
                            className="mt-4 p-4 border rounded bg-blue-50">
                            <h2 className="font-bold mb-2">Add New Payment</h2>
                            <h2 className="font-bold">Next Payment: {nextDue.title} - ₹{nextDue.amount}</h2>
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
                <div>
                    {!nextDue && !certificateIssued ? (
                        <button
                            onClick={handleIssuCertificate}
                            className="bg-green-600 text-white rounded-md m-4 p-2"
                        >
                            🎉 Issue Certificate
                        </button>
                    ) : !nextDue && certificateIssued ? (
                        <button
                            disabled
                            className="bg-gray-400 text-white rounded-md m-4 p-2 cursor-not-allowed"
                        >
                            Certificate Already Issued
                        </button>
                    ) : null}
                </div>

                // <button
                // onClick={ handleIssuCertificate}
                //  className="bg-green-600 text-white rounded-md m-4 p-2">issue certificate </button>

            )}

            {showCertificateModal && certificateStudent && certificateCourse && (
                <div className="mt-">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                            onClick={() => setShowCertificateModal(false)}
                        >
                            &times;
                        </button>
                        <CertificateTemplate
                            student={certificateStudent}
                            course={certificateCourse.title}
                            onUploaded={() => {
                                setShowCertificateModal(false);
                                setCertificateIssued(true);
                            }}
                        />
                    </div>
                </div>
            )}
            {selectedPayment && (
                <div style={{ position: "absolute", left: "-9999px", top: 0, zIndex: -1 }}>
                    <ReceiptTemplate student={currentId} payment={selectedPayment} course={course} />
                </div>
            )}
        </div>
    )
}

export default PaymentDetails


