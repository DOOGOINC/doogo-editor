'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AutoLogout() {
  const router = useRouter();

  useEffect(() => {
    // 3시간 (단위: 밀리초)
    const INACTIVITY_TIME = 3 * 60 * 60 * 1000; 
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      
      timeout = setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await supabase.auth.signOut();
          alert('보안을 위해 3시간 동안 활동이 없어 자동 로그아웃되었습니다.');
          router.push('/login');
          router.refresh();
        }
      }, INACTIVITY_TIME);
    };

    // 활동 감지 이벤트 등록
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      clearTimeout(timeout);
    };
  }, [router]);

  return null;
}