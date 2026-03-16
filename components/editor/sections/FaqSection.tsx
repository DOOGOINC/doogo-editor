'use client';

import { useEditorStore } from '@/store/useEditorStore';
import EditableText from '../core/EditableText';
import EditableImage from '../core/EditableImage';

export default function FaqSection({ module }: { module: any }) {
  const { titleFontFamily, bodyFontFamily, fontSizeStep, updateModuleContent } = useEditorStore();
  
  const baseSize = [80, 90, 100][fontSizeStep];

  return (
    <section key={module.id} className="relative w-full overflow-hidden flex flex-col justify-between bg-gray-200">
      
      {/* 🖼️ 배경 이미지 */}
      <div className="relative z-0 opacity-75 flex">
        <EditableImage 
          src={module.image} 
          initialWidth={860} 
          initialHeight={900} // 이 높이만큼 섹션이 늘어납니다.
          onSave={(url: string) => updateModuleContent(module.id, 'image', url)} 
        />
      </div>

      {/* 가독성을 위한 레이어 (이미지 바로 위) */}
      <div className="absolute inset-0 bg-black/5 z-0 pointer-events-none" />

      {/* 💡 텍스트 영역 (absolute inset-0으로 이미지 위에 띄움) */}
      <div className="absolute inset-0 z-10 w-full max-w-[860px] mx-auto flex flex-col h-full px-12 py-12 pointer-events-none">
        
        <div className="flex flex-col flex-1">
          {/* 1. 최상단 서브 타이틀 */}
          <div className="mb-2 pointer-events-auto">
            <EditableText 
              key={`sub-${module.id}`}
              initialValue={module.subTitle} 
              style={{ 
                fontFamily: bodyFontFamily, 
                fontSize: `${baseSize * 0.38}px`, 
                color: '#FFFFFF', 
                fontWeight: '500',
                textShadow: '0px 2px 4px rgba(0,0,0,0.3)'
              }} 
              onSave={(val) => updateModuleContent(module.id, 'subTitle', val)}
            />
          </div>

          <div className="w-[1.5px] h-16 bg-white ml-1" />

          {/* 2. 메인 타이틀 */}
          <div className="flex items-baseline gap-6 pointer-events-auto">
            <EditableText 
              key={`title-${module.id}`}
              initialValue={module.title} 
              style={{ 
                fontFamily: titleFontFamily, 
                fontSize: `${baseSize * 1.0}px`, 
                color: '#FFFFFF', 
                fontWeight: '800',
                letterSpacing: '-0.05em',
                textShadow: '0px 2px 10px rgba(0,0,0,0.4)'
              }} 
              onSave={(val) => updateModuleContent(module.id, 'title', val)}
            />
            <span style={{ fontFamily: titleFontFamily, fontSize: `${baseSize * 0.8}px`, color: '#FFFFFF', fontWeight: '100' }}>FAQ</span>
          </div>

          {/* 3. 설명 문구 */}
          <div className="max-w-[100%] pointer-events-auto">
            <EditableText 
              key={`cont-${module.id}`}
              initialValue={module.content} 
              style={{ 
                fontFamily: bodyFontFamily, 
                fontSize: `${baseSize * 0.54}px`, 
                color: '#FFFFFF', 
                fontWeight: '600',
                textShadow: '0px 2px 4px rgba(0,0,0,0.3)'
              }} 
              onSave={(val) => updateModuleContent(module.id, 'content', val)}
            />
          </div>
        </div>

        {/* 4. 하단 브랜드 로고 */}
        <div className="relative z-10 w-full max-w-[860px] mx-auto pointer-events-auto">
          <EditableText 
            key={`brand-${module.id}`}
            initialValue={module.brandName} 
            style={{ 
              fontFamily: titleFontFamily, 
              fontSize: `${baseSize * 0.38}px`, 
              color: '#FFFFFF', 
              fontWeight: '700'
            }} 
            onSave={(val) => updateModuleContent(module.id, 'brandName', val)}
          />
        </div>
      </div>
    </section>
  );
}