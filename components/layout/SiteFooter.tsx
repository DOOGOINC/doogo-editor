'use client';

import React from 'react';
import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-[#0b0e14] text-white py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-16 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <img 
                  src="/image/Artboard 12@2x.png" 
                  alt="Footer Logo" 
                  className="w-44 object-contain" 
                />
              </Link>
            </div>
            <p className="text-[14px] text-gray-500 leading-relaxed max-w-[300px]">
              AI가 작성하는 전문적인 카피라이팅과<br />
              직관적인 에디터로 최상의 상세페이지를 제작하세요.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
            <div className="space-y-5">
              <h4 className="text-[12px] font-black text-white uppercase tracking-widest">Service</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-[14px] text-gray-500 hover:text-white transition-colors">에디터</Link></li>
                <li><Link href="/purchase" className="text-[14px] text-gray-500 hover:text-white transition-colors">포인트 충전</Link></li>
              </ul>
            </div>
            <div className="space-y-5">
              <h4 className="text-[12px] font-black text-white uppercase tracking-widest">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/policy/terms" className="text-[14px] text-gray-500 hover:text-white transition-colors">이용약관</Link></li>
                <li><Link href="/policy/privacy" className="text-[14px] text-gray-500 hover:text-white transition-colors">개인정보 처리방침</Link></li>
              </ul>
            </div>
            <div className="space-y-5">
              <h4 className="text-[12px] font-black text-white uppercase tracking-widest">Contact</h4>
              <ul className="space-y-3 text-[14px] text-gray-500">
                <li>doogobiz@gmail.com</li>
                <li>070-7174-2186</li>
                <li>평일 10:00 - 18:00</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 사업자 정보 상세 영역 */}
        <div className="pt-10 border-t border-white/5 space-y-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-gray-600">
            <p><span className="text-gray-500 mr-2">상호명</span> 주식회사 두고</p>
            <p><span className="text-gray-500 mr-2">대표자명</span> 문원오</p>
            <p><span className="text-gray-500 mr-2">사업자등록번호</span> 726-87-03167</p>
            <p><span className="text-gray-500 mr-2">통신판매업 신고번호</span> 제 2024-세종아름-0878호</p>
          </div>
          <div className="text-[12px] text-gray-600">
            <p><span className="text-gray-500 mr-2">영업장 소재지</span> 세종특별자치시 갈매로 353, 제5층 5023호 (어진동)</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-gray-600">
          <p>© {new Date().getFullYear()} 주식회사 두고. All rights reserved.</p>
          <div className="flex gap-6">
            <button className="hover:text-gray-400">유튜브</button>
            <button className="hover:text-gray-400">인스타</button>
            <button className="hover:text-gray-400">스레드</button>
          </div>
        </div>
      </div>
    </footer>
  );
}