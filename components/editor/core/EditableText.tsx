'use client';
import { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  initialValue: string;
  initialSize?: number;
  style?: React.CSSProperties;
  className?: string;
  tag?: any;
  onSave?: (value: string) => void;
}

export default function EditableText({ 
  initialValue, 
  initialSize = 1, 
  className,
  style, 
  tag: Tag = 'p',
  onSave 
}: EditableTextProps) {
  const [isSelected, setIsSelected] = useState(false);
  // 💡 드래그 리사이징 관련 상태(fontSize, isResizing) 제거

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLElement>(null);
  const isTyping = useRef(false);

  // 외부 클릭 시 선택 해제
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSelected && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsSelected(false);
      }
    };
    if (isSelected) window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isSelected]);

  // 💡 드래그 리사이징 로직(onMouseMove, onMouseUp) 전체 삭제됨

  // 스토어 데이터 반영 (타이핑 중 아닐 때만)
  useEffect(() => {
    if (textRef.current && !isTyping.current) {
      textRef.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  const handleInput = () => {
    isTyping.current = true;
  };

  const handleBlur = () => {
    isTyping.current = false;
    if (textRef.current && onSave) {
      const currentHtml = textRef.current.innerHTML;
      if (currentHtml !== initialValue) {
        onSave(currentHtml);
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative inline-block group/text shrink-0 max-w-full ${className?.includes('w-full') ? 'w-full' : ''}`}>
      <div 
        onClick={() => setIsSelected(!isSelected)}
        className={`relative transition-all p-0.1 border-2 rounded-lg ${
          isSelected 
            ? 'border-blue-600 bg-white/10 shadow-sm' 
            : 'border-transparent hover:border-blue-300'
        } ${className?.includes('w-full') ? 'w-full' : 'inline-block'}`}
        style={{ 
          maxWidth: '100%',
          wordBreak: 'break-word',
          overflowWrap: 'break-word' 
        }}
      >
        <Tag 
          ref={textRef}
          className={`outline-none whitespace-pre-wrap break-words block ${className}`} 
          style={{ 
            ...style, 
            fontFamily: style?.fontFamily ? `"${style.fontFamily}", sans-serif` : 'inherit',
            // 💡 fontSize는 이제 상위에서 전달된 style.fontSize만 따릅니다.
            fontSize: style?.fontSize || 'inherit', 
            outline: 'none' 
          }} 
          contentEditable 
          spellCheck={false}
          suppressContentEditableWarning={true}
          onInput={handleInput}
          onBlur={handleBlur}
        />

        {isSelected && (
          <>
            {/* 💡 우측 하단 크기 조절 핸들(-right-2.5) 삭제됨 */}
            {/* 시각적인 선택 표시용 점들만 유지 (필요 없으면 삭제 가능) */}
            <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full" />
            <div className="absolute -right-1.5 -top-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full" />
            <div className="absolute -left-1.5 -bottom-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full" />
            <div className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full" />
          </>
        )}
      </div>
    </div>
  );
}