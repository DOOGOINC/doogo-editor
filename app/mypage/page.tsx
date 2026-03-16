'use client';

import React, { useEffect, useState } from 'react';
import { User, CreditCard, ShoppingBag, Settings, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function MyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{
    email: string;
    nickname: string;
    points: number;
  } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 1. 현재 세션 유저 가져오기
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          alert('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
          router.push('/login');
          return;
        }

        // 2. profiles 테이블에서 추가 정보 가져오기
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('프로필 로딩 에러:', profileError);
        }

        setUserData({
          email: user.email || '',
          nickname: profile?.nickname || user.user_metadata?.nickname || '사용자',
          points: profile?.points || 0,
        });
      } catch (error) {
        console.error('데이터 조회 중 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 bg-[#f8f9fa] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const user = userData || { email: '', nickname: '', points: 0 };

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      
      <main className="flex-1 bg-[#f8f9fa] py-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <h1 className="text-[28px] font-bold text-gray-900 mb-8 tracking-tight">마이페이지</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card & Sidebar Menu */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  <User size={40} className="text-gray-300" />
                </div>
                <h2 className="text-[18px] font-bold text-gray-900 mb-1">{user.nickname}</h2>
                <p className="text-[13px] text-gray-400 mb-6">{user.email}</p>
                <button className="w-full cursor-pointer py-2.5 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-all">
                  프로필 수정
                </button>
              </div>

              {/* Side Menu List */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden py-2">
                {[
                  { icon: <ShoppingBag size={18} />, label: '구매 내역' },
                  { icon: <CreditCard size={18} />, label: '포인트 관리' },
                  { icon: <Settings size={18} />, label: '설정' },
                ].map((item, idx) => (
                  <button key={idx} className="w-full flex items-center justify-between p-4 px-6 text-[14px] cursor-pointer text-gray-700 hover:bg-gray-50 transition-all group">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300 group-hover:text-gray-500 transition-colors">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </button>
                ))}
                <div className="h-[1px] bg-gray-50 my-2 mx-4" />
                <button 
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push('/login');
                  }}
                  className="w-full flex items-center gap-3 p-4 px-6 text-[14px] text-red-400 hover:bg-red-50 transition-all font-medium cursor-pointer"
                >
                  <LogOut size={18} />
                  로그아웃
                </button>
              </div>
            </div>

            {/* Main Dashboard Area */}
            <div className="md:col-span-2 space-y-6">
              {/* Point Summary Card */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
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

              {/* Empty State Box (Recent Activity) */}
              <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm min-h-[350px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag size={28} className="text-gray-200" />
                </div>
                <h4 className="text-[16px] font-bold text-gray-900 mb-2 text-center">최근 구매 내역이 없어요</h4>
                <Link href="/" className="mt-8 text-[14px] font-bold text-[#155dfc] hover:underline underline-offset-4 transition-all text-center">
                  에디터 바로가기 &gt;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
