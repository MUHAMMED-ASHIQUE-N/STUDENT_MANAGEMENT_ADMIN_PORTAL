import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChfoNte-KpXiiLXcUR5uJEN3_u_wP2p60",
  authDomain: "student-management-3801a.firebaseapp.com",
  projectId: "student-management-3801a",
  storageBucket: "student-management-3801a.firebasestorage.app",
  messagingSenderId: "666963640760",
  appId: "1:666963640760:web:93f5fcb6fa60325eeb0f4d",
  measurementId: "G-C6M0DB68NH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);