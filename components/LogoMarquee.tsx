'use client';

import React from 'react';

const PARTNERS = [
  { name: 'Partner 1', logo: 'https://framerusercontent.com/images/eziJbtVdIE4oo9IJIKWO4QuTa8.png' },
  { name: 'Partner 2', logo: 'https://framerusercontent.com/images/vLH1BeYFnn9sXQl0IKTfquKlc.png' },
  { name: 'Partner 3', logo: 'https://framerusercontent.com/images/CJaOlKvBR5lrk6UCEyrIFOIw.png' },
  { name: 'Partner 4', logo: 'https://framerusercontent.com/images/0LYiLdcYTrGs6HOrgB2R2sQBf4.png' },
  { name: 'Partner 5', logo: 'https://framerusercontent.com/images/Ajf96McCiznkPIHwXOebfWHwQZ0.png' },
  { name: 'Partner 6', logo: 'https://framerusercontent.com/images/2swzBXgfilSs0WY4E0dotSueUco.png' },
];

export default function LogoMarquee() {
  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 mb-8 text-center">
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] w-12 bg-gray-100" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sponsored by</p>
          <div className="h-[1px] w-12 bg-gray-100" />
        </div>
      </div>

      {/* 무한 롤링 컨테이너 */}
      <div className="relative flex overflow-hidden group">
        <div className="flex animate-marquee whitespace-nowrap py-4 items-center">
          {/* 첫 번째 세트 */}
          {PARTNERS.map((partner, idx) => (
            <div key={`first-${idx}`} className="mx-8 w-32 md:w-40 flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
              <img src={partner.logo} alt={partner.name} className="w-full h-12 object-contain" />
            </div>
          ))}
          {/* 무한 루프를 위한 복제 세트 */}
          {PARTNERS.map((partner, idx) => (
            <div key={`second-${idx}`} className="mx-8 w-32 md:w-40 flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
              <img src={partner.logo} alt={partner.name} className="w-full h-12 object-contain" />
            </div>
          ))}
        </div>
      </div>

      {/* Tailwind CSS 애니메이션 확장 (globals.css에 추가 필요) */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 30s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}