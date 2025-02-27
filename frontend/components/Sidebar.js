// components/Sidebar.js
import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="bg-gray-200 p-4 w-64 flex-shrink-0">
      <h2 className="text-lg text-[#800000] font-semibold mb-4">Academics</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="block p-2 hover:bg-gray-300 rounded">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/settings" className="block p-2 hover:bg-gray-300 rounded">
              Settings
            </Link>
          </li>
          <li>
            <Link href="/users" className="block p-2 hover:bg-gray-300 rounded">
              Users
            </Link>
          </li>
          {/* Add more sidebar links as needed */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;