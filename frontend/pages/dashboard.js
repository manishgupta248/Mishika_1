import { useEffect } from 'react';
import useAuthStore from '../store/auth';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth().catch(() => router.push('/login'));
  }, [checkAuth, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-md p-8 bg-green-50 border border-green-200 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Dashboard</h1>
        <div className="space-y-4">
          <p className="text-center text-gray-700">
            Welcome, <span className="font-semibold">{user.first_name} {user.last_name}</span> ({user.email})
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/profile')}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              View Profile
            </button>
            <button
              onClick={() => {
                useAuthStore.getState().logout();
                toast.success('Logged out successfully!');
                router.push('/login');
              }}
              className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}