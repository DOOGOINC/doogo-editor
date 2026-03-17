'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = async () => {
      // 1. 세션 확인 (로그인 여부)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace('/login');
        return;
      }

      // 2. profiles 테이블에서 is_admin 확인
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      // 권한이 없거나 에러가 나면 메인으로 튕겨내기
      if (error || !profile?.is_admin) {
        router.replace('/');
      } else {
        setIsAdmin(true);
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#155dfc]"></div>
      </div>
    );
  }

  // 관리자일 때만 자식 컴포넌트(어드민 페이지 내용)를 보여줌
  return isAdmin ? <>{children}</> : null;
}