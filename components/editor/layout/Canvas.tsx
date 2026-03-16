'use client';

import { useEditorStore } from '@/store/useEditorStore';
import DraggableModule from '../DraggableModule';
import ModuleToolbar from '../ModuleToolbar';
import { useEffect, useRef, useState } from 'react';

export default function Canvas() {
  const { modules, canvasScale, scrollToId, setScrollToId } = useEditorStore();
  const scale = canvasScale || 0.6;
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(1500);

  useEffect(() => {
    if (scrollToId) {
      const element = document.getElementById(`module-${scrollToId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setScrollToId(null);
    }
  }, [scrollToId, setScrollToId]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
    }
  }, [modules]);

  return (
    <div id="canvas-root" className="relative flex flex-col items-center bg-[#222] min-h-full py-20 overflow-visible">
      <div 
        id="canvas-container" // 💡 캡처를 위해 이 ID를 추가했습니다.
        ref={contentRef}
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 10,
        }}
        className="w-full max-w-[860px] bg-white shadow-2xl min-h-[1500px] h-fit relative shrink-0"
      >
        {modules.map((module) => (
          <DraggableModule key={module.id} module={module} />
        ))}
      </div>

      <div 
        style={{ 
          height: scale > 1 ? `calc(${contentHeight}px * (${scale} - 1))` : '0px',
        }} 
        className="w-full pointer-events-none transition-all duration-200" 
      />

      <ModuleToolbar />
    </div>
  );
}