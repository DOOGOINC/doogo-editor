'use client';

import { useEditorStore } from '@/store/useEditorStore';
import { useEffect, useState, useRef } from 'react';

export default function ModuleToolbar() {
  const { 
    hoveredModuleId, 
    setHoveredModuleId, 
    canvasScale, 
    removeModule, 
    duplicateModule, 
    moveModule 
  } = useEditorStore();
  
  const [pos, setPos] = useState({ top: 0, left: 0, opacity: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const requestRef = useRef<number | null>(null);

  // 💡 실시간 위치 업데이트 로직
  const syncPosition = () => {
    const id = hoveredModuleId || activeIdRef.current;
    if (!id) return;

    const target = document.getElementById(`module-${id}`);
    const container = document.getElementById('canvas-root');
    
    if (target && container) {
      const targetRect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // 상태 업데이트 (스크롤 중에도 즉시 반영됨)
      setPos({
        top: targetRect.top - containerRect.top,
        left: (targetRect.right - containerRect.left) + 8,
        opacity: 1
      });
    }
    // 다음 프레임에서도 계속 실행
    requestRef.current = requestAnimationFrame(syncPosition);
  };

  useEffect(() => {
    if (hoveredModuleId) {
      activeIdRef.current = hoveredModuleId;
      if (timerRef.current) clearTimeout(timerRef.current);
      
      // 💡 실시간 추적 시작
      requestRef.current = requestAnimationFrame(syncPosition);
    } else {
      // 마우스가 떠났을 때 즉시 멈추지 않고 사라지는 연출 후에 멈춤
      timerRef.current = setTimeout(() => {
        setPos((prev) => ({ ...prev, opacity: 0 }));
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      }, 200);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [hoveredModuleId]);

  if (!hoveredModuleId && pos.opacity === 0) return null;

  const currentId = hoveredModuleId || activeIdRef.current;

  return (
    <div 
      className="absolute z-[9999] pointer-events-auto transition-opacity duration-150"
      onMouseEnter={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (activeIdRef.current) setHoveredModuleId(activeIdRef.current);
      }}
      onMouseLeave={() => setHoveredModuleId(null)}
      style={{ 
        top: pos.top, 
        left: pos.left, 
        opacity: pos.opacity,
        willChange: 'top, left', // 💡 브라우저에게 최적화 힌트 제공
      }}
    >
      <div className="flex flex-col bg-[#1e1e1e] p-1.5 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10">
        <ToolbarButton onClick={() => currentId && moveModule(currentId, 'up')} icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m18 15-6-6-6 6"/></svg>} />
        <ToolbarButton onClick={() => currentId && moveModule(currentId, 'down')} icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>} />
        <ToolbarButton onClick={() => currentId && duplicateModule(currentId)} icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>} />
        <div className="h-[1px] bg-white/10 my-1.5 mx-1" />
        <ToolbarButton onClick={() => currentId && removeModule(currentId)} icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>} isDelete />
      </div>
    </div>
  );
}

// ToolbarButton은 기존과 동일
function ToolbarButton({ onClick, icon, isDelete }: any) {
  return (
    <button 
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick(); }}
      className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${
        isDelete ? 'hover:bg-red-500/20 text-red-400 hover:text-red-500' : 'hover:bg-white/10 text-gray-400 hover:text-white'
      }`}
    >
      {icon}
    </button>
  );
}