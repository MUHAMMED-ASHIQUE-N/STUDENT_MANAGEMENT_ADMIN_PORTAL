import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { addDoc, collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import type { StudentDetails } from "../type/auth";


export const createStudent = async (name: string, email: string, password: string, courseId: string, admissionFee: number, advanceFee: number = 0, checkpointNO: number) => {

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "userDetails", uid), {
        name,
        email,
        courseId,
        createdAt: new Date(),
        role: "student",
        checkpointNO,
    });


    if (admissionFee > 0) {
        await addDoc(collection(db, "payments"), {
            studentId: uid,
            courseId,
            amount: admissionFee,
            checkpoint: "Admission Fee",
            date: new Date(),
            receiptUrl: ""
        })
    }

    if (advanceFee > 0) {
        await addDoc(collection(db, "payments"), {
            studentId: uid,
            courseId,
            amount: advanceFee,
            checkpoint: "Advance Fee",
            date: new Date(),
            receiptUrl: ""
        })
    }
}


export const subscribeStudents = (callback: (students: StudentDetails[]) => void) => {
    const studentsCollection = collection(db, "userDetails");
    const unsubscribe = onSnapshot(studentsCollection, (snapshot) => {
        const students: StudentDetails[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<StudentDetails, "id">)
        }));

        callback(students)
    });

    return unsubscribe;
}



export const updatedStudent = async (id: string, name: string, email: string, courseId: string, admissionFee: number, advanceFee: number) => {

    const studentRef = doc(db, "userDetails", id);
    await updateDoc(studentRef, { name, email, courseId, admissionFee, advanceFee });

}



export const deleteStudent = async (id: string) => {
    await deleteDoc(doc(db, "userDetails", id))

}
