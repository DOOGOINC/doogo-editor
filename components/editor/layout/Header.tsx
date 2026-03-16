'use client';

import { useState, useEffect } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { useStore } from 'zustand';
import { toPng } from 'html-to-image';
import { 
  RotateCcw, RotateCw, Download, User, Loader2, CheckCircle2, 
  CreditCard, UserCircle, LogOut, Save 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Header() {
  const temporalStore = useEditorStore.temporal;
  const { undo, redo, pastStates, futureStates } = useStore(temporalStore, (state) => state);
  const { modules, productName, mainColor, fontFamily, titleFontFamily, bodyFontFamily, fontSizeStep } = useEditorStore();

  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  const [downloadProgress, setDownloadProgress] = useState(0); 
  const [showToast, setShowToast] = useState(false); 
  const [toastMsg, setToastMsg] = useState(''); 
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  
  // 💡 포인트 포함 유저 상태
  const [userData, setUserData] = useState<{ email?: string, nickname?: string, points?: number } | null>(null);

  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  // 💡 유저 정보 및 실제 포인트 가져오기
  const fetchUserAndPoints = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single();

      setUserData({
        email: user.email,
        nickname: user.user_metadata?.nickname || '사용자',
        points: profile?.points || 0
      });
    }
  };

  useEffect(() => {
    fetchUserAndPoints();
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // 💡 1. 순수 저장 및 썸네일 업데이트 기능 (포인트 소모 X)
  const handleSave = async () => {
    const canvasElement = document.getElementById('canvas-container');
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!canvasElement || !projectId) return;

    try {
      setIsSaving(true);
      
      const thumbUrl = await toPng(canvasElement, {
        cacheBust: false,
        backgroundColor: '#ffffff',
        pixelRatio: 0.4,
        width: 860,
        style: { width: '860px', height: 'auto', transform: 'scale(1)', transformOrigin: 'top center' },
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const res = await fetch(thumbUrl);
        const blob = await res.blob();
        const filePath = `${user.id}/thumbs/${projectId}.png`;
        
        await supabase.storage.from('user-images').upload(filePath, blob, { upsert: true });
        const { data: { publicUrl } } = supabase.storage.from('user-images').getPublicUrl(filePath);

        await supabase.from('projects').update({
          name: productName,
          content: modules,
          main_color: mainColor,
          font_family: fontFamily,
          title_font_family: titleFontFamily,
          body_font_family: bodyFontFamily,
          font_size_step: fontSizeStep,
          thumbnail: publicUrl,
          updated_at: new Date().toISOString()
        }).eq('id', projectId);

        setToastMsg('프로젝트가 안전하게 저장되었습니다!');
        setShowToast(true);
      }
    } catch (err) {
      console.error('저장 실패:', err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 💡 2. PNG 다운로드 기능 (100포인트 소모 로직 추가)
  const handleDownload = async () => {
    if (!userData) return alert('로그인이 필요합니다.');
    
    // 1. 포인트 체크
    const DOWNLOAD_COST = 100;
    if ((userData.points || 0) < DOWNLOAD_COST) {
      return alert(`포인트가 부족합니다. (필요: ${DOWNLOAD_COST}P / 보유: ${userData.points}P)`);
    }

    // 2. 사용자 승인 확인
    const confirmDownload = window.confirm(`상세페이지를 이미지로 저장하시겠습니까?\n${DOWNLOAD_COST}포인트가 차감됩니다. (현재: ${userData.points}P)`);
    if (!confirmDownload) return;

    const canvasElement = document.getElementById('canvas-container');
    if (!canvasElement) return alert('캔버스를 찾을 수 없습니다.');

    try {
      setIsDownloading(true);
      setDownloadProgress(10);

      // 3. 실제 포인트 차감 처리 (DB 업데이트)
      const { error: pointError } = await supabase
        .from('profiles')
        .update({ points: (userData.points || 0) - DOWNLOAD_COST })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (pointError) throw new Error('포인트 차감 중 오류가 발생했습니다.');

      // 4. 화면 포인트 수치 즉시 업데이트
      setUserData(prev => prev ? { ...prev, points: (prev.points || 0) - DOWNLOAD_COST } : null);

      setDownloadProgress(30);

      const dataUrl = await toPng(canvasElement, {
        cacheBust: false,
        backgroundColor: '#ffffff',
        pixelRatio: 1, 
        width: 860,
        skipFonts: false,
        includeQueryParams: true,
        imagePlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 
        style: { width: '860px', height: 'auto', transform: 'scale(1)', transformOrigin: 'top center' },
      });

      setDownloadProgress(90);

      const link = document.createElement('a');
      const today = new Date();
      const dateString = today.toISOString().split('T')[0].replace(/-/g, '');
      link.download = `${productName || '상세페이지'}_${dateString}.png`;
      link.href = dataUrl;
      link.click();
      
      setDownloadProgress(100);
      setToastMsg('이미지가 성공적으로 저장되었습니다!');
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
        setShowToast(true);
      }, 500);
      
    } catch (err: any) {
      console.error('다운로드 에러:', err);
      alert(err.message || '이미지 생성 중 오류가 발생했습니다.');
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <header className="h-[60px] w-full border-b border-gray-200 bg-white flex items-center justify-between px-6 z-[100] sticky top-0 shadow-sm">
      {isDownloading && (
        <div className="absolute top-0 left-0 h-[3px] bg-blue-600 transition-all duration-300 z-[110]" style={{ width: `${downloadProgress}%` }} />
      )}

      {/* 로고 */}
      <div className="flex items-center min-w-[150px]">
  <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter">
    <img src="../image/Artboard 10@2x.png" alt="Logo" className="w-44 object-contain" />
  </Link>
</div>

      {/* Undo/Redo */}
      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 gap-1">
        <button onClick={() => undo()} disabled={!canUndo} className={`w-9 h-9 flex items-center justify-center rounded-md transition-all ${canUndo ? 'text-slate-700 hover:bg-white hover:shadow-sm cursor-pointer' : 'text-slate-300 opacity-50'}`}><RotateCcw size={18} strokeWidth={2.5} /></button>
        <div className="w-[1px] h-4 bg-slate-200 mx-1" />
        <button onClick={() => redo()} disabled={!canRedo} className={`w-9 h-9 flex items-center justify-center rounded-md transition-all ${canRedo ? 'text-slate-700 hover:bg-white hover:shadow-sm cursor-pointer' : 'text-slate-300 opacity-50'}`}><RotateCw size={18} strokeWidth={2.5} /></button>
      </div>

      {/* 버튼 영역 */}
      <div className="flex items-center gap-2 min-w-[350px] justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>저장</span>
        </button>

        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 disabled:opacity-70 cursor-pointer"
        >
          {isDownloading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>{downloadProgress}%</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>PNG 저장</span>
            </>
          )}
        </button>

        {/* 유저 메뉴 및 포인트 연동 */}
        <div className="relative ml-2">
          <button onClick={() => setIsLoginMenuOpen(!isLoginMenuOpen)} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isLoginMenuOpen ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm cursor-pointer' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 cursor-pointer'}`}><User size={20} /></button>
          {isLoginMenuOpen && (
            <div className="absolute right-0 top-[55px] w-[240px] bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden py-1 z-[110] animate-in fade-in zoom-in-95 duration-100">
              <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                <div className="font-bold text-[15px] text-gray-900 mb-0.5">{userData?.nickname || '로딩 중...'}</div>
                <div className="text-[12px] text-gray-400 font-medium">{userData?.email || '이메일 확인 중'}</div>
              </div>
              <div className="p-1">
                <Link href="/mypage" className="flex items-center gap-3 w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors rounded-xl text-[14px] font-medium text-gray-700 group"><UserCircle size={18} className="text-gray-300 group-hover:text-gray-400" /><span>마이페이지</span></Link>
                <Link href="/purchase" className="flex items-center gap-3 w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors rounded-xl text-[14px] font-medium text-gray-700 group">
                  <CreditCard size={18} className="text-gray-300 group-hover:text-gray-400" />
                  <div className="flex justify-between flex-1 items-center">
                    <span>내 포인트</span>
                    <span className="text-[12px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {(userData?.points || 0).toLocaleString()} P
                    </span>
                  </div>
                </Link>
              </div>
              <div className="h-[1px] bg-gray-50 my-1" />
              <div className="p-1"><button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-2.5 hover:bg-red-50 transition-colors rounded-xl text-[14px] font-semibold text-red-500 group"><LogOut size={18} className="text-red-300 group-hover:text-red-400" /><span>로그아웃</span></button></div>
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[200] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 size={20} className="text-[#155dfc]" />
          <span className="font-medium tracking-tight">{toastMsg}</span>
        </div>
      )}
    </header>
  );
}