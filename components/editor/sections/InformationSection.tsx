'use client';

import { useEditorStore } from '@/store/useEditorStore';
import EditableText from '../core/EditableText';

/** ⏰ 시계 아이콘 SVG */
const ClockIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="13" r="8" stroke="black" strokeWidth="1.2" />
    <path d="M12 9V13L14.5 14.5" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M16 4L18 6M8 4L6 6" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/** 🌡️ 온도계 아이콘 SVG */
const TempIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 15V5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5V15" stroke="black" strokeWidth="1.2" />
    <path d="M16.5 17.5C16.5 19.9853 14.4853 22 12 22C9.51472 22 7.5 19.9853 7.5 17.5C7.5 15.658 8.61231 14.0762 10.2013 13.3906C10.6698 13.1885 11 12.7214 11 12.2109V11" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M14 7H16M14 10H16M14 13H16" stroke="black" strokeWidth="1" />
  </svg>
);

export default function InformationSection({ module }: { module: any }) {
  const { titleFontFamily, bodyFontFamily, fontSizeStep, updateModuleContent } = useEditorStore();
  
  const baseSize = [42, 48, 54][fontSizeStep];

  return (
    <section className="flex flex-col items-center w-full bg-white py-16 px-10">
      
      {/* 1. 상단 타이틀 구역 */}
      <div className="w-full max-w-[860px] flex flex-col items-center">
        <div className="w-full flex justify-center pb-8 mb-20 border-b-[2.5px] border-black">
          <EditableText 
            initialValue={module.title || "섭취 및 보관방법"} 
            style={{ 
              fontFamily: titleFontFamily, 
              fontSize: `${baseSize}px`, 
              color: '#000000', 
              fontWeight: '800',
              letterSpacing: '-0.03em'
            }} 
            onSave={(val) => updateModuleContent(module.id, 'title', val)}
          />
        </div>
      </div>

      {/* 2. 정보 리스트 컨테이너 */}
      <div className="w-full max-w-[860px] flex flex-col items-center space-y-12 px-4">
        
        {/* --- 첫 번째 정보 (섭취) --- */}
        <div className="flex items-center w-full max-w-[700px]">
          <div className="flex flex-col items-center w-[160px] shrink-0">
            <div className="mb-3">
              <ClockIcon />
            </div>
            {/* 제목 라벨은 한 줄 유지를 위해 className에 w-full을 주지 않음 */}
            <EditableText 
              initialValue={module.infoLabel1} 
              style={{ 
                fontFamily: bodyFontFamily, 
                fontSize: `${baseSize * 0.70}px`, 
                color: '#000000', 
                fontWeight: '500'
              }} 
              onSave={(val) => updateModuleContent(module.id, 'infoLabel1', val)}
            />
          </div>
          
          {/* 우측 상세 설명: w-full을 주어 줄바꿈이 작동하게 함 */}
          <div className="flex-1 ml-16 overflow-hidden">
            <EditableText 
              initialValue={module.infoDesc1} 
              className="w-full"
              style={{ 
                fontFamily: bodyFontFamily, 
                fontSize: `${baseSize * 0.55}px`, 
                color: '#444444', 
                lineHeight: 1.6,
                wordBreak: 'keep-all', // 단어 단위 줄바꿈
                textAlign: 'left'
              }} 
              onSave={(val) => updateModuleContent(module.id, 'infoDesc1', val)}
            />
          </div>
        </div>

        {/* --- 두 번째 정보 (보관) --- */}
        <div className="flex items-center w-full max-w-[700px]">
          <div className="flex flex-col items-center w-[160px] shrink-0">
            <div className="mb-3">
              <TempIcon />
            </div>
            <EditableText 
              initialValue={module.infoLabel2} 
              style={{ 
                fontFamily: bodyFontFamily, 
                fontSize: `${baseSize * 0.70}px`, 
                color: '#000000', 
                fontWeight: '500'
              }} 
              onSave={(val) => updateModuleContent(module.id, 'infoLabel2', val)}
            />
          </div>
          
          <div className="flex-1 ml-16 overflow-hidden">
            <EditableText 
              initialValue={module.infoDesc2} 
              className="w-full"
              style={{ 
                fontFamily: bodyFontFamily, 
                fontSize: `${baseSize * 0.55}px`, 
                color: '#444444', 
                lineHeight: 1.6,
                wordBreak: 'keep-all',
                textAlign: 'left'
              }} 
              onSave={(val) => updateModuleContent(module.id, 'infoDesc2', val)}
            />
          </div>
        </div>

      </div>

      <div className="w-full max-w-[860px] mt-24 border-t-[2.5px] border-black" />
    </section>
  );
}