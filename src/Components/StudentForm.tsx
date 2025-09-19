import React, { useState, useEffect } from "react";
import { createStudent, updateStudent } from "../utils/studentUtils";
import type { Coursetype } from "../type/auth";

interface StudentFormProps {
  editStudent?: any; // student being edited
  courses: Coursetype[];
  onSaved: () => void;
}

function StudentForm({ editStudent, courses, onSaved }: StudentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [courseId, setCourseId] = useState("");
  const [admissionFee, setAdmissionFee] = useState(0);
  const [checkpoint, setCheckpoint] = useState([{ title: "", amount: 0, dueOrder: 0 }]);
  const [planType, setPlanType] = useState("default");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState("");

  const selectedCourse = courses?.find((c) => c.id === courseId);
  const totalFee =
    (selectedCourse?.fees.courseFee || 0) + (selectedCourse?.fees.admissionFee || 0);
  const duration = selectedCourse?.duration || 0;

    useEffect(() => {
    if (courseId) {
      const selectedCourse = courses.find((c) => c.id === courseId);
      if (selectedCourse) {
        setCheckpoint(selectedCourse.checkpoints || []);
      }
    }
  }, [courseId, courses]);

  const handleCustomCheckpoint = (cpCount: number) => {
    if (!selectedCourse) return;
    const totalFee = selectedCourse.fees.courseFee;
    const perCheckpoint = Math.round(totalFee / cpCount);

    const cps = Array.from({ length: cpCount }, (_, i) => ({
      title: `Installment ${i + 1}`,
      amount: perCheckpoint,
      dueOrder: i + 2,
    }));
    setCheckpoint(cps);
  };

  useEffect(() => {
    if (editStudent) {
      setName(editStudent.name);
      setEmail(editStudent.email);
      setCourseId(editStudent.courseId);
      setAdmissionFee(editStudent.admissionFee);
      setCheckpoint(editStudent.checkpoint || []);
      setPlanType(editStudent.planType || "default");
      setPassword(""); 
    } else {
      resetForm();
    }
  }, [editStudent]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";
    if (!editStudent && !password.trim()) newErrors.password = "Password is required";
    if (!courseId) newErrors.courseId = "Please select a course";
    if (selectedCourse && admissionFee != selectedCourse.fees.admissionFee) {
      newErrors.admissionFee = `Admission fee must be ₹${selectedCourse.fees.admissionFee}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editStudent) {
        await updateStudent(
          editStudent.id,
          name,
          email,
          courseId,
          admissionFee,
          checkpoint,
          planType
        );
      } else {
        await createStudent(
          name,
          email,
          password,
          courseId,
          admissionFee,
          checkpoint,
          planType,
          totalFee,
          duration
        );
      }
      resetForm();
      onSaved();
    } catch (err:any) {
      setError(err.message || 'something went wrong')
    }
     finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setCourseId("");
    setAdmissionFee(0);
    setCheckpoint([{ title: "", amount: 0, dueOrder: 0 }]);
    setPlanType("default");
    setErrors({});
  };

  return (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.name ? "border-red-500" : "border-gray-300 focus:ring-blue-400"
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 ${
                  errors.email ? "border-red-500" : "border-gray-300 focus:ring-blue-400"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
          </div>

          {/* Password */}
          {!editStudent && (
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 ${
                  errors.password ? "border-red-500" : "border-gray-300 focus:ring-blue-400"
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
          )}

          {/* Course */}
          <div>
            <label className="block mb-1 font-medium">Select Course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 ${
                errors.courseId ? "border-red-500" : "border-gray-300 focus:ring-blue-400"
              }`}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            {errors.courseId && <p className="text-red-500 text-sm">{errors.courseId}</p>}
          </div>
          {/* Plan Type */}
          <div>
            <label className="block mb-1 font-medium">Checkpoint Plan</label>
            <select
              value={planType}
              onChange={e => {
                const selected = e.target.value;
                setPlanType(selected);
                if (selected === "default" && selectedCourse) {
                  setCheckpoint(selectedCourse.checkpoints || []);
                } else {
                  setCheckpoint([]);
                }
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="default">Default</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Custom Checkpoints */}
          {planType === "custom" && selectedCourse && (
            <div>
              <label className="block mb-1 font-medium">Choose Installments</label>
              <select
                onChange={e => handleCustomCheckpoint(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"

              >

                <option value="">Select installment count</option>
                {Array.from({ length: selectedCourse.duration }, (_, i) => i + 1).map(cp => (
                  <option key={cp} value={cp}>
                    {cp} month{cp > 1 ? "s" : ""} (₹{Math.round(selectedCourse.fees.courseFee / cp)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Checkpoints Table */}
          {checkpoint.length > 0 && selectedCourse && (
            <div>
              <h3 className="font-semibold mb-2 text-blue-600">Checkpoints</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-md text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Title</th>
                      <th className="border px-4 py-2">Amount</th>
                      <th className="border px-4 py-2">Due Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkpoint.map((cp, idx) => (
                      <tr key={idx}>
                        <td className="border px-4 py-2">{cp.title}</td>
                        <td className="border px-4 py-2">₹{cp.amount}</td>
                        <td className="border px-4 py-2">{cp.dueOrder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Admission Fee */}
          <div>
            <label className="block mb-1 font-medium">Admission Fee</label>
            {selectedCourse && (
              <p className="mb-1 text-gray-600">
                Required: ₹{selectedCourse.fees.admissionFee}
              </p>
            )}
            <input
              type="number"
              value={admissionFee}
              onChange={(e) => setAdmissionFee(Number(e.target.value))}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 ${
                errors.admissionFee
                  ? "border-red-500"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.admissionFee && (
              <p className="text-red-500 text-sm">{errors.admissionFee}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : editStudent ? "Update Student" : "Create Student"}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>

  );
}

export default StudentForm;


