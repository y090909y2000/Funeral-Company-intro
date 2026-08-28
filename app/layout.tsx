import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { VisitorGate } from "./components/visitor";

export const metadata: Metadata = {
  title: {
    default: "安和生命禮儀｜讓思念，有安放的地方",
    template: "%s｜安和生命禮儀",
  },
  description:
    "安和生命禮儀提供 24 小時到府接體、治喪流程規劃、傳統科儀誦經、會場花藝佈置與後續關懷。一位禮儀師從初終陪到合爐，不轉手、不加價、不催促。",
  keywords: [
    "生命禮儀",
    "殯葬服務",
    "治喪流程",
    "殯葬科儀",
    "禮儀公司",
    "做七",
    "對年合爐",
  ],
  openGraph: {
    title: "安和生命禮儀｜讓思念，有安放的地方",
    description:
      "24 小時到府接體、治喪規劃、傳統科儀與後續關懷。一位禮儀師全程陪伴。",
    locale: "zh_TW",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant-TW" className="h-full">
      <head>
        {/* 中文字體走 Google Fonts 的 unicode-range 分包，比自帶字檔輕得多 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* 這裡刻意不用 next/font：繁中字體的字符集龐大，自帶字檔會塞進數 MB
            的 woff2 分包並拖慢編譯。走 Google Fonts 讓瀏覽器按 unicode-range
            只取用到的分包，載入量小得多，失敗時也會退回 globals.css 的系統字體堆疊。
            no-page-custom-font 這條規則是針對 Pages Router 的 _document，此處不適用。 */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&display=swap"
        />
      </head>
      <body className="grain min-h-full flex flex-col bg-cream text-ink">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {/* 首次到訪詢問稱呼；已填過或選擇跳過就不會出現 */}
        <VisitorGate />
      </body>
    </html>
  );
}
