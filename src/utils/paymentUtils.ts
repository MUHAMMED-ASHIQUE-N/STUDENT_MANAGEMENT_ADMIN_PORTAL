import type { StudentDetails } from "../type/auth";

export function calculatePaymentSummary (student:StudentDetails , payment: { amount: number}[]) {

const courseFee = student.course?.fees || 0;
const admissionFee = student.course?.admissionfee || 0;
const totalAmount = courseFee + admissionFee;

const totalPaidFromPayments = (student.payment || []).reduce(
    (sum, p) => sum + p.amount, 0)

    const totalPaid = student.paidAmount + totalPaidFromPayments;
    const balance = totalAmount - totalPaid;

    return {
        totalAmount,
        totalPaid,
        balance,
    }

}
