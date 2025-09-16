// /**
//  * Import function triggers from their respective submodules:
//  *
//  * import {onCall} from "firebase-functions/v2/https";
//  * import {onDocumentWritten} from "firebase-functions/v2/firestore";
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// import {setGlobalOptions} from "firebase-functions";
// import {onRequest} from "firebase-functions/https";
// import * as logger from "firebase-functions/logger";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

// // For cost control, you can set the maximum number of containers that can be
// // running at the same time. This helps mitigate the impact of unexpected
// // traffic spikes by instead downgrading performance. This limit is a
// // per-function limit. You can override the limit for each function using the
// // `maxInstances` option in the function's options, e.g.
// // `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// // NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// // functions should each use functions.runWith({ maxInstances: 10 }) instead.
// // In the v1 API, each function can only serve one request per container, so
// // this will be the maximum concurrent request count.
// setGlobalOptions({ maxInstances: 10 });

// // export const helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });


// import * as functions from "firebase-functions/v1";
// import * as admin from "firebase-admin";

// // initialize the admin SDK so we can access Auth + Firestore
// admin.initializeApp();

// /**
//  * Trigger: When a student is deleted from Firestore "userDetails/{userId}"
//  * Action: Delete their Auth account automatically
//  */
// export const deleteAuthUser = functions.firestore
//   .document("userDetails/{userId}")
//   .onDelete(async (snap, context) => {
//     const userId = context.params.userId;

//     try {
//       await admin.auth().deleteUser(userId);
//       console.log(`✅ Successfully deleted Auth user with UID: ${userId}`);
//     } catch (error) {
//       console.error("❌ Error deleting Auth user:", error);
//     }
//   });


import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const incrementStudentCount = functions.firestore.document('userDetails/{studentId}')
    .onCreate(async (snap:any, context:any) => {
        const studentData = snap.data();
        const courseId = studentData.courseId;

        if (courseId) {
            const courseRef = admin.firestore().collection('courses').doc(courseId);

            try {
                // Use a transaction to safely increment the studentsCount
                await admin.firestore().runTransaction(async (transaction:any) => {
                    const courseDoc = await transaction.get(courseRef);

                    if (!courseDoc.exists) {
                        throw new Error('Course document does not exist!');
                    }

                    // Get the current student count or default to 0
                    const currentCount = courseDoc.data().studentsCount || 0;
                    const newCount = currentCount + 1;

                    // Update the studentsCount field
                    transaction.update(courseRef, { studentsCount: newCount });
                });

                console.log(`Student count for course ${courseId} incremented successfully.`);
            } catch (error) {
                console.error(`Transaction failed for course ${courseId}:`, error);
            }
        }
    });






