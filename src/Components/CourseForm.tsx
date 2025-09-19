import { createCourse, updateCourse } from '../utils/courseUtils';
import type { Coursetype } from '../type/auth';

interface CourseFormProps {
    editId: string | null;
    setEditId: React.Dispatch<React.SetStateAction<string | null>>;
    course: Coursetype;
    setCourse: React.Dispatch<React.SetStateAction<Coursetype>>;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function CourseForm({ editId, setEditId, course, setCourse, error, setError, loading, setLoading }: CourseFormProps) {
    const totalFee = Number(course.fees.courseFee)
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
                totalFee: totalFee
            };
            if (editId) {
                await updateCourse(editId, courseData);
                setEditId(null);
            } else {
                await createCourse(courseData);
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
                {/* Course fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Course Name</label>
                        <input
                            type="text"
                            name="title"
                            value={course.title}
                            onChange={handleChange}
                            placeholder="Course Name"
                            required
                            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Category/Technology</label>
                        <input
                            type="text"
                            name="category"
                            value={course.category}
                            onChange={handleChange}
                            placeholder="E.g., MERN, Marketing"
                            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Course Duration (Months)</label>
                        <input
                            type="number"
                            name="duration"
                            value={course.duration}
                            onChange={handleChange}
                            placeholder="Duration in months"
                            required
                            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Course Fee</label>
                        <input
                            type="number"
                            name="courseFee"
                            value={course.fees.courseFee}
                            onChange={handleFeeChange}
                            placeholder="Course Fee"
                            required
                            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Admission Fee</label>
                        <input
                            type="number"
                            name="admissionFee"
                            value={course.fees.admissionFee}
                            onChange={handleFeeChange}
                            placeholder="Admission Fee"
                            required
                            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col sm:col-span-2">
                        <label className="mb-1 font-medium">Description</label>
                        <textarea
                            name="description"
                            value={course.description}
                            onChange={handleChange}
                            placeholder="Course Description"
                            rows={4}
                            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* <p className="text-lg font-semibold">Total Fee: ₹{totalF}</p> */}

                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-bold mb-2">Payment Checkpoints</h3>
                    {course.checkpoints.map((cp, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-3 items-center">
                            <input
                                type="text"
                                value={cp.title}
                                onChange={(e) => handleCheckpointChange(idx, "title", e.target.value)}
                                placeholder="Checkpoint Title"
                                className="border border-gray-300 rounded-md py-2 px-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                value={cp.amount === 0 ? "" : cp.amount} // show placeholder if 0
                                onChange={(e) => handleCheckpointChange(idx, "amount", e.target.value === "" ? 0 : Number(e.target.value))}
                                placeholder="Amount"
                                className="border border-gray-300 rounded-md py-2 px-3 w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                                type="number"
                                value={cp.dueOrder}
                                onChange={(e) => handleCheckpointChange(idx, "dueOrder", Number(e.target.value))}
                                placeholder="Due Order"
                                className="border border-gray-300 rounded-md py-2 px-3 w-full sm:w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => removeCheckpoint(idx)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addCheckpoint}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                        + Add Checkpoint
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors font-semibold"
                >
                    {loading ? "Saving..." : editId ? "Update Course" : "Create Course"}
                </button>

                {error && <p className="text-red-500 text-center">{error}</p>}
            </form>
        </div>
    )
}

export default CourseForm