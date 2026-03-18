'use client';

import React, { useState } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface PaymentTableProps {
  payments: any[];
  loading: boolean;
}

export const PaymentTable = ({ payments, loading }: PaymentTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. CSV 다운로드 함수 수정
  const downloadCSV = () => {
    if (payments.length === 0) return;

    // 헤더 정의 (10개 컬럼)
    const headers = ["결제일시", "주문번호", "이름", "이메일", "연락처", "상품명", "충전포인트", "보너스", "실결제금액", "상태"];
    
    // 데이터 행 생성 (헤더 순서와 1:1 대응 확인)
    const rows = payments.map(pay => [
      `"${new Date(pay.created_at).toLocaleString('ko-KR')}"`, // 날짜 쉼표 방지 따옴표
      `"${pay.payment_id}"`,
      `"${pay.profiles?.full_name || '-'}"`,
      `"${pay.profiles?.email || '-'}"`,
      `"${pay.profiles?.phone || '-'}"`,
      `"${pay.order_name}"`,
      pay.points || 0,
      pay.bonus || 0,
      pay.amount || 0,
      pay.status === 'PAID' ? "완료" : "실패" // 상태값 확인
    ]);

    // CSV 변환
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    // 다운로드 실행 (BOM 추가로 한글 깨짐 방지)
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `결제내역_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. 페이지네이션 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = payments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(payments.length / itemsPerPage);

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center bg-white border border-gray-200 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#155dfc]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 상단 툴바: 엑셀 다운로드 버튼 */}
      <div className="flex justify-end">
        <button 
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-[#1d6f42] hover:bg-[#165a35] text-white rounded-md text-[13px] font-bold transition-colors shadow-sm"
        >
          <Download size={16} />
          엑셀(CSV) 다운로드
        </button>
      </div>

      <div className="w-full overflow-hidden border border-gray-300 rounded-sm shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1500px] text-[13px]">
            <thead>
              <tr className="bg-[#f2f2f2] border-b border-gray-300 text-gray-700">
                <th className="px-4 py-2 border-r border-gray-300 font-bold w-[160px]">결제일시</th>
                <th className="px-4 py-2 border-r border-gray-300 font-bold w-[200px]">주문번호</th>
                <th className="px-4 py-2 border-r border-gray-300 font-bold">이름</th>
                <th className="px-4 py-2 border-r border-gray-300 font-bold">이메일</th>
                <th className="px-4 py-2 border-r border-gray-300 font-bold w-[130px]">연락처</th>
                <th className="px-4 py-2 border-r border-gray-300 font-bold">상품명</th>
                <th className="px-4 py-2 border-r border-gray-300 font-bold text-right w-[100px]">충전 포인트</th>
                <th className="px-4 py-2 border-r border-gray-300 font-bold text-right w-[100px]">보너스</th>
                <th className="px-4 py-2 border-r border-gray-300 font-bold text-right w-[120px]">실 결제금액</th>
                <th className="px-4 py-2 border-r border-gray-300 font-bold text-center w-[80px]">상태</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-gray-400">내역이 없습니다.</td>
                </tr>
              ) : (
                currentItems.map((pay) => (
                  <tr key={pay.id} className="hover:bg-blue-50/30 border-b border-gray-200">
                    <td className="px-4 py-3 border-r border-gray-200 text-gray-600">
                      {new Date(pay.created_at).toLocaleString('ko-KR')}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200 font-mono text-[11px] text-gray-400">{pay.payment_id}</td>
                    <td className="px-4 py-3 border-r border-gray-200 font-bold">{pay.profiles?.full_name || '-'}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{pay.profiles?.email || '-'}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{pay.profiles?.phone || '-'}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{pay.order_name}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-right font-bold text-[#155dfc]">{(pay.points || 0).toLocaleString()} P</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-right font-bold text-[#FF6467]">+{(pay.bonus || 0).toLocaleString()} P</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-right font-black bg-gray-50/30">{pay.amount?.toLocaleString()}원</td>
                    <td className="px-4 py-3 text-center font-bold">
                      {pay.status === 'PAID' ? <span className="text-blue-600">완료</span> : <span className="text-red-500">실패</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 컨트롤 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 rounded-md disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-[14px] font-medium text-gray-600">
            {currentPage} / {totalPages} 페이지
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-300 rounded-md disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};