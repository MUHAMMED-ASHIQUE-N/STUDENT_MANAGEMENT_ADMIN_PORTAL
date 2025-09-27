import { deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { db } from '../firebase/config';
import { type Coursetype } from '../type/auth';
import CourseList from './CourseList';
import { subscribeCourse } from '../utils/courseUtils';
import CourseForm from './CourseForm';

function Courses() {
  const [courses, setCourses] = useState<Coursetype[] | undefined>(undefined);
  const [editId, setEditId] = useState<string | null>(null);
  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    duration: 0,
    fees: {
      courseFee: 0,
      admissionFee: 0,
    },
    checkpoints: [{ title: "", amount: 0, dueOrder: 1 }]
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const unsubscribe = subscribeCourse((course) => {
        setCourses(course);
      });
      return () => unsubscribe();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (formOpen && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [formOpen]);

  const handleEdit = (selectedCourse: any) => {
    setEditId(selectedCourse.id);
    setCourse(selectedCourse);
    setFormOpen(true);
  };

  const deleteCourse = async (id: string) => {
    await deleteDoc(doc(db, "courses", id));
  };

  return (
    <div className="md:px-4">
      <div className="flex flex-col-reverse sm:flex-row gap-4 justify-between items-center">
              <h1 className="text-2xl font-bold ">Course Details</h1>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors capitalize"
        >
          {formOpen ? "Cancel" : "+ Create New course"}
        </button>
      </div>
      <div
        ref={formRef}
        className={`overflow-hidden transition-all duration-400 ease-in-out  ${
          formOpen ? "max-h-[2000px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="bg-white border-t-6 border-blue-500 p-6 rounded-3xl shadow-md max mb-4">
          <h2 className="text-2xl font-bold mb-4 text-center">{editId ? "Edit Course" : "Create New Course"}</h2>
          <CourseForm  editId={editId} setEditId={setEditId} course={course} setCourse={setCourse} error={error} setError={setError} loading={loading} setLoading={setLoading} />
        </div>
      </div>
      <div className="mt-8">
        <CourseList onEdit={handleEdit} onDelete={deleteCourse} courses={courses} />
      </div>
    </div>
  );
}

export default Courses;
