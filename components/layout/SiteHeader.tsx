'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut, LogIn } from 'lucide-react';

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 1. 로그인 상태 확인 및 실시간 감시
  useEffect(() => {
    const checkAdmin = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
      setIsAdmin(!!data?.is_admin);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) checkAdmin(session.user.id);
    });

    // 상태 변화 감지 (로그인/로그아웃 시 즉시 반영)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        checkAdmin(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthAction = async () => {
    if (session) {
      // 로그아웃 처리
      await supabase.auth.signOut();
      setSession(null);
      router.push('/login');
    } else {
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* 로고 */}
        <div className="flex items-center min-w-[150px]">
          <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter">
            <img src="/image/logo.png" alt="Logo" className="w-44 object-contain" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {[
            { label: '에디터', href: '/pj' },
            { label: '마이페이지', href: '/mypage' },
            ...(isAdmin ? [{ label: '관리자', href: '/admin' }] : []),
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[14px] font-bold transition-all ${
                pathname === item.href ? 'text-[#155dfc]' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
          
          <div className="w-[1px] h-4 bg-gray-200" />

          <button 
            onClick={handleAuthAction} 
            className="cursor-pointer flex items-center gap-1.5 text-[13px] font-bold text-gray-400 hover:text-[#155dfc] transition-all group"
          >
            {session ? (
              <>
                <LogOut size={16} className="text-gray-300 group-hover:text-red-400" />
                <span className="group-hover:text-red-500">로그아웃</span>
              </>
            ) : (
              <>
                <LogIn size={16} className="text-gray-300 group-hover:text-[#155dfc]" />
                <span>로그인</span>
              </>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}