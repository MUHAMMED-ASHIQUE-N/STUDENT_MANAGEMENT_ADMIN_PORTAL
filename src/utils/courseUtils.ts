import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Coursetype, StudentDetails } from "../type/auth";
import { generateCheckpoints } from "./generateCheckpoints ";


export const createCourse = async (
  courseData: Coursetype[] | any,
) => {

  const checkpoints = generateCheckpoints(
    courseData.totalFee,
    courseData.admissionFee,
    0,
    courseData.duration,
    courseData.checkpoints || []
    // ✅ works for both default & custom
  );

    await addDoc(collection(db, "courses"), {
      ...courseData,
    checkpoints: checkpoints ,
      // paymentCheckpoints: checkpoints,
      // paymentCheckpoints:
      //   checkpoints && checkpoints.length > 0 && checkpoints[0].title !== ""
      //     ? checkpoints
      //     : defaultCheckpoints,
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



























// import {
//   addDoc,
//   collection,
//   doc,
//   onSnapshot,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "../firebase/config";
// import type { Coursetype, StudentDetails } from "../type/auth";
// import { generateCheckpoints } from "./generateCheckpoints ";


// export const createCourse = async (
//   courseName: string,
//   description: string,
//   category: string,
//   duration: number,
//   admissionFee: number,
//   courseFee: number,
//   totalFee: number,
//   customCheckpoints: { title: string; amount: number; dueOrder: number }[]
// ) => {


//   const checkpoints = generateCheckpoints(
//     totalFee,
//     admissionFee,
//     0,
//     duration,
//     customCheckpoints || []   // ✅ works for both default & custom
//   );


//   await addDoc(collection(db, "courses"), {
//     courseName,
//     description,
//     category,
//     duration,
//     courseFee,
//     admissionFee,
//     paymentCheckpoints: checkpoints,
//     // paymentCheckpoints:
//     //   checkpoints && checkpoints.length > 0 && checkpoints[0].title !== ""
//     //     ? checkpoints
//     //     : defaultCheckpoints,
//     createdAt: serverTimestamp(),
//   });
// };




// export const subscribeCourse = (
//   callback: (courses: Coursetype[]) => void
// ) => {
//   const courseCollection = collection(db, "courses");
//   const unsubscribe = onSnapshot(courseCollection, (snapshot) => {
//     const course: Coursetype[] = snapshot.docs.map(doc => ({
//       id: doc.id, ...(doc.data() as Omit<Coursetype, "id">)

//     }));

//     callback(course)
//   });

//   return unsubscribe;
// }


// export const updateCourse = async (
//   id: string,
//   data: Partial<Coursetype>
// ) => {
//   await updateDoc(doc(db, "courses", id), data);
// }