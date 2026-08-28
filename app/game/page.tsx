import type { Metadata } from "next";
import Link from "next/link";
import { ParallaxMedia, Reveal } from "../components/motion";
import { CoinGame } from "./coin-game";

export const metadata: Metadata = {
  title: "聚寶盆接金幣",
  description:
    "15 秒的小遊戲：移動聚寶盆接住掉下來的金幣，面額有 1、5、10、50、100 元。純娛樂單元，分數不代表任何優惠。",
};

export default function GamePage() {
  return (
    <>
      {/* 深色首屏：頁首在頂部是透明的，底下需要暗色才讀得到 */}
      <section className="relative h-[52svh] min-h-[20rem] w-full overflow-hidden">
        <ParallaxMedia
          src="/images/sunset-mountain.jpg"
          alt="夕照下的山稜剪影"
          priority
          sizes="100vw"
          shift="9%"
          overscan="14%"
          className="absolute inset-0 h-full w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-espresso/75 via-espresso/50 to-espresso/92" />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/70 via-transparent to-transparent" />
        </ParallaxMedia>

        <div className="relative z-10 mx-auto flex h-full max-w-[88rem] flex-col justify-end px-5 pb-12 sm:px-8 sm:pb-16 lg:px-12">
          <Reveal>
            <span className="eyebrow text-gold">Extras · 小遊戲</span>
          </Reveal>
          <Reveal delay={140}>
            <h1 className="font-title mt-6 text-[2rem] leading-[1.4] text-cream sm:text-5xl lg:text-[3.4rem]">
              聚寶盆接金幣
            </h1>
          </Reveal>
          <Reveal delay={280}>
            <p className="mt-6 max-w-xl text-[0.92rem] leading-[2.1] tracking-wider text-cream/75">
              15 秒，接住掉下來的金幣。單純娛樂，跟服務內容與收費無關。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <CoinGame />

        <div className="mt-16 border-t border-linen pt-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-[0.85rem] leading-[2] tracking-wider text-cocoa/70">
              這一頁是練習用的娛樂單元。若您正在處理家人的後事，
              直接打電話給我們會比在這裡停留更有幫助。
            </p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <a
                href="tel:0800000000"
                className="rounded-full bg-espresso px-7 py-3.5 text-[0.85rem] tracking-[0.14em] text-cream transition-colors hover:bg-rust"
              >
                24H 專線
              </a>
              <Link
                href="/blog"
                className="rounded-full px-7 py-3.5 text-[0.85rem] tracking-[0.14em] text-espresso ring-1 ring-clay transition-colors hover:bg-sand/50"
              >
                常見問答
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
