'use client';
import { useState, useRef, useEffect } from 'react';

export default function EditableImage({ src, initialWidth, initialHeight, className }: any) {
  const [isSelected, setIsSelected] = useState(false);
  const [width] = useState(initialWidth || 860);
  const [height, setHeight] = useState(initialHeight || 600);
  const [scale, setScale] = useState(1);
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeType, setActiveType] = useState<'RESIZE_T' | 'RESIZE_B' | 'SCALE' | 'MOVE' | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startX = useRef(0);
  const startHeight = useRef(0);
  const startScale = useRef(1);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSelected && !wrapperRef.current?.contains(e.target as Node)) {
        setIsSelected(false);
      }
    };
    if (isSelected) window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isSelected]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!activeType) return;

      if (activeType === 'RESIZE_T' || activeType === 'RESIZE_B') {
        const dy = e.clientY - startY.current;
        const delta = activeType === 'RESIZE_T' ? -dy : dy;
        const newHeight = Math.max(100, Math.min(1200, startHeight.current + delta));
        setHeight(newHeight);
        
        const ratio = newHeight / startHeight.current;
        setScale(Math.max(0.1, Math.min(5, startScale.current * ratio)));

      } else if (activeType === 'SCALE') {
        const dx = e.clientX - startX.current;
        setScale(Math.max(0.1, Math.min(8, startScale.current + dx * 0.01)));

      } else if (activeType === 'MOVE') {
        const dx = e.clientX - startX.current;
        const dy = e.clientY - startY.current;
        setPosition({
          x: startPos.current.x + dx,
          y: startPos.current.y + dy
        });
      }
    };

    const onMouseUp = () => {
      setActiveType(null);
      document.body.classList.remove('resizing-active');
    };

    if (activeType) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [activeType]);

  const handleStart = (e: React.MouseEvent, type: any) => {
    e.stopPropagation(); 
    e.preventDefault();
    setActiveType(type);
    startX.current = e.clientX;
    startY.current = e.clientY;
    startHeight.current = height;
    startScale.current = scale;
    startPos.current = position;
    document.body.classList.add('resizing-active');
  };

  // 💡 드롭 핸들러 추가
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const imageUrl = e.dataTransfer.getData('imageUrl');
    if (imageUrl && className?.includes('editable-image-target')) {

    }
  };

  return (
    <div 
      ref={wrapperRef}
      onClick={() => setIsSelected(!isSelected)}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={(e) => {
        const imageUrl = e.dataTransfer.getData('imageUrl');
        if (imageUrl) {
          const event = new CustomEvent('imageDrop', { 
            detail: { imageUrl, element: wrapperRef.current } 
          });
          window.dispatchEvent(event);
        }
      }}
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`relative inline-block overflow-hidden transition-all bg-transparent group/canvas ${
        isSelected ? 'ring-2 ring-blue-500 shadow-2xl z-20' : 'hover:ring-1 hover:ring-blue-300'
      }`}
    >
      {src ? (
        <div 
          onMouseDown={(e) => isSelected && handleStart(e, 'MOVE')}
          className={`w-full h-full flex items-center justify-center overflow-hidden ${isSelected ? 'cursor-move' : 'cursor-pointer'}`}
        >
          <img 
            src={src} 
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: activeType ? 'none' : 'transform 0.2s ease-out' 
            }}
            className="w-full h-full object-contain object-center pointer-events-none" 
            alt="edit" 
          />
        </div>
      ) : (
        <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm font-medium tracking-tight">사진 드래그</p>
        </div>
      )}

      {isSelected && (
        <>
          {/* 상단 조절 핸들 */}
          <div 
            onMouseDown={(e) => handleStart(e, 'RESIZE_T')} 
            className="absolute top-0 left-0 w-full h-12 flex justify-center items-start z-[60] group/top"
            style={{ cursor: 'ns-resize' }}
          >
            <div className="w-32 h-3 bg-blue-600 rounded-b-2xl shadow-lg group-hover/top:h-5 transition-all flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
              <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
              <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
            </div>
          </div>

          {/* 하단 조절 핸들 */}
          <div 
            onMouseDown={(e) => handleStart(e, 'RESIZE_B')} 
            className="absolute bottom-0 left-0 w-full h-12 flex justify-center items-end z-[60] group/bottom"
            style={{ cursor: 'ns-resize' }}
          >
            <div className="w-32 h-3 bg-blue-600 rounded-t-2xl shadow-lg group-hover/bottom:h-5 transition-all flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
              <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
              <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
            </div>
          </div>

          {/*줌 컨트롤러 (플로팅 슬라이더) */}
          <div className="absolute top-4 right-4 flex items-center z-[70] pointer-events-auto">
            <div 
              className="flex items-center gap-3 px-4 py-2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all hover:bg-white"
              onMouseDown={(e) => e.stopPropagation()} 
            >
              {/* 축소 버튼 */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setScale(Math.max(0.1, scale - 0.1));
                }}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 active:scale-90 transition-all"
              >
                <span className="text-xl font-light">−</span>
              </button>

              {/* 슬라이더 영역 */}
              <div 
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleStart(e, 'SCALE');
                }}
                className="relative w-24 h-1.5 bg-gray-200 rounded-full cursor-pointer group/zoom"
              >
                <div 
                  className="absolute h-full bg-blue-500 rounded-full transition-all" 
                  style={{ width: `${Math.min(100, (scale / 2) * 100)}%` }} 
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-md scale-0 group-hover/zoom:scale-100 transition-transform"
                  style={{ left: `calc(${Math.min(100, (scale / 2) * 100)}% - 8px)` }}
                />
              </div>

              {/* 확대 버튼 */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setScale(Math.min(2, scale + 0.1));
                }}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 active:scale-90 transition-all"
              >
                <span className="text-xl font-light">+</span>
              </button>

              {/* 수치 표시 */}
              <div className="min-w-[45px] text-right">
                <span className="text-xs font-black text-blue-600 tabular-nums">
                  {Math.round(scale * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* 위치 리셋 버튼 */}
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              setPosition({ x: 0, y: 0 }); 
              setScale(1); 
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute top-4 left-4 px-2 py-1 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-md text-[20px] font-bold text-gray-500 hover:text-blue-600 z-[70]"
          >
            초기화
          </button>

          {/* 상하 가이드 아웃라인 */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-500/40 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-500/40 pointer-events-none"></div>
        </>
      )}
    </div>
  );
}