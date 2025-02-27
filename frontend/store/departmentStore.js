import { create } from 'zustand';
import { getDepartments, getFacultyChoices } from '@/lib/apiDept';

const useDepartmentStore = create((set) => ({
    departments: [],
    facultyChoices: [],
    fetchDepartments: async () => {
        const { data } = await getDepartments();
        set({ departments: data });
    },
    fetchFacultyChoices: async () => {
        const { data } = await getFacultyChoices();
        set({ facultyChoices: data });
    },
}));

export default useDepartmentStore;