import { create } from 'zustand';
import { getSyllabi, createSyllabus, deleteSyllabus, updateSyllabus } from '../lib/apiDept';


const useSyllabusStore = create((set) => ({
    syllabi: [],
    pagination: { count: 0, next: null, previous: null },
    fetchSyllabi: async (page = 1, limit = 10, courseId = '', search = '') => {
        try {
            const { data } = await getSyllabi(page, limit, courseId, search);
            set({
                syllabi: data.results || [],
                pagination: { count: data.count || 0, next: data.next, previous: data.previous },
            });
        } catch (error) {
            console.error('Failed to fetch syllabi:', error);
        }
    },

    uploadSyllabus: async (formData) => {
        try {
            await createSyllabus(formData);
            set((state) => ({ syllabi: [...state.syllabi, formData] })); // Optimistic update
        } catch (error) {
            console.error('Failed to upload syllabus:', error);
            throw error;
        }
    },

    updateSyllabus: async (id, data) => {
        try {
            await updateSyllabus(id, data);
            set((state) => ({
                syllabi: state.syllabi.map((s) => (s.id === id ? { ...s, ...data } : s)),
            }));
        } catch (error) {
            console.error('Failed to update syllabus:', error);
        }
    },
    removeSyllabus: async (id) => {
        try {
            await deleteSyllabus(id);
            set((state) => ({ syllabi: state.syllabi.filter((s) => s.id !== id) }));
        } catch (error) {
            console.error('Failed to delete syllabus:', error);
        }
    },
}));

export default useSyllabusStore;