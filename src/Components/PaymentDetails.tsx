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
import { AlertCircle, Award, CheckCircle2, Clock, Download, Eye, FileText, TrendingUp } from 'lucide-react'
import { collection, onSnapshot } from 'firebase/firestore'

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
    const [isGenerating, setIsGenerating] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [certificates, setCertificates] = useState<any[]>([]);

    const handleGenerateReceipt = async (payment: any) => {
        if (!payment) {
            alert("No payment found for this checkpoint!");
            return;
        }

        setSelectedPayment(payment);
        setIsGenerating(true);
        setUploadProgress(0);
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
        if (!id || !course || !nextDue) return alert("No Checkpoint Due!")
        await addPayment(db, currentId!, receiptUrl)
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

    const paidPercentage = totalFee > 0 ? (paidAmount / totalFee) * 100 : 0;

    useEffect(() => {
        const unsubCertificates = onSnapshot(
            collection(db, "certificates"),
            (snapshot) => {
                setCertificates(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            }
        );
        return () => unsubCertificates();
    }, []);

    const certificateIssued = certificates.some(
        cert =>
            cert.studentId === currentId?.id &&
            cert.courseName?.toLowerCase() === course?.title?.toLowerCase()
    );

    formRef.current?.scrollIntoView({ behavior: "smooth" });
    return (
        <div className=''>
            <ProgressTracker isGenerating={isGenerating} uploadProgress={uploadProgress} />
            <h1 className='md:text-center text-xl font-bold py-4'> Payment History  </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                        <p className="text-slate-600 text-sm font-medium">Student</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{currentId?.name}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                        <p className="text-slate-600 text-sm font-medium">Course</p>
                    </div>
                    <p className="text-xl font-bold text-slate-900 truncate">{course?.title}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <p className="text-slate-600 text-sm font-medium">Paid Amount</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">₹{paidAmount.toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-amber-600" />
                        <p className="text-slate-600 text-sm font-medium">Due Amount</p>
                    </div>
                    <p className="text-2xl font-bold text-amber-600">₹{dueAmount.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Fee Breakdown
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                            <span className="text-slate-700">Course Fee</span>
                            <span className="font-semibold text-slate-900">₹{course?.fees.courseFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                            <span className="text-slate-700">Admission Fee</span>
                            <span className="font-semibold text-slate-900">₹{course?.fees.admissionFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 bg-blue-50 px-4 py-3 rounded-lg">
                            <span className="font-semibold text-slate-900">Total Fee</span>
                            <span className="text-xl font-bold text-blue-600">₹{totalFee.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Payment Progress</h2>
                    <div className="space-y-4">
                        <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                                style={{ width: `${paidPercentage}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Completed</span>
                            <span className="font-semibold text-slate-900">{Math.round(paidPercentage)}%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-3">
                            <div className="bg-green-50 p-3 rounded-lg">
                                <p className="text-xs text-slate-600 mb-1">Paid</p>
                                <p className="text-lg font-bold text-green-600">₹{paidAmount.toLocaleString()}</p>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-lg">
                                <p className="text-xs text-slate-600 mb-1">Remaining</p>
                                <p className="text-lg font-bold text-amber-600">₹{dueAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-sm p-6 text-white">
                    <h2 className="text-lg font-semibold mb-6">Summary</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between pb-3 border-b border-slate-700">
                            <span className="text-slate-300">Checkpoints Completed</span>
                            <span className="font-semibold">{payments.length} / {currentId?.checkpoints.length}</span>
                        </div>
                        <div className="flex justify-between pt-3">
                            <span className="text-slate-300">Status</span>
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Payment History
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Checkpoint</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentId?.checkpoints.map((checkpoint, index) => {
                                const paid = payments.find(
                                    p => p.checkpointDueOrder === checkpoint.dueOrder
                                );

                                return (
                                    <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={paid ? 'text-slate-900 font-medium' : 'text-slate-500'}>
                                                {paid ? format(paid.date.toDate(), 'dd-MM-yyyy') : (checkpoint.dueDate ? format(checkpoint.dueDate?.toDate(), 'dd-MM-yyyy') : "No DueDate")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-900 font-medium">{checkpoint.title}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-900 font-semibold">₹{checkpoint.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {paid ? (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                                    <Clock className="w-4 h-4" />
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {paid?.receiptUrl ? (
                                                <div className="flex items-center gap-3">
                                                    <a
                                                        href={paid.receiptUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </a>
                                                    <a
                                                        href={paid.receiptUrl}
                                                        download={`receipt_${currentId?.name}_${checkpoint.title}.pdf`}
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download
                                                    </a>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleGenerateReceipt(paid)}
                                                    disabled={isGenerating}
                                                    className="inline-flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    {isGenerating ? 'Generating...' : 'Generate'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                {dueAmount > 0 &&
                    <button
                        onClick={handleFormOpen}

                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <Clock className="w-5 h-5" />
                        Add Payment
                    </button>
                }{!nextDue && !certificateIssued &&
                    <button
                        onClick={handleIssuCertificate}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <Award className="w-5 h-5" />
                        Issue Certificate
                    </button>
                } {!nextDue && certificateIssued &&
                    <button
                        onClick={handleIssuCertificate}
                        className="flex-1 px-6 py-3 rounded-lg  transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-slate-500 text-white cursor-not-allowed opacity-80 hover:from-gray-600 hover:to-slate-500"
                    >
                        <Award className="w-5 h-5" />
                        Certificate Already Issued
                    </button>
                }
            </div>

            {nextDue && !payments.find(p => p.checkpointDueOrder === nextDue.dueOrder && p.status === "pending" && showForm == true) && (
                <div>
                    {showForm && (
                        <div
                            ref={formRef}
                            className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-blue-600" />
                                    Add Payment
                                </h2>
                                <div
                                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <p className="text-slate-700 mb-2">
                                        <span className="font-semibold">Next Payment Due:</span> {nextDue.title}
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600">₹{nextDue.amount} </p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddPayment}
                                        className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                    >
                                        Mark as Paid
                                    </button>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 bg-slate-200 text-slate-700 px-4 py-3 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {showCertificateModal && certificateStudent && certificateCourse && (
                <div ref={formRef} className="mt-8">
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













