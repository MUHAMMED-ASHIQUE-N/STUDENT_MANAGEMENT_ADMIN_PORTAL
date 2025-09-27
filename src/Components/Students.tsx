import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { subscribeStudents } from "../utils/studentUtils";
import type { Coursetype } from "../type/auth";
import StudentList from "./StudentList";
import StudentForm from "./StudentForm";

function Students() {
  const [courses, setCourses] = useState<Coursetype[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<any | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchCourses = async () => {
      const snapshot = await getDocs(collection(db, "courses"));
      setCourses(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Coursetype, "id">),
        }))
      );
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeStudents((data) => {
      setStudents(data);
    });
    return () => unsubscribe();
  }, []);

  const filteredStudents = students.filter((student) => {
    const course = courses.find((c) => c.id === student.courseId);
    const courseTitle = course ? course.title.toLowerCase() : "";
    const search = searchTerm.toLowerCase();
    if ( student.role === "student") {
      return (
      
      student.name?.toLowerCase().includes(search) ||
      student.id.toLowerCase().includes(search) ||
      courseTitle.includes(search)
    );
    }
    
  });

  const handleEdit = (student: any) => {
    setEditStudent(student);
    setFormOpen(true);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormClose = () => {
    setEditStudent(null);
    setFormOpen(false);
  };

  return (
    <div className="sm:p-2">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <div className="w-full sm:w-1/3 px-4 py-2 rounded-md flex justify-between relative bg-white shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder=" Search students..."
            className="w-full outline-none pl-6 text-gray-500"
          />
        </div>
        <button
          onClick={() => (formOpen ? handleFormClose() : setFormOpen(true))}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {formOpen ? "Cancel" : "+ Create New Student"}
        </button>
      </div>
      <div
        ref={formRef}
        className={`text-xs lg:text-sm bg-white border-t-6 rounded-2xl border-blue-500 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          formOpen ? "opacity-100 p-2 md:p-6" : "max-h-0 opacity-0 p-0"
        }`}
      > 
        {formOpen && (
          <>
            <h2 className="text-center text-2xl font-bold mb-6 text-blue-600">
              {editStudent ? "Edit Student" : "Create New Student"}
            </h2>
            <StudentForm
              editStudent={editStudent}
              courses={courses}
              onSaved={handleFormClose}
            />
          </>
        )}
      </div>
      <StudentList onEdit={handleEdit} courses={courses} students={filteredStudents} />
    </div>
  );
}

export default Students;
