'use client';

import { useEditorStore } from '@/store/useEditorStore';
import EditableText from '../core/EditableText';

export default function Faq2Section({ module }: { module: any }) {
  const { titleFontFamily, bodyFontFamily, fontSizeStep, updateModuleContent, mainColor } = useEditorStore();
  
  // 전체적인 크기감 유지
  const baseSize = [24, 28, 30][fontSizeStep];

  const handleUpdateItem = (index: number, key: 'question' | 'answer', value: string) => {
    const newItems = [...module.items];
    newItems[index][key] = value;
    updateModuleContent(module.id, 'items', newItems as any);
  };

  return (
    <section className="w-full py-12 px-12 bg-white flex flex-col gap-16 max-w-[1000px] mx-auto">
      {module.items?.map((item: any, index: number) => (
        <div key={item.id} className="flex flex-col gap-6">
          
          {/* ❓ Question: 왼쪽 (테두리에 mainColor 적용) */}
          <div className="flex flex-col items-start w-full">
            <span 
              className="ml-2 mb-2 font-black" 
              style={{ 
                fontSize: `${baseSize * 1.1}px`,
                color: mainColor // Q 번호 색상
              }}
            >
              Q{index + 1}.
            </span>
            <div 
              className="bg-white border-[3px] rounded-[25px] px-6 py-4 max-w-[85%] shadow-sm"
              style={{ borderColor: mainColor }} // 테두리 색상
            >
              <EditableText 
                initialValue={item.question}
                style={{ 
                  fontFamily: bodyFontFamily, 
                  fontSize: `${baseSize}px`, 
                  color: '#333', 
                  fontWeight: '500',
                  lineHeight: '1.4'
                }}
                onSave={(val) => handleUpdateItem(index, 'question', val)}
              />
            </div>
          </div>

          {/* 💡 Answer: 오른쪽 (배경 및 말꼬리에 mainColor 적용) */}
          <div className="flex flex-col items-end w-full relative">
            <div 
              className="relative rounded-[35px] px-10 py-8 max-w-[85%] shadow-md mr-4"
              style={{ backgroundColor: mainColor }} // 배경색
            >
              <EditableText 
                initialValue={item.answer}
                style={{ 
                  fontFamily: bodyFontFamily, 
                  fontSize: `${baseSize * 0.9}px`, 
                  color: '#fff',
                  fontWeight: '500',
                  lineHeight: '1.6',
                  textAlign: 'right'
                }}
                onSave={(val) => handleUpdateItem(index, 'answer', val)}
              />
              
              {/* ✨ 오른쪽 말풍선 꼬리 (mainColor 동적 반영) */}
              <div 
                className="absolute top-[30px] -right-[15px] w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent"
                style={{ 
                  borderLeft: `20px solid ${mainColor}`, // 꼬리 색상
                  filter: 'drop-shadow(2px 0px 1px rgba(0,0,0,0.1))' 
                }}
              />
            </div>
          </div>

        </div>
      ))}
    </section>
  );
}