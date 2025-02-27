import { useState, useEffect } from 'react';
import useAuthStore from '../store/auth';
import Navbar from './Navbar';
import Footer from './Footer';
import LeftSidebar from './LeftSidebar';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <LeftSidebar />
        <main className="flex-1  ">{children}</main> {/* ml-64 offsets sidebar */}
      </div>
      <Footer />
    </div>
  );
}