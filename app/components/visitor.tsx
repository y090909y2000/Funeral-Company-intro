"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { Modal, ModalClose } from "./modal";
import { visitorStore } from "../lib/stores";
import { NICKNAME_MAX_LENGTH, validateNickname } from "../lib/validation";

export function useVisitor() {
  return useSyncExternalStore(
    visitorStore.subscribe,
    visitorStore.getSnapshot,
    visitorStore.getServerSnapshot,
  );
}

/* ── 首次到訪詢問稱呼 ─────────────────────────────────────────
   ready 為 false 時（伺端算繪與 hydration 期間）什麼都不顯示，
   回訪者才不會先閃一下輸入框。
   ───────────────────────────────────────────────────────────── */

export function VisitorGate() {
  const { ready, value } = useVisitor();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const titleId = useId();
  const errorId = useId();

  const open = ready && value.name === null && !value.asked;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const message = validateNickname(draft);
    if (message) {
      setError(message);
      return;
    }
    visitorStore.set({ name: draft.trim(), asked: true });
  }

  function skip() {
    visitorStore.set({ name: null, asked: true });
  }

  return (
    <Modal
      open={open}
      onClose={skip}
      labelId={titleId}
      maxWidth="max-w-md"
      dismissOnBackdrop={false}
    >
      <div className="relative px-7 py-10 sm:px-10 sm:py-12">
        <ModalClose onClose={skip} />

        <span className="eyebrow block text-clay">Welcome</span>
        <h2
          id={titleId}
          className="font-title mt-5 text-[1.5rem] leading-[1.55] text-espresso sm:text-[1.75rem]"
        >
          我們該怎麼稱呼您？
        </h2>
        <p className="mt-4 text-[0.88rem] leading-[1.95] tracking-wider text-cocoa/80">
          只存在您這台裝置上，我們不會上傳，也不會用來聯絡您。
        </p>

        <form onSubmit={submit} noValidate className="mt-8">
          <label
            htmlFor="visitor-nickname"
            className="text-[0.78rem] tracking-[0.18em] text-cocoa"
          >
            稱呼
          </label>
          <input
            id="visitor-nickname"
            name="nickname"
            type="text"
            autoComplete="nickname"
            maxLength={NICKNAME_MAX_LENGTH + 5}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              if (error) setError(null);
            }}
            placeholder="例如：陳先生、小美"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={`mt-3 w-full border-b bg-transparent pb-3 text-[1.05rem] text-espresso outline-none transition-colors placeholder:text-clay/70 ${
              error ? "border-rust" : "border-linen focus:border-clay"
            }`}
          />
          {error ? (
            <p id={errorId} role="alert" className="mt-3 text-[0.8rem] text-rust">
              {error}
            </p>
          ) : null}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="rounded-full bg-espresso px-7 py-3.5 text-[0.88rem] tracking-[0.14em] text-cream transition-colors hover:bg-rust"
            >
              好，這樣稱呼我
            </button>
            <button
              type="button"
              onClick={skip}
              className="px-2 py-2 text-[0.82rem] tracking-wider text-cocoa/70 underline decoration-linen underline-offset-4 transition-colors hover:text-rust"
            >
              先不用
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

/* ── 首屏的問候 ───────────────────────────────────────────── */

export function VisitorGreeting() {
  const { ready, value } = useVisitor();

  // 沒填過名字就不佔版面
  if (!ready || !value.name) return null;

  return (
    <div className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2">
      <p className="text-[0.92rem] tracking-wider text-cream/90">
        <span className="font-title text-gold">{value.name}</span> 您好，
        我們在這裡。
      </p>
      <button
        type="button"
        onClick={() => visitorStore.set({ name: null, asked: false })}
        className="text-[0.75rem] tracking-wider text-cream/50 underline decoration-cream/30 underline-offset-4 transition-colors hover:text-cream"
      >
        不是您？
      </button>
    </div>
  );
}
