import { collection, onSnapshot } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { db } from "../firebase/config";
import { format } from "date-fns";
import type { DashContextType } from "../type/auth";

export const DashContext = createContext<DashContextType | undefined>(undefined);

export const DashProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalDues, setTotalDues] = useState(0);
    const [activeCourses, setActiveCourses] = useState(0);
    const [pendingCertificates, setPendingCertificates] = useState(0);
    const [topCourses, setTopCourses] = useState<any[]>([]);

    const [studentGraphDataMonthly, setStudentGraphDataMonthly] = useState<any[]>([]);
    const [studentGraphDataDaily, setStudentGraphDataDaily] = useState<any[]>([]);
    const [revenueGraphDataMonthly, setRevenueGraphDataMonthly] = useState<any[]>([]);
    const [revenueGraphDataDaily, setRevenueGraphDataDaily] = useState<any[]>([]);

    const [students, setStudents] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [certificates, setCertificates] = useState<any[]>([]);

    useEffect(() => {
        const unsubPayments = onSnapshot(collection(db, 'payments'), (snapshot) => {
            let currentTotalRevenue = 0;
            let currentTotalDues = 0;
            const monthMap: any = {};
            const dayMap: any = {};

            const paymentsData: any[] = [];

            snapshot.forEach((doc) => {
                const paymentData = doc.data();
                paymentsData.push({ id: doc.id, ...paymentData });

                if (paymentData.status === 'paid') {
                    currentTotalRevenue += Number(paymentData.amount) || 0;
                }
                if (paymentData.status === 'pending') {
                    currentTotalDues += Number(paymentData.amount) || 0;
                }

                const timestamp = paymentData.date ? paymentData.date.toDate() : new Date();
                const keyMonth = format(timestamp, 'yyyy-MM');
                const displayMonth = format(timestamp, 'MMM yyyy');
                const keyDay = format(timestamp, 'yyyy-MM-dd');
                const displayDay = format(timestamp, 'dd MMM');

                if (!monthMap[keyMonth]) monthMap[keyMonth] = { label: displayMonth, value: 0 };
                if (paymentData.status === 'paid') monthMap[keyMonth].value += Number(paymentData.amount) || 0;

                if (!dayMap[keyDay]) dayMap[keyDay] = { label: displayDay, value: 0 };
                if (paymentData.status === 'paid') dayMap[keyDay].value += Number(paymentData.amount) || 0;
            });

            setTotalRevenue(currentTotalRevenue);
            setTotalDues(currentTotalDues);
            setRevenueGraphDataMonthly(Object.keys(monthMap).sort().map(m => ({ name: monthMap[m].label, totalRevenue: monthMap[m].value })));
            setRevenueGraphDataDaily(Object.keys(dayMap).sort().map(d => ({ name: dayMap[d].label, totalRevenue: dayMap[d].value })));

            setPayments(paymentsData);
        });

        const unsubStudents = onSnapshot(collection(db, 'userDetails'), (snapshot) => {
            const studentsData: any[] = [];
            const monthMap: any = {};
            const dayMap: any = {};

            snapshot.forEach((doc) => {
                const data = doc.data();
                 if (data.role !== "student") return;

                studentsData.push({ id: doc.id, ...data });

                const createdAt = data.createdAt ? data.createdAt.toDate() : new Date();
                const keyMonth = format(createdAt, 'yyyy-MM');
                const displayMonth = format(createdAt, 'MMM yyyy');
                const keyDay = format(createdAt, 'yyyy-MM-dd');
                const displayDay = format(createdAt, 'dd MMM');

                if (!monthMap[keyMonth]) monthMap[keyMonth] = { label: displayMonth, value: 0 };
                monthMap[keyMonth].value++;

                if (!dayMap[keyDay]) dayMap[keyDay] = { label: displayDay, value: 0 };
                dayMap[keyDay].value++;
            });
             setTotalStudents(studentsData.length);
            setStudentGraphDataMonthly(Object.keys(monthMap).sort().map(m => ({ name: monthMap[m].label, students: monthMap[m].value })));
            setStudentGraphDataDaily(Object.keys(dayMap).sort().map(d => ({ name: dayMap[d].label, students: dayMap[d].value })));

            setStudents(studentsData);
        });

        const unsubCertificates = onSnapshot(collection(db, 'certificates'), (snapshot) => {
            const certData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCertificates(certData);
        });

        const unsubCourses = onSnapshot(collection(db, 'courses'), (snapshot) => {
            let activeCount = 0;
            let coursesList: any[] = [];
            snapshot.forEach(doc => {
                const courseData = doc.data();
                if (courseData) {
                    activeCount++;
                    coursesList.push({ id: doc.id, title: courseData.title, students: courseData.studentsCount || 0 });
                }
            });
            setActiveCourses(activeCount);
            setTopCourses(coursesList.sort((a, b) => b.students - a.students).slice(0, 3));
            setCourses(coursesList);
        });

        return () => {
            unsubPayments();
            unsubStudents();
            unsubCertificates();
            unsubCourses();
        };
    }, []);


    useEffect(() => {
        if (students.length === 0 || payments.length === 0 || courses.length === 0) return;

        function allCheckpointsPaid(student: any) {
            if (!student.checkpoints) return false;
            return student.checkpoints.every((cp:any) =>
                payments.some(p => p.studentId === student.id && p.checkpointDueOrder === cp.dueOrder && p.status === "paid")
            );
        }

        const issuedKeys = new Set(certificates.map(c => `${c.studentId}_${c.courseName?.toLowerCase()}`));

        const pendingList = students.filter(student => {
            const course = courses.find(c => c.id === student.courseId);
            const courseName = course?.title?.toLowerCase() || "";
            const key = `${student.id}_${courseName}`;
            return allCheckpointsPaid(student) && !issuedKeys.has(key);
        });

        setPendingCertificates(pendingList.length);
    }, [students, payments, certificates, courses]);


    return (
        <DashContext.Provider value={{
            totalStudents,
            totalRevenue,
            totalDues,
            activeCourses,
            pendingCertificates,
            topCourses,
            studentGraphDataMonthly,
            studentGraphDataDaily,
            revenueGraphDataMonthly,
            revenueGraphDataDaily
        }}>
            {children}
        </DashContext.Provider>
    )
}

export const useDash = () => {
    const context = useContext(DashContext);
    if (!context) throw new Error("AuthContext not found");
    return context;
};