// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';

// admin.initializeApp();

// export const incrementStudentCount = functions.firestore.document('userDetails/{studentId}')
//     .onCreate(async (snap:any, context:any) => {
//         const studentData = snap.data();
//         const courseId = studentData.courseId;

//         if (courseId) {
//             const courseRef = admin.firestore().collection('courses').doc(courseId);

//             try {
//                 // Use a transaction to safely increment the studentsCount
//                 await admin.firestore().runTransaction(async (transaction:any) => {
//                     const courseDoc = await transaction.get(courseRef);

//                     if (!courseDoc.exists) {
//                         throw new Error('Course document does not exist!');
//                     }

//                     // Get the current student count or default to 0
//                     const currentCount = courseDoc.data().studentsCount || 0;
//                     const newCount = currentCount + 1;

//                     // Update the studentsCount field
//                     transaction.update(courseRef, { studentsCount: newCount });
//                 });

//                 console.log(`Student count for course ${courseId} incremented successfully.`);
//             } catch (error) {
//                 console.error(`Transaction failed for course ${courseId}:`, error);
//             }
//         }
//     });






