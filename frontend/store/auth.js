// store/auth.js - Zustand store to manage authentication state.
import { create } from 'zustand';
import { login, getCurrentUser, logout as apiLogout, getProfile, updateProfile, changePassword } from '@/lib/api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
  login: async (email, password) => {
    await login(email, password);
    const user = await getCurrentUser();
    set({ user, isAuthenticated: true });
  },
  checkAuth: async () => {
    try {
      const user = await getCurrentUser();
      set({ user, isAuthenticated: true });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    }
  },
  logout: async () => {
    await apiLogout();
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (profileData) => {
    const updatedUser = await updateProfile(profileData);
    set({ user: updatedUser, isAuthenticated: true });
  },
  
  changePassword: async (currentPassword, newPassword) => {
    await changePassword(currentPassword, newPassword);
    // No state update needed unless you want to force re-login
  },

}));

export default useAuthStore;

// Export for interceptor use
export { useAuthStore };