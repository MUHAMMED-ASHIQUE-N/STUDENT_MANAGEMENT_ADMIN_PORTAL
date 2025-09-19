// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "../firebase/config";
// import { addDoc, collection, deleteDoc, doc, onSnapshot, runTransaction, setDoc, updateDoc } from "firebase/firestore";
// import type { StudentDetails } from "../type/auth";
// import { generateCheckpoints } from "./generateCheckpoints ";


// export const createStudent = async (
//   name: string,
//   email: string,
//   password: string,
//   courseId: string,
//   admissionFee: number,
//   checkpoints: { title: string; amount: number, dueOrder: number }[],
//   planType: string,
//   totalFee: number,
//   duration: number,
// ) => {

//   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//   const uid = userCredential.user.uid;

//   // let checkpoints = planType === "custom" ? [...selectedCheckpoints] :  generateCheckpoints(totalFee, admissionFee, advanceFee, duration )
//   let checkpoint = generateCheckpoints(
//     totalFee,
//     admissionFee,
//     duration,
//     checkpoints,
//     // planType === "custom" ? checkpoints : []
//   );


//   await setDoc(doc(db, "userDetails", uid), {
//     name,
//     email,
//     courseId,
//     admissionFee,
//     createdAt: new Date(),
//     checkpointPlan: planType,
//     checkpoints: checkpoint,  
//     role: "student",
//   });

//   for (const cp of checkpoint) {
//     if (cp.title.toLocaleLowerCase() === "admission fee") {
//       await addDoc(collection(db, "payments"), {
//         studentId: uid,
//         courseId,
//         amount: cp.amount,
//         title: cp.title,
//         checkpointDueOrder: cp.dueOrder,
//         date: new Date(),
//         receiptUrl: "",
//         status: "paid", 
//       });
//     }
//   }

// };


// export const subscribeStudents = (callback: (students: StudentDetails[]) => void) => {
//   const studentsCollection = collection(db, "userDetails");
//   const unsubscribe = onSnapshot(studentsCollection, (snapshot) => {
//     const students: StudentDetails[] = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...(doc.data() as Omit<StudentDetails, "id">)
//     }));

//     callback(students);
//   });

//   return unsubscribe;
// };


// export const updateStudent = async (
//   id: string,
//   name: string,
//   email: string,
//   courseId: string,
//   admissionFee: number,
//   checkpoint: { title: string; amount: number, dueOrder: number }[],
//   planType: string
// ) => {
//   const studentRef = doc(db, "userDetails", id);
//   await updateDoc(studentRef, {
//     name,
//     email,
//     courseId,
//     admissionFee,
//     checkpointPlan: planType,
//     selectedCheckpoints: checkpoint
//   });
// };


// export const deleteStudent = async (id: string, name: string, email: string, courseId: string) => {
//   await setDoc(doc(db, "previous", id), {
//     name,
//     email,
//     courseId,
//     status: "uncompleted",
//     movedAt: new Date(),
//   });

//   await deleteDoc(doc(db, "userDetails", id));
// };



import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  increment,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import type { StudentDetails } from "../type/auth";
import { generateCheckpoints } from "./generateCheckpoints ";
import { addPendingPayment } from "./paymentUtils";

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

  let checkpoint = generateCheckpoints(
    totalFee,
    admissionFee,
    duration,
    checkpoints,
  );

  const studentRef = doc(db, "userDetails", uid);
  const courseRef = doc(db, "courses", courseId);

  try {
    await runTransaction(db, async (transaction) => {
      const courseDoc = await transaction.get(courseRef);
      if (!courseDoc.exists()) {
        throw new Error("Course does not exist!");
      }

      // 2. Create the student document
      transaction.set(studentRef, {
        name,
        email,
        courseId,
        admissionFee,
        createdAt: new Date(),
        checkpointPlan: planType,
        checkpoints: checkpoint,
        role: "student",
      });

      // 3. Increment the studentsCount on the course document
      transaction.update(courseRef, {
        studentsCount: increment(1),
      });

      // 4. Create the admission fee payment record
      for (const cp of checkpoint) {
        if (cp.title.toLocaleLowerCase() === "admission fee") {
          const paymentRef = doc(collection(db, "payments"));
          transaction.set(paymentRef, {
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
    });

    const studentData: StudentDetails = {
      id: uid,
      name,
      email,
      courseId,
      admissionFee,
      createdAt: Timestamp.now(),
      checkpoints: checkpoint,
    };

    for (const cp of checkpoint) {
      if (cp.title.toLocaleLowerCase() !== "admission fee") {
        await addPendingPayment(db, studentData, cp);
      }
    }

    console.log("Student created and course count updated successfully!");
  } catch (e) {
    console.error("Transaction failed: ", e);
    // You might want to handle user deletion here if the transaction fails
    throw e;
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
  newCourseId: string,
  admissionFee: number,
  checkpoint: { title: string; amount: number, dueOrder: number }[],
  planType: string
) => {
  const studentRef = doc(db, "userDetails", id);
  const newCourseRef = doc(db, "courses", newCourseId);

  try {
    await runTransaction(db, async (transaction) => {
      const studentDoc = await transaction.get(studentRef);
      if (!studentDoc.exists()) {
        throw new Error("student does not exist!");
      }

      const oldCourseId = studentDoc.data().courseId;
      const oldCourseRef = doc(db, "courses", oldCourseId);


      transaction.update(studentRef, {
        name,
        email,
        courseId: newCourseId,
        admissionFee,
        checkpointPlan: planType,
        selectedCheckpoints: checkpoint
      })

      if (oldCourseId !== newCourseId) {
        const oldCourseDoc = await transaction.get(oldCourseRef);
        const oldCount = oldCourseDoc.data()?.studentsCount || 0;

        transaction.update(oldCourseRef, {
          studentsCount: Math.max(oldCount - 1, 0),
        });
        transaction.update(oldCourseRef, {
          studentsCount: increment(-1),
        });

        transaction.update(newCourseRef, {
          studentsCount: increment(1),
        });

      }
    })
    console.log(` Student ${name} updated successfully!`);
  } catch (e) {
    console.error(" Failed to update student:", e);
    throw e;
  }
};


export const deleteStudent = async (id: string, name: string, email: string, courseId: string) => {
  const studentRef = doc(db, "userDetails", id);
  const courseRef = doc(db, "courses", courseId);
  const previousRef = doc(db, "previous", id);

  try {
    await runTransaction(db, async (transaction) => {
      const courseDoc = await transaction.get(courseRef);
      if (!courseDoc.exists()) {
        throw new Error("Course does not exist!");
      }

      transaction.set(previousRef, {
        name,
        email,
        courseId,
        status: "uncompleted",
        movedAt: new Date(),
      });

      transaction.delete(studentRef);

      transaction.update(courseRef, {
        studentsCount: Math.max((courseDoc.data().studentsCount || 0) - 1, 0),
      });


      const paymentsQuery = query(
        collection(db, "payments"),
        where("studentId", "==", id),
        where("status", "==", "pending")
      );

      const paymentsSnap = await getDocs(paymentsQuery);
      paymentsSnap.forEach((docSnap) => {
        transaction.delete(docSnap.ref);
      });
    });

    console.log(`✅ Student ${name} deleted, payments cleaned, and course count updated.`);
  } catch (e) {
    console.error("Failed to delete student: ", e);
    throw e;
  }

};