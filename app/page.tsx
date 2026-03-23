'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, Layout, Image as ImageIcon } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import LogoMarquee from '@/components/LogoMarquee';
import FAQ from '@/components/FAQ';
import { POINT_PACKAGES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { POINT_PACKAGES as INITIAL_PACKAGES } from '@/lib/constants';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [pointPackages, setPointPackages] = useState(INITIAL_PACKAGES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    
    // DB에서 패키지 정보 가져오기
    const fetchPackages = async () => {
      try {
        const { data, error } = await supabase
          .from('package_settings')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) throw error;
        if (data && data.length > 0) setPointPackages(data);
      } catch (err) {
        console.error('패키지 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
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

      {/* 2.5 Usage Fees Section (이용요금 디자인 개선) */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-gray-50">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#155dfc]/5 text-[#155dfc] px-4 py-2 rounded-full text-sm font-black mb-4">
              <Zap size={16} fill="currentColor" />
              <span>이용요금</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
              필요한 만큼만 충전하고<br />
              <span className="text-[#155dfc]">합리적으로 이용하세요</span>
            </h2>
            <p className="text-gray-500 font-bold max-w-[600px] mx-auto leading-relaxed text-[15px] md:text-[17px]">
              복잡한 월간 구독 없이, 필요한 만큼만 충전하여<br className="hidden md:block" />
              모든 AI 제작 기능을 즉시 이용할 수 있습니다.
            </p>
          </div>

          {/* Pricing Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
  {/* map 대상을 소문자 pointPackages로 설정하여 DB 데이터를 불러옵니다 */}
  {pointPackages.map((pkg, i) => (
    <div 
      key={pkg.id || i} 
      className={`relative p-10 rounded-[40px] border-2 transition-all duration-500 group hover:-translate-y-2 ${
        pkg.popular 
        ? 'border-[#155dfc] bg-[#155dfc]/5 shadow-xl shadow-[#155dfc]/10' 
        : 'border-gray-300 bg-white hover:border-[#155dfc]/30 hover:shadow-lg'
      }`}
    >
      {/* 인기 패키지 상단 뱃지 */}
      {pkg.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#155dfc] text-white px-5 py-1.5 rounded-full text-[11px] font-black tracking-[0.1em]">
          POPULAR
        </div>
      )}

      {/* 패키지 태그 (기본, 인기, 추천 등) */}
      <div className="mb-8">
        <span className={`text-[12px] font-black px-3 py-1.5 rounded-xl ${
          pkg.popular ? 'bg-[#155dfc] text-white' : 'bg-gray-100 text-gray-500'
        }`}>
          {pkg.tag}
        </span>
      </div>

      {/* 포인트 수량 표시 (천 단위 콤마 추가) */}
      <div className="mb-2">
        <span className="text-[36px] font-black text-gray-900">
          {pkg.points.toLocaleString()}
        </span>
        <span className="text-[20px] font-bold text-gray-400 ml-1">P</span>
      </div>

      {/* 결제 금액 표시 (천 단위 콤마 + 원 추가) */}
      <div className="text-[22px] font-black text-[#155dfc] mb-6">
        {pkg.price.toLocaleString()}원
      </div>

      {/* 보너스 포인트 안내 영역 */}
      <div className="h-20">
        {pkg.bonus > 0 ? (
          <div className="text-[14px] font-bold text-[#FF6467] flex items-center gap-1.5 bg-[#FF6467]/5 px-4 py-2 rounded-2xl w-fit">
            <Zap size={14} fill="currentColor" />
            {pkg.bonus.toLocaleString()} P 추가 지급
          </div>
        ) : (
          <div className="text-[14px] font-bold text-gray-400 px-4 py-2">
            기본 패키지
          </div>
        )}
      </div>

      {/* 충전 페이지 이동 버튼 */}
      <Link 
        href="/purchase" 
        className={`w-full py-5 rounded-[24px] font-black text-[16px] flex items-center justify-center transition-all ${
          pkg.popular 
          ? 'bg-[#155dfc] text-white hover:bg-[#158dfc] shadow-lg shadow-[#155dfc]/20' 
          : 'bg-gray-900 text-white hover:bg-black'
        }`}
      >
        충전하기
      </Link>
    </div>
  ))}
</div>

          {/* 서비스 규정 하단 배치 (심플한 푸터 스타일) */}
          <div className="pt-16 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[1000px] mx-auto">
              <div className="space-y-3">
                <h4 className="text-[14px] text-gray-900 font-black flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 bg-[#155dfc] rounded-full"></div>
                  서비스 제공 안내
                </h4>
                <div className="text-[13px] text-gray-400 font-medium leading-[1.8] space-y-1">
                  <p>• 결제 완료 시 해당 계정으로 포인트가 즉시 자동 충전됩니다.</p>
                  <p>• 충전된 포인트는 모든 AI 생성 및 편집 기능에서 자유롭게 사용 가능합니다.</p>
                  <p>• 유효기간은 결제일로부터 1년이며, 유효기간 1년 초과시 포인트 소멸됩니다.</p>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-[14px] text-gray-900 font-black flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 bg-[#155dfc] rounded-full"></div>
                  취소 및 환불 규정
                </h4>
                <div className="text-[13px] text-gray-400 font-medium leading-[1.8] space-y-1">
                  <p>• 결제 후 7일 이내, 포인트를 전혀 사용하지 않은 경우에 한해 전액 환불이 가능합니다.</p>
                  <p>• 포인트 환불은 결제수단(신용카드)으로만 환불 가능합니다</p>
                  <p>• 디지털 콘텐츠의 특성상 1포인트라도 사용한 경우 청약철회가 불가합니다. (전자상거래법 제17조)</p>
                  <p>• 환불 신청은 1:1 고객센터 또는 이메일을 통해 접수해 주시기 바랍니다.</p>
                </div>
              </div>
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