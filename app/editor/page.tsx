'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/editor/layout/Sidebar';
import Canvas from '@/components/editor/layout/Canvas';
import ZoomController from '@/components/editor/layout/ZoomController'; 
import Header from '@/components/editor/layout/Header';
import SiteFooter from '@/components/layout/SiteFooter';
import { useEditorStore } from '@/store/useEditorStore';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

// 빌드 시 정적 생성을 방지하고 서버 사이드 렌더링을 강제합니다.
export const dynamic = 'force-dynamic';

// Debounce 함수
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 실제 에디터 로직이 담긴 내부 컴포넌트
function EditorContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');
  
  const [isLoading, setIsLoading] = useState(true);
  const { 
    modules, productName, mainColor, fontFamily, 
    titleFontFamily, bodyFontFamily, fontSizeStep,
    setProjectData, setUploadedImages 
  } = useEditorStore();

  // 1. 프로젝트 데이터 및 이미지 라이브러리 로드
  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('로그인이 필요합니다.');

        // 프로젝트와 유저 이미지 동시 로드
        const [projectRes, imagesRes] = await Promise.all([
          supabase.from('projects').select('*').eq('id', projectId).single(),
          supabase.from('user_images')
            .select('url')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(12)
        ]);

        if (projectRes.error) throw projectRes.error;

        if (projectRes.data) {
          setProjectData({
            name: projectRes.data.name,
            mainColor: projectRes.data.main_color || '#3b82f6',
            modules: projectRes.data.content || [],
            fontFamily: projectRes.data.font_family || 'Pretendard',
            titleFontFamily: projectRes.data.title_font_family || 'Pretendard',
            bodyFontFamily: projectRes.data.body_font_family || 'Pretendard',
            fontSizeStep: projectRes.data.font_size_step || 1
          });
        }

        if (imagesRes.data) {
          setUploadedImages(imagesRes.data.map(img => img.url));
        }
      } catch (error: any) {
        console.error('프로젝트 로드 실패:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        alert('프로젝트를 불러오지 못했습니다.');
        
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [projectId, setProjectData, setUploadedImages]);

  // 2. 실시간 자동 저장 로직 (Debounce 적용)
  const saveProject = useCallback(
    debounce(async (data: any) => {
      if (!projectId) return;

      try {
        const { error } = await supabase
          .from('projects')
          .update({
            name: data.productName,
            content: data.modules,
            main_color: data.mainColor,
            font_family: data.fontFamily,
            title_font_family: data.titleFontFamily,
            body_font_family: data.bodyFontFamily,
            font_size_step: data.fontSizeStep,
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId);

        if (error) throw error;
        console.log('자동 저장 완료');
      } catch (error) {
        console.error('자동 저장 실패:', error);
      }
    }, 1500),
    [projectId]
  );

  // 상태가 바뀔 때마다 저장 트리거
  useEffect(() => {
    if (isLoading) return; 
    
    saveProject({
      productName,
      modules,
      mainColor,
      fontFamily,
      titleFontFamily,
      bodyFontFamily,
      fontSizeStep
    });
  }, [modules, productName, mainColor, fontFamily, titleFontFamily, bodyFontFamily, fontSizeStep, isLoading, saveProject]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-gray-500 font-bold">에디터를 준비하고 있어요...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-100 overflow-hidden">
      <Header />
      <div className="flex flex-1 w-full overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-200 relative scrollbar-hide">
          <Canvas />
          <SiteFooter />
          <div className="fixed bottom-10 right-10 z-[9999]">
            <ZoomController />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-gray-500 font-bold">잠시만 기다려주세요...</p>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}