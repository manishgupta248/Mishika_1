import Link from 'next/link';

export default function LeftSidebar() {
  return (
    <aside className=" p-4 w-64 flex-shrink-0 shadow-md shadow-slate-400">
      <h2 className="text-lg text-[#800000] font-semibold mb-4">Academics</h2>
      <nav className="space-y-2">
        <Link href="/" className="block text-[#800000] hover:bg-gray-300 p-2 rounded">Dashboard</Link>
        <Link href="/departments" className="block text-[#800000] hover:bg-gray-300 p-2 rounded">Departments</Link>
        <Link href="/courses" className="block text-[#800000] hover:bg-gray-300 p-2 rounded">Courses</Link>
        <Link href="/syllabi" className="block text-[#800000] hover:bg-gray-300 p-2 rounded">Syllabi</Link>
      </nav>
    </aside>
  );
}