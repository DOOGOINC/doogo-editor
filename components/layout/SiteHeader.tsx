'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-[100] w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* 로고 */}
      <div className="flex items-center min-w-[150px]">
  <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter">
    <img src="../image/Artboard 10@2x.png" alt="Logo" className="w-44 object-contain" />
  </Link>
</div>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {[
            { label: '에디터', href: '/' },
            { label: '마이페이지', href: '/mypage' },
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
          <button onClick={async () => {
                              await supabase.auth.signOut();
                              router.push('/login');
                            }} className="cursor-pointer flex items-center gap-1.5 text-[13px] font-bold text-gray-400 hover:text-red-500 transition-all group">
            <LogOut size={16} className="text-gray-300 group-hover:text-red-400" />
            <span>로그아웃</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
