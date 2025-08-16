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

export interface Student {
    id: string;
    name: string;
    email: string;
    course: string;
    createdAt: Date;
    role: "admin" | "student";
}

export type StudentDtl = {
  id: string;
  name: string;
  email: string;
  course: string;
};


export interface StudentContextType {
    createStudent: (name: string, email: string, password: string, course: string) => Promise<void>;
    fetchStudents:() => Promise<void>
    // editStudent: (id: string, updates: Partial<Student>) => Promise<void>;
    updatedStudent: (id: string, name: string, email: string, course: string) => Promise<void>
    deleteStudent: (id: string) => Promise<void>;
    stdDetails:StudentDtl[] | null;
    loading: boolean;
    error: string | null;
}
