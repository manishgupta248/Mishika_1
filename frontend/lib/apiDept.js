import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
    withCredentials: true, // For HTTP-only cookies
});

export const getDepartments = () => api.get('academic/departments/');
export const createDepartment = (data) => api.post('academic/departments/', data);
export const updateDepartment = (id, data) => api.put(`academic/departments/${id}/`, data);
export const deleteDepartment = (id) => api.delete(`academic/departments/${id}/`);
export const getFacultyChoices = () => api.get('academic/faculty-choices/');

// Courses (paginated)
//export const getCourses = (page = 1, limit = 10) => api.get(`courses/courses/?page=${page}&limit=${limit}`);
export const getCourses = (page = 1, limit = 10, search = '') =>
    api.get(`courses/courses/?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`);
export const createCourse = (data) => api.post('courses/courses/', data);
export const updateCourse = (id, data) => api.put(`courses/courses/${id}/`, data);
export const deleteCourse = (id) => api.delete(`courses/courses/${id}/`);
export const getCourseChoices = () => api.get('courses/choices/');

// Syllabus API calls
export const getSyllabi = (page = 1, limit = 10, courseId = '', search = '') =>
    api.get(`courses/syllabi/?page=${page}&limit=${limit}${courseId ? `&course=${courseId}` : ''}${search ? `&search=${search}` : ''}`);
export const updateSyllabus = (id, data) => api.patch(`courses/syllabi/${id}/`, data);
export const createSyllabus = (data) => api.post('courses/syllabi/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteSyllabus = (id) => api.delete(`courses/syllabi/${id}/`);