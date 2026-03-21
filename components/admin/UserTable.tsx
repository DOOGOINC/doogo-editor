'use client';

import React, { useState } from 'react';
import { User, ShieldCheck, Coins, Ban, X, Check, Download, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface UserTableProps {
  users: any[];
  loading: boolean;
  view: 'dashboard' | 'users' | 'payments' | 'settings';
  onRefresh: () => void;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (order: 'asc' | 'desc') => void;
}

export const UserTable = ({ users, loading, view, onRefresh, sortOrder, onSortChange }: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const isDashboard = view === 'dashboard';

  // 1. CSV 다운로드 함수
  const downloadCSV = () => {
    if (users.length === 0) return;

    const headers = ["가입일", "이름", "닉네임", "이메일", "연락처", "보유포인트", "권한"];
    const rows = users.map(user => [
      `"${new Date(user.created_at).toLocaleString('ko-KR')}"`,
      `"${user.full_name || '-'}"`,
      `"${user.nickname || '-'}"`,
      `"${user.email || '-'}"`,
      `"${user.phone || '-'}"`,
      user.points || 0,
      user.is_admin ? "관리자" : "일반"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `유저목록_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. 페이지네이션 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // --- 관리자 기능 함수들 ---
  const handleUpdate = async (userId: string, updates: any) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);

      if (error) throw error;
      setSelectedUser((prev: any) => (prev ? { ...prev, ...updates } : null));
      if (onRefresh) onRefresh();
      alert('성공적으로 변경되었습니다.');
    } catch (error: any) {
      alert('수정 실패: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const toggleAdmin = (user: any) => {
    if (confirm(`'${user.nickname}' 유저를 ${user.is_admin ? '일반 유저' : '관리자'}로 변경하시겠습니까?`)) {
      handleUpdate(user.id, { is_admin: !user.is_admin });
    }
  };

  const adjustPoints = (user: any) => {
    const amount = prompt(`'${user.nickname}' 유저의 새로운 포인트를 입력하세요.`, user.points);
    if (amount !== null && !isNaN(parseInt(amount))) {
      handleUpdate(user.id, { points: parseInt(amount) });
    }
  };

  const banUser = (user: any) => {
    if (confirm(`정말로 '${user.nickname}' 유저를 벤(영구 정지) 하시겠습니까?`)) {
      alert('벤 기능은 DB에 is_banned 컬럼이 추가된 후 완벽히 동작합니다.');
    }
  };

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center bg-white border border-gray-200 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#155dfc]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 상단 툴바: 엑셀 다운로드 버튼 (대시보드 제외) */}
      {!isDashboard && (
        <div className="flex justify-end">
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#1d6f42] hover:bg-[#165a35] text-white rounded-md text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Download size={16} />
            유저 목록 CSV 다운로드
          </button>
        </div>
      )}

      {/* 유저 테이블 본체 */}
      <div className="w-full overflow-hidden border border-gray-300 rounded-sm shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px] text-[13px]">
            <thead>
              <tr className="bg-[#f2f2f2] border-b border-gray-300 text-gray-700">
                <th 
                  className="px-4 py-2 border-r border-gray-300 font-bold w-[160px] cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => onSortChange?.(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  <div className="flex items-center gap-2">
                    가입일
                    {sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </th>
                <th className="px-4 py-2 border-r border-gray-300 font-bold">이름</th>
                <th className="px-4 py-2 border-r border-gray-300 font-bold">닉네임</th>
                <th className="px-4 py-2 border-r border-gray-300 font-bold">이메일</th>
                <th className="px-4 py-2 border-r border-gray-300 font-bold w-[140px]">연락처</th>
                <th className="px-4 py-2 border-r border-gray-300 font-bold text-right w-[120px]">보유 포인트</th>
                <th className="px-4 py-2 border-r border-gray-300 font-bold text-center w-[100px]">권한</th>
                {!isDashboard && <th className="px-4 py-2 font-bold text-center w-[80px]">관리</th>}
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={isDashboard ? 7 : 8} className="px-4 py-10 text-center text-gray-400">유저 데이터가 없습니다.</td>
                </tr>
              ) : (
                currentItems.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-blue-50/30 border-b border-gray-200 transition-colors"
                  >
                    <td className="px-4 py-3 border-r border-gray-200 text-gray-500">
                      {user.created_at ? new Date(user.created_at).toLocaleString('ko-KR') : '-'}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200 font-bold text-gray-900">{user.full_name || '-'}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-gray-700">{user.nickname || '-'}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-gray-600">{user.email || '-'}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-gray-600">{user.phone || '-'}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-right font-black text-[#155dfc]">
                      {(user.points || 0).toLocaleString()} P
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">
                      {user.is_admin ? (
                        <span className="text-[11px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded">ADMIN</span>
                      ) : (
                        <span className="text-[11px] font-black bg-gray-100 text-gray-400 px-2 py-0.5 rounded">USER</span>
                      )}
                    </td>
                    {!isDashboard && (
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-[#155dfc] cursor-pointer"
                        >
                          <X size={16} className="rotate-45" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 컨트롤 */}
      {!isDashboard && totalPages > 1 && (
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

      {/* 3. 퀵 관리 모달 (유저 관리 버튼 클릭 시) */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => !updating && setSelectedUser(null)} 
          />

          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="relative h-32 bg-gradient-to-br from-[#155dfc] to-[#0d47c4] flex items-center justify-center">
              <button 
                onClick={() => setSelectedUser(null)} 
                disabled={updating}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
              >
                <X size={20} />
              </button>
              
              <div className="absolute -bottom-10 w-20 h-20 bg-white rounded-[2rem] shadow-lg flex items-center justify-center text-[28px] font-black text-[#155dfc] border-4 border-white">
                {selectedUser.nickname?.[0] || 'U'}
              </div>
            </div>

            <div className="pt-14 pb-10 px-8 text-center">
              <div className="mb-8">
                <h3 className="text-[22px] font-black text-gray-900">{selectedUser.nickname || selectedUser.full_name}</h3>
                <p className="text-[13px] text-gray-400 font-medium">
                  {selectedUser.email || '이메일 정보 없음'}
                </p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => toggleAdmin(selectedUser)}
                  disabled={updating}
                  className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-[#155dfc]/5 rounded-2xl border border-transparent hover:border-[#155dfc]/20 transition-all group disabled:opacity-50"
                >
                  <div className="p-2.5 bg-white text-orange-500 rounded-xl shadow-sm"><ShieldCheck size={18} /></div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-[14px] text-gray-800">관리자 권한 변경</p>
                    <p className="text-[11px] text-gray-400">현재: {selectedUser.is_admin ? '관리자' : '일반'}</p>
                  </div>
                </button>

                <button 
                  onClick={() => adjustPoints(selectedUser)}
                  disabled={updating}
                  className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-[#155dfc]/5 rounded-2xl border border-transparent hover:border-[#155dfc]/20 transition-all group disabled:opacity-50"
                >
                  <div className="p-2.5 bg-white text-[#155dfc] rounded-xl shadow-sm"><Coins size={18} /></div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-[14px] text-gray-800">포인트 수정</p>
                    <p className="text-[11px] text-gray-400">현재: {selectedUser.points?.toLocaleString()} P</p>
                  </div>
                </button>

                <div className="pt-2">
                  <button 
                    onClick={() => banUser(selectedUser)}
                    disabled={updating}
                    className="w-full flex items-center gap-4 p-4 bg-red-50 hover:bg-red-100/70 rounded-2xl transition-all group disabled:opacity-50"
                  >
                    <div className="p-2.5 bg-white text-red-600 rounded-xl shadow-sm"><Ban size={18} /></div>
                    <div className="text-left flex-1">
                      <p className="font-bold text-[14px] text-red-600">유저 서비스 차단 (BAN)</p>
                      <p className="text-[11px] text-red-400">영구 정지 및 접근 불가</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};