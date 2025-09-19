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


export interface DashContextType {
    totalStudents: number;
    totalRevenue: number;
    totalDues: number;
    activeCourses: number;
    pendingCertificates: number;
    topCourses: {
        id: string;
        title: string;
        students: number;
    }[];
    studentGraphData: {
        name: string | number;
        students: string | number;
    }[];
    revenueGraphData: {
        name: string | number;
        totalRevenue: string | number;
    }[],
}



// export type StudentDetails = {
//     id: string;
//     name: string;
//     email: string;
//     courseId: string;
//     admissionFee: number;
//     advanceFee: number;
//     createdAt?: Timestamp;
//     course?: Coursetype;
//     payment?: Payment[];
//     selectedCheckpoints: {
//         title: string;
//         amount: number;
//         dueOrder: number;
//     }[];
// };


// export interface Coursetype {
//     id: string;
//     courseName: string;
//     description: string;
//     category: string;
//     duration: number;
//     courseFee: number;
//     admissionFee: number;
//     paymentCheckpoints: {
//         title: string;
//         amount: number;
//         dueOrder: number;
//     }[];
// }


export type StudentDetails = {
    id: string;
    name: string;
    email: string;
    courseId: string;
    admissionFee: number;
    createdAt?: Timestamp;
    course?: Coursetype;
    payment?: Payment[];
    checkpoints: {
        title: string;
        amount: number;
        dueOrder: number;
    }[];
};


export interface Coursetype {
    id?: string;
    title: string;
    description: string;
    category: string;
    duration: number;
    fees: {
        courseFee: number;
        admissionFee: number;
    };
    checkpoints: {
        title: string;
        amount: number;
        dueOrder: number;
    }[];


}



export interface Payment {
    // id: string;
    studentId: string;
    courseId: string;
    title: string;
    amount: number;
    checkpointDueOrder: number;
    date: Timestamp;
    status: "pending" | "paid";
    receiptUrl?: string | null;
}

