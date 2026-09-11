import { useEffect, useState } from 'react';

/**
 * 入力値の変更を指定した時間（ms）だけ遅延させるユーティリティフック。
 * 検索ボックスでキー入力のたびに API を呼ばないようにするために使用します。
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}

