'use client';

import { useEditorStore } from '@/store/useEditorStore';
import EditableText from '../core/EditableText';

export default function ProductInfoSection({ module }: { module: any }) {
  const { titleFontFamily, bodyFontFamily, fontSizeStep, updateModuleContent, mainColor } = useEditorStore();
  
  const baseSize = [24, 28, 32][fontSizeStep];

  const handleUpdateItem = (index: number, key: 'label' | 'value', value: string) => {
    const newItems = [...module.infoItems];
    newItems[index][key] = value;
    updateModuleContent(module.id, 'infoItems', newItems as any);
  };

  return (
    <section className="w-full py-16 px-12 bg-[#F7F7F7] flex flex-col items-center">
      <div className="w-full max-w-[860px] flex flex-col">
        
        {/* 상단 섹션 타이틀 */}
        <div className="mb-12 text-center">
          <EditableText 
            initialValue={module.title}
            style={{ 
              fontFamily: titleFontFamily, 
              fontSize: `${baseSize * 2.0}px`, 
              color: '#000', 
              fontWeight: '800',
              letterSpacing: '-0.02em'
            }}
            onSave={(val) => updateModuleContent(module.id, 'title', val)}
          />
        </div>

        {/* 정보 테이블 영역 */}
        <div className="w-full border-t-[2.5px] border-black border-b-[2.5px]">
          {module.infoItems?.map((item: any, index: number) => (
            <div 
              key={index} 
              className={`flex w-full border-b border-t-[1.5px] border-gray-300 last:border-none py-6 px-1`}
            >
              {/* 라벨 (항목명) */}
              <div className="w-[140px] shrink-0">
                <EditableText 
                  initialValue={item.label}
                  style={{ 
                    fontFamily: bodyFontFamily, 
                    fontSize: `${baseSize}px`, 
                    color: '#000', 
                    fontWeight: '800' 
                  }}
                  onSave={(val) => handleUpdateItem(index, 'label', val)}
                />
              </div>

              {/* 내용 (값) */}
              <div className="flex-1 ml-4">
                <EditableText 
                  initialValue={item.value}
                  style={{ 
                    fontFamily: bodyFontFamily, 
                    fontSize: `${baseSize * 0.95}px`, 
                    color: '#333', 
                    fontWeight: '500',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap' // 줄바꿈 허용
                  }}
                  onSave={(val) => handleUpdateItem(index, 'value', val)}
                />
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}