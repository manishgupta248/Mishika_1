import { useState, useEffect, useRef } from 'react';
import useAuthStore from '../store/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[#800000] text-white p-2 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-xl font-bold px-4">MG</Link>
        <Link href="/" className="hover:text-gray-300">Home</Link>
        <Link href="/about" className="hover:text-gray-300">About</Link>
        <Link href="/contact" className="hover:text-gray-300">Contact</Link>
      </div>
      <div className="relative" ref={dropdownRef}>
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-2">
            <span>Welcome, {user.first_name}</span>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="focus:outline-none"
            >
              ▼
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-20">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-x-4">
            <Link href="/login" className="hover:text-gray-300">Login</Link>
            <Link href="/register" className="hover:text-gray-300">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}