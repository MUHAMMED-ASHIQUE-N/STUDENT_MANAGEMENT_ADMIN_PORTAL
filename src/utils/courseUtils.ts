import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Coursetype } from "../type/auth";
import { generateCheckpoints } from "./generateCheckpoints ";


export const createCourse = async (
  courseData: Coursetype[] | any,
) => {

  const checkpoints = generateCheckpoints(
    courseData.totalFee,
    courseData.admissionFee,
    courseData.duration,
    courseData.checkpoints || []
    // ✅ works for both default & custom
  );

    await addDoc(collection(db, "courses"), {
      ...courseData,
    checkpoints: checkpoints ,
      createdAt: serverTimestamp(),
    });
  };




export const subscribeCourse = (
  callback: (courses: Coursetype[]) => void
) => {
  const courseCollection = collection(db, "courses");
  const unsubscribe = onSnapshot(courseCollection, (snapshot) => {
    const courses: Coursetype[] = snapshot.docs.map(doc => ({
      id: doc.id, ...(doc.data() as Omit<Coursetype, "id">)

    }));
    callback(courses)
  });

  return unsubscribe;
}


export const updateCourse = async (
  id: string,
  data: Partial<Coursetype>
) => {
  await updateDoc(doc(db, "courses", id), data);
}


























