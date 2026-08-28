import Image from "next/image";
import Link from "next/link";
import { ParallaxMedia, Reveal } from "./components/motion";
import { VisitorGreeting } from "./components/visitor";
import { LotteryButton } from "./components/lottery-modal";

/* ── 內容資料 ──────────────────────────────────────────────── */

const SERVICES = [
  {
    no: "01",
    title: "初終接體",
    body: "24 小時待命。接獲通知後由禮儀師親自到場，協助遺體安置、冰存，並確認死亡證明書的開立方式與所需文件。",
  },
  {
    no: "02",
    title: "治喪協調",
    body: "依家族信仰（佛教、道教、基督教或自然簡葬）與預算，一次把日程、場地、人力排定，並以書面報價確認，事後不追加。",
  },
  {
    no: "03",
    title: "傳統科儀",
    body: "入殮、豎靈、做七誦經、家祭與公祭。法師與誦經團皆為長期合作團隊，不臨時外調人力。",
  },
  {
    no: "04",
    title: "花藝佈置",
    body: "以白菊、百合為主調的靈堂與告別式佈置。可依故人生前的喜好調整色系與意象，不套用固定樣板。",
  },
  {
    no: "05",
    title: "火化安厝",
    body: "殯儀館排程、火化、進金、晉塔或墓園安葬。全程有專人隨行，家屬不需自行在各單位間奔走。",
  },
  {
    no: "06",
    title: "後續關懷",
    body: "百日、對年、合爐的時間提醒與代辦，並協助除戶、勞保與國保喪葬給付等行政程序。",
  },
];

const PROCESS = [
  { no: "01", title: "初終", body: "通報、接體，確認死亡證明開立方式。" },
  { no: "02", title: "安置", body: "遺體冰存，擇定入殮與告別日期。" },
  { no: "03", title: "設靈", body: "豎靈、孝飯，開始做七誦經。" },
  { no: "04", title: "入殮", body: "淨身、更衣、大殮封棺。" },
  { no: "05", title: "奠禮", body: "家祭、公祭、發引。" },
  { no: "06", title: "安厝", body: "火化進金，晉塔或墓園安葬。" },
];

const QUESTIONS = [
  {
    id: "q1",
    kicker: "最急的一題",
    title: "親人剛過世，第一時間該做什麼？",
    excerpt:
      "在醫院、在家中、或是意外過世，處理程序完全不同。先別移動遺體，也先別急著決定任何方案。",
    image: "/images/candle-glass.jpg",
    alt: "溫暖燭光",
  },
  {
    id: "q2",
    kicker: "最難問出口的一題",
    title: "一場喪禮到底要多少錢？",
    excerpt:
      "同樣說「一條龍」，報價可能差三倍。差別不在便宜貴，而在哪些項目被算進去了、哪些沒有。",
    image: "/images/chrysanthemum-white.jpg",
    alt: "白菊花",
  },
  {
    id: "q3",
    kicker: "最常被誤解的一題",
    title: "做七、百日、對年、合爐是什麼？",
    excerpt:
      "四十九天、一百天、一年。這些日子不是規矩，是讓活著的人慢慢放下的節奏。",
    image: "/images/temple-censer.jpg",
    alt: "傳統廟宇香爐",
  },
];

/* ── 區塊標頭：序號 — 金線 — 拉丁標籤 ─────────────────────── */

function SectionHeading({
  no,
  latin,
  title,
  lead,
  tone = "warm",
}: {
  no: string;
  latin: string;
  title: string;
  lead?: string;
  tone?: "warm" | "dark";
}) {
  const numColor = tone === "dark" ? "text-gold" : "text-clay";
  const titleColor = tone === "dark" ? "text-cream" : "text-espresso";
  const leadColor = tone === "dark" ? "text-cream/70" : "text-cocoa/85";

  return (
    <div>
      <div className="flex items-center gap-5">
        <span className={`numeral text-[0.8rem] ${numColor}`}>{no}</span>
        <Reveal variant="rule" className="h-px flex-1">
          <div className="rule-gold" />
        </Reveal>
        <span className={`eyebrow ${numColor}`}>{latin}</span>
      </div>

      <Reveal delay={80}>
        <h2
          className={`font-title mt-7 text-[1.85rem] sm:text-[2.3rem] lg:text-[2.6rem] ${titleColor}`}
        >
          {title}
        </h2>
        {lead ? (
          <p
            className={`mt-5 max-w-2xl text-[0.95rem] leading-[2.1] tracking-wider ${leadColor}`}
          >
            {lead}
          </p>
        ) : null}
      </Reveal>
    </div>
  );
}

/* ── 頁面 ──────────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      {/* ═══ 首屏 ═══════════════════════════════════════════ */}
      <section className="relative min-h-[38rem] h-[100svh] w-full overflow-hidden">
        <ParallaxMedia
          src="/images/hero-candles.jpg"
          alt="無數盞暖黃燭光在暗處靜靜燃著"
          priority
          sizes="100vw"
          shift="9%"
          overscan="14%"
          className="absolute inset-0 h-full w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-espresso/75 via-espresso/35 to-espresso/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/70 via-transparent to-transparent" />
        </ParallaxMedia>

        {/* 右緣直排題辭 */}
        <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 md:block lg:right-10">
          <p className="vtext font-title text-[0.8rem] text-cream/55">
            二十四小時　隨侍在側
          </p>
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[88rem] flex-col justify-end px-5 pb-14 sm:px-8 sm:pb-20 lg:px-12">
          {/* 填過稱呼才會出現，內容讀自 localStorage */}
          <VisitorGreeting />

          <Reveal>
            <span className="eyebrow text-gold">Since 1994 · Taipei</span>
          </Reveal>

          <Reveal delay={140}>
            <h1 className="font-title mt-6 text-[2.5rem] leading-[1.32] text-cream sm:text-6xl lg:text-[4.6rem]">
              讓思念，
              <br />
              有安放的地方
            </h1>
          </Reveal>

          <Reveal delay={280}>
            <p className="mt-8 max-w-md text-[0.95rem] leading-[2.1] tracking-wider text-cream/75">
              治喪的那幾天，家屬需要的不是選項表，
              <br className="hidden sm:block" />
              而是一個能替你想到下一步的人。
            </p>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-11 flex flex-wrap items-center gap-4">
              <a
                href="tel:0800000000"
                className="group flex items-center gap-3 rounded-full bg-cream px-7 py-4 text-espresso transition-colors hover:bg-gold"
              >
                <span className="text-[0.88rem] tracking-[0.16em]">
                  即刻撥打
                </span>
                <span className="numeral text-[0.95rem] tracking-widest">
                  0800-000-000
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <Link
                href="/#process"
                className="rounded-full px-7 py-4 text-[0.88rem] tracking-[0.16em] text-cream ring-1 ring-cream/35 transition-colors hover:bg-cream/10"
              >
                先看治喪流程
              </Link>
            </div>
          </Reveal>

          {/* 底部事實列 */}
          <Reveal delay={520}>
            <dl className="mt-14 grid max-w-3xl grid-cols-1 gap-px overflow-hidden border-t border-cream/20 pt-8 sm:grid-cols-3">
              {[
                { k: "24H", v: "到府接體不分晝夜" },
                { k: "1 位", v: "禮儀師全程專責" },
                { k: "30 年", v: "在地治喪經驗" },
              ].map((item) => (
                <div key={item.k} className="flex items-baseline gap-4">
                  <dt className="numeral text-2xl text-gold sm:text-[1.6rem]">
                    {item.k}
                  </dt>
                  <dd className="text-[0.8rem] tracking-wider text-cream/65">
                    {item.v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ═══ 01 關於 ════════════════════════════════════════ */}
      <section
        id="about"
        className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
      >
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* 疊圖組 */}
          <div className="lg:col-span-5">
            <div className="relative">
              <Reveal>
                <ParallaxMedia
                  src="/images/lily-warm.jpg"
                  alt="暖光下的白色百合"
                  sizes="(max-width: 1024px) 92vw, 34vw"
                  shift="7%"
                  className="relative aspect-[4/5] w-[86%]"
                />
              </Reveal>

              {/* 右下角錯位小圖，打破方正 */}
              <Reveal delay={220}>
                <div className="absolute -bottom-12 right-0 w-[52%] border-[6px] border-cream shadow-[0_18px_50px_-24px_rgba(58,39,24,0.5)] sm:-bottom-16">
                  <ParallaxMedia
                    src="/images/incense-warm.jpg"
                    alt="一炷線香的煙在暖色背景中緩緩上升"
                    sizes="(max-width: 1024px) 46vw, 18vw"
                    shift="12%"
                    className="relative aspect-[4/3] w-full"
                  />
                </div>
              </Reveal>
            </div>
          </div>

          {/* 文字 */}
          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHeading
              no="01"
              latin="About"
              title="把最忙亂的幾天，變成能好好道別的幾天"
              lead="如憶成立於 1994 年，第一代創辦人原本是廟裡的誦經師。三十年來我們只做一件事：把家屬從跑流程的角色裡拉出來，讓他們有空專心當家人。"
            />

            <Reveal delay={160}>
              <div className="mt-12 space-y-8">
                {[
                  {
                    h: "一位禮儀師，從初終到合爐",
                    p: "不會今天來一個、明天換一個。從接體那一刻起，同一位禮儀師陪你走完百日、對年、合爐。",
                  },
                  {
                    h: "書面報價，事後不追加",
                    p: "所有項目在治喪協調時列清楚，包含哪些、不含哪些。過程中若有變動，一律先徵得家屬同意。",
                  },
                  {
                    h: "尊重家族原有的信仰",
                    p: "佛教、道教、一貫道、基督教，或是想從簡。我們配合你家原本的規矩，不會推銷不需要的科儀。",
                  },
                ].map((item, i) => (
                  <div
                    key={item.h}
                    className="flex gap-6 border-t border-linen/70 pt-8"
                  >
                    <span className="numeral shrink-0 pt-1 text-[0.75rem] text-clay">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="font-title text-[1.1rem] text-espresso">
                        {item.h}
                      </h3>
                      <p className="mt-3 text-[0.9rem] leading-[2] tracking-wider text-cocoa/80">
                        {item.p}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 02 服務項目（左圖沾黏、右列滾動）═══════════════ */}
      <section
        id="services"
        className="border-y border-linen/60 bg-cream-deep"
      >
        <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <Reveal>
                  <ParallaxMedia
                    src="/images/temple-hall.jpg"
                    alt="傳統廟宇殿內的金紅色藻井與匾額"
                    sizes="(max-width: 1024px) 92vw, 38vw"
                    shift="8%"
                    className="relative aspect-[4/5] w-full sm:aspect-[3/4]"
                  >
                    <div className="absolute inset-0 bg-espresso/15" />
                  </ParallaxMedia>
                </Reveal>

                <Reveal delay={140}>
                  <p className="mt-6 flex items-start gap-4 text-[0.78rem] leading-relaxed tracking-wider text-cocoa/65">
                    <span className="mt-2 h-px w-8 shrink-0 bg-clay" />
                    傳統科儀的每一個環節都有它的道理。
                    我們的工作是把道理說清楚，再讓你決定要做到什麼程度。
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <SectionHeading
                no="02"
                latin="Services"
                title="服務項目"
                lead="從接到電話的那一刻，到合爐後的最後一次提醒，以下是我們實際會替你做的事。"
              />

              {/* li 必須是 ol 的直接子元素，Reveal 放在 li 裡面，
                  否則 last: 之類的位置變體會失效 */}
              <ol className="mt-14">
                {SERVICES.map((s, i) => (
                  <li
                    key={s.no}
                    className="group border-t border-linen py-9 transition-colors last:border-b hover:border-clay"
                  >
                    <Reveal delay={i * 60}>
                      <div className="flex items-baseline gap-6">
                        <span className="numeral shrink-0 text-[0.8rem] text-clay transition-colors group-hover:text-rust">
                          {s.no}
                        </span>
                        <div>
                          <h3 className="font-title text-xl text-espresso sm:text-[1.4rem]">
                            {s.title}
                          </h3>
                          <p className="mt-4 text-[0.9rem] leading-[2.05] tracking-wider text-cocoa/80">
                            {s.body}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 視差題辭帶 ════════════════════════════════════ */}
      <section className="relative h-[34rem] w-full overflow-hidden sm:h-[40rem]">
        <ParallaxMedia
          src="/images/parallax-dawn.jpg"
          alt="晨光穿過雲海，山稜染成暖橘色"
          sizes="100vw"
          shift="12%"
          overscan="16%"
          className="absolute inset-0 h-full w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-espresso/55 via-espresso/40 to-espresso/70" />
        </ParallaxMedia>

        <div className="relative z-10 mx-auto flex h-full max-w-[88rem] items-center px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <Reveal>
              <span className="eyebrow text-gold">科儀 · Rites</span>
            </Reveal>
            <Reveal delay={140}>
              {/* 三行都固定斷行，避免大字級時最後兩字被擠成孤行 */}
              <blockquote className="font-title mt-8 text-[1.6rem] leading-[1.7] text-cream sm:text-[2.2rem] lg:text-[2.5rem]">
                人走了，關係還在。
                <br />
                我們把儀式辦好，
                <br />
                讓關係有地方繼續。
              </blockquote>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-10 flex items-center gap-5">
                <span className="h-px w-12 bg-gold" />
                <span className="text-[0.78rem] tracking-[0.24em] text-cream/60">
                  如憶生命禮儀
                </span>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-8 right-5 hidden md:block lg:right-10">
          <p className="vtext font-title text-[0.75rem] text-cream/45">
            慎終追遠
          </p>
        </div>
      </section>

      {/* ═══ 03 治喪流程 ══════════════════════════════════ */}
      <section
        id="process"
        className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
      >
        <div className="max-w-3xl">
          <SectionHeading
            no="03"
            latin="Process"
            title="治喪流程"
            lead="一般從初終到安厝約 7 至 15 天，實際天數會依擇日、殯儀館排程與家族需求調整。每一步我們都會提前告知你要準備什麼。"
          />
        </div>

        {/* 細線切出的格線：容器負責上／左，格子負責右／下，
            這樣不論三欄、兩欄或一欄，外框都不會缺角或疊線 */}
        <div className="mt-16 grid grid-cols-1 border-l border-t border-linen sm:grid-cols-2 lg:grid-cols-3">
          {PROCESS.map((step, i) => (
            <div
              key={step.no}
              className="group border-b border-r border-linen px-6 py-10 sm:px-8 lg:px-9"
            >
              <Reveal delay={i * 70}>
                <span className="numeral block text-[2.6rem] leading-none text-sand transition-colors duration-500 group-hover:text-clay">
                  {step.no}
                </span>
                <h3 className="font-title mt-5 text-[1.25rem] text-espresso">
                  {step.title}
                </h3>
                <p className="mt-3 text-[0.875rem] leading-[2] tracking-wider text-cocoa/75">
                  {step.body}
                </p>
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-14 flex flex-col gap-6 border-l-2 border-clay bg-cream-deep/70 px-7 py-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.9rem] leading-[2] tracking-wider text-cocoa">
              不確定現在該做哪一步？
              <br className="sm:hidden" />
              打電話給我們，先講狀況，不談方案。
            </p>
            <a
              href="tel:0800000000"
              className="group flex shrink-0 items-center gap-3 self-start text-espresso sm:self-auto"
            >
              <span className="numeral text-lg tracking-widest">
                0800-000-000
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-espresso text-cream transition-colors group-hover:bg-rust">
                →
              </span>
            </a>
          </div>
        </Reveal>
      </section>

      {/* ═══ 04 後續關懷（圖文交疊）════════════════════════ */}
      <section id="care" className="relative overflow-hidden bg-sand/45">
        <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* 兩者都要明確指定起始欄與列才會真的疊在一起。
                只給 col-span 的話，卡片先佔住第 8 欄後這裡就放不進第 1 列，
                會被擠到格線外的隱式欄位。 */}
            <div className="lg:col-span-8 lg:col-start-1 lg:row-start-1">
              <Reveal>
                <ParallaxMedia
                  src="/images/hands-companion.jpg"
                  alt="兩雙年長的手互相握著，彼此支撐"
                  sizes="(max-width: 1024px) 92vw, 58vw"
                  shift="8%"
                  className="relative aspect-[5/4] w-full sm:aspect-[4/3]"
                />
              </Reveal>
            </div>

            {/* 桌機時往左壓在圖片上，形成交疊 */}
            <div className="relative z-10 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:-ml-20">
              <Reveal delay={180}>
                <div className="bg-cream px-7 py-10 shadow-[0_28px_70px_-40px_rgba(58,39,24,0.55)] sm:px-11 sm:py-14">
                  <SectionHeading
                    no="04"
                    latin="Aftercare"
                    title="喪禮結束，才是想念的開始"
                  />

                  <p className="mt-6 text-[0.92rem] leading-[2.1] tracking-wider text-cocoa/85">
                    很多家屬告訴我們，最難的不是治喪那幾天，
                    而是回家之後那些安靜的日子。
                  </p>

                  <ul className="mt-9 space-y-5">
                    {[
                      "百日、對年、合爐的日期提醒與代辦",
                      "除戶、勞保與國保喪葬給付的文件協助",
                      "週年追思、清明掃墓的陪同安排",
                      "需要聊聊的時候，我們的電話一直都在",
                    ].map((item) => (
                      <li key={item} className="flex gap-4">
                        <span className="mt-2.5 h-px w-5 shrink-0 bg-clay" />
                        <span className="text-[0.88rem] leading-[1.95] tracking-wider text-cocoa">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 05 常見問答 ══════════════════════════════════ */}
      <section className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <SectionHeading
              no="05"
              latin="Journal"
              title="家屬最常問我們的三件事"
              lead="這三題幾乎每一戶都會問。我們把答案寫得長一點、白話一點，你可以先看，不用先打電話。"
            />
          </div>

          <Reveal delay={120}>
            <Link
              href="/blog"
              className="group flex shrink-0 items-center gap-3 text-[0.85rem] tracking-[0.16em] text-espresso"
            >
              前往常見問答
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-clay transition-colors group-hover:bg-espresso group-hover:text-cream">
                →
              </span>
            </Link>
          </Reveal>
        </div>

        {/* 交錯上下位移，避免三張卡片一字排開的制式感 */}
        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-7">
          {QUESTIONS.map((q, i) => (
            <Reveal key={q.id} delay={i * 110}>
              <Link
                href={`/blog#${q.id}`}
                className={`group block ${
                  i === 1 ? "md:mt-14" : i === 2 ? "md:mt-7" : ""
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={q.image}
                    alt={q.alt}
                    fill
                    sizes="(max-width: 768px) 92vw, 30vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-espresso/10 transition-opacity duration-500 group-hover:opacity-0" />
                </div>

                <span className="eyebrow mt-6 block text-clay">
                  {q.kicker}
                </span>
                <h3 className="font-title mt-3 text-[1.2rem] leading-[1.6] text-espresso transition-colors group-hover:text-rust">
                  {q.title}
                </h3>
                <p className="mt-4 text-[0.86rem] leading-[2] tracking-wider text-cocoa/75">
                  {q.excerpt}
                </p>
                <span className="mt-5 flex items-center gap-2 text-[0.78rem] tracking-[0.18em] text-rust">
                  閱讀
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ 06 線上小活動 ════════════════════════════════
          抽獎與小遊戲刻意收在同一區，不讓它們散落在治喪內容之間 */}
      <section
        id="extras"
        className="border-y border-linen/60 bg-cream-deep"
      >
        <div className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
          <div className="max-w-2xl">
            <SectionHeading
              no="06"
              latin="Extras"
              title="線上小活動"
              lead="兩個輕鬆的小單元。如果您正在處理家人的後事，直接打電話會比在這裡停留更有幫助。"
            />
          </div>

          <div className="mt-14 grid gap-px border-l border-t border-linen sm:grid-cols-2">
            {/* 抽獎 */}
            <div className="border-b border-r border-linen px-6 py-9 sm:px-9 sm:py-10">
              <Reveal>
                <span className="eyebrow block text-clay">Draw</span>
                <h3 className="font-title mt-4 text-[1.3rem] text-espresso">
                  蓮花被 優待抽獎
                </h3>
                <p className="mt-4 text-[0.88rem] leading-[2] tracking-wider text-cocoa/80">
                  中獎機率
                  <span className="numeral mx-1 text-rust">10%</span>
                  。抽中後會給您一組優待代碼，代碼只存在您的瀏覽器裡。
                </p>
                <LotteryButton className="mt-8 flex items-center gap-3 rounded-full bg-espresso px-7 py-3.5 text-[0.88rem] tracking-[0.14em] text-cream transition-colors hover:bg-rust" />
              </Reveal>
            </div>

            {/* 小遊戲 */}
            <div className="border-b border-r border-linen px-6 py-9 sm:px-9 sm:py-10">
              <Reveal delay={100}>
                <span className="eyebrow block text-clay">Mini game</span>
                <h3 className="font-title mt-4 text-[1.3rem] text-espresso">
                  聚寶盆接金幣
                </h3>
                <p className="mt-4 text-[0.88rem] leading-[2] tracking-wider text-cocoa/80">
                  15 秒，接住掉下來的 1、5、10、50、100 元金幣。
                  純娛樂，分數不代表任何優惠。
                </p>
                <Link
                  href="/game"
                  className="group mt-8 inline-flex items-center gap-3 text-[0.88rem] tracking-[0.14em] text-espresso"
                >
                  前往小遊戲
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-clay transition-colors group-hover:bg-espresso group-hover:text-cream">
                    →
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 結尾行動帶 ════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-espresso">
        <div className="absolute inset-0 opacity-25">
          <ParallaxMedia
            src="/images/incense-lotus-holder.jpg"
            alt=""
            sizes="100vw"
            shift="10%"
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/92 to-espresso/60" />

        <div className="relative z-10 mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow text-gold">Contact</span>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="font-title mt-7 text-[1.9rem] leading-[1.5] text-cream sm:text-[2.5rem]">
                現在不必做決定，
                <br />
                只要讓我們知道你在哪裡
              </h2>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-7 text-[0.92rem] leading-[2.1] tracking-wider text-cream/70">
                任何時間都可以打。就算只是想確認流程、問一個名詞，
                我們也會把話講完，不會催你簽約。
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div className="mt-11 flex flex-wrap items-center gap-4">
                <a
                  href="tel:0800000000"
                  className="group flex items-center gap-4 rounded-full bg-cream px-8 py-4 text-espresso transition-colors hover:bg-gold"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-terracotta" />
                  </span>
                  <span className="numeral text-lg tracking-widest">
                    0800-000-000
                  </span>
                </a>
                <a
                  href="mailto:service@example.com"
                  className="rounded-full px-8 py-4 text-[0.85rem] tracking-[0.16em] text-cream ring-1 ring-cream/30 transition-colors hover:bg-cream/10"
                >
                  以信件詢問
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
