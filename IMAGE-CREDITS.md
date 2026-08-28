# 圖片來源與授權

`public/images/` 內的 14 張照片全部取自 **Unsplash**，於 2026-08-28 下載。

## 授權

Unsplash License 允許免費用於**商業與非商業**用途，且**不強制標註**攝影師或
Unsplash（但標註是受歡迎的）。主要限制是：不得販售未經修改的照片副本，也不得
用這些照片去建立一個與 Unsplash 競爭的圖庫服務。

完整條款：<https://unsplash.com/license>

> 因為下載走的是 Unsplash 的圖片 CDN，網址本身不帶攝影師姓名，所以下表沒有列出
> 作者。授權上不需要標註；若你想加上致謝，可用下表的網址回查原始照片頁面。

## 對照表

| 檔名 | 內容 | 原始網址 |
| --- | --- | --- |
| `hero-candles.jpg` | 首屏：暗處的成排暖黃燭光 | `https://images.unsplash.com/photo-1476900164809-ff19b8ae5968` |
| `parallax-dawn.jpg` | 視差題辭帶：晨光雲海與山稜 | `https://images.unsplash.com/photo-1444090542259-0af8fa96557e` |
| `lily-warm.jpg` | 關於我們：暖光下的白百合 | `https://images.unsplash.com/photo-1542768651-5d7354d0b782` |
| `incense-warm.jpg` | 關於我們錯位小圖：線香煙 | `https://images.unsplash.com/photo-1551690935-a9e6f0a7e788` |
| `temple-hall.jpg` | 服務項目沾黏圖：廟宇藻井與匾額 | `https://images.unsplash.com/photo-1674573112312-9eef29fc6fdf` |
| `hands-companion.jpg` | 後續關懷：兩雙年長的手相握 | `https://images.unsplash.com/photo-1580869318757-a6c605b061ed` |
| `incense-lotus-holder.jpg` | 結尾行動帶底圖：蓮花造型香座 | `https://images.unsplash.com/photo-1541795083-1b160cf4f3d7` |
| `candle-glass.jpg` | 問答一封面：玻璃杯中的燭光 | `https://images.unsplash.com/photo-1528351655744-27cc30462816` |
| `chrysanthemum-white.jpg` | 問答二封面：白菊 | `https://images.unsplash.com/photo-1677867582326-b75b7f042377` |
| `temple-censer.jpg` | 問答三封面：廟前銅香爐 | `https://images.unsplash.com/photo-1600168488108-087f4be72b86` |
| `lotus-pond.jpg` | Blog 首屏：水面上的蓮花 | `https://images.unsplash.com/photo-1474557157379-8aa74a6ef541` |

## 備用（已下載但目前未使用）

留著方便你日後替換或加新區塊：

| 檔名 | 內容 | 原始網址 |
| --- | --- | --- |
| `incense-ritual.jpg` | 成束燃燒的線香，很接近台灣廟裡的樣子 | `https://images.unsplash.com/photo-1424177558417-016f30ac3059` |
| `hands-care.jpg` | 握住輪椅上長者的手 | `https://images.unsplash.com/photo-1576560665905-28b4d4ea3380` |
| `sunset-mountain.jpg` | 夕照下的山稜剪影 | `https://images.unsplash.com/photo-1611366376326-5eaf36b54355` |

## 想換圖的話

圖片都以 `next/image` 的 `fill` 模式載入，容器已設好長寬比，所以換成同名檔案就會
直接生效，不需要改任何尺寸參數。裁切位置若不理想，可調整 `ParallaxMedia` 的
`objectPosition`（例如 `"center 30%"`）。
