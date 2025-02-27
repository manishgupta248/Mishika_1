import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAuthStore from '@/store/auth';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, isAuthenticated, checkAuth, updateProfile, changePassword } = useAuthStore();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { errors: profileErrors, isSubmitting: isProfileSubmitting } } = useForm();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, watch, formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting } } = useForm();
  const newPassword = watch('newPassword', '');

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth().catch(() => router.push('/login'));
    } else if (user) {
      resetProfile({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
    }
  }, [isAuthenticated, user, checkAuth, router, resetProfile]);

  const onProfileSubmit = async (data) => {
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update profile.');
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      toast.success('Password changed successfully! Please log in again.');
      useAuthStore.getState().logout();
      router.push('/login');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to change password.');
    }
  };

  if (!isAuthenticated || !user) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100"><p>Loading...</p></div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-green-50 border border-green-200 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Profile</h1>

        {/* Profile Display/Edit Section */}
        {!editMode ? (
          <div className="space-y-4">
            <p><strong className="text-gray-700">Email:</strong> {user.email}</p>
            <p><strong className="text-gray-700">First Name:</strong> {user.first_name}</p>
            <p><strong className="text-gray-700">Last Name:</strong> {user.last_name}</p>
            <button
              onClick={() => setEditMode(true)}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="first_name"
                type="text"
                {...registerProfile('first_name', { required: 'First name is required' })}
                className="mt-1 w-full p-2  border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your first name"
              />
              {profileErrors.first_name && <p className="mt-1 text-sm text-red-600">{profileErrors.first_name.message}</p>}
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="last_name"
                type="text"
                {...registerProfile('last_name', { required: 'Last name is required' })}
                className="mt-1 w-full p-2 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your last name"
              />
              {profileErrors.last_name && <p className="mt-1 text-sm text-red-600">{profileErrors.last_name.message}</p>}
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isProfileSubmitting}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition duration-200"
              >
                {isProfileSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Password Change Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                {...registerPassword('currentPassword', { required: 'Current password is required' })}
                className="mt-1 w-full p-2 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter current password"
              />
              {passwordErrors.currentPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>}
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                id="newPassword"
                type="password"
                {...registerPassword('newPassword', { 
                  required: 'New password is required', 
                  minLength: { value: 6, message: 'Password must be at least 6 characters' } 
                })}
                className="mt-1 w-full p-2 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new password"
              />
              {passwordErrors.newPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                {...registerPassword('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: (value) => value === newPassword || 'Passwords do not match',
                })}
                className="mt-1 w-full p-2 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm new password"
              />
              {passwordErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isPasswordSubmitting}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition duration-200"
            >
              {isPasswordSubmitting ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}