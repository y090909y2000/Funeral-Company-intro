import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ParallaxMedia, Reveal } from "../components/motion";

export const metadata: Metadata = {
  title: "常見問答",
  description:
    "家屬最常問的三件事：親人剛過世第一時間該做什麼、一場喪禮要多少錢、做七百日對年合爐是什麼。由安和生命禮儀以白話整理。",
};

/* ── 版面小元件 ────────────────────────────────────────────── */

function Callout({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <aside className="my-11 border-l-2 border-clay bg-cream-deep/70 px-6 py-7 sm:px-8">
      <span className="eyebrow block text-rust">{label}</span>
      <div className="mt-4 space-y-3 text-[0.92rem] leading-[2] tracking-wider text-cocoa">
        {children}
      </div>
    </aside>
  );
}

function Sub({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-title mt-14 flex items-baseline gap-4 text-[1.2rem] text-espresso sm:text-[1.35rem]">
      <span className="mt-3 h-px w-6 shrink-0 bg-clay" />
      {children}
    </h3>
  );
}

function Ordered({ items }: { items: { h: string; p: string }[] }) {
  return (
    <ol className="mt-7 space-y-7">
      {items.map((item, i) => (
        <li key={item.h} className="flex gap-5 border-t border-linen/70 pt-6">
          <span className="numeral shrink-0 pt-1 text-[0.75rem] text-clay">
            0{i + 1}
          </span>
          <div>
            <h4 className="font-title text-[1.02rem] text-espresso">
              {item.h}
            </h4>
            <p className="mt-2.5 text-[0.9rem] leading-[2] tracking-wider text-cocoa/85">
              {item.p}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-4">
          <span className="mt-2.5 h-px w-5 shrink-0 bg-clay" />
          <span className="text-[0.9rem] leading-[1.95] tracking-wider text-cocoa">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ArticleHead({
  no,
  kicker,
  title,
  image,
  alt,
  readTime,
}: {
  no: string;
  kicker: string;
  title: string;
  image: string;
  alt: string;
  readTime: string;
}) {
  return (
    <header>
      <div className="flex items-center gap-5">
        <span className="numeral text-[0.8rem] text-clay">{no}</span>
        <Reveal variant="rule" className="h-px flex-1">
          <div className="rule-gold" />
        </Reveal>
        <span className="eyebrow text-clay">{readTime}</span>
      </div>

      <Reveal delay={80}>
        <span className="eyebrow mt-8 block text-rust">{kicker}</span>
        <h2 className="font-title mt-4 text-[1.75rem] leading-[1.5] text-espresso sm:text-[2.2rem] lg:text-[2.45rem]">
          {title}
        </h2>
      </Reveal>

      <Reveal delay={160}>
        <ParallaxMedia
          src={image}
          alt={alt}
          sizes="(max-width: 1024px) 92vw, 60rem"
          shift="8%"
          className="relative mt-11 aspect-[3/2] w-full sm:aspect-[16/9]"
        />
      </Reveal>
    </header>
  );
}

/* ── 頁面 ──────────────────────────────────────────────────── */

export default function BlogPage() {
  return (
    <>
      {/* ═══ 首屏 ═══════════════════════════════════════════ */}
      <section className="relative h-[62svh] min-h-[24rem] w-full overflow-hidden">
        <ParallaxMedia
          src="/images/lotus-pond.jpg"
          alt="一朵蓮花靜靜浮在水面上"
          priority
          sizes="100vw"
          shift="9%"
          overscan="14%"
          className="absolute inset-0 h-full w-full"
        >
          {/* 蓮花亮部會吃掉標題對比，垂直＋水平各壓一層 */}
          <div className="absolute inset-0 bg-gradient-to-b from-espresso/75 via-espresso/55 to-espresso/92" />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/70 via-transparent to-transparent" />
        </ParallaxMedia>

        <div className="relative z-10 mx-auto flex h-full max-w-[88rem] flex-col justify-end px-5 pb-14 sm:px-8 sm:pb-20 lg:px-12">
          <Reveal>
            <span className="eyebrow text-gold">Journal · 常見問答</span>
          </Reveal>
          <Reveal delay={140}>
            <h1 className="font-title mt-6 text-[2.1rem] leading-[1.4] text-cream sm:text-5xl lg:text-[3.6rem]">
              家屬最常問我們的三件事
            </h1>
          </Reveal>
          <Reveal delay={280}>
            <p className="mt-7 max-w-xl text-[0.92rem] leading-[2.1] tracking-wider text-cream/75">
              寫給還沒決定要不要打電話的你。
              不推銷、不留伏筆，把該說的都說完。
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ 目錄 ═══════════════════════════════════════════ */}
      <nav
        aria-label="文章目錄"
        className="border-b border-linen/60 bg-cream-deep"
      >
        <div className="mx-auto max-w-[88rem] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <ol className="grid gap-px sm:grid-cols-3">
            {[
              { id: "q1", no: "01", t: "第一時間該做什麼？" },
              { id: "q2", no: "02", t: "一場喪禮要多少錢？" },
              { id: "q3", no: "03", t: "做七、百日、對年、合爐" },
            ].map((item, i) => (
              <li key={item.id}>
                <Reveal delay={i * 80}>
                  <a
                    href={`#${item.id}`}
                    className="group flex items-baseline gap-5 border-t border-clay/50 pt-6 sm:pr-8"
                  >
                    <span className="numeral text-[0.75rem] text-clay">
                      {item.no}
                    </span>
                    <span className="font-title text-[1.05rem] leading-[1.65] text-espresso transition-colors group-hover:text-rust">
                      {item.t}
                      <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-y-0.5">
                        ↓
                      </span>
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* ═══ 文章一 ════════════════════════════════════════ */}
      <article
        id="q1"
        className="mx-auto max-w-[60rem] px-5 py-24 sm:px-8 sm:py-32"
      >
        <ArticleHead
          no="01"
          kicker="最急的一題"
          title="親人剛過世，第一時間該做什麼？"
          image="/images/candle-glass.jpg"
          alt="一盞放在木桌上的溫暖燭光"
          readTime="約 6 分鐘"
        />

        <div className="prose-warm mt-14 max-w-[41rem]">
          <Reveal>
            <p className="dropcap">
              接到消息的那一刻，多數人腦中是空的。這很正常。
              你不需要馬上做任何決定，但有幾件事的順序不能顛倒——
              因為<strong>死亡證明書怎麼開，決定了後面所有流程能不能動</strong>。
              而它取決於「人是在哪裡、以什麼原因過世的」。
            </p>
          </Reveal>

          <Reveal>
            <Sub>先確認：是在哪裡過世的</Sub>
            <Ordered
              items={[
                {
                  h: "在醫院或安寧病房",
                  p: "最單純的情況。由醫院的主治醫師開立死亡證明書，遺體可先安置於醫院的太平間或往生室。你可以在這段時間聯絡禮儀公司安排接體，不必當場決定後續方案。",
                },
                {
                  h: "在家中，且長期有就醫紀錄",
                  p: "先不要移動遺體。可聯絡原診治醫師或當地衛生所，說明病史後請醫師到宅確認並開立死亡證明書。若是在宅安寧的個案，通常照護團隊已預先安排好這一步。",
                },
                {
                  h: "意外、猝逝，或死因不明",
                  p: "請撥 110 報警。這類情況屬於「非病死或可疑為非病死」，須由警察機關報請檢察官會同法醫相驗，開立相驗屍體證明書。在相驗完成前，遺體與現場都不可移動。",
                },
              ]}
            />
          </Reveal>

          <Reveal>
            <Callout label="現在請先不要做這三件事">
              <p>
                一、<strong>不要移動或清理遺體</strong>
                。若尚未確認開立方式，移動可能影響相驗。
              </p>
              <p>
                二、<strong>不要在電話裡答應任何報價</strong>
                。口頭承諾之後很難追究，等到能坐下來看書面明細再決定。
              </p>
              <p>
                三、<strong>不要急著昭告親友</strong>
                。等日期確定再通知，可以省下反覆更正的力氣。
              </p>
            </Callout>
          </Reveal>

          <Reveal>
            <Sub>接下來 24 小時內會發生的事</Sub>
            <p>
              確認證明書的開立方式後，才輪到接體。禮儀公司到場後會協助遺體安置與冰存，
              並與你確認入殮、告別式的可能日期——這一步通常會參考擇日，
              也要看殯儀館的禮廳與火化爐排程，不是想哪天就哪天。
            </p>
            <p>
              同一天內你會被問到很多選擇：棺木、壽衣、要不要誦經、辦幾天。
              如果當下答不出來，就說「明天再回覆」。
              <strong>正派的禮儀公司不會逼你在接體現場簽約</strong>。
            </p>
          </Reveal>

          <Reveal>
            <Sub>可以先準備的文件</Sub>
            <Bullets
              items={[
                "往生者的身分證、健保卡、印章",
                "往生者的戶口名簿（辦理除戶時需要）",
                "申請人（通常為配偶或直系血親）的身分證與印章",
                "若有保險單、勞保／國保投保資料，一併找出來備用",
              ]}
            />
            <p className="mt-7">
              另外提醒一個很多人事後才發現的細節：
              <strong>死亡證明書請多申請幾份</strong>
              。除戶、銀行帳戶處理、保險理賠、喪葬給付、遺產稅申報，
              每個單位都可能要收正本。一般建議一次申請十份以上，
              事後補開比當下多印麻煩得多。
            </p>
          </Reveal>
        </div>
      </article>

      <div className="mx-auto max-w-[60rem] px-5 sm:px-8">
        <div className="rule-gold" />
      </div>

      {/* ═══ 文章二 ════════════════════════════════════════ */}
      <article
        id="q2"
        className="mx-auto max-w-[60rem] px-5 py-24 sm:px-8 sm:py-32"
      >
        <ArticleHead
          no="02"
          kicker="最難問出口的一題"
          title="一場喪禮到底要多少錢？"
          image="/images/chrysanthemum-white.jpg"
          alt="幾朵盛開的白色菊花"
          readTime="約 7 分鐘"
        />

        <div className="prose-warm mt-14 max-w-[41rem]">
          <Reveal>
            <p className="dropcap">
              問價格不是不孝，是負責。真正讓家屬受傷的從來不是花了多少錢，
              而是<strong>事後才發現有些項目原來不含在裡面</strong>。
              同樣一句「一條龍全包」，兩家報價差三倍是常有的事——
              差別往往不在品質，而在哪些東西被算進去了。
            </p>
          </Reveal>

          <Reveal>
            <Sub>費用其實是六個籃子</Sub>
            <p>
              把報價單攤開，幾乎所有費用都能歸進這六類。
              看報價時，逐項對照一遍，缺哪一類就問哪一類。
            </p>
            <Ordered
              items={[
                {
                  h: "遺體處理",
                  p: "接體、冰存（按天計）、淨身、更衣、化妝，必要時的防腐處理。天數拉長，這一項就會跟著長。",
                },
                {
                  h: "殯葬用品",
                  p: "棺木、壽衣、骨灰罐、庫錢與紙紮。這是整份報價中價差最大的一塊，同樣功能的棺木與骨灰罐，選擇範圍可以非常寬。",
                },
                {
                  h: "場地與規費",
                  p: "禮廳租金、冰櫃使用費、火化爐、晉塔或墓園費用。公立殯儀館與私立會館的價差相當明顯，這部分多屬公家規費，不是禮儀公司的收入。",
                },
                {
                  h: "人力",
                  p: "禮儀師、司儀、誦經法師或誦經團、樂隊、扶棺人員。辦幾天、做幾場科儀，直接影響人力費用。",
                },
                {
                  h: "佈置與花藝",
                  p: "靈堂佈置、告別式會場、花山花牆、輸出照片與影片。這一項最容易在過程中「順便加」，所以要先講清楚基準。",
                },
                {
                  h: "後續項目",
                  p: "進金、晉塔、做七誦經、百日與對年。留意這些常被排在報價之外，要另外確認是否包含。",
                },
              ]}
            />
          </Reveal>

          <Reveal>
            <Callout label="看報價的三個原則">
              <p>
                一、<strong>要求單項列價</strong>
                ，不接受只有一個總數的報價單。看不到單項，就無法比較。
              </p>
              <p>
                二、<strong>直接問「不含什麼」</strong>
                。這句話比問「含什麼」有用得多，也最能看出一家公司老不老實。
              </p>
              <p>
                三、<strong>確認公家規費是否已代收</strong>
                。火化、晉塔等費用若未列入，最後仍要自付，容易造成預算誤判。
              </p>
            </Callout>
          </Reveal>

          <Reveal>
            <Sub>先定預算，再談方案</Sub>
            <p>
              比較實用的做法是反過來：先在心裡定一個上限，直接告訴禮儀師
              「我們大概能負擔到這裡」，請他在這個範圍內規劃。
              把預算說出來不會被看輕，反而能省下一輪一輪加價的拉扯。
            </p>
            <p>
              也想提醒一句：<strong>排場與心意是兩件事</strong>。
              我們見過非常簡約的告別式，因為家屬親手寫了訃聞、選了故人生前愛聽的歌，
              全場的人都哭了。也見過花牆做到滿，家屬卻從頭到尾在對帳單。
            </p>
          </Reveal>

          <Reveal>
            <Sub>別忘了可以申請的給付</Sub>
            <p>
              喪葬費用有一部分可以透過社會保險支應，記得主動確認往生者的投保身分：
            </p>
            <Bullets
              items={[
                "勞保、國民年金、公保、農保的喪葬給付（依投保身分擇一辦理）",
                "同一死亡事故的喪葬給付不得重複請領，辦理前先確認適用哪一種",
                "各縣市對低收入戶另有喪葬補助，可洽戶籍地公所社會科",
                "軍公教人員另有專屬的撫慰與喪葬相關規定",
              ]}
            />
            <p className="mt-7">
              給付金額與申請期限依主管機關公告調整，本文不列數字，
              以免你看到過期資訊。請以勞保局、公所或承辦單位的最新規定為準，
              需要的話我們也可以代為協助送件。
            </p>
          </Reveal>
        </div>
      </article>

      <div className="mx-auto max-w-[60rem] px-5 sm:px-8">
        <div className="rule-gold" />
      </div>

      {/* ═══ 文章三 ════════════════════════════════════════ */}
      <article
        id="q3"
        className="mx-auto max-w-[60rem] px-5 py-24 sm:px-8 sm:py-32"
      >
        <ArticleHead
          no="03"
          kicker="最常被誤解的一題"
          title="做七、百日、對年、合爐是什麼？"
          image="/images/temple-censer.jpg"
          alt="傳統廟宇前的銅製香爐"
          readTime="約 6 分鐘"
        />

        <div className="prose-warm mt-14 max-w-[41rem]">
          <Reveal>
            <p className="dropcap">
              很多人以為這些是「一定要做的規矩」，做不到就是不孝。
              其實換個角度看會輕鬆很多：
              <strong>這些日子是替活著的人設計的</strong>。
              它們把漫長的悲傷切成一段一段，讓你知道再過幾天還有一次可以好好想他，
              也給了你一個名正言順能哭的場合。
            </p>
          </Reveal>

          <Reveal>
            <Sub>四個時間點</Sub>
            <Ordered
              items={[
                {
                  h: "做七 — 從往生日起算，每七天一次，共七次",
                  p: "頭七、二七、三七……直到七七（也稱滿七、尾七），前後約四十九天。閩南習俗中不同「七」常由不同房分主辦，例如頭七由子女、三七由女兒，各地分法差異很大。",
                },
                {
                  h: "百日 — 往生後第一百天",
                  p: "規模通常比做七簡單，家人聚在一起誦經或準備供品。到這個時候，多數家屬才真正開始感覺到日子恢復正常。",
                },
                {
                  h: "對年 — 滿一週年",
                  p: "傳統以農曆計算。對年之後，正式的服喪期告一段落，也是許多家庭真正放下的節點。",
                },
                {
                  h: "合爐 — 讓故人成為「祖先」",
                  p: "通常在對年後擇日進行，將故人的名字寫入祖先牌位、香爐合為一個。做完合爐，往後就跟著祖先一起祭拜，不再單獨設位。",
                },
              ]}
            />
          </Reveal>

          <Reveal>
            <Callout label="現代做法可以怎麼調整">
              <p>
                <strong>提前做是可以的。</strong>
                多數家庭會把日子往前挪幾天，配合大家能請假的時間。
                取的是「七」的意義，不是硬卡在那一天。
              </p>
              <p>
                <strong>合併也是可以的。</strong>
                有些家庭只做頭七與滿七，中間以簡單的居家祭拜代替，
                這在現在相當普遍。
              </p>
              <p>
                <strong>不同信仰有不同做法。</strong>
                佛教多以誦經超薦，道教有其科儀次第，
                基督教與天主教則以追思禮拜、彌撒的形式進行，不做七。
              </p>
            </Callout>
          </Reveal>

          <Reveal>
            <Sub>為什麼還是建議做一點什麼</Sub>
            <p>
              從實務上看，有做儀式的家庭，家人之間的爭執通常比較少。
              因為儀式提供了一個共同的行程：這天大家都會回來、都會做同一件事。
              沒有這個框架，各自消化悲傷的家人很容易在
              「你好像不太難過」這種誤會裡受傷。
            </p>
            <p>
              所以我們很少建議完全省略，但也從不勸家屬加做。
              <strong>合適的規模，是你這個家做得來的規模</strong>。
              需要簡化的時候，我們會陪你想怎麼簡化才不失禮。
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-16 border-t border-linen pt-8">
              <p className="text-[0.82rem] leading-[2] tracking-wider text-cocoa/65">
                ※
                本文為一般性說明。台灣各地與各家族的習俗差異相當大，
                相關法規與給付規定亦會調整；實際作法請以當地主管機關公告，
                以及承辦禮儀師的建議為準。
              </p>
            </div>
          </Reveal>
        </div>
      </article>

      {/* ═══ 結尾 ═══════════════════════════════════════════ */}
      <section className="border-t border-linen/60 bg-cream-deep">
        <div className="mx-auto max-w-[60rem] px-5 py-20 sm:px-8 sm:py-24">
          <Reveal>
            <span className="eyebrow text-clay">Still here?</span>
            <h2 className="font-title mt-6 text-[1.6rem] leading-[1.55] text-espresso sm:text-[2rem]">
              看完還是有想問的，
              <br className="sm:hidden" />
              直接問我們就好
            </h2>
            <p className="mt-6 max-w-xl text-[0.92rem] leading-[2.1] tracking-wider text-cocoa/85">
              問一個名詞、確認一個日期、或只是想聽人說一句沒關係。
              我們的電話 24 小時都有人接。
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="tel:0800000000"
                className="group flex items-center gap-4 rounded-full bg-espresso px-8 py-4 text-cream transition-colors hover:bg-rust"
              >
                <span className="numeral text-lg tracking-widest">
                  0800-000-000
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <Link
                href="/"
                className="rounded-full px-8 py-4 text-[0.85rem] tracking-[0.16em] text-espresso ring-1 ring-clay transition-colors hover:bg-sand/50"
              >
                回首頁
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
