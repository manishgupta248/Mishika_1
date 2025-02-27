import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import useDepartmentStore from '@/store/departmentstore';
import { createDepartment, updateDepartment, deleteDepartment } from '@/lib/apiDept';

export default function Departments() {
  const { departments, facultyChoices, fetchDepartments, fetchFacultyChoices } = useDepartmentStore();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editFaculty, setEditFaculty] = useState('');

  // react-hook-form for create form
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch data on mount
  useEffect(() => {
    fetchDepartments();
    fetchFacultyChoices();
  }, [fetchDepartments, fetchFacultyChoices]);

  // Handle create department
  const onCreateSubmit = async (data) => {
    try {
      await createDepartment(data);
      fetchDepartments();
      reset(); // Clear form
      toast.success('Department created successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.non_field_errors?.[0] || 'Failed to create department.';
      toast.error(errorMsg); // Handles duplicate name/faculty errors from backend
    }
  };

  // Handle update department
  const handleUpdate = async (id) => {
    try {
      await updateDepartment(id, { name: editName, faculty: editFaculty });
      fetchDepartments();
      setEditingId(null);
      toast.success('Department updated successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.non_field_errors?.[0] || 'Failed to update department.';
      toast.error(errorMsg);
    }
  };

  // Handle delete department
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDepartment(id);
        fetchDepartments();
        toast.success('Department deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete department.');
      }
    }
  };

  // Start editing a department
  const startEditing = (dept) => {
    setEditingId(dept.id);
    setEditName(dept.name);
    setEditFaculty(dept.faculty);
  };

  // Show department details in toast
  const showDetails = (dept) => {
    const facultyLabel = facultyChoices.find((choice) => choice.value === dept.faculty)?.label || dept.faculty;
    toast(
      <div>
        <h3 className="font-bold">{dept.name}</h3>
        <p>Faculty: {facultyLabel}</p>
        <p>ID: {dept.id}</p>
      </div>,
      { duration: 4000, position: 'top-center' }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Toaster for notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Create Department Form */}
      <div className="max-w-2xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Department</h1>
        <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Department Name</label>
            <input
              {...register('name', { required: 'Department name is required' })}
              className={`mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter department name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Faculty</label>
            <select
              {...register('faculty', { required: 'Faculty is required' })}
              className={`mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.faculty ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="">Select Faculty</option>
              {facultyChoices.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
            {errors.faculty && <p className="text-red-500 text-sm mt-1">{errors.faculty.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Create Department
          </button>
        </form>
      </div>

      {/* Departments Table */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Department List</h2>
        {departments.length === 0 ? (
          <p className="text-gray-500">No departments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-[#800000]">
                <tr>
                  <th className="px-4 py-2 text-left border border-green-200 text-sm font-medium text-white">Id</th>
                  <th className="px-4 py-2 text-left border border-green-200 text-sm font-medium text-white">Name</th>
                  <th className="px-4 py-2 text-left border border-green-200 text-sm font-medium text-white">Faculty</th>
                  <th className="px-4 py-2 text-left border border-green-200 text-sm font-medium text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 border border-green-200">{dept.id}</td>
                    {editingId === dept.id ? (
                      <>
                        <td className="px-4 py-2 border border-green-200">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded-md"
                          />
                        </td>
                        <td className="px-4 py-2  border border-green-200 ">
                          <select
                            value={editFaculty}
                            onChange={(e) => setEditFaculty(e.target.value)}
                            className="w-full p-1 rounded-md"
                          >
                            {facultyChoices.map((choice) => (
                              <option key={choice.value} value={choice.value}>
                                {choice.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2 flex space-x-2 ">
                          <button
                            onClick={() => handleUpdate(dept.id)}
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
                        <td
                          onClick={() => showDetails(dept)}
                        >
                          {dept.name}
                        </td>
                        <td className="px-4 py-2 border border-green-200 text-gray-800">
                          {facultyChoices.find((choice) => choice.value === dept.faculty)?.label || dept.faculty}
                        </td>
                        <td className="px-4 py-2 border border-green-200 flex space-x-2">
                          <button
                            onClick={() => startEditing(dept)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(dept.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}