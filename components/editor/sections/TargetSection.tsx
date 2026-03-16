// src/components/editor/sections/TargetSection.tsx
'use client';

import { useEditorStore } from '@/store/useEditorStore';
import EditableText from '../core/EditableText';
import EditableImage from '../core/EditableImage';

export default function TargetSection({ module }: { module: any }) {
  const { titleFontFamily, bodyFontFamily, mainColor, fontSizeStep, updateModuleContent } = useEditorStore();
  const base = [80, 90, 100][fontSizeStep];

  return (
    <section 
      className="flex flex-col items-center w-full transition-colors duration-300"
      style={{ backgroundColor: mainColor }}
    >
      {/* 🌑 1. 그림자 전용 래퍼 (상단 영역 전체를 감싸서 하단 섹션 위로 그림자를 뿌림) */}
      <div 
        className="relative w-full z-20" 
        style={{ 
          filter: `
          drop-shadow(0 8px 6px rgba(0,0,0,0.3)) 
        `
        }}
      >
        {/* 🖼️ 2. 실제 이미지 및 clip-path 영역 */}
        <div 
          className="relative w-full flex flex-col justify-center items-center bg-white"
          style={{ 
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 95%, 53% 95%, 50% 100%, 47% 95%, 0% 95%)',
          }}
        >
          {/* EditableImage (높이 조절 핸들 사용 가능) */}
          <div className="relative w-full flex justify-center">
            <EditableImage 
              src={module.image} 
              initialWidth={1000}
              initialHeight={800}
              onSave={(url: string) => updateModuleContent(module.id, 'image', url)} 
              className="z-30"
            />

          </div>

          {/* 상단 텍스트 (이미지 위에 고정) */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 pointer-events-none">
            {/* 💡 컨테이너는 통과(none), 아래 개별 텍스트들은 클릭 가능(auto)하게 변경 */}
            <div className="mb-0 pointer-events-auto">
              <EditableText 
                initialValue={module.brandName} 
                style={{ fontFamily: bodyFontFamily, fontSize: `${base * 0.42}px`, color: mainColor, fontWeight: 'bold', textShadow: '0px 4px 25px rgba(0,0,0,0.2)' }} 
                onSave={(val) => updateModuleContent(module.id, 'brandName', val)}
              />
            </div>
            <div className="mb-4 pointer-events-auto">
              <EditableText 
                initialValue={module.subTitle} 
                style={{ fontFamily: bodyFontFamily, fontSize: `${base * 0.45}px`, color:mainColor, fontWeight: 900, textShadow: '0px 4px 25px rgba(0,0,0,0.2)' }} 
                onSave={(val) => updateModuleContent(module.id, 'subTitle', val)}
              />
            </div>
            <div className="pointer-events-auto">
              <EditableText 
                initialValue={module.title} 
                style={{ 
                  fontFamily: titleFontFamily, 
                  fontSize: `${base}px`, 
                  color: '#ffffff', 
                  fontWeight: 'bold', 
                  lineHeight: 1.1,
                  textShadow: '0px 4px 25px rgba(0,0,0,0.6)'
                }} 
                onSave={(val) => updateModuleContent(module.id, 'title', val)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🟦 3. 하단: 리스트 영역 (그림자가 이 영역 위로 떨어짐) */}
      <div className="relative w-full py-12 px-10 text-white flex justify-center z-10">
        <div className="max-w-[750px] w-full pt-10">
          <ul className="space-y-12">
            {[1, 2, 3, 4].map((num) => {
              const fieldName = `tag${num}`;
              return (
                <li key={num} className="flex items-start gap-8 group/item">
                  {/* 숫자 포인트 디자인 */}
                  <div className="mt-1 w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 border border-white/20 shadow-xl backdrop-blur-md">
                    <span className="text-[17px] font-black italic">0{num}</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <EditableText 
                      initialValue={module[fieldName]} 
                      style={{ 
                        fontFamily: bodyFontFamily, 
                        fontSize: `${base * 0.30}px`, 
                        color: '#ffffff', 
                        lineHeight: 1.5 
                      }} 
                      onSave={(val) => updateModuleContent(module.id, fieldName, val)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}