import { create } from 'zustand';
import { temporal } from 'zundo';

export interface Module {
  id: string;
  type: 'HERO' | 'DESC' | 'INFO' | 'CHECKPOINT' | 'CHECKPOINT2' | 'CHECKPOINT3' | 'TARGET' | 'FAQ' | 'FAQ2' | 'PRODUCT_INFO' | 'IMAGE_ONLY';
  title: string;
  content?: string;
  subContent?: string;
  image?: string;
  brandName?: string;
  tag1?: string;
  tag2?: string;
  tag3?: string;
  tag4?: string;
  subTitle?: string;
  infoLabel1?: string;
  infoLabel2?: string;
  infoDesc1?: string;
  infoDesc2?: string;
  items?: any[];
}

interface EditorState {
  productName: string;
  baseDescription: string;
  mainColor: string;
  modules: Module[];
  uploadedImages: { url: string; is_ai?: boolean }[]; 
  canvasScale: number;
  hoveredModuleId: string | null;
  recommendedKeywords: string[]; // AI가 생성한 추천 키워드 리스트

  // 💡 통합된 단계별 폰트 상태
  fontFamily: string;     // 전체 통합 폰트
  titleFontFamily: string; // 제목용 폰트
  bodyFontFamily: string;  // 본문용 폰트
  fontSizeStep: number;
  scrollToId: string | null;
  setScrollToId: (id: string | null) => void;
  setTitleFontFamily: (font: string) => void;
  setBodyFontFamily: (font: string) => void;

  setProductName: (name: string) => void;
  setBaseDescription: (desc: string) => void;
  setMainColor: (color: string) => void;
  setModules: (modules: Module[]) => void;
  setUploadedImages: (images: { url: string; is_ai?: boolean }[]) => void; 
  addUploadedImage: (image: { url: string; is_ai?: boolean }) => void;
  removeUploadedImage: (index: number) => void;
  addModule: (type?: Module['type']) => void;
  removeModule: (id: string) => void;
  updateModuleImage: (id: string, imageUrl: string) => void;
  updateModuleContent: (id: string, field: string, value: string) => void;
  setCanvasScale: (scale: number) => void;
  setHoveredModuleId: (id: string | null) => void;
  setRecommendedKeywords: (keywords: string[]) => void;
  duplicateModule: (id: string) => void;
  moveModule: (id: string, direction: 'up' | 'down') => void;
  

  // 💡 통합된 폰트 액션
  setFontFamily: (font: string) => void;
  setFontSizeStep: (step: number) => void;
  // 💡 프로젝트 데이터 전체 설정 액션 추가
  setProjectData: (data: {
    name: string;
    mainColor: string;
    modules: Module[];
    fontFamily: string;
    titleFontFamily: string;
    bodyFontFamily: string;
    fontSizeStep: number;
  }) => void;
}

export const useEditorStore = create<EditorState>()(
  temporal((set) => ({
    recommendedKeywords: [],
  canvasScale: 0.6,
  hoveredModuleId: null,
  productName: '',
  baseDescription: '',
  scrollToId: null,
  mainColor: '#3b82f6',
  setScrollToId: (id) => set({ scrollToId: id }),
  // 💡 폰트 설정 초기값
  fontFamily: 'Pretendard',
  fontSizeStep: 1, // '보통'이 기본값
  titleFontFamily: 'Pretendard',
  bodyFontFamily: 'Pretendard',

  // 💡 프로젝트 데이터 전체 설정 구현
  setProjectData: (data) => set({
    productName: data.name,
    mainColor: data.mainColor,
    modules: data.modules,
    fontFamily: data.fontFamily,
    titleFontFamily: data.titleFontFamily,
    bodyFontFamily: data.bodyFontFamily,
    fontSizeStep: data.fontSizeStep
  }),

  setTitleFontFamily: (font) => set({ titleFontFamily: font }),
  setBodyFontFamily: (font) => set({ bodyFontFamily: font }),
  setFontSizeStep: (step) => set({ fontSizeStep: step }),

  // 💡 폰트 관련 액션 구현
  setFontFamily: (font) => set({ fontFamily: font }),

  // 초기 모듈 데이터
  modules: [
    { 
      id: 'm1', 
      type: 'HERO', 
      title: 'LACTINON-G™\n' + '1100억 유산균',
      content: '프리미엄 프로바이오틱스',
      brandName: 'Selectonery',
      tag1: '뉴질랜드 생산',
      tag2: '30캡슐',
      tag3: '안전한 블리스터 포장'
    },
    { 
      id: 'm2', 
      type: 'CHECKPOINT', 
      subTitle: 'CHECK POINT 1.',
      title: '1 캡슐 당\n1100억 CFU',
      content: '<b>하루 1캡슐로 1100억 마리 이상의 유산균</b>을 간편하게\n' +
                '섭취할 수 있도록 고함량으로 설계된 제품입니다.\n' +
                '여러 캡슐을 복용할 필요 없이, 1일 1회 섭취만으로도\n' +
                '충분한 유익균을 공급할 수 있도록 배합하였습니다.',
    },
    { 
      id: 'm3', 
      type: 'CHECKPOINT2', 
      subTitle: 'CHECK POINT 2.',
      title: '엄격한 생산과정,\n뉴질랜드 생산',
      content: 'Selectonery LACTINON-G™ 1100억 유산균은\n' +
                '<b>청정한 자연환경을 간직한 뉴질랜드</b>에서\n' +
                '<b>엄격한 공인 검증기관의 검사</b>를 거쳐\n' +
                '원료 본연의 가치를 담아 생산하여 믿고 선택할 수 있는\n' +
                '프리미엄 프로바이오틱스입니다.',
    },
    { 
      id: 'm4', 
      type: 'CHECKPOINT3', 
      subTitle: 'CHECK POINT 3.',
      title: '위생적인\nPTP 개별포장',
      content: '셀렉토너리 랙티논-G는 보틀형 패키지가 아닌\n' +
                '<b>위생적이고 휴대가 간편한 PTP 개별포장</b>으로\n' +
                '오염으로부터 안심하고 섭취하시 수 있습니다.',
    },
    { 
      id: 'm5', 
      type: 'TARGET', 
      brandName: 'Selectonery',
      subTitle: 'LACTINON-G™ 110B',
      title: '이런 분들께\n추천해요',
      tag1: '<b>고함량 복합 유산균</b>을 찾고있어요.',
      tag2: '<b>프리바이오틱스와 배합</b>된 프로바이오틱스를 원해요!',
      tag3: '<b>식물성 캡슐</b>로 제작된 포뮬러를 찾고있어요.',
      tag4: '<b>하루 한 캡슐</b>만 섭취하고 싶어요!',
      content: ''
    },
    { 
      id: 'm6', 
      type: 'INFO', 
      brandName: 'Selectonery',
      subTitle: 'LACTINON-G™ 110B',
      title: '섭취 및 보관방법',
      infoDesc1: '1일 1회, 1캡슐을 식후 아침에 섭취하시거나,\n 전문가의 권장에 따라 섭취하십시오.',
      infoDesc2: '서늘하고 건조한 곳에 보관하시고,\n 밀봉이 손상된 경우 사용하지 마십시오.',
      infoLabel1: '<b>하루 한 번</b>',
      infoLabel2: '<b>상온보관</b>',
      content: ''
    },
    { 
      id: 'm7', 
      type: 'FAQ', 
      brandName: 'Selectonery',
      subTitle: '청정 뉴질랜드에서 온 프로바이오틱스, 렉티논-G™',
      title: '자주 묻는 질문',
      content: '뉴질랜드에서 직접 답변드립니다.'
    },
    { 
      id: 'm8', 
      type: 'FAQ2',
      title: '',
      items: [
        {
          id: 1,
          question: "패키지에 영어로 표기되어 있던데\n뉴질랜드 제품인가요?",
          answer: "네 맞습니다.\n청정 자연을 자랑하는 뉴질랜드에서 생산된 제품으로,\n안전 관리에 철저한 GMP 인증을 받은 시설에서\n제조된 뉴질랜드 제품입니다."
        },
        {
          id: 2,
          question: "몇가지 유산균이 배합된 제품인가요?",
          answer: "1캡슐 당 110 Billion(1,100억) CFU의\n고함량 유산균을 함유한 총 19종의\n복합 유산균 배합 제품입니다."
        },
        {
          id: 3,
          question: "섭취시 부작용이 생기지는 않을까요?",
          answer: "과다 섭취 시 복통, 구토, 설사 등을\n유발할 수 있기 때문에 권장량을 섭취하셔야 합니다.\n임신 중이거나 수유 중인 경우, 또는 질환이 있거나\n약물을 복용 중인 경우에는\n의료 전문가와 상담 후 섭취하시길 바랍니다."
        }
      ]
    },
    { 
      id: 'm9', 
      type: 'PRODUCT_INFO', 
      title: '상품정보',
      infoItems: [
        { label: '상품명', value: 'Premiun Probiotics LACTINON-G™' },
        { label: '제조원', value: 'Selectonery' },
        { label: '내용량', value: '30 베지캡슐' },
        { label: '제품 성분', value: 'Probiotic Blend (110 Billion CFU at time of manufacture):\nLactobacillus acidophilus, Lactobacillus casei, Lactobacillus rhamnosus, Lactobacillus plantarum, Lactobacillus salivarius, Lactobacillus bulgaricus, Lactobacillus fermentum, Lactobacillus gasseri, Lactobacillus helveticus, Lactobacillus johnsonii, Lactobacillus paracasei, Lactobacillus reuteri, Lactobacillus ruminis, Lactococcus lactis, Streptococcus thermophilus, Bifidobacterium longum, Bifidobacterium breve, Bifidobacterium lactis, Bifidobacterium bifidum' },
        { label: '원산지', value: '뉴질랜드' },
        { label: '유통기한', value: '제품에 별도 표기' },
        { label: '섭취방법', value: '1일 1회, 1캡슐을 식후 아침에 섭취하시거나, 전문가의 권장에 따라 섭취하십시오.' },
        { label: '주의사항', value: '어린이의 손이 닿지 않는 곳에 보관하십시오. 서늘하고 건조한 곳에 보관하시고, 밀봉이 손상된 경우 사용하지 마십시오. 임신 중이거나 수유 중인 경우 섭취를 권장하지 않습니다. 증상이 지속되면 전문가와 상담하십시오.' }
      ]
    },
    { 
      id: 'm10',
      type: 'IMAGE_ONLY', 
      title: '' ,
      brandName: 'Selectonery',
    },
  ],
  uploadedImages: [],
  
  setProductName: (name) => set({ productName: name }),
  setBaseDescription: (desc) => set({ baseDescription: desc }),
  setMainColor: (color) => set({ mainColor: color }),
  setModules: (modules) => set({ modules }),
  setUploadedImages: (images) => set({ uploadedImages: images }), 
  setCanvasScale: (scale: number) => set({ canvasScale: scale }),
  setHoveredModuleId: (id) => set({ hoveredModuleId: id }),
  setRecommendedKeywords: (keywords) => set({ recommendedKeywords: keywords }),

  addUploadedImage: (image) => set((state) => ({
    uploadedImages: [image, ...state.uploadedImages]
  })),
  removeUploadedImage: (index: number) => set((state) => ({
    uploadedImages: state.uploadedImages.filter((_, i) => i !== index)
  })),
  addModule: (type = 'DESC') => set((state) => {
    // 1. ID를 먼저 생성합니다. (그래야 아래에서 참조 가능)
    const newId = Math.random().toString(36).substr(2, 9);
    
    const defaultData: Record<string, Partial<Module>> = {
      HERO: {
        title: '새로운 히어로 타이틀',
        content: '여기에 서브 문구를 적어보세요.',
        brandName: 'Brand Name',
      },
      CHECKPOINT: {
        subTitle: `CHECK POINT 1.`,
        title: '메인 카피를 입력하세요',
        content: '상세 설명을 입력하세요.',
      },
      CHECKPOINT2: {
        subTitle: `CHECK POINT 2.`,
        title: '메인 카피를 입력하세요',
        content: '상세 설명을 입력하세요.',
      },
      CHECKPOINT3: {
        subTitle: `CHECK POINT 3.`,
        title: '메인 카피를 입력하세요',
        content: '상세 설명을 입력하세요.',
      },
      TARGET: {
        title: '이런 분들께 추천해요',
        tag1: '추천 대상 1',
        tag2: '추천 대상 2',
      },
      DESC: {
        title: '내용을 입력하세요.',
        content: '상세 내용을 입력하세요.',
      }
    };
  
    const config = defaultData[type] || defaultData.DESC;
  
    return {
      // 2. scrollToId는 modules 밖에서 업데이트해야 Canvas가 감지합니다.
      scrollToId: newId, 
      modules: [
        ...state.modules,
        {
          id: newId, // 위에서 만든 ID 사용
          type: type as any,
          subTitle: '',
          title: '',
          content: '',
          ...config,
        }
      ]
    };
  }),

  removeModule: (id) => set((state) => ({
    modules: state.modules.filter(m => m.id !== id),
    hoveredModuleId: null
  })),

  duplicateModule: (id) => set((state) => {
    const index = state.modules.findIndex((m) => m.id === id);
    if (index === -1) return {}; 
    
    const newModule = { 
      ...state.modules[index], 
      id: `mod-${Date.now()}` 
    };
    
    const newModules = [...state.modules];
    newModules.splice(index + 1, 0, newModule);
    
    return { modules: newModules };
  }),

  moveModule: (id, direction) => set((state) => {
    const index = state.modules.findIndex((m) => m.id === id);
    if (index === -1) return {};

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= state.modules.length) return {};

    const newModules = [...state.modules];
    const [movedItem] = newModules.splice(index, 1);
    newModules.splice(newIndex, 0, movedItem);

    return { modules: newModules };
  }),

  updateModuleImage: (id, imageUrl) => set((state) => ({
    modules: state.modules.map((m) => m.id === id ? { ...m, image: imageUrl } : m)
  })),

  updateModuleContent: (id, field, value) => set((state) => ({
    modules: state.modules.map((m) => 
      m.id === id ? { ...m, [field]: value } : m
    )
  })),
  
}),
{ 
  limit: 6,
  partialize: (state) => ({
    modules: state.modules,
  }), 
}
)
);