import { useState, useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';

export function useHydratedStore<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selector: (state: any) => T,
  defaultValue?: T
): T | undefined {
  const [hydrated, setHydrated] = useState(false);
  const store = useUserStore(selector);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated ? store : defaultValue;
}
