'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const menuItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/students', label: 'Học Sinh' },
    { href: '/admin/teachers', label: 'Giáo Viên' },
    { href: '/admin/classes', label: 'Lớp Học' },
    { href: '/admin/schedules', label: 'Lịch Học' },
  ];

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-yellow-400">Thầy Hoàng</h2>
        <p className="text-sm text-slate-400">Admin Panel</p>
      </div>
      <nav className="flex flex-col space-y-2">
        {menuItems.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className={`px-4 py-2 rounded-lg transition-colors ${isActive
                ? 'bg-yellow-500 text-black font-semibold'
                : 'text-slate-300 hover:bg-slate-700'
              }`}>
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-900">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
