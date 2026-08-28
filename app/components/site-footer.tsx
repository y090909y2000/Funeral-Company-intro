import Link from "next/link";

const COLUMNS = [
  {
    title: "服務項目",
    links: [
      { label: "24 小時到府接體", href: "/#services" },
      { label: "治喪協調規劃", href: "/#services" },
      { label: "傳統科儀誦經", href: "/#services" },
      { label: "會場佈置花藝", href: "/#services" },
      { label: "火化・安厝・晉塔", href: "/#services" },
    ],
  },
  {
    title: "了解更多",
    links: [
      { label: "關於安和", href: "/#about" },
      { label: "治喪流程", href: "/#process" },
      { label: "後續關懷", href: "/#care" },
      { label: "常見問答", href: "/blog" },
      { label: "小遊戲", href: "/game" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative bg-espresso text-cream/70">
      {/* 頂部金線，與全站的細線語彙一致 */}
      <div className="rule-gold opacity-60" />

      <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* 字標與理念 */}
          <div className="lg:col-span-5">
            <div className="flex items-baseline gap-4">
              <span className="font-title text-3xl text-cream">安和</span>
              <span className="eyebrow text-clay">An Hé · Life Rites</span>
            </div>

            <p className="mt-6 max-w-sm text-[0.9rem] leading-[2] tracking-wider">
              一位禮儀師從初終陪到合爐，
              <br />
              不轉手、不加價、不催促。
              <br />
              讓思念，有安放的地方。
            </p>

            <div className="mt-8 inline-flex flex-col gap-1">
              <span className="eyebrow text-clay">24 hours</span>
              <a
                href="tel:0800000000"
                className="numeral text-2xl tracking-[0.16em] text-cream transition-colors hover:text-gold sm:text-3xl"
              >
                0800-000-000
              </a>
            </div>
          </div>

          {/* 連結欄 */}
          {COLUMNS.map((col) => (
            <nav key={col.title} className="sm:col-span-1 lg:col-span-2">
              <h3 className="font-title text-sm tracking-[0.2em] text-cream/90">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[0.85rem] tracking-wider transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* 聯絡資訊 */}
          <div className="lg:col-span-3">
            <h3 className="font-title text-sm tracking-[0.2em] text-cream/90">
              聯絡與服務範圍
            </h3>
            <dl className="mt-5 space-y-4 text-[0.85rem] leading-relaxed tracking-wider">
              <div>
                <dt className="text-clay">服務處</dt>
                <dd>臺北市○○區○○路 000 號 1 樓</dd>
              </div>
              <div>
                <dt className="text-clay">服務範圍</dt>
                <dd>臺北、新北、基隆、桃園（外縣市可洽詢）</dd>
              </div>
              <div>
                <dt className="text-clay">電子信箱</dt>
                <dd>
                  <a
                    href="mailto:service@example.com"
                    className="transition-colors hover:text-gold"
                  >
                    service@example.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* 版權列 */}
        <div className="mt-16 border-t border-cream/12 pt-8">
          <div className="flex flex-col gap-4 text-[0.75rem] tracking-wider text-cream/45 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} 安和生命禮儀有限公司　殯葬服務業許可證：
              北市殯管字第 ○○○○ 號
            </p>
            <p className="sm:text-right">
              本站為練習用示範網站，聯絡資訊與證照字號皆為範例。
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
