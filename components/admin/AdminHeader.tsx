'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // supabase 임포트 추가

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  const [userName, setUserName] = useState<string>('관리자');

  useEffect(() => {
    const getUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || '관리자';
        setUserName(name);
      }
    };
    getUserName();
  }, []);

  return (
    <header className="h-[32px] bg-[#1d2327] text-[#c3c4c7] flex items-center justify-between px-4 text-[13px] font-medium sticky top-0 z-[100] border-b border-black/10 select-none">
      {/* Left side: Quick links */}
      <div className="flex items-center gap-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 hover:text-white transition-colors group"
        >
          <Home size={14} className="text-[#8c8f94] group-hover:text-[#72aee6]" />
          <span>doogostudio 바로가기</span>
        </Link>
        
        <div className="hidden sm:flex items-center gap-2 text-[#8c8f94]">
          <span className="text-[11px] opacity-30">|</span>
          <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>서버 상태 정상</span>
          </div>
        </div>
      </div>

      {/* Right side: User profile & Logout */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">
          <div className="w-5 h-5 rounded-full bg-[#3c434a] flex items-center justify-center border border-white/5">
            <User size={12} className="text-[#8c8f94] group-hover:text-[#72aee6]" />
          </div>
          <span className="font-bold text-[#f0f0f1]">{userName}님</span>
        </div>

        <button 
          onClick={onLogout}
          className="flex items-center gap-2 hover:text-[#f06d6d] transition-colors group border-l border-white/10 pl-5 h-[32px] cursor-pointer"
        >
          <LogOut size={13} className="text-[#8c8f94] group-hover:text-[#f06d6d]" />
          <span>로그아웃</span>
        </button>
      </div>
    </header>
  );
};