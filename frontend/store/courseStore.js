import { create } from 'zustand';
import { getCourses, getCourseChoices, getDepartments } from '@/lib/apiDept';

const useCourseStore = create((set) => ({
    courses: [],
    courseChoices: {},
    pagination: { count: 0, next: null, previous: null },
    fetchCourses: async (page = 1, limit = 10, search = '') => {
        try {
            const { data } = await getCourses(page, limit, search);
            set({
                courses: data.results || [],
                pagination: {
                    count: data.count || 0,
                    next: data.next,
                    previous: data.previous,
                },
            });
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        }
    },

    fetchCourseChoices: async () => {
        try {
            const { data } = await getCourseChoices();
            set({ courseChoices: data });
        } catch (error) {
            console.error('Failed to fetch course choices:', error);
        }
    },
  
    fetchDepartments: async () => {
        const { data } = await getDepartments();
        set({ departments: data });
    },
}));

export default useCourseStore;