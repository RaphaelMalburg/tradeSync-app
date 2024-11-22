import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserStoreDTO } from "@/lib/dto/user.dto";

interface UserState {
  user: UserStoreDTO | null;
  setUser: (user: UserStoreDTO | null) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "user-storage",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : createJSONStorage(() => ({
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            })),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
