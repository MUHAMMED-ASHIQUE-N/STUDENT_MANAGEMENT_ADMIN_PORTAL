import { createCourse, updateCourse } from '../utils/courseUtils';
import type { Coursetype } from '../type/auth';
import { Plus, Save, Trash2 } from 'lucide-react';

interface CourseFormProps {
    editId: string | null;
    setEditId: React.Dispatch<React.SetStateAction<string | null>>;
    course: Coursetype;
    setCourse: React.Dispatch<React.SetStateAction<Coursetype>>;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<string>>;
}

function CourseForm({ editId, setEditId, course, setCourse, error, setError, loading, setLoading, setSuccess }: CourseFormProps) {
    const totalFee = Number(course.fees.courseFee) + Number(course.fees.admissionFee) 
    const courseFee = Number(course.fees.courseFee)
      const checkpointTotal = course.checkpoints.reduce((sum, cp) => sum + cp.amount, 0);

    const addCheckpoint = () => {
        setCourse((prev: any) => ({
            ...prev,
            checkpoints: [
                ...prev.checkpoints,
                { title: "", amount: 0, dueOrder: prev.checkpoints.length + 1 }
            ]
        }));
    };

    const handleCheckpointChange = (index: number, field: string, value: string | number) => {
        const updated: any = [...course.checkpoints];
        updated[index] = { ...updated[index], [field]: value };
        setCourse((prev) => ({
            ...prev,
            checkpoints: updated
        }));
    };

    const removeCheckpoint = (idx: number) => {
        setCourse((prev) => ({
            ...prev,
            checkpoints: prev.checkpoints.filter((_, i) => i !== idx)
        }));
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setCourse((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFeeChange = (e: any) => {
        const { name, value } = e.target;
        setCourse((prev) => ({
            ...prev,
            fees: {
                ...prev.fees,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const courseData = {
                ...course,
                totalFee: courseFee
            };
            if (editId) {
                await updateCourse(editId, courseData);
                 setSuccess("Course updated successfully!");
                 
                setEditId(null);
            } else {
                await createCourse(courseData);
                setSuccess("Course created successfully!");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setError("");
        }
        setCourse({
            title: "",
            description: "",
            category: "",
            duration: 0,
            fees: {
                courseFee: 0,
                admissionFee: 0,
            },
            checkpoints: []
        });
    };

    return (
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-slate-700">Course Name *</label>
                <input type="text" name="title" value={course.title} onChange={handleChange} required className="border border-slate-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-slate-700">Category/Technology *</label>
                <input type="text" name="category" value={course.category} onChange={handleChange} required className="border border-slate-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-slate-700">Duration (months) *</label>
                <input type="number" name="duration" value={course.duration === 0 ? "" : course.duration} onChange={handleChange} min={1} required className="border border-slate-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col sm:col-span-2">
                <label className="mb-2 font-medium text-slate-700">Description</label>
                <textarea name="description" value={course.description} onChange={handleChange} rows={4} className="border border-slate-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <div className="w-1 h-6 bg-emerald-500 rounded-full mr-3"></div>
              Course Fees
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-slate-700">Course Fee *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">₹</span>
                  <input type="number" name="courseFee" value={course.fees.courseFee === 0 ? "" : course.fees.courseFee} onChange={handleFeeChange} min={0} required className="border border-slate-300 rounded-lg py-2.5 pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-slate-700">Admission Fee *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">₹</span>
                  <input type="number" name="admissionFee" value={course.fees.admissionFee === 0 ? "" : course.fees.admissionFee} onChange={handleFeeChange} min={0} required className="border border-slate-300 rounded-lg py-2.5 pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200 flex justify-between">
              <span className="text-slate-700 font-medium">Total Fee</span>
              <span className="text-2xl font-bold text-emerald-600">₹{totalFee.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                <div className="w-1 h-6 bg-amber-500 rounded-full mr-3"></div>
                Payment Checkpoints
              </h2>
              <span className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">{course.checkpoints.length} checkpoints</span>
            </div>
            <div className="space-y-3 mb-6">
              {course.checkpoints.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                  <p className="text-slate-500">No checkpoints added yet. Click below to add one.</p>
                </div>
              ) : (
                course.checkpoints.map((cp, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <input type="text" value={cp.title} onChange={e => handleCheckpointChange(idx, "title", e.target.value)} placeholder="Checkpoint Title" className="border border-slate-300 rounded-lg py-2 px-3 flex-1" />
                    <div className="flex gap-3 items-center flex-wrap sm:flex-nowrap">
                      <div className="flex-1 sm:flex-initial min-w-32">
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-slate-500 text-sm">₹</span>
                          <input type="number" value={cp.amount === 0 ? "" : cp.amount} onChange={e => handleCheckpointChange(idx, "amount", e.target.value === "" ? 0 : Number(e.target.value))} min={0} className="border border-slate-300 rounded-lg py-2 pl-7 pr-3 w-full" />
                        </div>
                      </div>
                      <div className="flex-1 sm:flex-initial min-w-24">
                        <input type="number" value={cp.dueOrder} onChange={e => handleCheckpointChange(idx, "dueOrder", Number(e.target.value))} min={1} className="border border-slate-300 rounded-lg py-2 px-3 w-full" />
                      </div>
                      <button type="button" onClick={() => removeCheckpoint(idx)} className="bg-red-50 text-red-600 p-2.5 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {course.checkpoints.length > 0 && (
                              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-6 flex justify-between">
                <span className="text-slate-700 font-medium">Checkpoint Total</span>
                <span className="text-xl font-bold text-amber-600">₹{checkpointTotal.toLocaleString()}</span>
              </div>
            )}

            <button type="button" onClick={addCheckpoint} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Add Payment Checkpoint
            </button>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            {loading ? "Saving..." : editId ? "Update Course" : "Create Course"}
          </button>
        </form>
        </div>
    )
}

export default CourseForm