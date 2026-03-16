// gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// 💡 NEXT_PUBLIC을 제거하고 오직 서버의 환경변수만 참조합니다.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey && typeof window === "undefined") {
  // 서버 환경에서만 경고를 띄웁니다.
  console.error("⚠️ GEMINI_API_KEY가 서버 환경변수에 설정되지 않았습니다.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// 서버 사이드에서만 사용할 모델 인스턴스
export const model20Flash = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  generationConfig: { responseMimeType: "application/json" } // 💡 응답을 JSON으로 강제
});