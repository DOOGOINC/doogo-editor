import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AutoLogout from "@/components/auth/AutoLogout";
import VisitorTracker from "@/components/VisitorTracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 1. 이건 구글/네이버 검색 결과용 (길어도 괜찮음)
  title: {
    default: "AI 상세페이지 자동 제작 | 상품사진 한 장으로 쇼핑몰 매출 콘텐츠 완성 - 두고스튜디오",
    template: "%s | doogo",
  },
  
  // 2. 이게 카카오톡/SNS 공유용 (짧게 수정 제안)
  openGraph: {
    title: "AI 상세페이지 자동 제작 | 상품사진 한 장으로 쇼핑몰 매출 콘텐츠 완성 - 두고스튜디오",
    description: "상품 사진 한 장만 업로드하면 AI가 상세페이지, 광고 콘텐츠까지 자동 생성합니다.  쇼핑몰 운영자를 위한 빠르고 쉬운 상세페이지 제작 솔루션, 두고스튜디오. ", 
    url: "https://doogostudio.co.kr/",
    siteName: "두고스튜디오",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <head>
        
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AutoLogout />
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
