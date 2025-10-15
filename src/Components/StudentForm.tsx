import React, { useState, useEffect } from "react";
import { Upload, User, Mail, Lock, DollarSign, FileText, AlertCircle, CheckCircle } from "lucide-react";
import type { Coursetype } from "../type/auth";
import { createStudent, updateStudent } from "../utils/studentUtils";
import InputField from "./InputField";
import SelectField from "./SelectField";

interface StudentFormProps {
  editStudent?: any;
  courses: Coursetype[];
  onSaved: () => void;
}

const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

function StudentForm({ editStudent, courses = [], onSaved }: StudentFormProps) {
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
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedCourse = courses?.find((c) => c.id === courseId);
  const totalFee = Number(selectedCourse?.fees?.courseFee || 0) + Number(selectedCourse?.fees?.admissionFee || 0);
  const duration = selectedCourse?.duration || 0;

  useEffect(() => {
    if (courseId) {
      const selected = courses.find((c) => c.id === courseId);
      if (selected) {
        setCheckpoint(selected.checkpoints || []);
      }
    }
  }, [courseId, courses]);

  useEffect(() => {
    if (editStudent) {
      setName(editStudent.name);
      setEmail(editStudent.email);
      setCourseId(editStudent.courseId);
      setAdmissionFee(editStudent.admissionFee);
      setCheckpoint(editStudent.checkpoint || []);
      setPlanType(editStudent.planType || "default");
      setPassword("");
      setProfilePicUrl(editStudent.profilePicUrl || "");
      setProfilePic(null);
    }
     else {
      resetForm();
    }
  }, [editStudent]);

  const handleCustomCheckpoint = (cpCount: number) => {
    if (!selectedCourse) return;
    const total = selectedCourse.fees.courseFee;
    const perCheckpoint = Math.round(total / cpCount);
    const cps = Array.from({ length: cpCount }, (_, i) => ({
      title: `Installment ${i + 1}`,
      amount: perCheckpoint,
      dueOrder: i + 2,
    }));
    setCheckpoint(cps);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Enter a valid email";
    if (!editStudent && !password.trim()) newErrors.password = "Password is required";
    else if (!editStudent && !passwordRegex.test(password)) newErrors.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
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
    setError("");
    setSuccessMessage("");
    try {
      let uploadedProfilePicUrl = "";
      if (profilePic) {
        const formData = new FormData();
        formData.append("file", profilePic);
        formData.append("upload_preset", "profilePic_preset"); 

        const res = await fetch("https://api.cloudinary.com/v1_1/drhqnpnjd/image/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) {
          uploadedProfilePicUrl = data.secure_url;
        }
      }

      setSuccessMessage(editStudent ? "Student updated successfully!" : "Student created successfully!");

      if (editStudent) {
        await updateStudent(
          editStudent.id,
          name,
          email,
          courseId,
          admissionFee,
          checkpoint,
          planType,
          uploadedProfilePicUrl || editStudent.profilePicUrl
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
          duration,
          uploadedProfilePicUrl
        );
      }
      resetForm();
      onSaved();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
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
    setProfilePic(null);
    setProfilePicUrl("");
    setErrors({});
    setSuccessMessage("");
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePic(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setProfilePicUrl("");
    }
  };

  return (
    <div className="min-h-screen p">
      <div className="">
        <div className="bg-white rounded-2xl shadow-md md:shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <User size={32} />
              <h1 className="text-3xl font-bold">{editStudent ? "Edit Student" : "Add New Student"}</h1>
            </div>
            <p className="text-blue-100">Complete the form below to {editStudent ? "update" : "register"} a student</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  icon={User}
                  label="Full Name"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                  placeholder="John Doe"
                  error={errors.name}
                  required
                />
                <InputField
                  icon={Mail}
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e:any) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  error={errors.email}
                  required
                />
              </div>

              {!editStudent && (
                <div className="mt-6">
                  <InputField
                    icon={Lock}
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e:any) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    error={errors.password}
                    required
                  />
                </div>
              )}
            </div>

            {/* Course Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Course Details</h2>
              <SelectField
                label="Select Course"
                value={courseId}
                onChange={(e:any) => setCourseId(e.target.value)}
                options={[
                  { value: "", label: "Choose a course..." },
                  ...courses.map((c) => ({ value: c.id, label: c.title }))
                ]}
                error={errors.courseId}
              />
            </div>

            {/* Payment Information */}
            {selectedCourse && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Payment Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                    <p className="text-sm text-gray-600">Course Fee</p>
                    <p className="text-2xl font-bold text-blue-600">₹{selectedCourse.fees.courseFee}</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-600">
                    <p className="text-sm text-gray-600">Admission Fee</p>
                    <p className="text-2xl font-bold text-indigo-600">₹{selectedCourse.fees.admissionFee}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-purple-600">₹{totalFee}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    label="Payment Plan Type"
                    value={planType}
                    onChange={(e: any) => {
                      const selected = e.target.value;
                      setPlanType(selected);
                      if (selected === "default" && selectedCourse) {
                        setCheckpoint(selectedCourse.checkpoints || []);
                      } else {
                        setCheckpoint([]);
                      }
                    }}
                    options={[
                      { value: "default", label: "Default Plan" },
                      { value: "custom", label: "Custom Installments" }
                    ]}
                  />

                  <InputField
                    icon={DollarSign}
                    label="Admission Fee"
                    type="number"
                    value={admissionFee === 0 ? "" : admissionFee}
                    onChange={(e: any) => setAdmissionFee(Number(e.target.value))}
                    placeholder={`₹${selectedCourse.fees.admissionFee}`}
                    error={errors.admissionFee}
                    required
                  />
                </div>

                {planType === "custom" && (
                  <div className="mt-6">
                    <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FileText size={16} className="text-blue-600" />
                      Choose Number of Installments
                    </label>
                    <select
                      onChange={(e) => handleCustomCheckpoint(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select installment count...</option>
                      {Array.from({ length: selectedCourse.duration }, (_, i) => i + 1).map((cp) => (
                        <option key={cp} value={cp}>
                          {cp} month{cp > 1 ? "s" : ""} → ₹{Math.round(selectedCourse.fees.courseFee / cp)} per installment
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {checkpoint.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FileText size={18} className="text-blue-600" />
                      Payment Checkpoints
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100 border-b-2 border-gray-300">
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Installment</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Amount</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Due Order</th>
                          </tr>
                        </thead>
                        <tbody>
                          {checkpoint.map((cp, idx) => (
                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-800">{cp.title}</td>
                              <td className="px-4 py-3 font-semibold text-blue-600">₹{cp.amount}</td>
                              <td className="px-4 py-3 text-gray-600">Month {cp.dueOrder}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Picture */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Profile Picture</h2>
              <label className=" text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Upload size={16} className="text-blue-600" />
                Upload Photo
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                  id="profilePic"
                />
                <label
                  htmlFor="profilePic"
                  className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  {profilePicUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <img src={profilePicUrl} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
                      <p className="text-sm text-blue-600">Click to change photo</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={32} className="text-gray-400" />
                      <p className="text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-start gap-3">
                <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-green-700">{successMessage}</p>
              </div>
            )}

            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : (editStudent ? "Update Student" : "Create Student")}
              </button>
              {editStudent && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentForm;