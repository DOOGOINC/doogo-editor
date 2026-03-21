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
  const [activeTab, setActiveTab] = useState<'home' | 'payments' | 'points'>('home');
  const [userData, setUserData] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [pointLogs, setPointLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
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
          id: user.id,
          email: user.email,
          nickname: profile?.nickname || '사용자',
          points: profile?.points || 0,
        });
  
        // 탭에 따라 필요한 데이터만 가져오기 (성능 최적화)
        if (activeTab === 'home' || activeTab === 'payments') {
          let pQuery = supabase
            .from('payments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
          if (activeTab === 'home') pQuery = pQuery.limit(5);
          const { data: pData } = await pQuery;
          if (pData) setPayments(pData);
        }

        if (activeTab === 'home' || activeTab === 'points') {
          let lQuery = supabase
            .from('point_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (activeTab === 'home') lQuery = lQuery.limit(5);
          const { data: lData } = await lQuery;
          if (lData) setPointLogs(lData);
        }
  
        setLoading(false);
  
      } catch (error) {
        console.error('Data fetch error:', error);
        router.push('/login');
      }
    };
  
    fetchData();
  }, [router, activeTab]);

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
              user={userData} activeTab={activeTab} setActiveTab={setActiveTab} 
              onSignOut={() => { supabase.auth.signOut(); router.push('/login'); }} 
            />
            <MyPageContent 
              user={userData} 
              payments={payments} 
              pointLogs={pointLogs} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}