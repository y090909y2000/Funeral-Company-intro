/**
 * 表單驗證。回傳 null 代表通過，回傳字串就是要顯示給使用者的錯誤訊息。
 * 訊息刻意分開寫，讓使用者知道「哪裡」不對，而不是只看到一句格式錯誤。
 */

/**
 * 以 HTML5 email 欄位的規則為基礎，額外要求網域必須有後綴（至少一個點），
 * 因為 a@b 雖然符合規格，但在一般網站的情境下幾乎都是打錯。
 */
const EMAIL_PATTERN =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export const EMAIL_MAX_LENGTH = 254; // RFC 5321 的單一位址上限

export function validateEmail(raw: string): string | null {
  const value = raw.trim();

  if (!value) return "請填寫 Email，優待券會寄到這個信箱。";
  if (value.length > EMAIL_MAX_LENGTH) return "Email 太長了，請確認是否貼錯。";
  if (/\s/.test(value)) return "Email 不能有空白。";

  const atCount = (value.match(/@/g) ?? []).length;
  if (atCount === 0) return "Email 少了 @，例如 name@example.com。";
  if (atCount > 1) return "Email 只能有一個 @。";

  const [local, domain] = value.split("@");
  if (!local) return "@ 前面還沒有填寫。";
  if (!domain) return "@ 後面還沒有填寫網域，例如 example.com。";
  if (local.startsWith(".") || local.endsWith("."))
    return "@ 前面不能以句點開頭或結尾。";
  if (value.includes("..")) return "Email 不能有連續兩個句點。";
  if (!domain.includes(".")) return "網域看起來不完整，例如 gmail.com。";
  if (domain.startsWith("-") || domain.endsWith("-"))
    return "網域不能以連字號開頭或結尾。";

  if (!EMAIL_PATTERN.test(value)) return "Email 格式不正確，請再確認一次。";

  return null;
}

export const NICKNAME_MAX_LENGTH = 20;

export function validateNickname(raw: string): string | null {
  const value = raw.trim();

  if (!value) return "請留下我們該怎麼稱呼您。";
  if (value.length > NICKNAME_MAX_LENGTH)
    return `稱呼請控制在 ${NICKNAME_MAX_LENGTH} 個字以內。`;
  // 純標點或符號多半是誤觸
  if (!/[\p{L}\p{N}]/u.test(value)) return "稱呼至少要有一個文字或數字。";

  return null;
}
