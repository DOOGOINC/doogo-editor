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
    title: "AI 상세페이지 자동 제작 | 상품사진 한 장으로 쇼핑몰 매출 콘텐츠 완성 - 두고스튜디오",
    description: "AI 상세페이지 자동 제작 | 상품사진 한 장으로 쇼핑몰 매출 콘텐츠 완성 - 두고스튜디오",
    url: "https://doogostudio.co.kr/",
    siteName: "두고스튜디오",
    images: [
      {
        url: "/og-image.jpg", // public 폴더 안에 있는 이미지 파일명 (1200x630 권장)
        width: 1200,
        height: 630,
        alt: "두고스튜디오 서비스 미리보기 이미지",
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
