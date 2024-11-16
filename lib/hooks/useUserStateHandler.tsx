"use client";

import { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import { User } from "@/types";

export function useUserStateHandler({ user }: { user: User | null }) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return null;
}
