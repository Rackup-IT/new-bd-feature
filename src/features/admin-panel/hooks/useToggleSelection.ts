import { useCallback, useState } from "react";

export default function useToggleSelection<T>() {
  const [set, setSet] = useState<Set<T>>(new Set<T>());

  const toggle = useCallback((item: T) => {
    setSet((prev) => {
      const next = new Set(prev);
      if (prev.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => setSet(new Set()), []);
  const isSelected = useCallback((item: T) => set.has(item), [set]);

  return { selectedIds: set, toggle, clear, isSelected };
}
