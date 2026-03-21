'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, CreditCard, Smartphone, Building2, ChevronLeft, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import * as PortOne from '@portone/browser-sdk/v2';
import { supabase } from '@/lib/supabase';
import { POINT_PACKAGES as INITIAL_PACKAGES } from '@/lib/constants';


export default function PurchasePage() {
  const [pointPackages, setPointPackages] = useState(INITIAL_PACKAGES);
  const [loading, setLoading] = useState(true);

  const [selectedPkg, setSelectedPkg] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [isAgreed, setIsAgreed] = useState(false);

  // 로그인한 유저 정보 가져오기 (결제 시 필수 정보용)
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserEmail(user.email || '');
        // 휴대폰 번호 가져오기
        if (user.phone) {
          setUserPhone(user.phone);
        } else if (user.user_metadata?.phone) {
          setUserPhone(user.user_metadata.phone);
        }
        // 이름 가져오기
        if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
        } else if (user.user_metadata?.name) {
          setUserName(user.user_metadata.name);
        } else {
          setUserName('구매자');
        }
      }
    };
    const fetchPackages = async () => {
      try {
        const { data } = await supabase
          .from('package_settings')
          .select('*')
          .order('id', { ascending: true });
        
        if (data && data.length > 0) {
          setPointPackages(data);
          // 인기 상품이 있다면 그걸 기본 선택으로 설정
          const popular = data.find(p => p.popular);
          if (popular) setSelectedPkg(popular.id);
        }
      } finally {
        setLoading(false);
      }
    };
    getUser();
    fetchPackages();
  }, [supabase]);

  

  const currentPkg = pointPackages.find(p => p.id === selectedPkg) || pointPackages[0];

  // 결제 요청 함수
  const handlePayment = async () => {
    if (!userId || !userEmail) {
      alert('사용자 정보를 확인 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    if (!isAgreed) {
      alert('구매 조건 확인 및 체크박스에 동의해 주세요.');
      return;
    }

    try {
      setIsProcessing(true);
      
      // 포트원 결제 요청 (V2 브라우저 SDK)
      const payment = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,
        paymentId: `pay-${crypto.randomUUID().split('-')[0]}-${Date.now()}`,
        orderName: `doogo 포인트 충전 - ${currentPkg.points.toLocaleString()}P`,
        totalAmount: currentPkg.price,
        currency: 'KRW',
        payMethod: 'CARD',
        customer: {
          customerId: userId,
          fullName: userName,
          email: userEmail,
          phoneNumber: userPhone || '010-0000-0000',
        },
        windowType: {
          pc: 'IFRAME',
          mobile: 'REDIRECTION',
        },
      });
      
      if (!payment) {
        alert('결제 요청 중 알 수 없는 오류가 발생했습니다.');
        return;
      }
      if (payment?.code != null) {
        // 결제 실패 또는 취소
        if (payment.message !== '결제가 취소되었습니다') {
          alert(`결제 실패: ${payment.message}`);
        }
        return;
      }

      // 서버 측 결제 검증 및 포인트 지급 요청
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: payment.paymentId,
          points: currentPkg.points,
          bonus: currentPkg.bonus,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyResponse.ok && verifyData.success) {
        alert(`${currentPkg.points.toLocaleString()}P 포인트가 정상적으로 충전되었습니다!`);
        window.location.href = '/mypage';
      } else {
        alert(`포인트 지급 중 오류가 발생했습니다: ${verifyData.message || '서버 확인 필요'}`);
      }
      
    } catch (error) {
      console.error('결제 에러:', error);
      alert('결제 진행 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-[700px] mx-auto px-6">
          {/* Back Link */}
          <Link href="/mypage" className="flex items-center gap-1 text-gray-400 hover:text-gray-600 mb-6 transition-all group w-fit">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[14px] font-bold">마이페이지로</span>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#155dfc]/10 rounded-lg flex items-center justify-center text-[#155dfc]">
              <Zap size={18} fill="currentColor" />
            </div>
            <h1 className="text-[32px] font-black text-gray-900">포인트 충전</h1>
          </div>
          <p className="text-gray-400 mb-12 text-[15px] font-medium leading-relaxed">
            충전한 포인트는 서비스 내 모든 AI 제작 기능을 자유롭게 이용하는 데 사용됩니다.
          </p>

          {/* Section: Points Selection */}
<section className="mb-12">
  <h3 className="text-[13px] font-black text-gray-400 mb-5 uppercase tracking-widest flex items-center gap-2">
    <span className="w-1 h-3 bg-gray-200 rounded-full inline-block" />
    01. 충전 상품 선택
  </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* 로딩 중일 때 표시할 UI */}
    {loading ? (
      <div className="col-span-full py-10 flex justify-center">
        <Loader2 className="animate-spin text-[#155dfc]" />
      </div>
    ) : (
      /* DB에서 불러온 패키지 리스트를 출력 (생략 없이 전체 유지) */
      pointPackages.map((pkg) => (
        <button
          key={pkg.id}
          onClick={() => setSelectedPkg(pkg.id)}
          className={`p-6 rounded-[28px] cursor-pointer border-2 text-left transition-all relative overflow-hidden active:scale-[0.98] ${
            selectedPkg === pkg.id 
            ? 'border-[#155dfc] bg-[#158dfc]/5 shadow-sm shadow-[#155dfc]/10' 
            : 'border-gray-100 hover:border-gray-200 bg-white'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[22px] font-black ${selectedPkg === pkg.id ? 'text-[#155dfc]' : 'text-gray-900'}`}>
              {/* 포인트 수량 (콤마 추가) */}
              {pkg.points?.toLocaleString()} <span className="text-[14px] font-bold">P</span>
            </span>
            {selectedPkg === pkg.id && (
              <div className="text-[#155dfc]">
                <CheckCircle2 size={24} fill="currentColor" className="text-white" />
              </div>
            )}
          </div>
          
          {/* 결제 금액 (콤마 추가) */}
          <p className="text-[17px] text-gray-600 font-bold">
            {pkg.price?.toLocaleString()}원
          </p>
          
          {/* 보너스 포인트가 있을 경우 표시 */}
          {pkg.bonus > 0 && (
            <span className="mt-4 inline-flex items-center gap-1 bg-[#FF6467] text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
              <Zap size={10} fill="currentColor" />
              +{pkg.bonus.toLocaleString()} P Bonus
            </span>
          )}
        </button>
      ))
    )}
  </div>
</section>

          {/* Section: Payment Method */}
          <section className="mb-12">
            <h3 className="text-[13px] font-black text-gray-400 mb-5 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-3 bg-gray-200 rounded-full inline-block" />
              02. 결제 수단 (신용카드 전용)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: <CreditCard size={22} />, label: '신용카드', active: true },
                { icon: <Building2 size={22} />, label: '계좌이체', active: false },
              ].map((method, idx) => (
                <button 
                  key={idx} 
                  disabled={!method.active}
                  className={`flex flex-col items-center justify-center p-6 border rounded-[24px] transition-all relative ${
                    method.active 
                    ? 'border-[#155dfc] bg-[#155dfc]/5 text-[#155dfc] cursor-pointer ring-1 ring-[#155dfc]/20' 
                    : 'border-gray-50 bg-gray-50/50 text-gray-300 grayscale opacity-60 cursor-not-allowed'
                  }`}
                >
                  {!method.active && (
                    <span className="absolute top-2 right-2 text-[8px] font-black bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-md">
                      준비중
                    </span>
                  )}
                  <span className="mb-3">{method.icon}</span>
                  <span className="text-[14px] font-black">{method.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Section: Summary & Checkout */}
          <div className="bg-[#f8f9fa] rounded-[32px] p-8 border border-gray-100 mb-8 space-y-4">
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-gray-500 font-bold">충전 포인트</span>
              <span className="text-gray-900 font-black text-[18px]">{currentPkg.points.toLocaleString()} P</span>
            </div>
            {currentPkg.bonus > 0 && (
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-gray-500 font-bold">보너스 포인트</span>
                <span className="text-[#FF6467] font-black text-[18px]">+{currentPkg.bonus.toLocaleString()} P</span>
              </div>
            )}
            <div className="h-[1px] bg-gray-200/50 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-black">총 결제 금액</span>
              <span className="text-[32px] font-black text-[#155dfc] tracking-tighter">
                {currentPkg.price.toLocaleString()}원
              </span>
            </div>
          </div>


          {/* 결제 동의 체크박스 영역 */}
          <div className="mb-6 px-4 py-6 bg-gray-50 rounded-[24px] border border-gray-100">
            <div className="mb-6 space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#155dfc] rounded-full mt-1.5 shrink-0" />
                <p className="text-[13px] font-bold text-gray-700">충전된 포인트의 유효기간은 결제일로부터 <span className="text-[#155dfc]">1년</span>입니다.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#155dfc] rounded-full mt-1.5 shrink-0" />
                <p className="text-[13px] font-bold text-gray-700">포인트 환불은 결제하신 수단(<span className="text-[#155dfc]">신용카드</span>)을 통해서만 가능합니다.</p>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center mt-0.5">
                <input 
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-[#155dfc] checked:border-[#155dfc] transition-all cursor-pointer"
                />
                <svg 
                  className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth="4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors">주문 내용 및 포인트 이용 정책을 확인하였으며, 결제에 동의합니다.</p>
                <p className="text-[12px] text-gray-400 font-medium leading-relaxed mt-1">
                  구매하신 포인트는 디지털 상품의 특성상 사용 즉시 환불이 제한될 수 있음을 확인하였으며, 서비스 이용약관 및 개인정보 처리방침에 따라 결제를 진행합니다.
                </p>
              </div>
            </label>
          </div>
          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-6 rounded-[24px] font-black text-[19px] transition-all shadow-xl shadow-[#155dfc]/20 active:scale-95 flex items-center justify-center gap-2 ${
              isProcessing 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
              : 'bg-[#155dfc] hover:bg-[#158dfc] text-white cursor-pointer'
            }`}
          >
            {isProcessing ? '처리 중...' : '포인트 충전하기'}
            {!isProcessing && <Zap size={20} fill="currentColor" />}
          </button>

          <div className="mt-8 text-[12px] text-gray-400 leading-[1.8] font-medium ">
            <p>결제 완료 시 즉시 포인트가 충전되며, 충전 내역은 마이페이지에서 확인 가능합니다.</p>
            <p>결제 과정에서 문제가 발생할 경우 고객센터로 문의해 주시기 바랍니다.</p>
            <p>- 모든거래에 대한 책임과 환불, 민원등은 ㈜두고에서진행합니다.</p>
            <br />
            <p>- 민원담당자 : 문원오</p>
            <p>- 연락처 : 070-7174-2186</p>
          </div>
        </div>
      </div>
    
  );
}
