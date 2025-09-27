import { collection, onSnapshot } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { db } from "../firebase/config";
import { format } from "date-fns";
import type { DashContextType } from "../type/auth";

export const DashContext = createContext<DashContextType | undefined>(undefined);
export const DashProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [totalStudents, setTotalStudents] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalDues, setTotalDues] = useState(0);
    const [activeCourses, setActiveCourses] = useState(0);
    const [pendingCertificates, setPendingCertificates] = useState(12);
    const [topCourses, setTopCourses] = useState<any[]>([]);

    const [studentGraphData, setStudentGraphData] = useState<any[]>([]);
    const [revenueGraphData, setRevenueGraphData] = useState<any[]>([]);


    useEffect(() => {
        // Other onSnapshot listeners remain the same...
        const unsubPayments = onSnapshot(collection(db, 'payments'), (snapshot) => {
            let currentTotalRevenue = 0;
            let currentTotalDues = 0;
            const monthMap: any = {};

            snapshot.forEach((doc) => {
                const paymentData = doc.data();
                if (paymentData.status === 'paid') {
                    currentTotalRevenue += Number(paymentData.amount) || 0;
                }
                if (paymentData.status === 'pending') {
                    currentTotalDues += Number(paymentData.amount) || 0;
                }

                const timestamp = paymentData.date ? paymentData.date.toDate() : new Date();
                const month = format(timestamp, "MMM dd ")

                if (!monthMap[month]) {
                    monthMap[month] = 0;
                }
                if (paymentData.status === 'paid'){
                    monthMap[month] +=  Number(paymentData.amount) || 0 
                }
            });

            const graphData = Object.keys(monthMap).sort().map(month => ({
                name: month,
                totalRevenue: monthMap[month]
            }));
            setTotalRevenue(currentTotalRevenue);
            setTotalDues(currentTotalDues);
            setRevenueGraphData(graphData);
        });


        const unsubStudents = onSnapshot(collection(db, 'userDetails'), (snapshot) => {
            setTotalStudents(snapshot.size);
            
            const monthMap: any = {};

            snapshot.forEach((doc) => {
                const data = doc.data();
                const createdAt = data.createdAt ? data.createdAt.toDate() : new Date(); // fallback
                const month = format(createdAt, 'dd MMM');

                if (!monthMap[month]) {
                    monthMap[month] = 0;
                }
                monthMap[month]++;
            });

            const graphData = Object.keys(monthMap).sort().map(month => ({
                name: month,
                students: monthMap[month]
            }));

            setStudentGraphData(graphData);

        });

        const unsubActiveCourses = onSnapshot(collection(db, 'courses'), (snapshot) => {
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
        });

        return () => {
            unsubPayments();
            unsubStudents();
            unsubActiveCourses();
        };
    }, []);

  

    return (
        <DashContext.Provider value={{totalStudents,totalRevenue, totalDues, activeCourses, pendingCertificates, topCourses, studentGraphData, revenueGraphData} }>
            {children}
        </DashContext.Provider>
    )
}

export const useDash = () => {
  const context = useContext(DashContext);
  if (!context) throw new Error("AuthContext not found");
  return context;
};
