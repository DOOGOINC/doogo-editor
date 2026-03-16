'use client';

import React from 'react';
import { 
  Users, CreditCard, Sparkles, LogOut, 
  Search, MoreHorizontal, Settings, LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';

export default function MiniAdmin() {
  const stats = [
    { label: '전체 유저', value: '1,284명', icon: <Users size={18} /> },
    { label: '누적 매출', value: '425만원', icon: <CreditCard size={18} /> },
    { label: 'AI 사용량', value: '8,422회', icon: <Sparkles size={18} /> },
  ];

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#f8f9fa] font-pretendard">
        {/* 1. Slim Sidebar */}
        <aside className="w-20 lg:w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen shrink-0 transition-all z-50">
          <div className="p-6 lg:p-10 flex justify-center lg:justify-start">
            <Link href="/" className="text-[20px] font-black text-[#155dfc] italic tracking-tighter">
              <span className="lg:hidden">A</span>
              <span className="hidden lg:inline uppercase">Admin Hub</span>
            </Link>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            {[
              { icon: <LayoutDashboard size={20} />, label: '대시보드', active: true },
              { icon: <Users size={20} />, label: '유저 관리' },
              { icon: <CreditCard size={20} />, label: '결제 내역' },
              { icon: <Settings size={20} />, label: '환경 설정' }
            ].map((item, idx) => (
              <button 
                key={idx} 
                className={`w-full flex items-center justify-center lg:justify-start gap-3 p-4 rounded-2xl transition-all ${
                  item.active 
                    ? 'bg-[#155dfc] text-white shadow-lg shadow-[#155dfc]/20' 
                    : 'text-[#333] hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                <span className="hidden lg:inline font-bold text-[14px]">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-50">
            <button className="w-full flex items-center justify-center lg:justify-start gap-3 p-4 text-red-400 hover:bg-red-50 rounded-2xl transition-all group">
              <LogOut size={20} className="text-red-300 group-hover:text-red-400" />
              <span className="hidden lg:inline font-bold text-[14px]">로그아웃</span>
            </button>
          </div>
        </aside>

        {/* 2. Main Content */}
        <main className="flex-1 p-6 lg:p-12 space-y-8 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-[26px] font-black text-[#333]-900 tracking-tight">대시보드</h1>
            <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-gray-100 shadow-sm w-full sm:w-72 focus-within:border-[#155dfc]/30 transition-all">
              <Search size={16} className="text-gray-300" />
              <input type="text" placeholder="유저 검색..." className="bg-transparent border-none outline-none text-[14px] w-full font-medium placeholder:text-gray-300" />
            </div>
          </div>

          {/* Simple Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow cursor-default">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#155dfc] shadow-inner">{stat.icon}</div>
                <div>
                  <p className="text-[12px] font-black text-[#333] uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                  <h3 className="text-[22px] font-black text-[#333] tracking-tight">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* User Table Card */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-[18px] font-black text-[#333]-900 mb-0.5">최근 가입 유저</h2>
                <p className="text-[13px] text-[#333]-400 font-medium">실시간으로 가입된 최신 사용자 목록입니다.</p>
              </div>
              <button className="px-5 py-2.5 bg-gray-50 text-[#333] rounded-xl text-[12px] font-black hover:bg-[#155dfc] hover:text-white transition-all">전체보기</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/30 text-[11px] font-black text-[#333] uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-10 py-5">사용자 정보</th>
                    <th className="px-10 py-5">보유 포인트</th>
                    <th className="px-10 py-5">가입일</th>
                    <th className="px-10 py-5 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[14px]">
                  {[
                    { name: '김인프', email: 'kim@example.com', points: '15,000 P', date: '2024.03.12' },
                    { name: '이코드', email: 'lee@example.com', points: '32,500 P', date: '2024.03.11' },
                    { name: '박디자인', email: 'park@example.com', points: '500 P', date: '2024.03.10' },
                    { name: '최에이아이', email: 'choi@example.com', points: '0 P', date: '2024.03.09' },
                    { name: '정개발', email: 'jung@example.com', points: '120,000 P', date: '2024.03.08' },
                  ].map((user, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-all group cursor-pointer">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-400 text-xs group-hover:bg-[#155dfc] group-hover:text-white transition-all shadow-sm">
                            {user.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-none mb-1.5">{user.name}</p>
                            <p className="text-[12px] text-gray-400 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="font-black text-gray-900">{user.points}</span>
                      </td>
                      <td className="px-10 py-6 text-gray-400 font-medium text-[13px]">{user.date}</td>
                      <td className="px-10 py-6 text-right">
                        <button className="p-2.5 text-gray-200 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-10 py-6 bg-gray-50/30 border-t border-gray-50 flex justify-center">
              <p className="text-[12px] text-gray-300 font-medium">© {new Date().getFullYear()} Mini Admin Hub. All rights reserved.</p>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
