// src/components/editor/sections/HeroSection.tsx
'use client';

import { useEditorStore } from '@/store/useEditorStore';
import EditableText from '../core/EditableText';
import EditableImage from '../core/EditableImage';

export default function HeroSection({ module }: { module: any }) {
  // 💡 스토어에서 새로운 상태(fontFamily, fontSizeStep)를 가져옵니다.
  const { 
    updateModuleContent, 
    mainColor, 
    titleFontFamily, 
    bodyFontFamily, 
    fontSizeStep 
  } = useEditorStore();

  /**
   * 💡 히어로 섹션 전용 단계별 기준 크기 (Base Size)
   * 히어로는 전체 페이지의 얼굴이므로 다른 섹션보다 기준치를 약간 높게(예: 80~140) 설정하면 더 임팩트가 있습니다.
   */
  const baseSizes = [80, 90, 100]; 
  const base = baseSizes[fontSizeStep];

  return (
    <div className="pb-24 px-2 text-center bg-[#ededed]">
      {/* 1. 브랜드명 (기준값의 40%) */}
      <div className="mb-10 pt-14"> 
        <EditableText 
          initialValue={module.brandName} 
          style={{ 
            fontFamily: '"Pretendard"',
            fontSize: `${base * 0.4}px` 
          }} 
          className="text-[#aeaeae] font-bold tracking-normal leading-none" 
          onSave={(val: string) => updateModuleContent(module.id, 'brandName', val)}
        />
      </div>

      {/* 2. 상단 소제목 (기준값의 35%) */}
      <div>
        <EditableText 
          initialValue={module.content} 
          style={{ 
            fontFamily: bodyFontFamily, 
            fontSize: `${base * 0.45}px` 
          }} 
          className="text-[#222] font-bold mb-2" 
          onSave={(val: string) => updateModuleContent(module.id, 'content', val)}
        />
      </div>

      {/* 3. 메인 타이틀 (기준값 100%) */}
      <div className="mb-8">
        <EditableText 
          tag="h1" 
          initialValue={module.title} 
          style={{ 
            fontFamily: titleFontFamily, 
            fontSize: `${base}px` 
          }}
          className="font-bold leading-[1.1] tracking-[0.02em] text-black whitespace-pre-line"
          onSave={(val: string) => updateModuleContent(module.id, 'title', val)}
        />
      </div>

      {/* 4. 태그 영역 (기존 스타일 유지) */}
      <div className="flex justify-center gap-3 mb-16">
        <div className="px-4 py-1 rounded-full shadow-sm flex items-center justify-center" style={{ backgroundColor: mainColor }}>
          <EditableText 
            initialValue={module.tag1 || "뉴질랜드 생산"} 
            style={{ 
              fontFamily: bodyFontFamily, 
              fontSize: `${Math.max(16, base * 0.3)}px` 
            }} // 태그는 고정 크기 유지 혹은 base 비율 사용 가능
            className="text-white font-bold" 
            onSave={(val: string) => updateModuleContent(module.id, 'tag1', val)}
          />
        </div>
        <div className="px-4 py-1 rounded-full bg-[#d9d9d9] flex items-center justify-center">
          <EditableText 
            initialValue={module.tag2 || "30캡슐"} 
            style={{ 
              fontFamily: bodyFontFamily, 
              fontSize: `${Math.max(16, base * 0.3)}px` 
            }}
            className="text-[#555] font-bold leading-none" 
            onSave={(val: string) => updateModuleContent(module.id, 'tag2', val)}
          />
        </div>
        <div className="px-4 py-1 rounded-full bg-[#d9d9d9] flex items-center justify-center">
          <EditableText 
            initialValue={module.tag3 || "안전한 블리스터 포장"} 
            style={{ 
              fontFamily: bodyFontFamily, 
              fontSize: `${Math.max(16, base * 0.3)}px` 
            }}
            className="text-[#555] font-bold" 
            onSave={(val: string) => updateModuleContent(module.id, 'tag3', val)}
          />
        </div>
      </div>

      {/* 5. 메인 이미지 (기존 유지) */}
      <div className="flex justify-center items-center">
        <EditableImage 
          src={module.image} 
          initialWidth={600} 
          onSave={(url) => updateModuleContent(module.id, 'image', url)} 
        />
      </div>
    </div>
  );
}