import { addDoc, collection, Firestore, onSnapshot, orderBy, query, where } from "firebase/firestore";
import type { Coursetype, StudentDetails } from "../type/auth";



export const subscribeStudents = (db: Firestore, callback: (students: StudentDetails[]) => void) => {
    return onSnapshot(collection(db, "userDetails"), (snapshot) => {
        const student = snapshot.docs.map(doc => ({
            id: doc.id, ...(doc.data() as Omit<StudentDetails, "id">)
        }))
        callback(student)
    });
}


export const subscribeCourses = (db: Firestore, callback: (courses: Coursetype[]) => void) => {
    return onSnapshot(collection(db, "courses"), (snapshot) => {
        const courses = snapshot.docs.map(doc => ({
            id: doc.id, ...(doc.data() as Omit<Coursetype, "id">)
        }))
        callback(courses)
    });
}


export const subscribePayments = (db: Firestore, studentId: string, callback: (payments: any[]) => void) => {
    return onSnapshot(
        query(collection(db, "payments"), where("studentId", "==", studentId), orderBy("date", "asc")), (snapshot) => {
            const payments = snapshot.docs.map(doc => ({
                id: doc.id, ...(doc.data() as Omit<Coursetype, "id">)
            }))
            callback(payments)
        });
}


export const addPayment = async (db: Firestore, studentId: string, courseId: string | undefined, amount: number, checkpoint: string) => {
    await addDoc(collection(db, "payments"), {
        studentId,
        courseId,
        amount,
        checkpoint,
        date: new Date(),
        receiptUrl: "",
    });
};



export const calculateTotals = (student: StudentDetails, course?: Coursetype, payments: any[] = []) => {

    const totalFee = (Number(course?.fees) || 0) + (Number(course?.admissionfee) || 0);
    const paidAmount = payments.filter((p) => p.studentId === student.id).reduce((sum, p) => sum + Number(p.amount || 0), 0)
    const dueAmount = totalFee - paidAmount;
    const expectedPerMonth = course?.fees && course?.duration ? course.fees / (student.checkpointNO || course.duration) : 0


    return { totalFee, paidAmount, dueAmount, expectedPerMonth, };
};


