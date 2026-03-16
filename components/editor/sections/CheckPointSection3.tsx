// src/components/editor/sections/CheckPointSection3.tsx
'use client';

import { useEditorStore } from '@/store/useEditorStore';
import EditableText from '../core/EditableText';
import EditableImage from '../core/EditableImage';

export default function CheckPointSection3({ module }: { module: any }) {
  // 💡 스토어에서 새로운 상태(fontFamily, fontSizeStep)를 가져옵니다.
  const { updateModuleContent, mainColor, titleFontFamily, 
    bodyFontFamily, fontSizeStep } = useEditorStore();
  const baseSizes = [80, 90, 100]; 
  const base = baseSizes[fontSizeStep];

  return (
    <section className="pt-44 flex flex-col items-center text-center px-0 bg-white">
      {/* 1. 서브 타이틀 (기준값의 45% 크기) */}
      <div className="mb-10">
        <EditableText 
          initialValue={module.subTitle} 
          style={{ 
            fontFamily: bodyFontFamily, 
            fontSize: `${base * 0.45}px`, // 비율 유지
            color: mainColor 
          }} 
          className="font-bold leading-[1.0] tracking-[0]" 
          onSave={(val) => updateModuleContent(module.id, 'subTitle', val)}
        />
      </div>

      {/* 2. 메인 타이틀 (기준값 100% 크기) */}
      <div className="mb-10 leading-none">
        <EditableText 
          initialValue={module.title} 
          style={{ 
            fontFamily: titleFontFamily, 
            fontSize: `${base}px` 
          }} 
          className="text-black font-bold leading-[1.2]" 
          onSave={(val) => updateModuleContent(module.id, 'title', val)}
        />
      </div>

      {/* 3. 본문 설명 (기준값의 35%~40% 크기) */}
      <div className="w-full max-w-[800px] mb-20 mx-auto flex justify-center">
        <EditableText 
          initialValue={module.content} 
          style={{ 
            fontFamily: bodyFontFamily, 
            fontSize: `${base * 0.35}px` // 본문은 상대적으로 작게 설정
          }} 
          className="text-[#333] leading-[1.6] break-keep font-medium w-full text-center" 
          onSave={(val) => updateModuleContent(module.id, 'content', val)}
        />
      </div>

      {/* 이미지 영역 (기존 유지) */}
      <div className="flex justify-center items-center pb-20">
        <EditableImage 
          src={module.image} 
          initialWidth={600} 
          onSave={(url: any) => updateModuleContent(module.id, 'image', url)} 
        />
      </div>
    </section>
  );
}