'use client';

import React, { useEffect, useState } from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import MyPageContent from '@/components/mypage/MyPageContent';
import { User, ShoppingBag, Settings, LogOut, ChevronRight, Loader2 } from 'lucide-react';

export default function MyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isViewAll, setIsViewAll] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // [수정] 유저가 없으면 로딩을 끄지 않고 바로 페이지 이동
        // 로딩을 끄지 않아야 이동 직전 찰나에 컴포넌트가 null 데이터를 읽지 않습니다.
        if (!user) { 
          router.push('/login'); 
          return; 
        }
  
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
  
        setUserData({
          email: user.email,
          nickname: profile?.nickname || '사용자',
          points: profile?.points || 0,
        });
  
        let query = supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (!isViewAll) query = query.limit(5);
  
        const { data: pData } = await query;
        if (pData) setPayments(pData);
  
        // [기존 유지] 모든 데이터 로드 완료 후 로딩 해제
        setLoading(false);
  
      } catch (error) {
        console.error('Data fetch error:', error);
        // 에러 발생 시에도 안전하게 리다이렉트
        router.push('/login');
      }
      // [중요] finally 블록을 제거하여 return 시 setLoading(false)이 강제 실행되지 않게 함
    };
  
    fetchData();
  }, [router, isViewAll]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 bg-[#f8f9fa] flex flex-col items-center justify-center">
          <Loader2 size={40} className="animate-spin mb-4 text-[#155dfc]" />
          <p className="font-bold text-[14px] text-gray-600">데이터를 가져오고 있어요</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 bg-[#f8f9fa] py-12">
        
        <div className="max-w-[1100px] mx-auto px-6">
          <h1 className="text-[28px] font-bold text-gray-900 mb-8 tracking-tight">마이페이지</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MyPageSidebar 
              user={userData} isViewAll={isViewAll} setIsViewAll={setIsViewAll} 
              onSignOut={() => { supabase.auth.signOut(); router.push('/login'); }} 
            />
            <MyPageContent 
              user={userData} payments={payments} isViewAll={isViewAll} setIsViewAll={setIsViewAll} 
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}