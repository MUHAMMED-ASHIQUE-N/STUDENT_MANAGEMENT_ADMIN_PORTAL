import { deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { db } from '../firebase/config';
import { type Coursetype } from '../type/auth';
import CourseList from './CourseList';
import { subscribeCourse } from '../utils/courseUtils';
import CourseForm from './CourseForm';
import { BsPlus, BsSearch, BsX } from 'react-icons/bs';
import { AlertCircle, CheckCircle } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState("");
  const [success, setSuccess] = useState("");

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

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    const term = searchTerm.toLowerCase();
    return courses.filter(
      (c) =>
        c.title?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        c.category?.toLowerCase().includes(term)
    );
  }, [courses, searchTerm]);

  return (
    <div className="md:px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-2">
        {/* Search Bar */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-2 border border-slate-200">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition">
            <BsSearch size={20} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name, catogogery, or description..."
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-slate-400 hover:text-slate-600"
              >
                <BsX size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setFormOpen(!formOpen)
            }
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm border ${formOpen
              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
              : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              }`}
          >
            {formOpen ? <BsX size={20} /> : <BsPlus size={20} />}
            <span className="">
              {formOpen ? "Cancel" : "Create New Course"}
            </span>
          </button>
        </div>
      </div>
      <div
        ref={formRef}
        className={`overflow-hidden transition-all duration-400 ease-in-out  ${formOpen ? "max-h-[2000px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"
          }`}
      >
        <div className="bg-white border-t-6 border-blue-500 p-6 rounded-3xl shadow-md max mb-4">
          <h2 className="text-3xl font-bold mb-4 text-center">{editId ? "Edit Course" : "Create New Course"}</h2>

          {/* Alerts */}
          {error && <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>}
          {success && <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{success}</p>
          </div>}
          <CourseForm editId={editId} setEditId={setEditId} course={course} setCourse={setCourse} error={error} setError={setError} loading={loading} setLoading={setLoading} setSuccess={setSuccess} />
        </div>
      </div>
      <div className="mt-8">
        <CourseList onEdit={handleEdit} onDelete={deleteCourse} courses={filteredCourses} />
      </div>
    </div>
  );
}

export default Courses;
