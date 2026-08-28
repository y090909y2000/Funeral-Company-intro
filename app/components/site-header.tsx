"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { label: "關於我們", href: "/#about" },
  { label: "服務項目", href: "/#services" },
  { label: "治喪流程", href: "/#process" },
  { label: "後續關懷", href: "/#care" },
  { label: "常見問答", href: "/blog" },
  { label: "小遊戲", href: "/game" },
];

const PHONE = "0800-000-000";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);

  // 換頁就收起選單。在 render 期間比對並重設，比放進 effect 少一次串聯 render，
  // 也涵蓋上一頁／下一頁這種沒有點到連結的情況。
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  // 捲過首屏一點就換成實心底，避免文字壓在亮圖上讀不到
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 選單開啟時鎖住背景滾動
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? "border-b border-linen/70 bg-cream/92 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-18 max-w-[88rem] items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* 字標 */}
          <Link
            href="/"
            className="group flex items-baseline gap-3"
            aria-label="安和生命禮儀 首頁"
          >
            <span
              className={`font-title text-[1.3rem] leading-none transition-colors duration-500 sm:text-[1.45rem] ${
                solid ? "text-espresso" : "text-cream"
              }`}
            >
              安和
            </span>
            <span
              className={`eyebrow hidden pb-px transition-colors duration-500 sm:block ${
                solid ? "text-clay" : "text-sand/85"
              }`}
            >
              An Hé · Life Rites
            </span>
          </Link>

          {/* 桌機導覽 */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative py-1 text-[0.9rem] tracking-[0.14em] transition-colors duration-300 ${
                  solid
                    ? "text-cocoa hover:text-rust"
                    : "text-cream/85 hover:text-cream"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${
                    solid ? "bg-rust" : "bg-gold"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* 24H 專線 */}
            <a
              href={`tel:${PHONE.replace(/-/g, "")}`}
              className={`hidden items-center gap-2.5 rounded-full py-2.5 pl-4 pr-5 text-[0.82rem] tracking-[0.12em] transition-all duration-300 sm:flex ${
                solid
                  ? "bg-espresso text-cream hover:bg-rust"
                  : "bg-cream/12 text-cream ring-1 ring-cream/35 backdrop-blur-sm hover:bg-cream/22"
              }`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-terracotta" />
              </span>
              <span className="numeral">24H {PHONE}</span>
            </a>

            {/* 漢堡鈕 */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "關閉選單" : "開啟選單"}
              aria-expanded={menuOpen}
              className={`flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full transition-colors duration-300 lg:hidden ${
                solid ? "text-espresso" : "text-cream"
              }`}
            >
              <span
                className={`block h-px w-5 bg-current transition-all duration-300 ${
                  menuOpen ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-current transition-all duration-300 ${
                  menuOpen ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* 手機／平板全螢幕選單 */}
      <div
        className={`fixed inset-0 z-40 bg-cream transition-[opacity,visibility] duration-500 lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex h-full flex-col justify-between px-7 pb-12 pt-28 sm:px-10">
          <nav className="flex flex-col">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="group flex items-baseline gap-5 border-b border-linen/60 py-5 transition-all duration-500"
                style={{
                  transitionDelay: menuOpen ? `${120 + i * 70}ms` : "0ms",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "none" : "translateY(14px)",
                }}
              >
                <span className="numeral text-xs text-clay">
                  0{i + 1}
                </span>
                <span className="font-title text-2xl text-espresso transition-colors group-hover:text-rust sm:text-3xl">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="space-y-5">
            <div className="rule-gold" />
            <p className="text-[0.8rem] leading-relaxed tracking-wider text-cocoa/75">
              我們知道此刻您沒有心力比較與挑選。
              <br />
              先撥一通電話，其餘的交給我們。
            </p>
            <a
              href={`tel:${PHONE.replace(/-/g, "")}`}
              className="flex items-center justify-center gap-3 rounded-full bg-espresso py-4 text-cream transition-colors hover:bg-rust"
            >
              <span className="eyebrow text-gold">24 hours</span>
              <span className="numeral text-lg tracking-widest">{PHONE}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
