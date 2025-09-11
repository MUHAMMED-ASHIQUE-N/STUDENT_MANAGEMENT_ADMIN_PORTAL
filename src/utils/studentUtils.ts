import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { addDoc, collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import type { StudentDetails } from "../type/auth";
import { generateCheckpoints } from "./generateCheckpoints ";


export const createStudent = async (
  name: string,
  email: string,
  password: string,
  courseId: string,
  admissionFee: number,
  checkpoints: { title: string; amount: number, dueOrder: number }[],
  planType: string,
  totalFee: number,
  duration: number,
) => {

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  // let checkpoints = planType === "custom" ? [...selectedCheckpoints] :  generateCheckpoints(totalFee, admissionFee, advanceFee, duration )
  let checkpoint = generateCheckpoints(
    totalFee,
    admissionFee,
    duration,
    checkpoints,
    // planType === "custom" ? checkpoints : []
  );

  
  await setDoc(doc(db, "userDetails", uid), {
    name,
    email,
    courseId,
    admissionFee,
    createdAt: new Date(),
    checkpointPlan: planType,
    checkpoints: checkpoint,  
    role: "student",
  });

  for (const cp of checkpoint) {
    if (cp.title.toLocaleLowerCase() === "admission fee") {
      await addDoc(collection(db, "payments"), {
        studentId: uid,
        courseId,
        amount: cp.amount,
        title: cp.title,
        checkpointDueOrder: cp.dueOrder,
        date: new Date(),
        receiptUrl: "",
        status: "paid", 
      });
    }
  }
};


export const subscribeStudents = (callback: (students: StudentDetails[]) => void) => {
  const studentsCollection = collection(db, "userDetails");
  const unsubscribe = onSnapshot(studentsCollection, (snapshot) => {
    const students: StudentDetails[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<StudentDetails, "id">)
    }));

    callback(students);
  });

  return unsubscribe;
};


export const updateStudent = async (
  id: string,
  name: string,
  email: string,
  courseId: string,
  admissionFee: number,
  checkpoint: { title: string; amount: number, dueOrder: number }[],
  planType: string
) => {
  const studentRef = doc(db, "userDetails", id);
  await updateDoc(studentRef, {
    name,
    email,
    courseId,
    admissionFee,
    checkpointPlan: planType,
    selectedCheckpoints: checkpoint
  });
};


export const deleteStudent = async (id: string, name: string, email: string, courseId: string) => {
  await setDoc(doc(db, "previous", id), {
    name,
    email,
    courseId,
    status: "uncompleted",
    movedAt: new Date(),
  });

  await deleteDoc(doc(db, "userDetails", id));
};










