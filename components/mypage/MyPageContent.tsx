'use client';

import React from 'react';
import { ShoppingBag, Zap, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function MyPageContent({ user, payments, pointLogs, activeTab, setActiveTab }: any) {
  // 1. 홈 요약 보기
  if (activeTab === 'home') {
    return (
      <div className="md:col-span-2 space-y-8">
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 animate-in fade-in duration-300 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#155dfc]/5 rounded-full group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10">
            <p className="text-[14px] text-gray-400 mb-2 font-bold uppercase tracking-wider">보유 포인트</p>
            <h3 className="text-[36px] font-black text-gray-900 flex items-baseline gap-1">
              {user.points.toLocaleString()} <span className="text-[18px] font-bold text-gray-400">P</span>
            </h3>
            <div className="flex gap-4 mt-2 text-[12px] text-gray-400 font-medium">
              <p>유효기간: <span className="text-gray-900 font-bold">결제일로부터 1년</span></p>
              <p>환불: <span className="text-gray-900 font-bold">결제수단으로만 가능</span></p>
            </div>
          </div>
          <Link 
            href="/purchase"
            className="bg-[#155dfc] text-white px-8 py-4 rounded-xl font-black text-[15px] hover:bg-[#158dfc] transition-all shadow-lg shadow-[#155dfc]/20 active:scale-95 text-center relative z-10"
          >
            포인트 충전하기
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* 최근 포인트 내역 요약 */}
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h4 className="text-[16px] font-bold text-gray-900 flex items-center gap-2">
                <Zap size={18} className="text-[#155dfc]" fill="currentColor" />
                최근 포인트 이용 내역
              </h4>
              <button onClick={() => setActiveTab('points')} className="text-[12px] font-bold text-gray-400 hover:text-[#155dfc] transition-colors cursor-pointer">
                더보기 &gt;
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {pointLogs.slice(0, 3).map((log: any, idx: number) => (
                <div key={idx} className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-bold text-gray-900 mb-1">{log.description}</p>
                    <p className="text-[12px] text-gray-400 font-medium">{new Date(log.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[14px] font-black ${log.amount > 0 ? 'text-[#155dfc]' : 'text-[#FF6467]'}`}>
                      {log.amount > 0 ? '+' : ''}{log.amount.toLocaleString()} P
                    </p>
                  </div>
                </div>
              ))}
              {pointLogs.length === 0 && (
                <div className="p-10 text-center text-gray-400 text-[13px] font-medium">내역이 없습니다.</div>
              )}
            </div>
          </div>

          {/* 최근 구매 내역 요약 */}
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h4 className="text-[16px] font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag size={18} className="text-gray-400" />
                최근 구매 내역
              </h4>
              <button onClick={() => setActiveTab('payments')} className="text-[12px] font-bold text-gray-400 hover:text-[#155dfc] transition-colors cursor-pointer">
                더보기 &gt;
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {payments.slice(0, 3).map((payment: any, idx: number) => (
                <div key={idx} className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-bold text-gray-900 mb-1">{payment.order_name}</p>
                    <p className="text-[12px] text-gray-400 font-medium">{new Date(payment.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-black text-[#155dfc]">{payment.amount?.toLocaleString()}원</p>
                  </div>
                </div>
              ))}
              {payments.length === 0 && (
                <div className="p-10 text-center text-gray-400 text-[13px] font-medium">내역이 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. 구매 내역 탭
  if (activeTab === 'payments') {
    return (
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h4 className="text-[16px] font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag size={18} className="text-gray-400" />
              전체 구매 내역
            </h4>
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
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md uppercase bg-[#155dfc]/10 text-[#155dfc]">
                      결제완료
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center">
              <ShoppingBag size={28} className="text-gray-100 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">구매 내역이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. 포인트 이용 내역 탭
  if (activeTab === 'points') {
    return (
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h4 className="text-[16px] font-bold text-gray-900 flex items-center gap-2">
              <Zap size={18} className="text-[#155dfc]" fill="currentColor" />
              전체 포인트 이용 내역
            </h4>
          </div>
          {pointLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">일시</th>
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">상품/항목</th>
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">변동 포인트</th>
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">잔여 포인트</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pointLogs.map((log: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap text-[13px] text-gray-500 font-medium">
                        {new Date(log.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-[14px] font-bold text-gray-900">{log.description}</p>
                      </td>
                      <td className="px-6 py-5 text-right font-black text-[14px]">
                        <span className={log.amount > 0 ? 'text-[#155dfc]' : 'text-[#FF6467]'}>
                          {log.amount > 0 ? '+' : ''}{log.amount.toLocaleString()} P
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right font-black text-[14px] text-gray-900">
                        {log.balance?.toLocaleString()} P
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center">
              <Zap size={28} className="text-gray-100 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">이용 내역이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}