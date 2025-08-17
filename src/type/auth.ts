import type { Unsubscribe } from "firebase/auth";

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
  course: string;
  paidAmount:number;
};


export interface StudentContextType {
    createStudent: (name: string, email: string, password: string, course: string, paidAmount:number) => Promise<void>;
    subscribeStudents:() => Unsubscribe;
    updatedStudent: (id: string, name: string, email: string, course: string, paidAmount:number) => Promise<void>;
    deleteStudent: (id: string) => Promise<void>;
    stdDetails:StudentDetails[] | null;
    loading: boolean;
    error: string | null;
}



export interface Coursetype {
    id:string;
    courseName: string;
    duration: string;
    fees: string
}