'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function MyPageContent({ user, payments, isViewAll, setIsViewAll }: any) {
  return (
    <div className="md:col-span-2 space-y-6">
      {/* 포인트 카드: 홈(isViewAll=false)일 때만 표시 */}
      {!isViewAll && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 animate-in fade-in duration-300">
          <div>
            <p className="text-[14px] text-gray-400 mb-2 font-bold uppercase tracking-wider">보유 포인트</p>
            <h3 className="text-[36px] font-black text-gray-900 flex items-baseline gap-1">
              {user.points.toLocaleString()} <span className="text-[18px] font-bold text-gray-400">P</span>
            </h3>
          </div>
          <Link 
            href="/purchase"
            className="bg-[#155dfc] text-white px-8 py-4 rounded-xl font-black text-[15px] hover:bg-[#158dfc] transition-all shadow-lg shadow-[#155dfc]/20 active:scale-95 text-center"
          >
            포인트 충전하기
          </Link>
        </div>
      )}

      {/* 결제 내역 영역 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h4 className="text-[16px] font-bold text-gray-900">
            {isViewAll ? '전체 구매 내역' : '최근 구매 내역'}
          </h4>
          {!isViewAll && (
            <button 
              onClick={() => setIsViewAll(true)} 
              className="text-[12px] font-bold text-gray-400 hover:text-[#155dfc] transition-colors cursor-pointer bg-none border-none p-0"
            >
              전체보기 &gt;
            </button>
          )}
        </div>
        
        {payments.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {payments.map((payment: any, idx: number) => (
              <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-[#155dfc]/10 group-hover:text-[#155dfc] transition-all">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900 mb-1">{payment.order_name}</p>
                    <p className="text-[12px] text-gray-400 font-medium">
                      {new Date(payment.created_at).toLocaleDateString('ko-KR', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[15px] font-black text-[#155dfc] mb-1">{payment.amount?.toLocaleString()}원</p>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    payment.status === 'PAID' ? 'bg-[#155dfc]/10 text-[#155dfc]' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {payment.status === 'PAID' ? '결제완료' : payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 flex flex-col items-center justify-center min-h-[350px]">
            <ShoppingBag size={28} className="text-gray-200 mb-6" />
            <h4 className="text-[16px] font-bold text-gray-400 mb-2 text-center">구매 내역이 없어요</h4>
          </div>
        )}
      </div>
    </div>
  );
}