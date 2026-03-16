// src/components/editor/DraggableModule.tsx
'use client';

import { useEditorStore } from '@/store/useEditorStore';
import HeroSection from './sections/HeroSection';
import CheckPointSection from './sections/CheckPointSection';
import CheckPointSection2 from './sections/CheckPointSection2';
import CheckPointSection3 from './sections/CheckPointSection3';
import TargetSection from './sections/TargetSection';
import InformationSection from './sections/InformationSection';
import FaqSection from './sections/FaqSection';
import FaqSection2 from './sections/FaqSection2';
import ProductInfoSection from './sections/ProductInfoSection';
import ImageOnlySection from './sections/ImageOnlySection';



export default function DraggableModule({ module }: { module: any }) {
  const { updateModuleImage, setHoveredModuleId } = useEditorStore();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 1. 파일 드롭 처리 (컴퓨터에서 직접 드래그)
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) return;
      const blobUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        updateModuleImage(module.id, blobUrl);
      };
      img.src = blobUrl;
      return;
    }

    // 2. 라이브러리 이미지 드롭 처리 (사이드바에서 드래그)
    const imageUrl = e.dataTransfer.getData("imageUrl");
    if (imageUrl) {
      updateModuleImage(module.id, imageUrl);
    }
  };
  

  return (
    <div 
      id={`module-${module.id}`}
      onMouseEnter={() => setHoveredModuleId(module.id)}
      onMouseLeave={() => setHoveredModuleId(null)}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={handleDrop}
      className="relative group bg-white transition-all border-b border-gray-100"
    >
      {/* 💡 분리된 섹션 컴포넌트 호출 */}
      {module.type === 'HERO' && <HeroSection module={module} />}
      {module.type === 'CHECKPOINT' && <CheckPointSection module={module} />}
      {module.type === 'CHECKPOINT2' && <CheckPointSection2 module={module} />}
      {module.type === 'CHECKPOINT3' && <CheckPointSection3 module={module} />}
      {module.type === 'TARGET' && <TargetSection module={module} />}
      {module.type === 'INFO' && <InformationSection module={module} />}
      {module.type === 'FAQ' && <FaqSection module={module} />}
      {module.type === 'FAQ2' && <FaqSection2 module={module} />}
      {module.type === 'PRODUCT_INFO' && <ProductInfoSection module={module} />}
      {module.type === 'IMAGE_ONLY' && <ImageOnlySection module={module} />}
      
      
      
      
      {/* 가이드 라인 유지 */}
      <div className="absolute inset-0 border-[6px] border-transparent group-hover:border-[#E46278] pointer-events-none transition-all z-50" />
    </div>
  );
}