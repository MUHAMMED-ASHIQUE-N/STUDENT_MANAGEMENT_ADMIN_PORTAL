import type { Unsubscribe } from "firebase/auth";
import type { Timestamp } from "firebase/firestore";

export interface UserData {
    uid: string;
    email: string;
    password: string;
    role: "admin" | "student";
}


export interface AuthContextType {
    user: UserData | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

// export interface Student {
//     id: string;
//     name: string;
//     email: string;
//     course: string;
//     createdAt: Date;
//     role: "admin" | "student";
// }

export type StudentDetails = {
    id: string;
    name: string;
    email: string;
    courseId: string;
    paidAmount: number;
    createdAt?: Timestamp ;
    course?: Coursetype;
    payment?: Payment[];

};


export interface StudentContextType {
    createStudent: (name: string, email: string, password: string, courseId: string, paidAmount: number) => Promise<void>;
    subscribeStudents: () => Unsubscribe;
    updatedStudent: (id: string, name: string, email: string, courseId: string, paidAmount: number) => Promise<void>;
    deleteStudent: (id: string) => Promise<void>;
    stdDetails: StudentDetails[] | null;
    loading: boolean;
    error: string | null;
}



export interface Coursetype {
    id: string;
    courseName: string;
    duration: number;
    fees: number;
    admissionfee:number;
}

export interface Payment {
  id: string;
  studentId: string; // to link payment to student
  amount: number;
  date: Timestamp;
}