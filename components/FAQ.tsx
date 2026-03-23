'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_DATA = [
  {
    question: "포인트는 어떻게 충전하고 사용하나요?",
    answer: "마이페이지에서  5,000P 단위로 충전하실 수 있습니다. 상세페이지 PNG 다운로드, 문구 생성시 일정 포인트가 차감됩니다."
  },
  {
    question: "제작한 상세페이지의 저작권은 누구에게 있나요?",
    answer: "생성된 모든 콘텐츠의 저작권은 사용자 본인에게 귀속됩니다. 쇼핑몰, 광고 등 상업적인 용도로 제한 없이 자유롭게 활용하실 수 있습니다."
  },
  {
    question: "이미지 업로드 용량 제한이 있나요?",
    answer: "최대 12개 까지 업로드 가능하며, 고화질 이미지를 권장합니다."
  },
  {
    question: "다른 서비스와 차별점이 무엇인가요?",
    answer: "단순 텍스트 생성이 아닙니다. 커머스에 최적화된 심리학 기반의 카피라이팅과 고퀄리티 UI 컴포넌트를 결합하여, 클릭 한 번으로 '팔리는' 상세페이지를 완성해 드립니다."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-[#f8f9fa]">
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* 중앙 타이틀 영역 */}
        <div className="text-center mb-16">
          <h2 className="text-[36px] font-black text-gray-900 mb-4 tracking-tighter">
            자주 묻는 질문
          </h2>
          <p className="text-[16px] text-gray-500 font-medium">
            궁금하신 점을 확인하고 바로 시작해 보세요.
          </p>
        </div>

        {/* 중앙 정렬 아코디언 리스트 */}
        <div className="space-y-4">
          {FAQ_DATA.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:border-[#155dfc]/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-7 text-left cursor-pointer group"
              >
                <span className={`text-[18px] font-bold tracking-tight transition-colors ${
                  openIndex === idx ? 'text-[#155dfc]' : 'text-gray-900 group-hover:text-[#155dfc]'
                }`}>
                  {item.question}
                </span>
                <div className={`p-1.5 rounded-full transition-all ${
                  openIndex === idx ? 'bg-[#155dfc] text-white' : 'bg-gray-50 text-gray-400'
                }`}>
                  <ChevronDown 
                    size={18} 
                    className={`transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} 
                  />
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-7 pb-7">
                  <p className="text-[16px] leading-relaxed text-gray-500 font-medium pt-4 border-t border-gray-50">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 추가 문의 안내 */}
        {/* <div className="mt-16 text-center">
          <p className="text-[14px] text-gray-400 font-bold">
            더 궁금한 점이 있으신가요? <span className="text-[#155dfc] cursor-pointer hover:underline ml-1">고객센터 문의하기</span>
          </p>
        </div> */}

      </div>
    </section>
  );
}