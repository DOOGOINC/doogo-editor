'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';

export default function ZoomController() {
  const { canvasScale, setCanvasScale } = useEditorStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleZoom = (delta: number) => {
    const next = Math.max(0.1, Math.min(1.4, (canvasScale || 1) + delta));
    setCanvasScale(next);
  };

  const scalePercent = Math.round(((canvasScale || 0.6) / 0.6) * 100);

  return (
    <div 
      className="fixed bottom-6 right-6 z-[1000] flex flex-col items-center gap-2 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!isDragging) setIsHovered(false);
      }}
    >
      {/* 배경: #0b0e14, 테두리: #1c212c */}
      <div className={`
        flex flex-col items-center w-12 bg-[#0b0e14] rounded-xl  border border-[#1c212c] p-1.5 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${isHovered || isDragging ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'}
      `}>
        {/* 확대/축소 버튼: 포인트 블루 #155dfc 적용 */}
        <button 
          onClick={() => handleZoom(0.1)}
          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#155dfc] hover:bg-[#1c212c] rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <div className="h-44 flex items-center justify-center relative my-2">
          <input 
            type="range" min="0.1" max="1.4" step="0.01" 
            value={canvasScale || 0.6}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onChange={(e) => setCanvasScale(parseFloat(e.target.value))}
            className="vertical-slider"
          />
        </div>

        <button 
          onClick={() => handleZoom(-0.1)}
          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#155dfc] hover:bg-[#1c212c] rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
          </svg>
        </button>

        <div className="w-8 h-[1px] bg-[#1c212c] my-1" />

        {/* Reset 버튼: 텍스트도 #155dfc 포인트만 사용 */}
        <button 
          onClick={() => setCanvasScale(0.6)}
          className="w-full py-2 text-[10px] font-black text-gray-500 hover:text-[#155dfc] transition-colors uppercase tracking-tighter"
        >
          Reset
        </button>
      </div>

      {/* 하단 인디케이터: 보라색 그림자 제거, 블루 글로우만 적용 */}
      <div className={`
        h-9 px-3 min-w-[60px] flex items-center justify-center bg-[#0b0e14] border border-[#1c212c] rounded-lg shadow-xl transition-all duration-200
        ${isHovered || isDragging ? 'border-[#155dfc]' : ''}
      `}>
        <span className="text-[12px] font-black text-white tabular-nums tracking-tight">
          {scalePercent}%
        </span>
      </div>

      <style jsx>{`
.vertical-slider {
  appearance: none;
  width: 4px;
  height: 150px;
  border-radius: 999px;
  outline: none;
  -webkit-appearance: slider-vertical;
  accent-color: #155dfc;

  /* modern track */
  background: linear-gradient(
    to bottom,
    #1c212c 0%,
    #202633 50%,
    #1c212c 100%
  );

  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.03),
    inset 0 2px 6px rgba(0,0,0,0.6);
}

.vertical-slider:focus {
  outline: none;
}

.vertical-slider::-webkit-slider-runnable-track {
  background: transparent;
}

.vertical-slider::-moz-range-track {
  background: transparent;
}

/* modern thumb */
.vertical-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: grab;

  background: radial-gradient(
    circle at 30% 30%,
    #3b82f6,
    #155dfc
  );

  border: 3px solid #0b0e14;

  box-shadow:
    0 0 0 1px rgba(21,93,252,0.3),
    0 0 10px rgba(21,93,252,0.35),
    0 2px 6px rgba(0,0,0,0.6);

  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.vertical-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow:
    0 0 0 1px rgba(21,93,252,0.5),
    0 0 14px rgba(21,93,252,0.45),
    0 4px 10px rgba(0,0,0,0.7);
}

.vertical-slider::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.05);
}

/* firefox */
.vertical-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid #0b0e14;

  background: radial-gradient(
    circle at 30% 30%,
    #3b82f6,
    #155dfc
  );

  box-shadow:
    0 0 0 1px rgba(21,93,252,0.3),
    0 0 10px rgba(21,93,252,0.35),
    0 2px 6px rgba(0,0,0,0.6);
}
`}</style>
    </div>
  );
}