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
  title: {
    default: "AI 상세페이지 자동 제작 | 상품사진 한 장으로 쇼핑몰 매출 콘텐츠 완성 - 두고스튜디오",
    template: "%s | doogo",
  },
  icons: {
    icon: "/favicon.ico",
  },
  // --- 아래 내용을 추가하세요 ---
  openGraph: {
    title: "두고스튜디오 | AI 상세페이지 자동 제작", 
    description: "상품 사진 한 장으로 완성하는 AI 상세페이지 솔루션",
    url: "https://doogostudio.co.kr/",
    siteName: "두고스튜디오",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ko_KR",
    type: "website",
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
