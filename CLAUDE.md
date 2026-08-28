@AGENTS.md

# 如憶生命禮儀 — 練習用官網

Next.js 16.3.3（App Router / Turbopack）+ React 19 + Tailwind CSS v4 + TypeScript。
虛構的殯葬禮儀公司官網，用途是練習。GitHub：
<https://github.com/y090909y2000/Funeral-Company-intro>

## 目前進度

已完成並推上 GitHub（`main` 分支，工作區乾淨）：

- 三個頁面 `/`、`/blog`、`/game` 都能正常運作
- 首頁六個區塊：01 關於、02 服務項目、03 治喪流程、04 後續關懷、05 常見問答、
  06 線上小活動
- 滾動視差、進場動畫、手機／平板／桌機響應式、手機全螢幕選單
- 首次到訪詢問稱呼並存 localStorage、回訪直接顯示、首屏問候
- 抽獎 modal（10% 機率、Email 格式驗證、結果存 localStorage）
- 接金幣小遊戲（15 秒、面額 1/5/10/50/100、最高分存 localStorage）
- `npx tsc --noEmit` 與 `npx eslint app` 皆零錯誤零警告

還沒做、可能是下一步的：

- 替換假的聯絡資訊（見「待替換的假資料」）
- 沒有真正的聯絡表單（Email 驗證目前只用在抽獎 modal）
- 沒有部署（可考慮 Vercel）
- 沒有測試

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

## 協作方式（請遵守，這是使用者明確要求的）

**版面由使用者自己看，不要主動截圖。** 改完版面就說「已完成，請開
<http://localhost:3000> 看看」，並把該注意的地方列成清單讓他對照。他會自己點進
網頁檢查，有問題會自己截圖回報。

原因是成本：建站那次為了選圖與驗證版面讀了約 50 張截圖，是整段對話最大的花費
來源，而使用者本來就會自己看畫面 —— 同樣的結果卻多花了很多錢。

**便宜的驗證用這些取代截圖：**

```bash
npx tsc --noEmit && npx eslint app     # 先跑這兩個，零錯誤零警告
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/   # 頁面有沒有 500
```

只在這幾種情況才截圖，而且**先說一句為什麼**：使用者明確要求、頁面完全無法載入
需要定位、或使用者回報了看程式碼找不出原因的視覺 bug。

**其他省錢原則：**

- 使用者指名檔案時就直接改，不要先全域搜尋
- 用 grep 找片段，不要整份讀大檔
- 技術名詞用中文解釋清楚（使用者是初學者會問「這什麼意思」），但別因此拉長篇幅
- 每完成一個功能就建議使用者 `/clear`

## 模型選擇（每個任務開始前先評估一句）

模型不能由 Claude 自己切換，只有使用者能用 `/model` 換。所以**每接到一個任務，
先用一句話評估「這個任務適合什麼模型」再動手**，讓使用者決定要不要切。
專案的 `settings.local.json` 目前釘在 `haiku`，新對話預設就是 Haiku。

相對價格（Haiku = 1 倍）：**Haiku 4.5 = 1× ・ Sonnet 5 = 2× ・ Opus 5 = 5×**。
關鍵是 **Sonnet 5 只比 Haiku 貴一倍**，而不是貴好幾倍。

| 任務類型 | 建議 |
| --- | --- |
| 改文案、調顏色間距、加一個簡單元件、重新命名、回答觀念問題 | Haiku 4.5 夠用 |
| 新增頁面或功能、跨多個檔案改動、除錯、要讀 Next.js 文件 | Sonnet 5 |
| 難以重現的 bug、架構決策、大範圍重構 | Opus 5 |

**升級的判斷點：同一個問題連續失敗兩次就停手，說「這題我卡住了，建議切
Sonnet 5 再繼續」**，不要在便宜模型上反覆重試 —— 重試會把整段對話重新計價，
三次失敗的 Haiku 比一次成功的 Sonnet 貴。

兩個容易忽略的成本陷阱：

- **對話中途 `/model` 升級，會用新價格重算已累積的整段上下文。** 所以正確順序是
  「先 `/clear` → 再選模型 → 才開始做」，不是做到一半才換。
- **Haiku 4.5 的上下文只有 200K**（Sonnet 5 與 Opus 5 是 1M）。長對話會比較早
  觸發壓縮，這也是要常 `/clear` 的原因。

## 我在這個專案上犯過的流程錯誤（別重複）

1. **截了太多圖。** 見上一節。這是最貴的一次浪費。
2. **`mkdir -p "$D" && cd "$D"` 失敗後沒察覺。** sandbox 讓 mkdir 回非零，`cd`
   因此沒執行，14 張圖全下載到別的目錄，等於整批重下一次。
   寫檔前先確認目標**是資料夾**（當時 `public/images` 竟是一個 0 bytes 的檔案），
   寫完立刻用 `ls`／`stat` 驗證真的落地。
3. **globals.css 寫了兩份。** 先寫在 layer 外，發現覆寫問題後又在 `@layer` 內
   重寫一次，留下重複規則要再花一輪刪掉。**動手前先決定 layer 結構。**
4. **同一個 grid bug 修了兩次。** 只補 `row-start` 讓版面更糟，才發現兩邊都要
   `col-start` + `row-start`。改 grid 交疊前先把欄位佔用算清楚。
5. **元件建好卻沒接進頁面。** 寫完 `LotteryButton`、`VisitorGreeting` 沒 import
   到 `page.tsx`，差點把半成品 commit 上去。**做完一個元件立刻接上並確認畫面有它。**
6. 環境細節：**沒有 python**（`python -c` 會失敗），改檔用 Edit 工具或 sed。

## 萬一真的需要截圖（附帶的坑）

Chrome headless + CDP：

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
