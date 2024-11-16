"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "../store/useUserStore";

export function useStoreHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      useUserStore.persist.rehydrate();
    }
  }, [isHydrated]);

  return null;
}
