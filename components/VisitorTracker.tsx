'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackVisit = async () => {
      // 관리자 페이지 방문은 제외
      if (pathname.startsWith('/admin')) return;

      try {
        // 1. 이번 세션에서 해당 경로를 이미 기록했는지 확인 (새로고침 방지)
        const sessionKey = `v_track_${pathname}`;
        if (sessionStorage.getItem(sessionKey)) return;

        // 로컬 스토리지에서 유니크 방문자 ID 가져오거나 생성
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          localStorage.setItem('visitor_id', visitorId);
        }

        const { error } = await supabase.from('visits').insert({
          visitor_id: visitorId,
          path: pathname,
          referer: document.referrer || null,
          user_agent: navigator.userAgent
        });

        if (!error) {
          // 2. 성공적으로 기록했다면 세션 스토리지에 표시하여 중복 방지
          sessionStorage.setItem(sessionKey, 'true');
        } else {
          console.warn('방문 기록 저장 실패 (테이블 미생성 가능성):', error.message);
        }
      } catch (e) {
        console.error('방문 기록 중 오류 발생:', e);
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}
