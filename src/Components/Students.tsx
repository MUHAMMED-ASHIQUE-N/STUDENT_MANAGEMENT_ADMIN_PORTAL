import { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { subscribeStudents } from "../utils/studentUtils";
import type { Coursetype } from "../type/auth";
import StudentList from "./StudentList";
import StudentForm from "./StudentForm";
import { BsChevronDown, BsPlus, BsSearch, BsX } from "react-icons/bs";

function Students() {
  const [courses, setCourses] = useState<Coursetype[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<any | null>(null);
  const [sortOption, setSortOption] = useState<
    "createdDesc" | "createdAsc" | "nameAsc" | "nameDesc"
  >("createdDesc");

  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

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

  const filteredStudents = students
    .filter((student) => {
      const course = courses.find((c) => c.id === student.courseId);
      const courseTitle = course ? course.title.toLowerCase() : "";
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        student.name?.toLowerCase().includes(search) ||
        student.id.toLowerCase().includes(search) ||
        courseTitle.includes(search);

      const matchesCourse =
        selectedCourse === "all" || student.courseId === selectedCourse;

      const createdAt = student.createdAt?.seconds
        ? new Date(student.createdAt.seconds * 1000)
        : null;
      const matchesDate =
        (!dateRange.start || (createdAt && createdAt >= new Date(dateRange.start))) &&
        (!dateRange.end || (createdAt && createdAt <= new Date(dateRange.end)));

      return student.role === "student" && matchesSearch && matchesCourse && matchesDate;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "createdAsc":
          return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
        case "createdDesc":
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
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

  const handleClearFilters = () => {
    setSelectedCourse("all");
    setDateRange({ start: "", end: "" });
  };

  return (
    <div className="sm:p-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-2 border border-slate-200">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition">
            <BsSearch size={20} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name, email, or student ID..."
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
            onClick={() => (formOpen ? handleFormClose() : setFormOpen(true))}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm border ${formOpen
                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              }`}
          >
            {formOpen ? <BsX size={20} /> : <BsPlus size={20} />}
            <span>{formOpen ? "Cancel" : "Create New Student"}</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm mb-4">
        <div className="flex flex-wrap gap-4 items-stretch">
          <div className="flex flex-col flex-1 min-w-[160px]">
            <label className="text-sm font-semibold text-slate-700 mb-1">Sort by</label>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
                className="appearance-none w-full px-4 py-2 pr-10 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:border-slate-300 transition"
              >
                <option value="createdDesc">Newest First</option>
                <option value="createdAsc">Oldest First</option>
                <option value="nameAsc">Name (A-Z)</option>
                <option value="nameDesc">Name (Z-A)</option>
              </select>
              <BsChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 min-w-[160px]">
            <label className="text-sm font-semibold text-slate-700 mb-1">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="appearance-none w-full px-4 py-2 pr-10 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:border-slate-300 transition"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col flex-1 min-w-[120px]">
            <label className="text-sm font-semibold text-slate-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
            />
          </div>
          <div className="flex flex-col flex-1 min-w-[120px]">
            <label className="text-sm font-semibold text-slate-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
            />
          </div>

          <div className="flex flex-col justify-end flex-1 min-w-[100px]">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition w-full"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div
        ref={formRef}
        className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${formOpen ? "opacity-100 p-2 md:p-6" : "max-h-0 opacity-0 p-0"
          }`}
      >
        {formOpen && (
          <StudentForm
            editStudent={editStudent}
            courses={courses}
            onSaved={handleFormClose}
          />
        )}
      </div>

      <StudentList onEdit={handleEdit} courses={courses} students={filteredStudents} />
    </div>
  );
}

export default Students;
