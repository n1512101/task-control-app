import { useCallback, useEffect, useRef } from "react";

type Debounce = (fn: () => void) => void;

// debounce関数を返すhook
const useDebounce = (timeout: number): Debounce => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // クリーンアップ関数
  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  // コンポーネントのアンマウント時にクリーンアップ
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const debounce: Debounce = useCallback(
    (fn) => {
      clearTimer();
      timer.current = setTimeout(fn, timeout);
    },
    [clearTimer, timeout]
  );

  return debounce;
};

export default useDebounce;
