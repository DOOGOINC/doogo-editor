'use client';

import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableModuleItemProps {
  id: string;
  type: string;
  title: string;
}

export function SortableModuleItem({ id, type, title }: SortableModuleItemProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({ id });

  const removeModule = useEditorStore(state => state.removeModule);
  const setScrollToId = useEditorStore(state => state.setScrollToId);
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      onClick={() => setScrollToId(id)} 
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group mb-2 ${
        isDragging 
          ? 'bg-[#1c212c] border-[#155dfc] shadow-2xl opacity-80' 
          : 'bg-[#1c212c] border-transparent hover:border-[#155dfc]/50'
      }`}
    >
      {/* 드래그 핸들 (:: 표시) - listeners와 attributes를 여기에 바인딩 */}
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab text-gray-500 hover:text-white px-1 font-mono text-sm select-none"
      >
        ::
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black text-[#155dfc] uppercase tracking-tighter">
          {type}
        </p>
        <p className="text-xs text-gray-200 truncate font-medium">
          {title || '제목을 입력해주세요'}
        </p>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation(); 
          removeModule(id);
        }} 
        className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
      >
        ✕
      </button>
    </div>
  );
}