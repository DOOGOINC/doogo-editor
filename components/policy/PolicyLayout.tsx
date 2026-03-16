'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';

interface PolicyLayoutProps {
  children: React.ReactNode;
}

export default function PolicyLayout({ children }: PolicyLayoutProps) {
  const pathname = usePathname();

  const tabs = [
    { name: '이용약관', href: '/policy/terms' },
    { name: '개인정보 처리방침', href: '/policy/privacy' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 공통 헤더 */}
      <SiteHeader />

      {/* Tab Navigation */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1100px] mx-auto px-6">
          <nav className="flex gap-8">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`py-6 text-[15px] font-bold transition-all relative ${
                    isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#155dfc]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-6 py-12">
        {children}
      </main>

      {/* 공통 푸터 */}
      <SiteFooter />
    </div>
  );
}
