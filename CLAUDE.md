@AGENTS.md

# 安和生命禮儀 — 練習用官網

Next.js 16.3.3（App Router / Turbopack）+ React 19 + Tailwind CSS v4 + TypeScript。
虛構的殯葬禮儀公司官網，用途是練習。GitHub：
<https://github.com/y090909y2000/Funeral-Company-intro>

## 指令

```bash
npm run dev        # 開發伺服器，預設 http://localhost:3000
npx tsc --noEmit   # 型別檢查
npx eslint app     # lint（改完程式務必跑這兩個，兩者都要零錯誤零警告）
npm run build      # 正式建置
```

`next dev` 若說 port 3000 已被占用且「Another next dev server is already running」，
表示前一個 process 還在。舊 process 會自己重新編譯，通常直接用原本那個就好；
真要重開再 `taskkill /PID <pid> /F`。

## 路由與檔案

| 路徑 | 檔案 | 說明 |
| --- | --- | --- |
| `/` | `app/page.tsx` | 首頁，六個編號區塊 01–06 |
| `/blog` | `app/blog/page.tsx` | 三篇殯葬常見問答長文（錨點 `#q1` `#q2` `#q3`） |
| `/game` | `app/game/page.tsx` + `coin-game.tsx` | 接金幣小遊戲 |

共用元件在 `app/components/`：

- `site-header.tsx` — 固定頁首。捲過 48px 才變實心底；在頂部是透明的，
  **所以任何新頁面最上方都必須是深色區塊**，否則米白色的頁首文字會看不見。
- `site-footer.tsx`
- `motion.tsx` — `ParallaxMedia`（滾動視差）與 `Reveal`（進場淡入）
- `modal.tsx` — `Modal` / `ModalClose`，含 Escape、點背景關閉、焦點循環、還原焦點
- `visitor.tsx` — 首次到訪詢問稱呼、首屏問候
- `lottery-modal.tsx` — 10% 機率的抽獎

`app/lib/`：

- `local-store.ts` — localStorage 的 store 工廠，搭配 `useSyncExternalStore`
- `stores.ts` — 三個實例：`visitorStore`、`prizeStore`、`bestScoreStore`
- `validation.ts` — `validateEmail`、`validateNickname`
- `scroll-lock.ts` — 用計數器的背景滾動鎖

## 設計系統

色票與字體定義在 `app/globals.css` 的 `@theme inline`。暖色系：
`cream` `cream-deep` `sand` `linen` `clay` `gold` `terracotta` `rust` `cocoa`
`espresso` `ink`。用 `bg-cream`、`text-espresso`、`border-linen` 這樣取用。

自訂 class（全部在 `@layer components` 內）：

| class | 用途 |
| --- | --- |
| `.font-title` | 中文標題，明體 + 寬字距 |
| `.eyebrow` | 拉丁小標，全大寫寬字距 |
| `.numeral` | 等寬數字 |
| `.vtext` | 直排中文 |
| `.rule-gold` | 金色髮絲線 |
| `.px-frame` / `.px-media` | 視差容器與內層圖片 |
| `.reveal` / `.reveal-rule` | 進場動畫 |
| `.prose-warm` / `.dropcap` | 長文排版 |
| `.grain` | 全站紙質顆粒（掛在 `body`） |

視覺方向刻意避開制式 AI 版型：非對稱排版、疊圖、「序號—金線—拉丁標籤」的區塊
標頭、直排題辭、沾黏圖配滾動清單。**新增區塊請沿用這套語彙，不要退回三張等寬
圓角卡片加 emoji。**

中文長文行寬用 `max-w-[41rem]`（約 640px）。960px 對中文太寬。

## 已知的坑（重要，別再踩）

1. **自訂 CSS 一定要放進 `@layer components`。**
   放在 layer 外面會蓋掉 Tailwind utility — 例如 `.px-frame { position: relative }`
   會壓過 className 上的 `absolute`，把 hero 版面弄裂。
   （`prefers-reduced-motion` 那段刻意留在 layer 外，才能覆寫預設動畫。）

2. **`Reveal` 不能夾在 `<ol>` 與 `<li>` 之間。**
   那是非法 HTML，而且會讓 `last:`、`nth-child()` 這類位置變體全部失效
   （流程區的格線就是這樣消失的）。正確寫法是 `<li>` 在外、`Reveal` 在內。

3. **格線邊框用「容器畫上／左，格子畫右／下」。**
   不要用 `nth-child` 去關掉特定邊框，欄數一變就破。

4. **grid 圖文交疊要同時給 `col-start` 和 `row-start`。**
   只給 `col-span` 的那一方會因為欄位被搶而被擠到下一列，或掉到格線外的隱式欄位。

5. **中文字體走 Google Fonts `<link>`，不用 `next/font`。**
   繁中字符集龐大，自帶字檔會塞進數 MB 分包並拖慢編譯。
   `layout.tsx` 有一行 `eslint-disable-next-line @next/next/no-page-custom-font`，
   那條規則是針對 Pages Router 的 `_document`，此處不適用。

6. **讀 localStorage 用 `useSyncExternalStore`，不要 `useEffect` + `setState`。**
   後者會被 `react-hooks/set-state-in-effect` 這條 lint 規則擋下，
   而且回訪者會先閃一下「沒有資料」的畫面。
   同理，`site-header.tsx` 換頁收選單是在 render 期間比對 pathname，不是用 effect。

7. **Bash 工具寫入專案目錄會被 sandbox 擋掉**（curl 回 200 但寫出 0 bytes）。
   下載檔案要先存到暫存目錄，再用 `dangerouslyDisableSandbox` 複製進來。

## 圖片

`public/images/` 共 14 張，全部取自 Unsplash（授權允許商用、不強制標註）。
對照表與 3 張未使用的備用圖列在 `IMAGE-CREDITS.md`。
都用 `next/image` 的 `fill` 模式，容器已設好長寬比，換成同名檔案即可生效。

## 驗證版面的方法

改完版面不要只看 HTML 有沒有字，要真的看畫面。用 Chrome headless + CDP：

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new \
  --disable-gpu --remote-debugging-port=9333 \
  --user-data-dir="C:\Users\user\AppData\Local\Temp\cdp-profile" \
  --no-first-run about:blank &
```

然後用 CDP 的 `Emulation.setDeviceMetricsOverride` 設視窗、`Runtime.evaluate`
執行 `window.scrollTo` 逐屏捲動、`Page.captureScreenshot` 擷取，再用 Read 看圖。

注意事項：

- **不要用 `#anchor` 定位截圖**。圖片載入後版面會位移，截到的常是空白處。
- **不要用 `--screenshot` 加 `--virtual-time-budget`**。`Reveal` 的進場動畫不會跑完，
  截出來是空白的純底色。要嘛真的捲動並等 1.4 秒，要嘛加
  `--force-prefers-reduced-motion` 讓內容直接顯示。
- Chrome 的 `--screenshot` 包在 shell function 裡會靜默失敗，逐條直接呼叫才穩。
- Port 9222 被 Adobe UXP 占用了，用 9333。

## 待替換的假資料

以下都是示範用的佔位資訊，正式上線前要換掉：

- 電話 `0800-000-000`（散落在 `page.tsx`、`site-header.tsx`、`site-footer.tsx`、
  `blog/page.tsx`、`game/page.tsx`）
- Email `service@example.com`
- 地址「臺北市○○區○○路 000 號」、證照字號「北市殯管字第 ○○○○ 號」
- 公司沿革（1994 年成立、三十年經驗）也是虛構的

抽獎與小遊戲都已在畫面上標明是練習用示範功能、不會實際寄信、分數與收費無關。

## 內容原則

殯葬相關敘述涉及實務與法規，寫作時：

- 不編造具體金額或給付數字，改為說明費用結構並提示以主管機關公告為準
- 保留「各地習俗差異大」的說明
- 文案用具體的台灣殯葬實務用語（做七、對年、合爐、豎靈、進金、晉塔），不寫通用套話
