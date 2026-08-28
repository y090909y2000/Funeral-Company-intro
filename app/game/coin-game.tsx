"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { bestScoreStore } from "../lib/stores";

/* ── 規則設定 ─────────────────────────────────────────────── */

const DURATION = 15; // 秒

// 固定的世界座標，畫面再大再小都用同一組物理數值，手機與桌機難度一致
const WORLD_W = 480;
const WORLD_H = 640;

const BASKET_W = 104;
const BASKET_H = 62;
const BASKET_SPEED = 420; // 鍵盤操作時的移動速度（每秒）

type CoinType = {
  value: number;
  weight: number; // 抽中的相對權重
  radius: number;
  face: string;
  rim: string;
  ink: string;
};

// 面額越大越少見，越大顆
const COIN_TYPES: CoinType[] = [
  { value: 1, weight: 34, radius: 15, face: "#f2e0c6", rim: "#cbac85", ink: "#7a5636" },
  { value: 5, weight: 26, radius: 17, face: "#e9cba3", rim: "#c1976a", ink: "#6b4a2c" },
  { value: 10, weight: 20, radius: 19, face: "#ddb079", rim: "#b0834e", ink: "#573818" },
  { value: 50, weight: 14, radius: 22, face: "#cb8442", rim: "#9a5a24", ink: "#fdf3e3" },
  { value: 100, weight: 6, radius: 26, face: "#eeb944", rim: "#b8860f", ink: "#4a3208" },
];

const TOTAL_WEIGHT = COIN_TYPES.reduce((sum, type) => sum + type.weight, 0);

function pickCoinType(): CoinType {
  let roll = Math.random() * TOTAL_WEIGHT;
  for (const type of COIN_TYPES) {
    roll -= type.weight;
    if (roll <= 0) return type;
  }
  return COIN_TYPES[0];
}

/* ── 遊戲狀態（放在 ref 裡，不驅動 render）───────────────── */

type Coin = { x: number; y: number; vy: number; spin: number; type: CoinType };
type Popup = { x: number; y: number; life: number; value: number };

type GameState = {
  coins: Coin[];
  popups: Popup[];
  basketX: number;
  elapsed: number;
  nextSpawn: number;
  score: number;
  tally: Map<number, number>;
  shownSecond: number;
  keys: Set<string>;
};

function freshState(): GameState {
  return {
    coins: [],
    popups: [],
    basketX: WORLD_W / 2,
    elapsed: 0,
    nextSpawn: 0,
    score: 0,
    tally: new Map(),
    shownSecond: DURATION,
    keys: new Set(),
  };
}

/* ── 繪圖 ─────────────────────────────────────────────────── */

const RIM_Y = WORLD_H - BASKET_H - 16; // 盆口的高度

function drawField(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, WORLD_H);
  bg.addColorStop(0, "#2a1c14");
  bg.addColorStop(0.55, "#3a2718");
  bg.addColorStop(1, "#241812");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  // 盆口附近的一圈暖光
  const glow = ctx.createRadialGradient(
    WORLD_W / 2,
    WORLD_H - 40,
    10,
    WORLD_W / 2,
    WORLD_H - 40,
    WORLD_W * 0.8,
  );
  glow.addColorStop(0, "rgba(212, 177, 131, 0.22)");
  glow.addColorStop(1, "rgba(212, 177, 131, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);
}

function drawCoin(ctx: CanvasRenderingContext2D, coin: Coin) {
  const { x, y, type, spin } = coin;
  // 用水平縮放假裝硬幣在翻轉，最窄留 0.35 免得變成一條線
  const squash = 0.35 + 0.65 * Math.abs(Math.cos(spin));

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(squash, 1);

  const shine = ctx.createRadialGradient(
    -type.radius * 0.35,
    -type.radius * 0.4,
    type.radius * 0.15,
    0,
    0,
    type.radius,
  );
  shine.addColorStop(0, "#fff8ea");
  shine.addColorStop(0.45, type.face);
  shine.addColorStop(1, type.rim);

  ctx.beginPath();
  ctx.arc(0, 0, type.radius, 0, Math.PI * 2);
  ctx.fillStyle = shine;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = type.rim;
  ctx.stroke();

  ctx.restore();

  // 面額不跟著壓扁，維持可讀
  if (squash > 0.55) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, (squash - 0.55) / 0.25);
    ctx.fillStyle = type.ink;
    ctx.font = `600 ${Math.round(type.radius * 0.92)}px Georgia, "Times New Roman", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(type.value), x, y + 1);
    ctx.restore();
  }
}

function drawBasket(ctx: CanvasRenderingContext2D, centerX: number) {
  const halfWidth = BASKET_W / 2;
  const top = RIM_Y;
  const bottom = top + BASKET_H;

  ctx.save();

  // 盆身：上寬下窄的圓底
  ctx.beginPath();
  ctx.moveTo(centerX - halfWidth, top);
  ctx.lineTo(centerX + halfWidth, top);
  ctx.quadraticCurveTo(centerX + halfWidth * 0.82, bottom, centerX, bottom);
  ctx.quadraticCurveTo(centerX - halfWidth * 0.82, bottom, centerX - halfWidth, top);
  ctx.closePath();

  const body = ctx.createLinearGradient(centerX - halfWidth, top, centerX + halfWidth, bottom);
  body.addColorStop(0, "#8a5a2c");
  body.addColorStop(0.5, "#b0763c");
  body.addColorStop(1, "#7a4a22");
  ctx.fillStyle = body;
  ctx.fill();

  // 盆口
  ctx.beginPath();
  ctx.ellipse(centerX, top, halfWidth, 11, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#2a1c14";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#d4b183";
  ctx.stroke();

  ctx.restore();
}

function drawPopup(ctx: CanvasRenderingContext2D, popup: Popup) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, popup.life);
  ctx.fillStyle = "#f2d9a8";
  ctx.font = '600 20px Georgia, "Times New Roman", serif';
  ctx.textAlign = "center";
  ctx.fillText(`+${popup.value}`, popup.x, popup.y);
  ctx.restore();
}

/* ── 元件 ─────────────────────────────────────────────────── */

type Status = "idle" | "playing" | "over";

export function CoinGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(freshState());

  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [breakdown, setBreakdown] = useState<{ value: number; count: number }[]>(
    [],
  );
  const [isRecord, setIsRecord] = useState(false);

  const best = useSyncExternalStore(
    bestScoreStore.subscribe,
    bestScoreStore.getSnapshot,
    bestScoreStore.getServerSnapshot,
  );

  const paint = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const state = stateRef.current;

    drawField(ctx);
    for (const coin of state.coins) drawCoin(ctx, coin);
    drawBasket(ctx, state.basketX);
    for (const popup of state.popups) drawPopup(ctx, popup);
  }, []);

  /* 畫布尺寸與 DPR。世界座標固定，這裡只負責縮放 */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      // 改動 canvas.width 會重置 context，所以 transform 要在這之後設
      const scale = rect.width / WORLD_W;
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);

      paint();
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [paint]);

  /* 主迴圈 */
  useEffect(() => {
    if (status !== "playing") return;

    const state = stateRef.current;
    let frame = 0;
    let last = performance.now();

    function finish() {
      const rows = COIN_TYPES.map((type) => ({
        value: type.value,
        count: state.tally.get(type.value) ?? 0,
      })).filter((row) => row.count > 0);

      setBreakdown(rows);
      setScore(state.score);
      setTimeLeft(0);

      // 直接向 store 取當下的最高分，這樣 best 就不必進 effect 的依賴，
      // 也避免「更新完 best 之後才比較」導致每局都判定為新高分
      const previousBest = bestScoreStore.getSnapshot().value;
      const record = state.score > previousBest && state.score > 0;
      setIsRecord(record);
      if (record) bestScoreStore.set(state.score);

      setStatus("over");
    }

    function update(dt: number) {
      state.elapsed += dt;

      // 鍵盤移動
      let direction = 0;
      if (state.keys.has("ArrowLeft") || state.keys.has("a")) direction -= 1;
      if (state.keys.has("ArrowRight") || state.keys.has("d")) direction += 1;
      if (direction !== 0) {
        state.basketX += direction * BASKET_SPEED * dt;
      }
      const half = BASKET_W / 2;
      state.basketX = Math.min(WORLD_W - half, Math.max(half, state.basketX));

      // 生成金幣：越接近尾聲越密
      const progress = state.elapsed / DURATION;
      const interval = 0.46 - 0.18 * progress;
      state.nextSpawn -= dt;
      if (state.nextSpawn <= 0) {
        state.nextSpawn = interval;
        const type = pickCoinType();
        state.coins.push({
          x: type.radius + Math.random() * (WORLD_W - type.radius * 2),
          y: -type.radius,
          vy: 165 + Math.random() * 95 + progress * 85,
          spin: Math.random() * Math.PI,
          type,
        });
      }

      // 移動與判定
      for (let i = state.coins.length - 1; i >= 0; i -= 1) {
        const coin = state.coins[i];
        coin.y += coin.vy * dt;
        coin.spin += dt * 3.2;

        const bottom = coin.y + coin.type.radius;
        const caught =
          bottom >= RIM_Y &&
          bottom <= RIM_Y + 36 &&
          Math.abs(coin.x - state.basketX) <= half;

        if (caught) {
          state.score += coin.type.value;
          state.tally.set(
            coin.type.value,
            (state.tally.get(coin.type.value) ?? 0) + 1,
          );
          state.popups.push({
            x: coin.x,
            y: RIM_Y - 14,
            life: 1,
            value: coin.type.value,
          });
          state.coins.splice(i, 1);
          setScore(state.score);
          continue;
        }

        if (coin.y - coin.type.radius > WORLD_H) state.coins.splice(i, 1);
      }

      // 得分飄字
      for (let i = state.popups.length - 1; i >= 0; i -= 1) {
        const popup = state.popups[i];
        popup.y -= 42 * dt;
        popup.life -= dt * 1.5;
        if (popup.life <= 0) state.popups.splice(i, 1);
      }

      // 倒數只在整秒變動時才更新 React state
      const remaining = Math.max(0, Math.ceil(DURATION - state.elapsed));
      if (remaining !== state.shownSecond) {
        state.shownSecond = remaining;
        setTimeLeft(remaining);
      }
    }

    function step(now: number) {
      // 切到別的分頁再回來時 now 會跳很大一段，夾住避免金幣瞬移穿過盆口
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      update(dt);
      paint();

      if (state.elapsed >= DURATION) {
        finish();
        return;
      }
      frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [status, paint]);

  /* 鍵盤 */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "a" ||
        key === "d"
      ) {
        // 遊戲進行中不要讓方向鍵捲動頁面
        if (status === "playing") event.preventDefault();
        stateRef.current.keys.add(key);
      }
    }
    function onKeyUp(event: KeyboardEvent) {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      stateRef.current.keys.delete(key);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [status]);

  const start = useCallback(() => {
    stateRef.current = freshState();
    setScore(0);
    setTimeLeft(DURATION);
    setBreakdown([]);
    setIsRecord(false);
    setStatus("playing");
  }, []);

  /* 滑鼠與觸控：直接把盆子對到指標的水平位置 */
  function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (status !== "playing") return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;

    const worldX = ((event.clientX - rect.left) / rect.width) * WORLD_W;
    const half = BASKET_W / 2;
    stateRef.current.basketX = Math.min(
      WORLD_W - half,
      Math.max(half, worldX),
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* 計分板 */}
      <div className="lg:col-span-5 lg:row-start-1">
        <div className="flex gap-px border-l border-t border-linen">
          <div className="flex-1 border-b border-r border-linen px-5 py-6">
            <span className="eyebrow block text-clay">Score</span>
            <p className="numeral mt-2 text-[2rem] leading-none text-espresso">
              {score}
              <span className="ml-1 text-[0.9rem] text-cocoa/60">元</span>
            </p>
          </div>
          <div className="flex-1 border-b border-r border-linen px-5 py-6">
            <span className="eyebrow block text-clay">Time</span>
            <p
              className={`numeral mt-2 text-[2rem] leading-none ${
                timeLeft <= 5 && status === "playing"
                  ? "text-rust"
                  : "text-espresso"
              }`}
            >
              {timeLeft}
              <span className="ml-1 text-[0.9rem] text-cocoa/60">秒</span>
            </p>
          </div>
        </div>

        {best.ready && best.value > 0 ? (
          <p className="mt-5 flex items-baseline gap-3 text-[0.82rem] tracking-wider text-cocoa/70">
            <span className="eyebrow text-clay">Best</span>
            <span className="numeral text-base text-espresso">
              {best.value} 元
            </span>
          </p>
        ) : null}

        <div className="mt-9 border-t border-linen pt-7">
          <h2 className="font-title text-[1.05rem] text-espresso">怎麼玩</h2>
          <ul className="mt-5 space-y-3.5">
            {[
              "移動滑鼠或手指拖動，把聚寶盆移到金幣底下",
              "也可以用方向鍵或 A／D 鍵操作",
              "15 秒內接到的金額就是分數，漏接不扣分",
            ].map((line) => (
              <li key={line} className="flex gap-4">
                <span className="mt-2.5 h-px w-5 shrink-0 bg-clay" />
                <span className="text-[0.86rem] leading-[1.9] tracking-wider text-cocoa">
                  {line}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <span className="eyebrow block text-clay">面額與出現機率</span>
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
              {COIN_TYPES.map((type) => (
                <div key={type.value} className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="inline-block h-3.5 w-3.5 rounded-full border"
                    style={{ background: type.face, borderColor: type.rim }}
                  />
                  <dt className="numeral text-[0.9rem] text-espresso">
                    {type.value}
                  </dt>
                  <dd className="numeral text-[0.75rem] text-cocoa/60">
                    {Math.round((type.weight / TOTAL_WEIGHT) * 100)}%
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* 遊戲區 */}
      <div className="lg:col-span-7 lg:row-start-1">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[30rem] overflow-hidden lg:max-w-none">
          <canvas
            ref={canvasRef}
            onPointerMove={onPointerMove}
            onPointerDown={onPointerMove}
            className="block h-full w-full touch-none"
            aria-label="接金幣遊戲畫面"
          />

          {/* 開始 / 結束畫面直接用 DOM 疊上去，排版比畫在 canvas 上好處理 */}
          {status !== "playing" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-espresso/80 px-6 text-center backdrop-blur-sm">
              {status === "idle" ? (
                <>
                  <span className="eyebrow text-gold">15 seconds</span>
                  <h2 className="font-title mt-5 text-[1.7rem] leading-[1.5] text-cream sm:text-[2.1rem]">
                    聚寶盆接金幣
                  </h2>
                  <p className="mt-4 max-w-xs text-[0.86rem] leading-[1.95] tracking-wider text-cream/70">
                    純娛樂的小單元，分數不代表任何優惠。
                  </p>
                  <button
                    type="button"
                    onClick={start}
                    className="mt-9 rounded-full bg-cream px-9 py-4 text-[0.9rem] tracking-[0.16em] text-espresso transition-colors hover:bg-gold"
                  >
                    開始遊戲
                  </button>
                </>
              ) : (
                <>
                  <span className="eyebrow text-gold">Time up</span>
                  <p className="numeral mt-5 text-[3rem] leading-none text-cream sm:text-[3.6rem]">
                    {score}
                    <span className="ml-2 text-[1.1rem] text-cream/60">元</span>
                  </p>

                  {isRecord ? (
                    <p className="mt-4 text-[0.85rem] tracking-[0.16em] text-gold">
                      新高分
                    </p>
                  ) : null}

                  {breakdown.length > 0 ? (
                    <dl className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2">
                      {breakdown.map((row) => (
                        <div key={row.value} className="flex items-baseline gap-1.5">
                          <dt className="numeral text-[0.9rem] text-cream/85">
                            {row.value}
                          </dt>
                          <dd className="numeral text-[0.78rem] text-cream/55">
                            ×{row.count}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="mt-6 text-[0.85rem] tracking-wider text-cream/60">
                      一個都沒接到，再試一次吧。
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={start}
                    className="mt-9 rounded-full bg-cream px-9 py-4 text-[0.9rem] tracking-[0.16em] text-espresso transition-colors hover:bg-gold"
                  >
                    再玩一次
                  </button>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
