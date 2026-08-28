"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { Modal, ModalClose } from "./modal";
import { prizeStore } from "../lib/stores";
import { useVisitor } from "./visitor";
import {
  EMAIL_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  validateEmail,
  validateNickname,
} from "../lib/validation";

/** 中獎機率。0.1 = 10% */
const WIN_RATE = 0.1;

const PRIZE_NAME = "蓮花被";
const DRAW_MS = 1800;

/** 抽獎動畫時滾動的字樣，只是視覺效果，與結果無關 */
const REEL = [
  `${PRIZE_NAME} 優待`,
  "謝謝參加",
  "再靠近一點",
  "謝謝參加",
  `${PRIZE_NAME} 優待`,
  "差一點點",
];

type Status = "form" | "drawing" | "won" | "lost";

function makeCouponCode() {
  // 去掉容易看錯的 0/O/1/I
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `AH-${code}`;
}

export function LotteryButton({ className = "" }: { className?: string }) {
  const visitor = useVisitor();
  const prize = useSyncExternalStore(
    prizeStore.subscribe,
    prizeStore.getSnapshot,
    prizeStore.getServerSnapshot,
  );

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("form");
  const [reelIndex, setReelIndex] = useState(0);

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const titleId = useId();
  const nicknameErrorId = useId();
  const emailErrorId = useId();

  // 抽獎動畫：字樣滾動一段時間後才揭曉結果。
  // setState 都在 interval / timeout 的回呼裡，不是同步寫在 effect 內。
  useEffect(() => {
    if (status !== "drawing") return;

    const spin = window.setInterval(() => {
      setReelIndex((index) => (index + 1) % REEL.length);
    }, 90);

    const settle = window.setTimeout(() => {
      if (Math.random() < WIN_RATE) {
        prizeStore.set(makeCouponCode());
        setStatus("won");
      } else {
        setStatus("lost");
      }
    }, DRAW_MS);

    return () => {
      window.clearInterval(spin);
      window.clearTimeout(settle);
    };
  }, [status]);

  function openModal() {
    // 開啟時才帶入稱呼：此時 localStorage 已經讀取完成
    setNickname(visitor.value.name ?? "");
    setNicknameError(null);
    setEmailError(null);
    setStatus(prize.value ? "won" : "form");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    // 抽獎中途關掉就回到表單，避免下次打開卡在動畫狀態
    if (status === "drawing") setStatus("form");
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();

    const nickMessage = validateNickname(nickname);
    const mailMessage = validateEmail(email);

    setNicknameError(nickMessage);
    setEmailError(mailMessage);

    if (nickMessage || mailMessage) return;

    setStatus("drawing");
  }

  function drawAgain() {
    prizeStore.set(null);
    setStatus("form");
  }

  return (
    <>
      <button type="button" onClick={openModal} className={className}>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-terracotta" />
        </span>
        抽 {PRIZE_NAME} 優待
      </button>

      <Modal open={open} onClose={closeModal} labelId={titleId} maxWidth="max-w-lg">
        <div className="relative px-7 py-10 sm:px-11 sm:py-12">
          <ModalClose onClose={closeModal} />

          <span className="eyebrow block text-clay">Draw · 安心禮遇</span>
          <h2
            id={titleId}
            className="font-title mt-5 text-[1.5rem] leading-[1.55] text-espresso sm:text-[1.8rem]"
          >
            {status === "won"
              ? `恭喜，${PRIZE_NAME} 優待到手`
              : status === "lost"
                ? "這次沒有中，還是謝謝您"
                : `${PRIZE_NAME} 優待抽獎`}
          </h2>

          {/* ── 表單 ─────────────────────────────────────── */}
          {status === "form" ? (
            <>
              <p className="mt-4 text-[0.88rem] leading-[1.95] tracking-wider text-cocoa/80">
                中獎機率
                <span className="numeral mx-1 text-rust">10%</span>
                。中獎後優待券會寄到您填的信箱。
              </p>

              <form onSubmit={submit} noValidate className="mt-8 space-y-7">
                <div>
                  <label
                    htmlFor="lottery-nickname"
                    className="text-[0.78rem] tracking-[0.18em] text-cocoa"
                  >
                    稱呼
                  </label>
                  <input
                    id="lottery-nickname"
                    name="nickname"
                    type="text"
                    autoComplete="nickname"
                    maxLength={NICKNAME_MAX_LENGTH + 5}
                    value={nickname}
                    onChange={(event) => {
                      setNickname(event.target.value);
                      if (nicknameError) setNicknameError(null);
                    }}
                    placeholder="例如：陳先生"
                    aria-invalid={nicknameError ? true : undefined}
                    aria-describedby={
                      nicknameError ? nicknameErrorId : undefined
                    }
                    className={`mt-3 w-full border-b bg-transparent pb-3 text-[1rem] text-espresso outline-none transition-colors placeholder:text-clay/70 ${
                      nicknameError
                        ? "border-rust"
                        : "border-linen focus:border-clay"
                    }`}
                  />
                  {nicknameError ? (
                    <p
                      id={nicknameErrorId}
                      role="alert"
                      className="mt-3 text-[0.8rem] text-rust"
                    >
                      {nicknameError}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="lottery-email"
                    className="text-[0.78rem] tracking-[0.18em] text-cocoa"
                  >
                    Email
                  </label>
                  <input
                    id="lottery-email"
                    name="email"
                    // type="email" 讓手機跳出對應鍵盤；驗證仍由我們自己做，
                    // noValidate 已關掉瀏覽器原生的錯誤氣泡
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={EMAIL_MAX_LENGTH}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    onBlur={() => {
                      if (email.trim()) setEmailError(validateEmail(email));
                    }}
                    placeholder="name@example.com"
                    aria-invalid={emailError ? true : undefined}
                    aria-describedby={emailError ? emailErrorId : undefined}
                    className={`mt-3 w-full border-b bg-transparent pb-3 text-[1rem] text-espresso outline-none transition-colors placeholder:text-clay/70 ${
                      emailError
                        ? "border-rust"
                        : "border-linen focus:border-clay"
                    }`}
                  />
                  {emailError ? (
                    <p
                      id={emailErrorId}
                      role="alert"
                      className="mt-3 text-[0.8rem] text-rust"
                    >
                      {emailError}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-espresso py-4 text-[0.9rem] tracking-[0.16em] text-cream transition-colors hover:bg-rust"
                >
                  開始抽獎
                </button>
              </form>
            </>
          ) : null}

          {/* ── 抽獎動畫 ─────────────────────────────────── */}
          {status === "drawing" ? (
            <div className="mt-10 flex flex-col items-center py-10">
              <div className="rule-gold w-full" />
              <p
                aria-live="polite"
                className="font-title my-9 h-10 text-[1.5rem] text-rust sm:text-[1.8rem]"
              >
                {REEL[reelIndex]}
              </p>
              <div className="rule-gold w-full" />
              <p className="mt-9 text-[0.82rem] tracking-[0.2em] text-cocoa/60">
                正在抽獎…
              </p>
            </div>
          ) : null}

          {/* ── 中獎 ─────────────────────────────────────── */}
          {status === "won" ? (
            <div className="mt-6">
              <p className="text-[0.9rem] leading-[2] tracking-wider text-cocoa/85">
                您抽中了
                <span className="font-title mx-1 text-rust">
                  {PRIZE_NAME} 優待
                </span>
                。憑下面的代碼與我們聯絡即可使用。
              </p>

              <div className="mt-7 border-l-2 border-clay bg-cream-deep/80 px-6 py-6">
                <span className="eyebrow block text-clay">Coupon code</span>
                <p className="numeral mt-3 text-2xl tracking-[0.22em] text-espresso sm:text-[1.75rem]">
                  {prize.value}
                </p>
              </div>

              <p className="mt-6 text-[0.78rem] leading-[1.9] tracking-wider text-cocoa/60">
                代碼已存在您這台裝置，下次打開還會在。
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="tel:0800000000"
                  className="flex-1 rounded-full bg-espresso py-4 text-center text-[0.88rem] tracking-[0.14em] text-cream transition-colors hover:bg-rust"
                >
                  打電話核對代碼
                </a>
                <button
                  type="button"
                  onClick={drawAgain}
                  className="rounded-full px-7 py-4 text-[0.82rem] tracking-wider text-cocoa/70 ring-1 ring-linen transition-colors hover:bg-sand/50 hover:text-espresso"
                >
                  清除並重抽
                </button>
              </div>
            </div>
          ) : null}

          {/* ── 未中獎 ───────────────────────────────────── */}
          {status === "lost" ? (
            <div className="mt-6">
              <p className="text-[0.9rem] leading-[2] tracking-wider text-cocoa/85">
                機率是
                <span className="numeral mx-1 text-rust">10%</span>
                ，沒中很正常。不過就算沒有優待，該有的服務一樣不會少。
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setStatus("drawing")}
                  className="flex-1 rounded-full bg-espresso py-4 text-[0.88rem] tracking-[0.14em] text-cream transition-colors hover:bg-rust"
                >
                  再抽一次
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full px-7 py-4 text-[0.82rem] tracking-wider text-cocoa/70 ring-1 ring-linen transition-colors hover:bg-sand/50 hover:text-espresso"
                >
                  下次再說
                </button>
              </div>
            </div>
          ) : null}

          <p className="mt-9 border-t border-linen pt-5 text-[0.72rem] leading-[1.8] tracking-wider text-cocoa/50">
            本抽獎為練習用示範功能，抽獎結果僅存於瀏覽器，不會實際寄送任何信件。
          </p>
        </div>
      </Modal>
    </>
  );
}
