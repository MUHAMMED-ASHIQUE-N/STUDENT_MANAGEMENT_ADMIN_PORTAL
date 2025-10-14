import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
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

const counterRef = doc(db, "counters", "students");


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
  profilePicUrl?: string ,
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  await signOut(auth)  //................

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

      const counterDoc = await transaction.get(counterRef);
      const courseDoc = await transaction.get(courseRef);

      let lastSeq = 0;
      if (counterDoc.exists()) {
        lastSeq = counterDoc.data().lastSeq || 0;
      }
      const newSeq = lastSeq + 1;
      const studentSeqId = `STD${String(newSeq).padStart(2, "0")}`;

      transaction.set(counterRef, { lastSeq: newSeq }, { merge: true });


      if (!courseDoc.exists()) {
        throw new Error("Course does not exist!");
      }

      transaction.set(studentRef, {
        name,
        email,
        courseId,
        admissionFee,
        createdAt: new Date(),
        checkpointPlan: planType,
        checkpoints: checkpoint,
        role: "student",
        studentSeqId,
        profilePicUrl:profilePicUrl || "",
      });

      transaction.update(courseRef, {
        studentsCount: increment(1),
      });

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
  planType: string,
  profilePicUrl?: string 
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
        selectedCheckpoints: checkpoint,
        profilePicUrl 
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