'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, CreditCard, Settings, LogOut } from 'lucide-react';

// view 타입을 정의합니다.
export type AdminView = 'dashboard' | 'users' | 'payments' | 'settings';

interface SidebarProps {
  onLogout: () => void;
  currentView: AdminView;
  setView: (view: AdminView) => void;
}

export const Sidebar = ({ onLogout, currentView, setView }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard' as AdminView, icon: <LayoutDashboard size={20} />, label: '대시보드' },
    { id: 'users' as AdminView, icon: <Users size={20} />, label: '유저 관리' },
    { id: 'payments' as AdminView, icon: <CreditCard size={20} />, label: '결제 내역' },
    { id: 'settings' as AdminView, icon: <Settings size={20} />, label: '환경 설정' }
  ];

  return (
    <aside className="w-20 lg:w-64 bg-white border-r border-gray-100 flex flex-col sticky top-[32px] h-[calc(100vh-32px)] shrink-0 transition-all z-50">
      <div className="p-6 lg:p-10 flex justify-center lg:justify-start">
        <Link href="/admin" className="text-[20px] font-black text-[#155dfc] tracking-tighter">
          <span className="lg:hidden">A</span>
          <span className="hidden lg:inline uppercase">doogo Admin</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setView(item.id)} // 클릭 시 view 변경
            className={`w-full cursor-pointer flex items-center justify-center lg:justify-start gap-3 p-4 rounded-2xl transition-all ${
              currentView === item.id 
                ? 'bg-[#155dfc] text-white shadow-lg shadow-[#155dfc]/20' 
                : 'text-[#333] hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.icon}
            <span className="hidden lg:inline font-bold text-[14px]">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};