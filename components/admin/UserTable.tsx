import React, { useState } from 'react';
import { User, ShieldCheck, Coins, Ban, X, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface UserTableProps {
  users: any[];
  loading: boolean;
  view: 'dashboard' | 'users' | 'payments' | 'settings';
  onRefresh: () => void; // 데이터 갱신을 위한 콜백
}

export const UserTable = ({ users, loading, view, onRefresh }: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);
  const isDashboard = view === 'dashboard';

  // --- 관리자 기능 함수들 ---
  const handleUpdate = async (userId: string, updates: any) => {
    setUpdating(true);
    try {
      // 1. DB 업데이트 (가입일 보존을 위해 날짜는 updated_at만 갱신)
      const { error } = await supabase
        .from('profiles')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);

      if (error) throw error;

      // 2. 현재 열려있는 팝업 상태 즉시 반영
      setSelectedUser((prev: any) => (prev ? { ...prev, ...updates } : null));
      
      // 3. 부모 리스트 데이터 새로고침
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
    // 벤 기능은 DB에 is_banned 컬럼이 추가된 후 완벽히 동작합니다.
    if (confirm(`정말로 '${user.nickname}' 유저를 벤(영구 정지) 하시겠습니까?`)) {
      alert('벤 기능은 DB에 is_banned 컬럼이 추가된 후 완벽히 동작합니다.');
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col relative">
      {/* 1. 유저 테이블 헤더 */}
      <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-[18px] font-black text-[#333] mb-0.5">
            {isDashboard ? "최근 가입 유저" : "전체 유저 관리"}
          </h2>
          <p className="text-[13px] text-gray-400 font-medium">유저를 클릭하면 상세 관리 메뉴가 나타납니다.</p>
        </div>
      </div>

      {/* 2. 유저 테이블 바디 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/30 text-[11px] font-black text-[#333] uppercase tracking-[0.2em]">
            <tr>
              <th className="px-10 py-5">사용자 정보</th>
              <th className="px-10 py-5">보유 포인트</th>
              <th className="px-10 py-5">권한</th>
              <th className="px-10 py-5">가입일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-[14px]">
            {loading ? (
              <tr><td colSpan={4} className="px-10 py-10 text-center text-gray-400 font-bold">로딩 중...</td></tr>
            ) : (
              users.map((user) => (
                <tr 
                  key={user.id} 
                  onClick={() => !isDashboard && setSelectedUser(user)}
                  className={`transition-all group ${!isDashboard ? 'cursor-pointer hover:bg-[#155dfc]/5' : 'cursor-default'}`}
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-400 group-hover:bg-[#155dfc] group-hover:text-white transition-all shadow-sm">
                        {user.nickname?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user.nickname || '익명'}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{user.email || '이메일 없음'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 font-black text-[#155dfc]">{user.points?.toLocaleString()} P</td>
                  <td className="px-10 py-6">
                    {user.is_admin ? (
                      <span className="text-[11px] font-black bg-orange-100 text-orange-600 px-2 py-1 rounded-md">ADMIN</span>
                    ) : (
                      <span className="text-[11px] font-black bg-gray-100 text-gray-400 px-2 py-1 rounded-md">USER</span>
                    )}
                  </td>
                  <td className="px-10 py-6 text-gray-400 text-[13px]">
                    {user.created_at 
                      ? new Date(user.created_at).toLocaleDateString() 
                      : (user.updated_at ? new Date(user.updated_at).toLocaleDateString() : '-')}
                  </td>
                </tr>
              ))
            )}
            {!loading && users.length === 0 && (
              <tr><td colSpan={4} className="px-10 py-10 text-center text-gray-400 font-bold">데이터가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. 퀵 관리 모달 (유저 클릭 시) */}
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
                {selectedUser.nickname?.[0]}
              </div>
            </div>

            <div className="pt-14 pb-10 px-8 text-center">
              <div className="mb-8">
                <h3 className="text-[22px] font-black text-gray-900">{selectedUser.nickname}</h3>
                {/* UID 대신 이메일을 출력합니다. */}
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