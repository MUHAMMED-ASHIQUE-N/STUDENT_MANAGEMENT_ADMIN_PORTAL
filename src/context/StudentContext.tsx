import React, { createContext, useContext, useState, type ReactNode } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { type Student, type StudentContextType, type StudentDtl } from '../type/auth';



export const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ stdDetails, setStdDetails] = useState<StudentDtl[] | null>(null);

  const createStudent = async (name: string, email: string, password: string, course: string) => {

    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "userDetails", uid), {
        name,
        email,
        course,
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

  

//   type StudentDtl = {
//   id: string;
//   name: string;
//   email: string;
//   course: string;
// };

 const getAllStudents = async (): Promise<StudentDtl[]> => {
  const studentsCollection = collection(db, "userDetails");
  const snapshot = await getDocs(studentsCollection);

  const students: StudentDtl[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<StudentDtl, "id">)
  }));

  return students;
};


 const fetchStudents = async () => {
  const data = await getAllStudents();
  setStdDetails(data)
  console.log("Students:", data);
};




// const editStudent = async ( id:string, update: Partial<Student> ) => {
//   try {
//     await updateDoc(doc(db, "userDetails", id), update)
//   }
//   catch(err:any) {
//     setError(err.message);
//   } 
// }


const updatedStudent = async (id:string, name:string, email:string, course:string) => {
  setLoading(true);
  try {

    const studentRef = doc(db, "userDetails", id);
    await updateDoc(studentRef, {name, email, course});

  }
  catch(err:any) {
    setError(err.message);
  }
  finally{
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
    <StudentContext.Provider value={{ createStudent, fetchStudents, updatedStudent, deleteStudent, stdDetails, loading, error }}>
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