import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import useSyllabusStore from '@/store/syllabusStore';
import useCourseStore from '@/store/courseStore';
import { useRouter } from 'next/router';
import { useDebounce } from 'use-debounce';



export default function Syllabi() {
    const router = useRouter();
    const { course: courseIdFromQuery } = router.query; // Get course ID from URL
    const { syllabi, pagination, fetchSyllabi, uploadSyllabus, updateSyllabus, removeSyllabus } = useSyllabusStore();
    const { courses, fetchCourses } = useCourseStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [file, setFile] = useState(null);
    const [courseId, setCourseId] = useState(courseIdFromQuery || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch] = useDebounce(searchQuery, 500);
    const [editingId, setEditingId] = useState(null);
    const [editVersion, setEditVersion] = useState(1);
    const [editIsActive, setEditIsActive] = useState(true);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchSyllabi(currentPage, itemsPerPage, courseId, debouncedSearch);
        fetchCourses(1, 100); // Fetch all courses for dropdown
    }, [fetchSyllabi, fetchCourses, currentPage, courseId, debouncedSearch]);

    useEffect(() => {
        if (courseIdFromQuery) setCourseId(courseIdFromQuery); // Update course filter from URL
    }, [courseIdFromQuery]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !courseId) {
            toast.error('Please select a file and course.');
            return;
        }
        const formData = new FormData();
        formData.append('course', courseId);
        formData.append('syllabus_file', file);
        try {
            await uploadSyllabus(formData);
            fetchSyllabi(currentPage, itemsPerPage, courseId, debouncedSearch);
            toast.success('Syllabus uploaded successfully!');
            setFile(null);
            setCourseId(courseIdFromQuery || ''); // Reset to query or empty
        } catch (error) {
            toast.error('Failed to upload syllabus.');
        }
    };

    const handleUpdate = async (id) => {
        try {
            await updateSyllabus(id, { version: editVersion, is_active: editIsActive });
            fetchSyllabi(currentPage, itemsPerPage, courseId, debouncedSearch);
            setEditingId(null);
            toast.success('Syllabus updated successfully!');
        } catch (error) {
            toast.error('Failed to update syllabus.');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            await removeSyllabus(id);
            fetchSyllabi(currentPage, itemsPerPage, courseId, debouncedSearch);
            toast.success('Syllabus deleted successfully!');
        }
    };

    const startEditing = (syllabus) => {
        setEditingId(syllabus.id);
        setEditVersion(syllabus.version);
        setEditIsActive(syllabus.is_active);
    };

    const totalPages = Math.ceil(pagination.count / itemsPerPage);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Upload Syllabus</h1>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Course</label>
                        <select
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-700 rounded-md"
                        >
                            <option value="">Select Course</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.COURSE_CODE} - {course.COURSE_NAME}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Syllabus File (PDF)</label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="mt-1 w-full border border-gray-700 p-2 rounded-md"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
                        Upload Syllabus
                    </button>
                </form>
            </div>

            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Syllabus List</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset to page 1 on search
                        }}
                        placeholder="Search by course code or name..."
                        className="w-full p-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-[#800000]">
                            <tr>
                                <th className="px-4 py-2 border border-green-300 text-left text-sm font-medium text-white">Course Code</th>
                                <th className="px-4 py-2 border border-green-300 text-left text-sm font-medium text-white">File</th>
                                <th className="px-4 py-2 border border-green-300 text-left text-sm font-medium text-white">Version</th>
                                <th className="px-4 py-2 border border-green-300 text-left text-sm font-medium text-white">Active</th>
                                <th className="px-4 py-2 border border-green-300 text-left text-sm font-medium text-white">Uploaded By</th>
                                <th className="px-4 py-2 border border-green-300 text-left text-sm font-medium text-white">Uploaded At</th>
                                <th className="px-4 py-2 border border-green-300 text-left text-sm font-medium text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {syllabi.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                                        No syllabi found.
                                    </td>
                                </tr>
                            ) : (
                                syllabi.map((syllabus) => (
                                    <tr key={syllabus.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2 border border-green-300 text-gray-800">
                                            {courses.find((c) => c.id === syllabus.course)?.COURSE_CODE}
                                        </td>
                                        <td className="px-4 py-2 border border-green-300 text-gray-800">
                                            <a href={syllabus.syllabus_file} target="_blank" className="text-blue-600 hover:underline">
                                                Download
                                            </a>
                                        </td>
                                        {editingId === syllabus.id ? (
                                            <>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={editVersion}
                                                        onChange={(e) => setEditVersion(Number(e.target.value))}
                                                        className="w-full p-1 border rounded-md"
                                                        min="1"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={editIsActive}
                                                        onChange={(e) => setEditIsActive(e.target.checked)}
                                                        className="w-5 h-5"
                                                    />
                                                </td>
                                                <td className="px-4 py-2  text-gray-800">{syllabus.uploaded_by}</td>
                                                <td className="px-4 py-2  text-gray-800">{new Date(syllabus.uploaded_at).toLocaleString()}</td>
                                                <td className="px-4 py-2  flex space-x-2">
                                                    <button
                                                        onClick={() => handleUpdate(syllabus.id)}
                                                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-2 border border-green-300 text-gray-800">{syllabus.version}</td>
                                                <td className="px-4 py-2 border border-green-300 text-gray-800">{syllabus.is_active ? 'Yes' : 'No'}</td>
                                                <td className="px-4 py-2 border border-green-300 text-gray-800">{syllabus.uploaded_by}</td>
                                                <td className="px-4 py-2 border border-green-300 text-gray-800">{new Date(syllabus.uploaded_at).toLocaleString()}</td>
                                                <td className="px-4 py-2 border border-green-300 flex space-x-2">
                                                    <button
                                                        onClick={() => startEditing(syllabus)}
                                                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(syllabus.id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
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