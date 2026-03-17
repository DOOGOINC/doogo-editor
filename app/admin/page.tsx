'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Search, Users, CreditCard, FileText } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

import { Sidebar, AdminView } from '@/components/admin/Sidebar';
import { StatsCard } from '@/components/admin/StatsCard';
import { UserTable } from '@/components/admin/UserTable';
import { DashboardView } from '@/components/admin/DashboardView';


export default function MiniAdmin() {
  const router = useRouter();
  const [view, setView] = useState<AdminView>('dashboard'); 
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [projectCount, setProjectCount] = useState(0); 
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async (query: string = '', currentView: AdminView) => {
    setLoading(true);
    const limitCount = currentView === 'dashboard' ? 5 : 50;
  
    try {
      let supabaseQuery = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false }); 
  
      if (query) {
        supabaseQuery = supabaseQuery.ilike('nickname', `%${query}%`);
      }
  
      const { data: userData, error: userError } = await supabaseQuery.limit(limitCount);
      if (userError) throw userError;
      
      setUsers([...(userData || [])]); 

      const { count, error: projectError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
      
      if (!projectError) setProjectCount(count || 0);

    } catch (error) {
      console.error("로드 에러:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(searchQuery, view); 
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, view, fetchData]);

  const handleLogout = async () => {
    if (confirm('로그아웃 하시습니까?')) {
      const { error } = await supabase.auth.signOut();
      if (!error) router.push('/login');
    }
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#f8f9fa] font-pretendard">
        <Sidebar onLogout={handleLogout} currentView={view} setView={setView} />

        <main className="flex-1 p-6 lg:p-12 space-y-8 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-[26px] font-black text-[#333] tracking-tight">
              {view === 'dashboard' ? '대시보드' : '유저 관리'}
            </h1>
            
            {/* 유저 관리 탭에서만 검색바 노출 */}
            {view === 'users' && (
              <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-gray-100 shadow-sm w-full sm:w-72 focus-within:border-[#155dfc]/30 transition-all animate-in fade-in slide-in-from-right-4 duration-300">
                <Search size={16} className="text-gray-300" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="유저 검색..." 
                  className="bg-transparent border-none outline-none text-[14px] w-full font-medium placeholder:text-gray-300" 
                />
              </div>
            )}
          </div>

          {/* 1. 대시보드 뷰일 때 상단 통계 + 그래프 노출 */}
          {view === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">

              
              <DashboardView users={users} />
            </div>
          )}

          {/* 3. 공통 유저 테이블 섹션 */}
          <div className="animate-in slide-in-from-bottom-4 duration-500 pt-4">
            <h2 className="text-[18px] font-black text-gray-900 mb-6">
              {view === 'dashboard' ? '최근 가입 유저' : '유저 리스트'}
            </h2>
            <UserTable 
              users={users} 
              loading={loading} 
              view={view}
              onRefresh={() => fetchData(searchQuery, view)} 
            />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}