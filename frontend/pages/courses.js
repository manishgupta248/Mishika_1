import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import useCourseStore from '../store/courseStore';
import useDepartmentStore from '@/store/departmentStore';
import { createCourse, updateCourse, deleteCourse } from '@/lib/apiDept';
import { useDebounce } from 'use-debounce';

export default function Courses() {
    const { courses, courseChoices, pagination, fetchCourses, fetchCourseChoices } = useCourseStore();
    const { departments, fetchDepartments } = useDepartmentStore();
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch] = useDebounce(searchQuery, 500); // 500ms debounce
    const itemsPerPage = 10;
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchCourses(currentPage, itemsPerPage, debouncedSearch);
        fetchCourseChoices();
        fetchDepartments();
    }, [fetchCourses, fetchCourseChoices, fetchDepartments, currentPage, debouncedSearch]);

    const onCreateSubmit = async (data) => {
        try {
            await createCourse(data);
            fetchCourses(currentPage, itemsPerPage, debouncedSearch); // Refresh with current filters
            reset();
            toast.success('Course created successfully!');
        } catch (error) {
            toast.error(error.response?.data?.COURSE_CODE?.[0] || 'Failed to create course.');
        }
    };

    const handleUpdate = async (id) => {
        try {
            await updateCourse(id, editData);
            fetchCourses(currentPage, itemsPerPage, debouncedSearch);
            setEditingId(null);
            toast.success('Course updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.COURSE_CODE?.[0] || 'Failed to update course.');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            try {
                await deleteCourse(id);
                fetchCourses(currentPage, itemsPerPage, debouncedSearch);
                toast.success('Course deleted successfully!');
            } catch (error) {
                toast.error('Failed to delete course.');
            }
        }
    };

    const startEditing = (course) => {
        setEditingId(course.id);
        setEditData(course);
    };

    const showDetails = (course) => {
        const disciplineName = departments.find((d) => d.id === course.DISCIPLINE)?.name || course.DISCIPLINE;
        toast(
            <div>
                <h3 className="font-bold">{course.COURSE_CODE}</h3>
                <p>Name: {course.COURSE_NAME}</p>
                <p>Discipline: {disciplineName}</p>
                <p>Type: {courseChoices.TYPE?.find((t) => t.value === course.TYPE)?.label || course.TYPE}</p>
            </div>,
            { duration: 4000, position: 'top-center' }
        );
    };

    const totalPages = Math.ceil(pagination.count / itemsPerPage);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Course</h1>
                <form onSubmit={handleSubmit(onCreateSubmit)} className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Course Code</label>
                        <input
                            {...register('COURSE_CODE', { required: 'Course code is required', maxLength: 10 })}
                            className={`mt-1 w-full p-2 border rounded-md ${errors.COURSE_CODE ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.COURSE_CODE && <p className="text-red-500 text-sm">{errors.COURSE_CODE.message || 'Max 10 chars'}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Course Name</label>
                        <input
                            {...register('COURSE_NAME', { required: 'Course name is required' })}
                            className={`mt-1 w-full p-2 border rounded-md ${errors.COURSE_NAME ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.COURSE_NAME && <p className="text-red-500 text-sm">{errors.COURSE_NAME.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select {...register('CATEGORY', { required: true })} className="mt-1 w-full p-2 border rounded-md">
                            <option value="">Select</option>
                            {courseChoices.CATEGORY?.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Course Category</label>
                        <select {...register('COURSE_CATEGORY', { required: true })} className="mt-1 w-full p-2 border rounded-md">
                            <option value="">Select</option>
                            {courseChoices.COURSE_CATEGORY?.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select {...register('TYPE', { required: true })} className="mt-1 w-full p-2 border rounded-md">
                            <option value="">Select</option>
                            {courseChoices.TYPE?.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Credit Scheme</label>
                        <select {...register('CREDIT_SCHEME', { required: true })} className="mt-1 w-full p-2 border rounded-md">
                            <option value="">Select</option>
                            {courseChoices.CREDIT_SCHEME?.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">CBCS Category</label>
                        <select {...register('CBCS_CATEGORY', { required: true })} className="mt-1 w-full p-2 border rounded-md">
                            <option value="">Select</option>
                            {courseChoices.CBCS_CATEGORY?.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Discipline</label>
                        <select {...register('DISCIPLINE', { required: true })} className="mt-1 w-full p-2 border rounded-md">
                            <option value="">Select</option>
                            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Maximum Credit</label>
                        <input
                            type="number"
                            {...register('MAXIMUM_CREDIT', { required: true, min: 0, max: 20 })}
                            className={`mt-1 w-full p-2 border rounded-md ${errors.MAXIMUM_CREDIT ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.MAXIMUM_CREDIT && <p className="text-red-500 text-sm">0-20 required</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Qualifying in Nature</label>
                        <select {...register('QUALIFYING_IN_NATURE', { required: true })} className="mt-1 w-full p-2 border rounded-md">
                            <option value="">Select</option>
                            {courseChoices.QUALIFYING_IN_NATURE?.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
                        Create Course
                    </button>
                </form>
            </div>

            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Course List</h2>
                {/* Search Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset to page 1 on new search
                        }}
                        placeholder="Search by code or name..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Code</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Discipline</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                                        No courses found.
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.id} className="border-b hover:bg-gray-50">
                                        {editingId === course.id ? (
                                            <>
                                                <td className="px-4 py-2">
                                                    <input
                                                        value={editData.COURSE_CODE}
                                                        onChange={(e) => setEditData({ ...editData, COURSE_CODE: e.target.value })}
                                                        className="w-full p-1 border rounded-md"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        value={editData.COURSE_NAME}
                                                        onChange={(e) => setEditData({ ...editData, COURSE_NAME: e.target.value })}
                                                        className="w-full p-1 border rounded-md"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <select
                                                        value={editData.DISCIPLINE}
                                                        onChange={(e) => setEditData({ ...editData, DISCIPLINE: e.target.value })}
                                                        className="w-full p-1 border rounded-md"
                                                    >
                                                        {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2 flex space-x-2">
                                                    <button onClick={() => handleUpdate(course.id)} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">Save</button>
                                                    <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600">Cancel</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td onClick={() => showDetails(course)} className="px-4 py-2 text-gray-800 cursor-pointer hover:text-blue-600">{course.COURSE_CODE}</td>
                                                <td className="px-4 py-2 text-gray-800">{course.COURSE_NAME}</td>
                                                <td className="px-4 py-2 text-gray-800">{departments.find((d) => d.id === course.DISCIPLINE)?.name}</td>
                                                <td className="px-4 py-2 flex space-x-2">
                                                    <button onClick={() => startEditing(course)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">Edit</button>
                                                    <button onClick={() => handleDelete(course.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Delete</button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={!pagination.previous}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700">
                        Page {currentPage} of {totalPages} (Total: {pagination.count})
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={!pagination.next}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
