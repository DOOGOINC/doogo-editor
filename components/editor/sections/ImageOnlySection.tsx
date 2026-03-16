'use client';

import { useEditorStore } from '@/store/useEditorStore';
import EditableText from '../core/EditableText';
import EditableImage from '../core/EditableImage';

export default function ImageOnlySection({ module }: { module: any }) {
  const { titleFontFamily, updateModuleContent, fontSizeStep } = useEditorStore();
  
  // 브랜드 로고 폰트 사이즈
  const baseSize = [40, 50, 60][fontSizeStep];

  return (
    <section key={module.id} className="relative w-full overflow-hidden flex flex-col bg-white">
      
      {/* 🖼️ 전체 배경 이미지 (Editable) */}
      <div className="relative z-0">
        <EditableImage 
          src={module.image} 
          initialWidth={860} 
          initialHeight={1100} // 고해상도 세로 이미지를 위해 높게 설정 (조절 가능)
          onSave={(url: string) => updateModuleContent(module.id, 'image', url)} 
        />
      </div>

      {/* 🏷️ 브랜드 로고 오버레이 (하단 중앙 배치) */}
      <div className="absolute bottom-18 left-0 w-full z-10 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <EditableText 
            initialValue={module.brandName}
            style={{ 
              fontFamily: '"Pretendard"', 
              fontSize: `${baseSize}px`, 
              color: '#aeaeae',
              fontWeight: '700',
            }}
            onSave={(val) => updateModuleContent(module.id, 'brandName', val)}
          />
        </div>
      </div>
    </section>
  );
}