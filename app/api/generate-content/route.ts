import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase 관리자 권한 클라이언트 설정 (포인트 차감용)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { productName, baseDescription, userId } = await req.json();

    // 1. 포인트 체크 및 차감 (userId가 있을 때만)
    if (userId) {
      // 서비스 비용 설정 가져오기
      let cost = 1000;
      try {
        const { data: settings } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'ai_generate_cost')
          .single();
        if (settings) {
          cost = settings.value !== undefined ? parseInt(settings.value) : 1000;
        }      } catch (err) {
        console.error('비용 설정 로드 실패:', err);
      }

      // 유저 포인트 조회
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        return NextResponse.json({ error: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
      }

      if (profile.points < cost) {
        return NextResponse.json({ error: `포인트가 부족합니다. (${cost.toLocaleString()}P 필요)` }, { status: 403 });
      }

      const newBalance = profile.points - cost;

      // 포인트 업데이트
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ points: newBalance })
        .eq('id', userId);

      if (updateError) throw updateError;

      // 이용 로그 기록 (KG 이니시스 필수 요구사항)
      await supabase.from('point_logs').insert({
        user_id: userId,
        amount: -cost,
        balance: newBalance,
        description: `AI 상세페이지 문구 생성 (${productName})`,
      });
    }

    // 2. AI 생성 로직 (기존 유지)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY_MISSING");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" } 
    });
    
    const prompt = `
    Context: 너는 전문 상세페이지 카피라이터야. 
    아래 제공된 [상품명]과 [상품 상세 설명]의 내용을 완벽히 분석해서, 실제 판매가 일어날 수 있도록 프리미엄 카피를 작성해줘.

    [상품명]: ${productName}
    [상품 상세 설명]: ${baseDescription}
    
   Instructions (가장 중요):
    - **주제 일치 규칙**: Hero의 태그와 Checkpoint의 타이틀은 반드시 동일한 핵심 정보를 다뤄야 함.
      1. hero.tag1 (핵심 요약) ↔ checkpoint.title (상세 제목) : 예) '뉴질랜드 생산' ↔ '엄격한 생산과정, 뉴질랜드 생산'
      2. hero.tag2 (핵심 요약) ↔ checkpoint2.title (상세 제목) : 예) '30캡슐' ↔ '1 캡슐 당 1100억 CFU (함량/분량 연결)'
      3. hero.tag3 (핵심 요약) ↔ checkpoint3.title (상세 제목) : 예) '블리스터 포장' ↔ '위생적인 PTP 개별포장'
    - 모든 텍스트에 핵심 강조점은 <b>키워드</b> 태그를 사용.
    - 줄바꿈은 \\n을 사용하고, 신뢰감 있는 전문적인 톤을 유지할 것.
  
    출력 형식(JSON):
    {
      "hero": { 
        "title": "${productName}", 
        "content": "[상품 상세 설명] 요약 브랜드 카피(12자 이내)", 
        "tag1": "특징1 핵심 키워드(7자 이내 <b> 사용 X)", 
        "tag2": "특징2 핵심 키워드(5자 이내 <b> 사용 X)", 
        "tag3": "특징3 핵심 키워드(11자 이내 <b> 사용 X)" 
      },
      "checkpoint": { "title": "tag1을 확장한 매력적인 제목(공백포함 16 ~ 20자 이내 줄바꿈 포함 <b> 사용 X)", "content": "<b>상세 내용(공백 포함 116자 이내)</b>" },
      "checkpoint2": { "title": "tag2를 확장한 매력적인 제목(공백포함 16 ~ 20자 이내 줄바꿈 포함 <b> 사용 X)", "content": "<b>상세 내용(공백 포함 123자 이내)</b>" },
      "checkpoint3": { "title": "tag3를 확장한 매력적인 제목(공백포함 16 ~ 20자 이내 줄바꿈 포함 <b> 사용 X)", "content": "<b>상세 내용(공백 포함 74자 이내)</b>" },
      "target": { 
        "subTitle": "${productName}", 
        "tag1": "추천대상 1 (<b>강조</b>)", "tag2": "추천대상 2 (<b>강조</b>)", "tag3": "추천대상 3 (<b>강조</b>)", "tag4": "추천대상 4 (<b>강조</b>)" 
      },
      "info": { 
        "subTitle": "${productName}", 
        "infoDesc1": "상세 설명에 기재된 섭취 방법 (<b>강조</b> 포함)", 
        "infoDesc2": "상세 설명에 기재된 보관 방법 (<b>강조</b> 포함)"
      },
      "faq": { "subTitle": "전문성 있는 소제목만 작성하고, 뒤에 ${productName}을 붙일 것 (예:청정 뉴질랜드에서 온 프로바이오틱스, ${productName} )", "content": "답변자 신뢰 문구(예:뉴질랜드에서 직접 답변드립니다.) ,  공백포함 18자 이내)" },
      "faq2": {
        "items": [
          { "id": 1, "question": "질문1", "answer": "설명에 근거한 답변 (<b>강조</b> 포함 공백포함 110자 이내)" },
          { "id": 2, "question": "질문2", "answer": "설명에 근거한 답변 (<b>강조</b> 포함 공백포함 110자 이내)" },
          { "id": 3, "question": "질문3", "answer": "설명에 근거한 답변 (<b>강조</b> 포함 공백포함 110자 이내)" }
        ]
      },
      "PRODUCT_INFO": {
        "title": "상품정보",
        "infoItems": [
          { "label": "상품명", "value": "여기에 실제 ${productName}을 작성할 것" }
        ]
      },
      "recommendedKeywords": [
        "키워드1", "키워드2", "키워드3", "키워드4", "키워드5", "키워드6", "키워드7", "키워드8", "키워드9", "키워드10", "키워드11", "키워드12"
      ]
    }
    
    Instruction for recommendedKeywords:
    - 상세페이지 곳곳에 활용하기 좋은 짧고 강렬한 키워드나 소구문구 12개를 생성해줘.
    - 각 항목은 10~20자 이내로 작성할 것.
  `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);

    return NextResponse.json(jsonData);
  } catch (error: any) {
    console.error("AI 생성 에러 상세:", error);
  
    // 429 에러(Quota Exceeded) 처리 추가
    if (error.status === 429 || error.message?.includes("quota")) {
      return NextResponse.json({ 
        error: "현재 AI 요청이 너무 많습니다. 1분만 쉬었다가 다시 시도해주세요!" 
      }, { status: 429 });
    }
  
    if (error.message === "API_KEY_MISSING") {
      return NextResponse.json({ error: "서버에 API Key가 설정되지 않았습니다." }, { status: 500 });
    }
    
    return NextResponse.json({ error: "AI 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}