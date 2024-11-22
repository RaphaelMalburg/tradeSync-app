"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/store/useUserStore";
import { UserStoreDTO } from "@/lib/dto/user.dto";

export function UserStateHandler({ user }: { user: UserStoreDTO | null }) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return null;
}
