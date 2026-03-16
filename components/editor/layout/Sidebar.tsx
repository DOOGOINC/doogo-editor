// Edited by Gemini CLI
'use client';

import React, { useState, useRef } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { ImageTab, InfoTab, ModuleTab, TemplateTab } from './SidebarTabs';
import { supabase } from '@/lib/supabase';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<'template' | 'image' | 'info' | 'module'>('template');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    uploadedImages, addUploadedImage, setUploadedImages, 
    modules, setModules, productName, baseDescription 
  } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor), 
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // 💡 이미지 라이브러리에서 영구 삭제 (Storage + DB)
  const handleDeleteImage = async (url: string) => {
    if (!window.confirm('이미지를 라이브러리에서 영구적으로 삭제하시겠습니까?')) return;

    try {
      // 1. DB에서 해당 URL의 정보(storage_path) 가져오기
      const { data: imgData, error: fetchError } = await supabase
        .from('user_images')
        .select('storage_path')
        .eq('url', url)
        .single();

      if (fetchError) throw fetchError;

      if (imgData) {
        // 2. Storage에서 파일 삭제
        const { error: storageError } = await supabase.storage
          .from('user-images')
          .remove([imgData.storage_path]);

        if (storageError) console.error('Storage 삭제 에러:', storageError);

        // 3. DB에서 기록 삭제
        const { error: dbError } = await supabase
          .from('user_images')
          .delete()
          .eq('url', url);

        if (dbError) throw dbError;

        // 4. 스토어 상태 업데이트
        setUploadedImages(uploadedImages.filter(u => u !== url));
      }
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      alert('이미지 삭제 중 오류가 발생했습니다.');
    }
  };

  // 💡 마스터 템플릿 적용 함수 (INITIAL_TEMPLATE 생략 - 기존 유지)
  const applyFullTemplate = () => {
    if (!window.confirm('현재 작업 중인 내용이 모두 사라지고 기본 템플릿이 적용됩니다. 계속하시겠습니까?')) return;
    const INITIAL_TEMPLATE = [
      { id: 'm1', type: 'HERO', title: 'LACTINON-G™\n' + '1100억 유산균', content: '프리미엄 프로바이오틱스', brandName: 'Selectonery', tag1: '뉴질랜드 생산', tag2: '30캡슐', tag3: '안전한 블리스터 포장' },
      { id: 'm2', type: 'CHECKPOINT', subTitle: 'CHECK POINT 1.', title: '1 캡슐 당\n1100억 CFU', content: '<b>하루 1캡슐로 1100억 마리 이상의 유산균</b>을 간편하게\n' + '섭취할 수 있도록 고함량으로 설계된 제품입니다.\n' + '여러 캡슐을 복용할 필요 없이, 1일 1회 섭취만으로도\n' + '충분한 유익균을 공급할 수 있도록 배합하였습니다.' },
      { id: 'm3', type: 'CHECKPOINT2', subTitle: 'CHECK POINT 2.', title: '엄격한 생산과정,\n뉴질랜드 생산', content: 'Selectonery LACTINON-G™ 1100억 유산균은\n' + '<b>청정한 자연환경을 간직한 뉴질랜드</b>에서\n' + '<b>엄격한 공인 검증기관의 검사</b>를 거쳐\n' + '원료 본연의 가치를 담아 생산하여 믿고 선택할 수 있는\n' + '프리미엄 프로바이오틱스입니다.' },
      { id: 'm4', type: 'CHECKPOINT3', subTitle: 'CHECK POINT 3.', title: '위생적인\nPTP 개별포장', content: '셀렉토너리 랙티논-G는 보틀형 패키지가 아닌\n' + '<b>위생적이고 휴대가 간편한 PTP 개별포장</b>으로\n' + '오염으로부터 안심하고 섭취하시 수 있습니다.' },
      { id: 'm5', type: 'TARGET', brandName: 'Selectonery', subTitle: 'LACTINON-G™ 110B', title: '이런 분들께\n추천해요', tag1: '<b>고함량 복합 유산균</b>을 찾고있어요.', tag2: '<b>프리바이오틱스와 배합</b>된 프로바이오틱스를 원해요!', tag3: '<b>식물성 캡슐</b>로 제작된 포뮬러를 찾고있어요.', tag4: '<b>하루 한 캡슐</b>만 섭취하고 싶어요!', content: '' },
      { id: 'm6', type: 'INFO', brandName: 'Selectonery', subTitle: 'LACTINON-G™ 110B', title: '섭취 및 보관방법', infoDesc1: '1일 1회, 1캡슐을 식후 아침에 섭취하시거나,\n 전문가의 권장에 따라 섭취하십시오.', infoDesc2: '서늘하고 건조한 곳에 보관하시고,\n 밀봉이 손상된 경우 사용하지 마십시오.', infoLabel1: '<b>하루 한 번</b>', infoLabel2: '<b>상온보관</b>', content: '' },
      { id: 'm7', type: 'FAQ', brandName: 'Selectonery', subTitle: '청정 뉴질랜드에서 온 프로바이오틱스, 렉티논-G™', title: '자주 묻는 질문', content: '뉴질랜드에서 직접 답변드립니다.' },
      { id: 'm8', type: 'FAQ2', title: '', items: [ { id: 1, question: "패키지에 영어로 표기되어 있던데\n뉴질랜드 제품인가요?", answer: "네 맞습니다.\n청정 자연을 자랑하는 뉴질랜드에서 생산된 제품으로,\n안전 관리에 철저한 GMP 인증을 받은 시설에서\n제조된 뉴질랜드 제품입니다." }, { id: 2, question: "몇가지 유산균이 배합된 제품인가요?", answer: "1캡슐 당 110 Billion(1,100억) CFU의\n고함량 유산균을 함유한 총 19종의\n복합 유산균 배합 제품입니다." }, { id: 3, question: "섭취시 부작용이 생기지는 않을까요?", answer: "과다 섭취 시 복통, 구토, 설사 등을\n유발할 수 있기 때문에 권장량을 섭취하셔야 합니다.\n임신 중이거나 수유 중인 경우, 또는 질환이 있거나\n약물을 복용 중인 경우에는\n의료 전문가와 상담 후 섭취하시길 바랍니다." } ] },
      { id: 'm9', type: 'PRODUCT_INFO', title: '상품정보', infoItems: [ { label: '상품명', value: 'Premiun Probiotics LACTINON-G™' }, { label: '제조원', value: 'Selectonery' }, { label: '내용량', value: '30 베지캡슐' }, { label: '제품 성분', value: 'Probiotic Blend...' }, { label: '원산지', value: '뉴질랜드' }, { label: '유통기한', value: '제품에 별도 표기' }, { label: '섭취방법', value: '1일 1회...' }, { label: '주의사항', value: '어린이의 손이 닿지 않는 곳에 보관...' } ] },
      { id: 'm10', type: 'IMAGE_ONLY', title: '' , brandName: 'Selectonery' },
    ];
    setModules(INITIAL_TEMPLATE as any);
  };

  // 💡 이미지 업로드 및 라이브러리 저장 (12개 제한)
  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("로그인이 필요합니다.");

    setLoading(true);
    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;

        // 1. Storage 업로드 (경로: user_id/timestamp_filename)
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('user-images') // 💡 'user-images' 버킷이 Supabase에 생성되어 있어야 함
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. 공개 URL 가져오기
        const { data: { publicUrl } } = supabase.storage
          .from('user-images')
          .getPublicUrl(filePath);

        // 3. DB 기록 저장 (user_images 테이블)
        const { error: dbError } = await supabase
          .from('user_images')
          .insert({
            user_id: user.id,
            storage_path: filePath,
            url: publicUrl
          });

        if (dbError) throw dbError;
      }

      // 4. 라이브러리 최신화 (최신 12개만 불러오기)
      const { data: latestImages, error: fetchError } = await supabase
        .from('user_images')
        .select('url')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(12);

      if (fetchError) throw fetchError;
      
      if (latestImages) {
        const urls = latestImages.map(img => img.url);
        setUploadedImages(urls);

        // 💡 캔버스의 빈 이미지 영역에 업로드된 이미지들을 순차적으로 할당
        const uploadedCount = files.length; // 이번에 새로 올린 파일 개수
        const newUrls = urls.slice(0, uploadedCount).reverse(); // 최신 업로드 순서대로 정렬
        
        let urlIdx = 0;
        const updatedModules = modules.map(m => {
          const hasImageField = ['HERO', 'CHECKPOINT', 'CHECKPOINT2', 'CHECKPOINT3', 'TARGET', 'FAQ', 'IMAGE_ONLY'].includes(m.type);
          // 이미지가 비어있는 섹션에만 하나씩 순서대로 넣음
          if (hasImageField && !m.image && urlIdx < newUrls.length) {
            return { ...m, image: newUrls[urlIdx++] };
          }
          return m;
        });
        
        if (urlIdx > 0) {
          setModules(updatedModules);
        }
      }

    } catch (error: any) {
      console.error('업로드 실패:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    e.target.value = '';
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over.id);
      setModules(arrayMove(modules, oldIndex, newIndex));
    }
  };

  const handleAiGenerate = async () => {
    if (!productName || !baseDescription) return alert("정보를 입력해주세요!");
    setLoading(true);
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, baseDescription }),
      });
      if (!res.ok) throw new Error("AI 생성 실패");
      const data = await res.json();
      setModules(modules.map(m => {
        switch (m.type) {
          case 'HERO': return { ...m, title: data.hero?.title || m.title, content: data.hero?.content || m.content, tag1: data.hero?.tag1 || m.tag1, tag2: data.hero?.tag2 || m.tag2, tag3: data.hero?.tag3 || m.tag3 };
          case 'CHECKPOINT': return { ...m, title: data.checkpoint?.title || m.title, content: data.checkpoint?.content || m.content };
          case 'CHECKPOINT2': return { ...m, title: data.checkpoint2?.title || m.title, content: data.checkpoint2?.content || m.content };
          case 'CHECKPOINT3': return { ...m, title: data.checkpoint3?.title || m.title, content: data.checkpoint3?.content || m.content };
          case 'TARGET': return { ...m, subTitle: data.target?.subTitle || m.subTitle, tag1: data.target?.tag1 || m.tag1, tag2: data.target?.tag2 || m.tag2, tag3: data.target?.tag3 || m.tag3, tag4: data.target?.tag4 || m.tag4 };
          case 'INFO': return { ...m, subTitle: data.info?.subTitle || m.subTitle, infoDesc1: data.info?.infoDesc1 || m.infoDesc1, infoDesc2: data.info?.infoDesc2 || m.infoDesc2 };
          case 'FAQ': return { ...m, subTitle: data.faq?.subTitle || m.subTitle, content: data.faq?.content || m.content };
          case 'FAQ2': return { ...m, items: data.faq2?.items || m.items };
          default: return m;
        }
      }));
      alert("AI 텍스트 생성이 완료되었습니다!");
    } catch (error) {
      console.error(error);
      alert("생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 bg-[#0b0e14] text-white h-screen flex flex-col border-r border-[#1c212c]">
      <div className="flex bg-[#0b0e14] border-b border-[#1c212c]">
        {(['template', 'image', 'info', 'module'] as const).map((t) => (
          <button 
            key={t} onClick={() => setActiveTab(t)} 
            className={`flex-1 py-4 text-[13px] font-black tracking-tighter transition-all cursor-pointer ${
              activeTab === t 
                ? 'text-[#155dfc] border-b-2 border-[#155dfc] bg-[#155dfc]/5' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t === 'template' ? '템플릿' : t === 'image' ? '이미지' : t === 'info' ? '정보' : '모듈'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 
        [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#0b0e14]
        [&::-webkit-scrollbar-thumb]:bg-[#1c212c] [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-[#155dfc] transition-colors">
        
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
        
        {activeTab === 'template' && <TemplateTab applyFullTemplate={applyFullTemplate} />}
        {activeTab === 'image' && (
          <ImageTab 
            fileInputRef={fileInputRef} 
            processFiles={processFiles} 
            handleDeleteImage={handleDeleteImage} // 💡 삭제 함수 전달
          />
        )}
        {activeTab === 'info' && <InfoTab handleAiGenerate={handleAiGenerate} loading={loading} />}
        {activeTab === 'module' && <ModuleTab sensors={sensors} handleDragEnd={handleDragEnd} />}
      </div>
    </div>
  );
}