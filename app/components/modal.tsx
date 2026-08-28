"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { lockScroll, unlockScroll } from "../lib/scroll-lock";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** 對話框標題的 id，給 aria-labelledby 用 */
  labelId: string;
  children: ReactNode;
  maxWidth?: string;
  /** 關掉「點背景關閉」，用在必須明確回應的對話框 */
  dismissOnBackdrop?: boolean;
};

export function Modal({
  open,
  onClose,
  labelId,
  children,
  maxWidth = "max-w-xl",
  dismissOnBackdrop = true,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    // 記住開啟前的焦點，關閉後還原，鍵盤使用者才不會被丟回頁面最上面
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    lockScroll();

    const panel = panelRef.current;
    const focusables = () =>
      panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];

    // 開啟時把焦點移進對話框
    (focusables()[0] ?? panel)?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      // 簡易焦點循環：Tab 到最後一個就跳回第一個，反之亦然
      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      unlockScroll();
      returnFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  // 掛到 body，避免被外層區塊的 overflow-hidden 或 transform 影響堆疊
  return createPortal(
    <div className="fixed inset-0 z-90 flex items-end justify-center p-3 sm:items-center sm:p-6">
      <div
        aria-hidden="true"
        onClick={dismissOnBackdrop ? onClose : undefined}
        className="modal-backdrop absolute inset-0 bg-espresso/75 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
        className={`modal-panel relative w-full ${maxWidth} max-h-[92svh] overflow-y-auto bg-cream shadow-[0_40px_90px_-30px_rgba(35,22,14,0.7)] outline-none`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

/** 對話框右上角的關閉鈕 */
export function ModalClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="關閉"
      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-cocoa transition-colors hover:bg-sand/60 hover:text-espresso"
    >
      <span className="relative block h-4 w-4">
        <span className="absolute left-0 top-1/2 block h-px w-4 rotate-45 bg-current" />
        <span className="absolute left-0 top-1/2 block h-px w-4 -rotate-45 bg-current" />
      </span>
    </button>
  );
}
