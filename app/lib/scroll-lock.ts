/**
 * 共用的背景滾動鎖。
 * 用計數器而不是直接寫 body.style，是因為手機選單與對話框可能同時存在，
 * 各自「關閉時把 overflow 設回空字串」會互相解鎖到對方。
 */

let locks = 0;
let previousOverflow = "";

export function lockScroll() {
  if (locks === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  locks += 1;
}

export function unlockScroll() {
  if (locks === 0) return;
  locks -= 1;
  if (locks === 0) document.body.style.overflow = previousOverflow;
}
