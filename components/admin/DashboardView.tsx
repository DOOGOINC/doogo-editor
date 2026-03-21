'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Users, UserPlus, CreditCard } from 'lucide-react';

// 1. [해결] props 타입 인터페이스 정의
interface DashboardViewProps {
  users: any[]; // MiniAdmin에서 넘겨주는 users 배열을 받습니다.
  payments: any[]; // 결제 내역 데이터를 추가로 받습니다.
  visits: any[]; // 방문자 유입 데이터를 추가로 받습니다.
}

// 2. [해결] 컴포넌트에 props 타입 적용
export const DashboardView = ({ users, payments, visits }: DashboardViewProps) => {
  const [range, setRange] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  // 실제 데이터를 기반으로 차트 데이터 생성
  const dashboardData = useMemo(() => {
    const today = new Date();
    
    // 1. 일간 데이터 (최근 9일)
    const weeklyLabels = Array.from({ length: 9 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (8 - i));
      return d.toISOString().split('T')[0].replace(/-/g, '.');
    });

    const weeklyJoiner = weeklyLabels.map(label => 
      users.filter(u => u.created_at && new Date(u.created_at).toISOString().split('T')[0].replace(/-/g, '.') === label).length
    );

    const weeklySales = weeklyLabels.map(label => 
      payments.filter(p => p.created_at && new Date(p.created_at).toISOString().split('T')[0].replace(/-/g, '.') === label && p.status === 'PAID').length
    );

    const weeklyVisitor = weeklyLabels.map(label => {
      const dailyVisits = visits.filter(v => v.created_at && new Date(v.created_at).toISOString().split('T')[0].replace(/-/g, '.') === label);
      // 고유 visitor_id의 개수만 추출 (중복 방문 제거)
      return new Set(dailyVisits.map(v => v.visitor_id)).size;
    });

    // 2. 월간 데이터 (최근 6개월)
    const monthlyLabels = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(today.getMonth() - (5 - i));
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
    });

    const monthlyJoiner = monthlyLabels.map(label => 
      users.filter(u => {
        const d = new Date(u.created_at);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}` === label;
      }).length
    );

    const monthlySales = monthlyLabels.map(label => {
      return payments.filter(p => {
        const d = new Date(p.created_at);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}` === label && p.status === 'PAID';
      }).length;
    });

    const monthlyVisitor = monthlyLabels.map(label => {
      const monthlyVisits = visits.filter(v => {
        const d = new Date(v.created_at);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}` === label;
      });
      return new Set(monthlyVisits.map(v => v.visitor_id)).size;
    });

    // 3. 연간 데이터 (최근 3년)
    const yearlyLabels = ['2024년', '2025년', '2026년'];
    const yearlyJoiner = yearlyLabels.map(label => 
      users.filter(u => `${new Date(u.created_at).getFullYear()}년` === label).length
    );
    const yearlySales = yearlyLabels.map(label => 
      payments.filter(p => `${new Date(p.created_at).getFullYear()}년` === label && p.status === 'PAID').length
    );
    const yearlyVisitor = yearlyLabels.map(label => {
      const yearlyVisits = visits.filter(v => `${new Date(v.created_at).getFullYear()}년` === label);
      return new Set(yearlyVisits.map(v => v.visitor_id)).size;
    });

    return {
      weekly: { labels: weeklyLabels, visitor: weeklyVisitor, joiner: weeklyJoiner, sales: weeklySales },
      monthly: { labels: monthlyLabels, visitor: monthlyVisitor, joiner: monthlyJoiner, sales: monthlySales },
      yearly: { labels: yearlyLabels, visitor: yearlyVisitor, joiner: yearlyJoiner, sales: yearlySales },
    };
  }, [users, payments, visits]);

  const current = dashboardData[range];
  // visitor가 0일 경우 maxVal이 0이 되어 나누기 오류가 발생하는 것을 방지
  const maxVal = Math.max(...current.visitor, ...current.joiner, ...current.sales, 1);

  return (
    <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm w-full font-pretendard">
      {/* 헤더 및 탭 섹션 */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-50 rounded-2xl text-[#155dfc]">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-[28px] font-black text-gray-900 tracking-tighter">비즈니스 성장 분석</h3>
          </div>
          <p className="text-[14px] text-gray-400 font-bold ml-16">{new Date().getFullYear()}년 실시간 서비스 성장 지표</p>
        </div>
        
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 ml-16 xl:ml-0 shadow-inner">
          {(['weekly', 'monthly', 'yearly'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setRange(tab)}
              className={`px-10 py-3 rounded-xl text-[13px] font-black transition-all ${
                range === tab ? 'bg-white shadow-lg text-[#155dfc] scale-105' : 'text-gray-400'
              }`}
            >
              {tab === 'weekly' ? '일간' : tab === 'monthly' ? '월간' : '연간'}
            </button>
          ))}
        </div>
      </div>

      {/* 범례 */}
      <div className="flex gap-10 mb-12 px-6 font-bold text-gray-400 text-[13px]">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-100"/> 고유 방문자</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-200"/> 신규 가입자</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#155dfc]"/> 최종 결제건</div>
      </div>

      {/* 대형 차트 본체 */}
      <div className="relative h-[420px] w-full flex items-end justify-between gap-4 sm:gap-10 px-6 border-b-2 border-gray-50 pb-12">
        {current.labels.map((label, i) => {
          const vH = (current.visitor[i] / maxVal) * 100;
          const jH = (current.joiner[i] / maxVal) * 100;
          const sH = (current.sales[i] / maxVal) * 100;

          return (
            <div key={`${range}-${i}`} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              <div className="w-full max-w-[64px] bg-gray-300/80 rounded-t-2xl transition-all duration-500 group-hover:bg-gray-400" style={{ height: `${vH}%` }} />
              <div className="w-full max-w-[64px] bg-blue-300/80 rounded-t-xl absolute bottom-12" style={{ height: `${jH}%` }} />
              <div className="w-full max-w-[64px] bg-[#155dfc] rounded-t-xl absolute bottom-12 shadow-[0_-4px_20px_rgba(21,93,252,0.15)] transition-all duration-1000" style={{ height: `${sH}%` }}>
                {/* 툴팁 */}
                <div className="absolute -top-80 left-1/2 -translate-x-1/2 bg-gray-900 text-white p-5 rounded-[1.8rem] opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-30 shadow-2xl scale-110 border border-white/10">
                  <p className="text-[11px] text-blue-400 font-black mb-1">{label}</p>
                  <p className="text-[13px] font-bold text-white">방문: {current.visitor[i].toLocaleString()}명</p>
                  <p className="text-[13px] font-bold text-blue-200">가입: {current.joiner[i].toLocaleString()}명</p>
                  <p className="text-[13px] font-bold text-[#155dfc]">결제: {current.sales[i].toLocaleString()}건</p>
                </div>
              </div>
              <span className="absolute -bottom-12 text-[11px] font-black text-gray-300 group-hover:text-gray-900 transition-colors whitespace-nowrap">{label}</span>
            </div>
          );
        })}
      </div>

      {/* 하단 요약 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-28">
        {[
          { icon: <Users size={24}/>, label: '누적 방문자 수', val: new Set(visits.map(v => v.visitor_id)).size, unit: '명', color: 'text-gray-400', bg: 'bg-gray-50' },
          { icon: <UserPlus size={24}/>, label: '누적 가입 유저', val: users.length, unit: '명', color: 'text-blue-500', bg: 'bg-blue-50' },
          { icon: <CreditCard size={24}/>, label: '누적 결제 건수', val: payments.filter(p => p.status === 'PAID').length, unit: '건', color: 'text-white', bg: 'bg-[#155dfc]' }
        ].map((item, i) => (
          <div key={i} className={`${item.bg === 'bg-[#155dfc]' ? 'bg-[#155dfc] text-white shadow-2xl' : `${item.bg} border border-gray-100`} p-10 rounded-[2.8rem] flex items-center gap-7]`}>
            <div className={`w-16 h-16 rounded-[1.4rem] flex items-center justify-center ${item.bg === 'bg-[#155dfc]' ? 'bg-white/20' : 'bg-white'} ${item.color}`}>
              {item.icon}
            </div>
            <div>
              <p className={`text-[12px] font-black tracking-widest ${item.bg === 'bg-[#155dfc]' ? 'text-white/60' : 'text-gray-400'}`}>{item.label}</p>
              <p className="text-[30px] font-black mt-1">{item.val.toLocaleString()}<span className="text-[16px] ml-1 opacity-60">{item.unit}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};