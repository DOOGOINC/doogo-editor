'use client';

import React, { useState } from 'react';
import { CheckCircle2, CreditCard, Smartphone, Building2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';

export default function PurchasePage() {
  const [selectedPkg, setSelectedPkg] = useState(1);

  const pointPackages = [
    { id: 1, points: 10000, price: 11000, bonus: 0 },
    { id: 2, points: 30000, price: 33000, bonus: 1500 },
    { id: 3, points: 50000, price: 55000, bonus: 3000 },
    { id: 4, points: 100000, price: 110000, bonus: 8000 },
  ];

  const currentPkg = pointPackages.find(p => p.id === selectedPkg)!;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-[700px] mx-auto px-6">
          {/* Back Link */}
          <Link href="/mypage" className="flex items-center gap-1 text-gray-400 hover:text-gray-600 mb-6 transition-all">
            <ChevronLeft size={20} />
            <span className="text-[14px] font-bold">마이페이지로</span>
          </Link>

          <h1 className="text-[32px] font-bold text-gray-900 mb-2">포인트 충전</h1>
          <p className="text-gray-400 mb-12 text-[15px]">충전한 포인트는 모든 서비스에서 자유롭게 사용 가능합니다.</p>

          {/* Section: Points Selection */}
          <section className="mb-12">
            <h3 className="text-[14px] font-black text-gray-400 mb-4 uppercase tracking-widest">충전 금액 선택</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pointPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg.id)}
                  className={`p-6 rounded-2xl cursor-pointer border-2 text-left transition-all relative overflow-hidden active:scale-[0.98] ${
                    selectedPkg === pkg.id 
                    ? 'border-[#155dfc] bg-[#158dfc]/5 shadow-sm' 
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[20px] font-black text-gray-900">
                      {pkg.points.toLocaleString()} <span className="text-[14px] font-bold">P</span>
                    </span>
                    {selectedPkg === pkg.id && (
                      <div className="text-[#155dfc] absolute top-6 right-6">
                        <CheckCircle2 size={24} fill="#158dfc" className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-[16px] text-gray-600 font-bold">{pkg.price.toLocaleString()}원</p>
                  {pkg.bonus > 0 && (
                    <span className="mt-3 inline-block bg-[#FF6467] text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                      +{pkg.bonus.toLocaleString()} P Bonus
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Section: Payment Method */}
          <section className="mb-12">
            <h3 className="text-[14px] font-black text-gray-400 mb-4 uppercase tracking-widest">결제 수단</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <CreditCard size={22} />, label: '신용카드' },
                { icon: <Smartphone size={22} />, label: '간편결제' },
                { icon: <Building2 size={22} />, label: '계좌이체' },
              ].map((method, idx) => (
                <button key={idx} className="flex flex-col items-center justify-center p-6 border border-gray-100 rounded-2xl hover:border-[#155dfc] hover:bg-[#155dfc]/5 hover:text-[#155dfc] transition-all group cursor-pointer">
                  <span className="mb-2 text-gray-300 group-hover:text-[#155dfc] transition-colors">{method.icon}</span>
                  <span className="text-[13px] font-bold group-hover:text-gray-900">{method.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Section: Summary & Checkout */}
          <div className="bg-[#f8f9fa] rounded-2xl p-8 border border-gray-100 mb-8 space-y-4">
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-gray-500 font-medium">충전 포인트</span>
              <span className="text-gray-900 font-bold">{currentPkg.points.toLocaleString()} P</span>
            </div>
            {currentPkg.bonus > 0 && (
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-gray-500 font-medium">보너스 포인트</span>
                <span className="text-[#FF6467] font-bold">+{currentPkg.bonus.toLocaleString()} P</span>
              </div>
            )}
            <div className="h-[1px] bg-gray-200 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-bold">총 결제 금액</span>
              <span className="text-[26px] font-black text-[#155dfc]">
                {currentPkg.price.toLocaleString()}원
              </span>
            </div>
          </div>

          <button className="w-full py-5 bg-[#155dfc] text-white rounded-2xl font-black text-[18px] cursor-pointer hover:bg-[#158dfc] transition-all shadow-xl shadow-[#155dfc]/20 active:scale-95">
            충전하기
          </button>

          <p className="mt-6 text-[12px] text-gray-400 text-center leading-relaxed">
            결제 완료 시 포인트는 즉시 충전되며,<br />
            충전된 포인트는 상품 구매 시 사용 가능합니다.
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
