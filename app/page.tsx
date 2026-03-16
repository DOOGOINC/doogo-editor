'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, Layout, Image as ImageIcon } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import LogoMarquee from '@/components/LogoMarquee';
import FAQ from '@/components/FAQ';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-[family-name:var(--font-pretendard)] overflow-x-hidden">
      <SiteHeader />

      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
          <div className={`inline-flex items-center gap-2 bg-[#155dfc]/5 text-[#155dfc] px-4 py-2 rounded-full text-sm font-black mb-8 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span>AI 상세페이지 에디터 doogo 1.0</span>
          </div>
          
          <h1 className={`text-5xl md:text-[80px] font-black leading-[1.05] tracking-tighter mb-8 transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            상세페이지 제작,<br />
            <span className="text-[#155dfc] relative">
              AI로 압도적
              <span className="absolute bottom-2 left-0 w-full h-3 bg-[#155dfc]/10 -z-10 transform scale-x-0 transition-transform duration-1000 delay-1000 origin-left" style={{ transform: isVisible ? 'scale-x(1)' : 'scale-x(0)' }} />
            </span>으로 빠르게.
          </h1>
          
          <p className={`text-lg md:text-xl text-gray-500 font-bold max-w-[700px] mx-auto leading-relaxed mb-12 transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            기획부터 카피라이팅, 디자인까지 AI가 대신합니다. <br className="hidden md:block" />
            이제 클릭 몇 번으로 전환율 높은 상세페이지를 완성하세요.
          </p>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link 
              href="/pj" 
              className="w-full sm:w-auto bg-[#155dfc] text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-[#158dfc] transition-all shadow-2xl shadow-[#155dfc]/30 active:scale-95 flex items-center justify-center gap-2 group overflow-hidden relative"
            >
              <span className="relative z-10">무료로 시작하기</span>
              <ArrowRight size={22} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          </div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#155dfc]/10 blur-[120px] rounded-full -z-10 animate-blob" />
      </section>
      <LogoMarquee />
      {/* 2. Feature Section */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">강력한 기능을 경험하세요</h2>
            <p className="text-gray-500 font-bold opacity-80">"단 한 번의 클릭으로 성공에 도달하세요."</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Zap size={28} fill="currentColor" />, title: "AI 카피라이팅", desc: "상품명만 입력하면 AI가 소구점을 분석하여 구매를 부르는 카피를 작성합니다." },
              { icon: <Layout size={28} />, title: "스마트 모듈", desc: "검증된 레이아웃을 모듈형으로 제공합니다. 드래그 앤 드롭으로 순서를 바꾸세요." },
              { icon: <ImageIcon size={28} />, title: "고화질 내보내기", desc: "완성된 디자인을 클릭 한 번으로 고화질 이미지로 저장하여 바로 사용하세요." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group hover:-translate-y-2">
                <div className="w-14 h-14 bg-[#155dfc]/10 rounded-2xl flex items-center justify-center text-[#155dfc] mb-8 group-hover:bg-[#155dfc] group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 group-hover:text-[#155dfc] transition-colors">{feature.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5 Point System Section (수정 완료) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#155dfc]/5 text-[#155dfc] px-4 py-2 rounded-full text-sm font-black">
                <Zap size={16} fill="currentColor" />
                <span>합리적인 포인트 충전 시스템</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                준비된 포인트로<br />
                <span className="text-[#155dfc]">즉시 상세페이지 완성</span>
              </h2>
              <p className="text-gray-500 font-bold max-w-[500px] mx-auto lg:mx-0 leading-relaxed">
                복잡한 월간 구독 없이, 필요한 만큼만 충전해서 사용하세요.<br className="hidden md:block" />
                모든 기능은 포인트로 투명하게 운영됩니다.
              </p>
            </div>

            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "투명한 사용", value: "100%", desc: "모든 AI 기능 사용 시 포인트 소모량이 명확하게 공개됩니다.", icon: <Layout size={24} /> },
                { title: "간편 결제", value: "Toss", desc: "토스페이먼츠 연동으로 1초 만에 안전하게 충전하세요.", icon: <Zap size={24} fill="currentColor" /> }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#f8f9fa] p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group hover:-translate-y-1 hover:bg-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#155dfc] border border-gray-100 group-hover:bg-[#155dfc] group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-[15px] font-black text-gray-900">{item.title}</span>
                  </div>
                  <div className="text-[48px] font-black text-[#155dfc] tracking-tighter mb-4 group-hover:scale-105 transition-transform origin-left">
                    {item.value}
                  </div>
                  <p className="text-[14px] text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-[0.03] -z-10" style={{ backgroundImage: 'linear-gradient(#155dfc 1px, transparent 1px), linear-gradient(90deg, #155dfc 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </section>
      <FAQ />
      {/* 3. CTA Section */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-[#155dfc] rounded-[48px] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-[#155dfc]/40 group">
            <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10 leading-tight group-hover:scale-105 transition-transform duration-700">
              지금 바로 AI와 함께<br />매출을 만들어보세요.
            </h2>
            <Link 
              href="/pj" 
              className="inline-flex items-center gap-2 bg-white text-[#155dfc] px-10 py-5 rounded-2xl font-black text-xl hover:scale-110 transition-all active:scale-95 relative z-10"
            >
              시작하기
              <ArrowRight size={22} />
            </Link>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
          </div>
        </div>
      </section>

      <SiteFooter />

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
      `}</style>
    </div>


  );
  
}