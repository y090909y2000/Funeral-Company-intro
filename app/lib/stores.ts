import { createLocalStore } from "./local-store";

/* ── 訪客稱呼 ─────────────────────────────────────────────────
   asked 記住「已經問過了」，這樣選擇跳過的人不會每次進站都被攔一次。
   ───────────────────────────────────────────────────────────── */

export type Visitor = { name: string | null; asked: boolean };

const EMPTY_VISITOR: Visitor = { name: null, asked: false };

export const visitorStore = createLocalStore<Visitor>(
  "anhe.visitor",
  EMPTY_VISITOR,
  (raw) => {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null) return EMPTY_VISITOR;
      const record = parsed as Record<string, unknown>;
      const name =
        typeof record.name === "string" && record.name.trim()
          ? record.name.trim()
          : null;
      return { name, asked: record.asked === true };
    } catch {
      // 舊格式或被手動改壞了就當作沒有資料
      return EMPTY_VISITOR;
    }
  },
  (value) => JSON.stringify(value),
);

/* ── 抽獎結果 ─────────────────────────────────────────────── */

export const prizeStore = createLocalStore<string | null>(
  "anhe.prize",
  null,
  (raw) => (raw.trim() ? raw.trim() : null),
  (value) => value ?? "",
);

/* ── 小遊戲最高分 ─────────────────────────────────────────── */

export const bestScoreStore = createLocalStore<number>(
  "anhe.game.best",
  0,
  (raw) => {
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
  },
  (value) => String(value),
);
