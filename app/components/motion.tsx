"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────
   共用滾動迴圈
   全站的視差元素共用「一個」scroll listener 與一個 rAF，
   避免每個區塊各自綁事件把主執行緒吃掉。
   ───────────────────────────────────────────────────────────── */

const nodes = new Set<HTMLElement>();
let frame = 0;
let listening = false;

function paint() {
  frame = 0;
  const vh = window.innerHeight;

  for (const el of nodes) {
    const rect = el.getBoundingClientRect();
    // 離視窗太遠就不必算
    if (rect.bottom < -240 || rect.top > vh + 240) continue;

    const center = rect.top + rect.height / 2;
    const raw = (vh / 2 - center) / ((vh + rect.height) / 2);
    const p = raw < -1 ? -1 : raw > 1 ? 1 : raw;
    el.style.setProperty("--p", p.toFixed(4));
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(paint);
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useParallaxFrame() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    nodes.add(el);
    startListening();
    schedule();

    return () => {
      nodes.delete(el);
    };
  }, []);

  return ref;
}

/* ── 視差圖片 ──────────────────────────────────────────────── */

type ParallaxMediaProps = {
  src: string;
  alt: string;
  /** 位移幅度，越大速差越明顯。需小於 overscan 才不會露出邊 */
  shift?: string;
  /** 圖片超出容器的上下留量 */
  overscan?: string;
  sizes?: string;
  priority?: boolean;
  objectPosition?: string;
  className?: string;
  /** 疊在圖片上的內容（遮色片、文字） */
  children?: ReactNode;
};

export function ParallaxMedia({
  src,
  alt,
  shift = "10%",
  overscan = "15%",
  sizes = "100vw",
  priority = false,
  objectPosition = "center",
  className = "",
  children,
}: ParallaxMediaProps) {
  const ref = useParallaxFrame();

  return (
    <div
      ref={ref}
      className={`px-frame ${className}`}
      style={
        { "--px-shift": shift, "--px-over": overscan } as CSSProperties
      }
    >
      <div className="px-media">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition }}
        />
      </div>
      {children}
    </div>
  );
}

/* ── 進場淡入 ──────────────────────────────────────────────── */

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** 毫秒，用來做同一組元素的錯位 */
  delay?: number;
  /** 細線用的展開動畫 */
  variant?: "fade" | "rule";
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "fade",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const base = variant === "rule" ? "reveal-rule" : "reveal";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${base} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
