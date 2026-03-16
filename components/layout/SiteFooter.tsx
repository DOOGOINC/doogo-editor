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
                <li>support@program.com</li>
                <li>평일 10:00 - 18:00</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-gray-600">
          <p>© {new Date().getFullYear()} Program Name. All rights reserved.</p>
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
