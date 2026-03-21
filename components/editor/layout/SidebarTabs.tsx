'use client';

import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableModuleItem } from './SortableModuleItem';
import { LayoutTemplate } from 'lucide-react';

export const ImageTab = ({ fileInputRef, processFiles, handleDeleteImage }: any) => {
  const { uploadedImages } = useEditorStore();
  const [isOver, setIsOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploadedImages.length < 12) {
      setIsOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. 기존 업로드 섹션 */}
      <section>
        <div className="flex justify-between items-end mb-3">
          <h3 className="text-[12px] font-black text-gray-500 uppercase tracking-widest">상품 이미지 업로드</h3>
          <span className={`text-[10px] font-bold ${uploadedImages.length >= 12 ? 'text-red-500' : 'text-[#3b82f6]'}`}>
            {uploadedImages.length} / 12
          </span>
        </div>
        <div 
          onClick={() => uploadedImages.length < 12 && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            isOver 
              ? 'border-[#155dfc] bg-[#155dfc]/10 scale-[1.02]' 
              : 'border-[#1c212c] hover:border-[#155dfc]'
          } ${uploadedImages.length >= 12 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <p className={`text-[14px] uppercase font-bold transition-colors ${isOver ? 'text-[#155dfc]' : 'text-gray-500'}`}>
            {isOver ? 'Drop to Upload' : '클릭하거나 이미지를 드래그'}
          </p>
        </div>
      </section>
      
      {/* 2. 라이브러리 섹션 */}
      <section>
        <h3 className="text-[12px] font-black text-gray-500 mb-3 uppercase tracking-widest">라이브러리</h3>
        <div className="grid grid-cols-3 gap-2">
          {uploadedImages.map((img: any, idx: number) => {
            // img가 객체인지 문자열인지에 따라 URL 추출
            const imageUrl = typeof img === 'string' ? img : img.url;
            
            return (
              <div 
                key={idx} 
                className="relative group aspect-square bg-[#1f2937] rounded-lg overflow-hidden border border-[#1f2937] cursor-pointer"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('imageUrl', imageUrl);
                }}
              >
                <img src={imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (imageUrl) {
                      handleDeleteImage(imageUrl); 
                    } else {
                      console.error("삭제할 이미지 URL이 없습니다.", img);
                    }
                  }}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white w-4 h-4 rounded opacity-0 group-hover:opacity-100 transition-all text-[8px]"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export const InfoTab = ({ handleAiGenerate, loading, aiCost = 1000 }: any) => {
  const { productName, setProductName, baseDescription, setBaseDescription, recommendedKeywords } = useEditorStore();
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleKeywordClick = (keyword: string, index: number) => {
    navigator.clipboard.writeText(keyword).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-[12px] font-black text-gray-500 mb-2 block uppercase tracking-widest">상품명</label>
        <input 
          value={productName} 
          onChange={(e) => setProductName(e.target.value)} 
          className="w-full bg-[#1c212c] rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-[#155dfc] outline-none transition-all" 
          placeholder="예: 건강식품"
        />
      </div>
      <div>
        <label className="text-[12px] font-black text-gray-500 mb-2 block uppercase tracking-widest">상품 설명</label>
        <textarea 
          value={baseDescription} 
          onChange={(e) => setBaseDescription(e.target.value)} 
          rows={8} 
          className="w-full bg-[#1c212c] rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-[#155dfc] outline-none resize-none transition-all" 
          placeholder="상품에 대한 자세한 설명을 입력해주세요. "
        />
      </div>
      <button 
        onClick={handleAiGenerate} 
        disabled={loading} 
        className="w-full py-4 bg-[#155dfc] hover:bg-[#150dfc] disabled:bg-gray-800 rounded-lg font-black text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer flex flex-col items-center justify-center gap-1"
      >
        <span>{loading ? '문구 생성 중' : '문구 생성하기'}</span>
        {!loading && <span className="text-[10px] opacity-70 font-bold">{aiCost.toLocaleString()}P 소모</span>}
      </button>

      {/* AI 추천 키워드 섹션 (데이터가 있을 때만 노출) */}
      {recommendedKeywords && recommendedKeywords.length > 0 && (
        <div className="pt-4 border-t border-gray-800 animate-in fade-in duration-500">
          <h3 className="text-[12px] font-black text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2">
            AI 추천 키워드
          </h3>
          <p className="text-[10px] text-gray-500 mb-3 font-medium">클릭하면 클립보드에 복사됩니다.</p>
          <div className="grid grid-cols-2 gap-2">
            {recommendedKeywords.map((kw, idx) => (
              <button
                key={idx}
                onClick={() => handleKeywordClick(kw, idx)}
                className={`text-[11px] px-3 py-2.5 bg-[#1c212c] hover:bg-[#155dfc]/10 border border-gray-700 hover:border-[#155dfc] text-gray-200 rounded-lg transition-all cursor-pointer text-left relative overflow-hidden group`}
              >
                <span className="relative z-10 font-bold">{kw}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ModuleTab = ({ sensors, handleDragEnd }: any) => {
  const { 
    modules, addModule, mainColor, setMainColor, 
    titleFontFamily, setTitleFontFamily, 
    bodyFontFamily, setBodyFontFamily, 
    fontSizeStep, setFontSizeStep 
  } = useEditorStore();

  const moduleTypes = [
    { type: 'HERO', label: '히어로', icon: '' },
    { type: 'CHECKPOINT', label: '체크포인트 1', icon: '' },
    { type: 'CHECKPOINT2', label: '체크포인트 2', icon: '' },
    { type: 'CHECKPOINT3', label: '체크포인트 3', icon: '' },
    { type: 'TARGET', label: '추천타겟', icon: '' },
  ];

  const colors = [
    { name: '스카이블루', hex: '#0ea5e9' }, { name: '에메랄드', hex: '#10b981' },
    { name: '인디고', hex: '#6366f1' }, { name: '로즈', hex: '#f43f5e' },
    { name: '앰버', hex: '#f59e0b' }, { name: '바이올렛', hex: '#8b5cf6' },
    { name: '슬레이트', hex: '#64748b' }, { name: '틸', hex: '#14b8a6' },
    { name: '시안', hex: '#06b6d4' }, { name: '퓨시아', hex: '#d946ef' },
    { name: '오렌지', hex: '#f97316' }, { name: '라임', hex: '#84cc16' }
  ];

  return (
    <div className="space-y-8">
      <h3 className="text-[12px] font-black text-gray-500 mb-4 uppercase tracking-widest">폰트 설정</h3>
      <section className="bg-[#1c212c] p-4 rounded-xl space-y-4">
        <div>
          <label className="text-[9px] text-gray-500 mb-1 block uppercase font-bold">제목 폰트</label>
          <select value={titleFontFamily} onChange={(e) => setTitleFontFamily(e.target.value)} className="w-full bg-[#1c212c] border border-[#155dfc] rounded p-2 text-xs text-white outline-none focus:border-[#3b82f6]">
            <option value="Pretendard">Pretendard</option>
            <option value="Noto Sans KR">Noto Sans KR</option>
            <option value="GmarketSansMedium">Gmarket Sans</option>
            <option value="Nanum Myeongjo">나눔명조</option>
          </select>
        </div>
        <div>
          <label className="text-[9px] text-gray-500 mb-1 block uppercase font-bold">본문 폰트</label>
          <select value={bodyFontFamily} onChange={(e) => setBodyFontFamily(e.target.value)} className="w-full bg-[#1c212c] border border-[#155dfc] rounded p-2 text-xs text-white outline-none focus:border-[#3b82f6]">
            <option value="Pretendard">Pretendard</option>
            <option value="Noto Sans KR">Noto Sans KR</option>
            <option value="GmarketSansMedium">Gmarket Sans</option>
            <option value="Nanum Myeongjo">나눔명조</option>
          </select>
        </div>
        <div className="flex bg-[#0b0e14] p-1 rounded-lg border border-[#374151]">
          {[0, 1, 2].map((s) => (
            <button key={s} onClick={() => setFontSizeStep(s)} className={`flex-1 py-1.5 text-[10px] font-bold cursor-pointer rounded transition-all ${fontSizeStep === s ? 'bg-[#155dfc] text-white' : 'text-gray-500'}`}>
              {s === 0 ? '작게' : s === 1 ? '보통' : '크게'}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[12px] font-black text-gray-500 mb-4 uppercase tracking-widest">컬러 팔레트</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {colors.map((c) => (
            <button key={c.hex} onClick={() => setMainColor(c.hex)} className={`p-2 rounded-md border-2 transition-all cursor-pointer flex flex-col items-center gap-1 ${mainColor === c.hex ? 'border-white scale-105 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`} style={{ backgroundColor: c.hex }}>
              <span className="text-[10px] font-bold text-white drop-shadow-md">{c.name}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 p-2 bg-[#1c212c] rounded-lg border border-[#1c212c]">
          <input type="color" value={mainColor} onChange={(e) => setMainColor(e.target.value)} className="w-8 h-8 cursor-pointer bg-transparent" />
          <input type="text" value={mainColor.toUpperCase()} onChange={(e) => setMainColor(e.target.value)} className="bg-transparent text-xs text-gray-200 outline-none font-mono" />
        </div>
      </section>

      <section>
        <h3 className="text-[12px] font-black text-gray-500 mb-4 uppercase tracking-widest">상세페이지 구성</h3>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={modules.map(m => m.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1">
              {modules.map((m) => (
                <SortableModuleItem key={m.id} id={m.id} type={m.type} title={m.title} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="grid grid-cols-2 gap-2 mt-6">
          {moduleTypes.map((item) => (
            <button key={item.type} onClick={() => addModule(item.type as any)} className="flex flex-col items-center justify-center p-3 rounded-md bg-[#1c212c] border border-transparent hover:border-[#3b82f6] transition-all group cursor-pointer">
              <span className="text-xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="text-[10px] font-medium text-gray-300">{item.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export const TemplateTab = ({ applyFullTemplate }: any) => {
  return (
    <div className="space-y-6">
      <section>
        <div className="flex justify-between items-end mb-3">
          <h3 className="text-[12px] font-black text-gray-500 uppercase tracking-widest">마스터 템플릿</h3>
        </div>
        <div 
          onClick={applyFullTemplate}
          className="group relative h-40 rounded-2xl overflow-hidden border-2 border-[#1c212c] hover:border-[#155dfc] transition-all cursor-pointer bg-gradient-to-br from-[#1c212c] to-[#0b0e14] flex flex-col items-center justify-center p-6 text-center shadow-lg"
        >
          <div className="w-12 h-12 bg-[#155dfc]/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <LayoutTemplate size={24} className="text-[#155dfc]" />
          </div>
          <h4 className="text-[14px] font-black text-white mb-1 tracking-tight">올인원 상세페이지</h4>
          <p className="text-[11px] text-gray-500 font-bold leading-tight">
            모든 섹션이 포함된<br/>표준 템플릿을 적용합니다
          </p>
          <div className="absolute top-3 right-3 bg-[#155dfc] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
            RECOMMENDED
          </div>
        </div>
      </section>

      <section className="bg-[#1c212c]/50 p-4 rounded-xl border border-[#1c212c]">
        <h5 className="text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest">포함된 섹션</h5>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
          {[
            '히어로 섹션', '체크포인트 1', '체크포인트 2', '체크포인트 3', 
            '추천 타겟', '이미지 전용', '섭취 방법', 'FAQ', '상품 정보'
          ].map((item, idx) => (
            <li key={idx} className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
              <div className="w-1 h-1 bg-[#155dfc] rounded-full" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};