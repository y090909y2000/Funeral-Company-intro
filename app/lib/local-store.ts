/**
 * 讀寫 localStorage 的小型 store，搭配 useSyncExternalStore 使用。
 *
 * 為什麼不用 useState + useEffect 讀取：
 * 伺端沒有 localStorage，所以「在 effect 裡讀完再 setState」會多跑一次 render，
 * 回訪者還會先閃一下「沒有資料」的畫面。
 * 這裡讓 getServerSnapshot 回 ready:false，hydration 完成後才切到真實值，
 * 元件只要判斷 ready 就不會閃，也不需要在 effect 裡 setState。
 */

export type StoreSnapshot<T> = { readonly ready: boolean; readonly value: T };

export type LocalStore<T> = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => StoreSnapshot<T>;
  getServerSnapshot: () => StoreSnapshot<T>;
  set: (value: T) => void;
};

export function createLocalStore<T>(
  key: string,
  empty: T,
  decode: (raw: string) => T,
  encode: (value: T) => string,
): LocalStore<T> {
  const server: StoreSnapshot<T> = { ready: false, value: empty };
  let current: StoreSnapshot<T> = server;

  const listeners = new Set<() => void>();
  let storageBound = false;

  function emit() {
    for (const listener of listeners) listener();
  }

  function readFromStorage(): T {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? empty : decode(raw);
    } catch {
      // 無痕模式或使用者關閉儲存權限時，localStorage 會直接丟例外
      return empty;
    }
  }

  function onStorage(event: StorageEvent) {
    // key 為 null 表示整個 storage 被清空
    if (event.key !== null && event.key !== key) return;
    current = { ready: true, value: readFromStorage() };
    emit();
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      // 只在第一個訂閱者進來時掛一次，避免同一個事件被處理多遍
      if (!storageBound) {
        window.addEventListener("storage", onStorage);
        storageBound = true;
      }
      return () => {
        listeners.delete(listener);
        if (storageBound && listeners.size === 0) {
          window.removeEventListener("storage", onStorage);
          storageBound = false;
        }
      };
    },

    getSnapshot() {
      // 第一次呼叫才真的去讀，之後沿用同一個物件；
      // useSyncExternalStore 用 Object.is 比對，回新物件會被當成值一直在變。
      if (!current.ready) current = { ready: true, value: readFromStorage() };
      return current;
    },

    getServerSnapshot() {
      return server;
    },

    set(value) {
      current = { ready: true, value };
      try {
        window.localStorage.setItem(key, encode(value));
      } catch {
        // 寫入失敗（例如容量已滿）就只保留這次連線的記憶體狀態
      }
      emit();
    },
  };
}
