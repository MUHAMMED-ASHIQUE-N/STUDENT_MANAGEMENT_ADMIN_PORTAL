import React, { useEffect, useState, useMemo, useRef } from "react";
import { Award, Loader } from "lucide-react";
import CertificateCard from "./CertificateCard";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import type { Coursetype, StudentDetails } from "../type/auth";
import { subscribeStudents } from "../utils/studentUtils";
import { BsSearch, BsX } from "react-icons/bs";
import { subscribeCourse } from "../utils/courseUtils";
import CertificateTemplate from "./CertificateTemplate";

const getAllPayments = async () => {
  const paymentsSnap = await getDocs(collection(db, "payments"));
  return paymentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

function Certificates() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [students, setStudents] = useState<StudentDetails[]>([]);
  const [courses, setCourses] = useState<Coursetype[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [showCertModal, setShowCertModal] = useState(false);
  const [modalStudent, setModalStudent] = useState<StudentDetails | null>(null);
  const [modalCourseName, setModalCourseName] = useState<string | null>(null);

  useEffect(() => {
  setLoading(true);
  const unsubscribe = onSnapshot(collection(db, "certificates"), (snapshot) => {
    setCertificates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  });

  return () => unsubscribe(); 
}, []);

  useEffect(() => {
    const unsubscribe = subscribeStudents((data) => setStudents(data));
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const unsubscribeCourse = subscribeCourse((data) => setCourses(data));
    return () => unsubscribeCourse();
  }, []);

  useEffect(() => {
    getAllPayments().then(setPayments);
  }, []);

  // Helper: returns true if ALL checkpoints are paid for student
  function allCheckpointsPaid(student: StudentDetails) {
    if (!student.checkpoints) return false;
    return student.checkpoints.every(cp =>
      payments.some(p => p.studentId === student.id && p.checkpointDueOrder === cp.dueOrder && p.status === "paid")
    );
  }

  const displayCertificates = useMemo(() => {
    const issued = certificates.map(cert => {
      const student = students.find(s => s.id === cert.studentId);
      return {
        id: cert.id,
        status: "issued",
        student,
        courseName: cert.courseName,
        certificateUrl: cert.certificateUrl,
        issuedAt: cert.issuedAt,
      };
    });

    const issuedStudentCourseKeys = new Set(
      certificates.map(cert => `${cert.studentId}_${cert.courseName?.toLowerCase()}`)
    );

    const pending = students.flatMap(student => {
      if (!student.checkpoints || !allCheckpointsPaid(student)) return [];
      const courseId = courses.find((c) => c.id === student.courseId)
      const courseName = courseId?.title
      const key = `${student.id}_${courseName?.toLowerCase()}`;
      if (issuedStudentCourseKeys.has(key)) return [];
      return [{
        id: `${student.id}_${courseName}`,
        status: "pending",
        student,
        courseName,
      }];
    });

    // 3. Merge and filter by search
    const combined = [...issued, ...pending];
    const term = searchTerm.toLowerCase();

    return combined.filter(item => {
      const studentName = item.student?.name?.toLowerCase() || "";
      const courseName = item.courseName?.toLowerCase() || "";
      return studentName.includes(term) || courseName.includes(term);
    });
  }, [certificates, students, payments, searchTerm]);


  const handleGenerateClick = (student: StudentDetails, courseName: string) => {
    setModalStudent(student);
    setModalCourseName(courseName);
    setShowCertModal(true);
  };

    const formRef = useRef<HTMLDivElement>(null);
    formRef.current?.scrollIntoView({ behavior: "smooth" });


  return (
    <div className="min-h-screen  lg:px-6">
      <div>
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-2 border border-slate-200">
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-slate-300 focus-within:ring-2 focus-within:ring-blue-200">
            <BsSearch size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by student or course..."
              className="flex-1 outline-none text-gray-700 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <BsX size={18} />
              </button>
            )}
          </div>
        </div>
        <div className="my-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-lg">
              <Award size={28} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">Issued & Pending Certificates</h1>
          </div>
          <p className="text-gray-600 ml-14">
            Manage and download student certificates, and view pending ones
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pb-4">
          <div className="bg-gradient-to-br from-blue-500/2 to-indigo-500/20 border border-blue-500/30 rounded-xl shadow-sm  p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
              <p className="text-slate-600 text-sm font-medium">Total</p>
            </div>
            <p className="text-3xl font-bold text-blue-500">
              {displayCertificates.length}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/2 to-emerald-500/20 border border-green-500/30 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-8 bg-green-600 rounded-full"></div>
              <p className="text-slate-600 text-sm font-medium">Issued</p>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {displayCertificates.filter(c => c.status === "issued").length}
            </p>
          </div>

          <div className="rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow bg-gradient-to-br from-amber-500/20 to-orange-500/20  border-amber-500/30 ">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-8 bg-amber-600 rounded-full"></div>
              <p className="text-slate-600 text-sm font-medium">Pending</p>
            </div>
            <p className="text-3xl font-bold text-amber-600">
              {displayCertificates.filter(c => c.status === "pending").length}
            </p>
            
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader size={40} className="text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading certificates...</p>
        </div>
      ) : displayCertificates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-16 text-center border-2 border-dashed border-gray-300">
          <Award size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-2xl font-semibold text-gray-700 mb-2">
            No Certificates Found
          </p>
          <p className="text-gray-500">
            Try searching by student name or course name
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCertificates.map(cert => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              onGenerate={(student: any, courseName: any) => handleGenerateClick(student, courseName)}
            />
          ))}

        </div>

      )}
      {/* Modal for certificate generation */}
      {showCertModal && modalStudent && modalCourseName && (
        <div ref={formRef} className=" flex items-center justify-center z-50 mt-12">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w- p-8 relative">
            <button
              className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-700"
              onClick={() => setShowCertModal(false)}
            >
              &times;
            </button>
            <CertificateTemplate
              student={modalStudent}
              course={modalCourseName}
              onUploaded={handleGenerateClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Certificates;




