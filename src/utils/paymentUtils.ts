import { addDoc, collection, doc, Firestore, getDocs, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import type { Coursetype, Payment, StudentDetails } from "../type/auth";


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





// export function getNextDueCheckpoint(student: StudentDetails, payments: any[]) {
//   const occupiedOrders = new Set(
//     payments.map((p) => Number(p.checkpointDueOrder)) // paid or pending
//   );

//   return [...(student.selectedCheckpoints || [])]
//     .sort((a, b) => a.dueOrder - b.dueOrder)
//     .find((cp) => !occupiedOrders.has(cp.dueOrder)); // first unpaid
// }



export function getNextDueCheckpoint(student: StudentDetails, payments: any[]) {
  if (!student.checkpoints) return null;

  for (let cp of student.checkpoints) {
    const paid = payments.find(
      (p) => p.checkpointDueOrder === cp.dueOrder && p.status === "paid"
    );
    if (!paid) {
      return cp; // return the first unpaid checkpoint
    }
  }
  return null; // all paid
}




export const addPayment = async (db: Firestore, student: StudentDetails, receiptUrl:string | null ) => {

  const paymentsSnap = await getDocs(
    query(collection(db, "payments"), where("studentId", "==", student.id))
  );

  const payments = paymentsSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Payment[])
  }));

  const next = getNextDueCheckpoint(student, payments);
  if (!next) throw new Error("All checkpoints already paid.");

  await addDoc(collection(db, "payments"), {
    studentId: student.id,
    courseId: student.courseId,
    checkpointDueOrder: next.dueOrder,
    title: next.title,
    amount: next.amount,
    date: new Date(),
    receiptUrl:"url",
    status: "paid",
  });
};



export const markPaymentAsPaid = async (db: Firestore, paymentId: string, receiptUrl: string | null) => {
  const paymentRef = doc(db, "payments", paymentId);
  await updateDoc(paymentRef, {
    status: "paid",
    receiptUrl,
    date: new Date(),
  });
};


// ✅ Calculate totals (from student's checkpoints)
export const calculateTotals = (student: StudentDetails, payments: any[] = []) => {

  
  const totalFee = student.checkpoints?.reduce((sum, cp) => sum + cp.amount, 0) || 0; 
  // const totalFee = totalcheckepoints - (student.cautionDeposit || 0 ); 
  const paidAmount = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const dueAmount = totalFee - paidAmount;

  return { totalFee, paidAmount, dueAmount };
};
















