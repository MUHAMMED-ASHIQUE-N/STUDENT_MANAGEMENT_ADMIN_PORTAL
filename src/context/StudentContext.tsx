import React, { createContext, useContext, useState, type ReactNode } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { type StudentContextType, type StudentDetails } from '../type/auth';



export const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stdDetails, setStdDetails] = useState<StudentDetails[] | null>(null);

  const createStudent = async (name: string, email: string, password: string, course: string, paidAmount:number) => {

    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "userDetails", uid), {
        name,
        email,
        course,
        paidAmount,
        createdAt: new Date(),
        role: "student",
      });
    }
    catch (err: any) {
      setError(err.message || 'something went wronggg');
    }
    finally {
      setLoading(false);
    }

  }


  const subscribeStudents = () => {
    const studentsCollection = collection(db, "userDetails");
    const unsubscribe = onSnapshot(studentsCollection, (snapshot) => {
      const students: StudentDetails[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<StudentDetails, "id">)
      }));

      setStdDetails(students)
    });

    return unsubscribe;
  }



  const updatedStudent = async (id: string, name: string, email: string, course: string, paidAmount:number) => {
    setLoading(true);
    try {
      const studentRef = doc(db, "userDetails", id);
      await updateDoc(studentRef, { name, email, course, paidAmount });
    }
    catch (err: any) {
      setError(err.message);
    }
    finally {
      setLoading(false);
    }
  }



  const deleteStudent = async (id: string) => {
    try {
      await deleteDoc(doc(db, "userDetails", id))
    }
    catch (err: any) {
      setError(err.message)
    }

  }



  return (
    <StudentContext.Provider value={{ createStudent, subscribeStudents, updatedStudent, deleteStudent, stdDetails, loading, error }}>
      {children}
    </StudentContext.Provider>

  )
}

export const useStudent = (): StudentContextType => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
};