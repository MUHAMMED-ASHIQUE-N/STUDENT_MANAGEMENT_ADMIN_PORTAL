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


import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

// initialize the admin SDK so we can access Auth + Firestore
admin.initializeApp();

/**
 * Trigger: When a student is deleted from Firestore "userDetails/{userId}"
 * Action: Delete their Auth account automatically
 */
export const deleteAuthUser = functions.firestore
  .document("userDetails/{userId}")
  .onDelete(async (snap, context) => {
    const userId = context.params.userId;

    try {
      await admin.auth().deleteUser(userId);
      console.log(`✅ Successfully deleted Auth user with UID: ${userId}`);
    } catch (error) {
      console.error("❌ Error deleting Auth user:", error);
    }
  });
