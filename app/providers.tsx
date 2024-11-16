"use client";

import { useStoreHydration } from "@/lib/hooks/useStoreHydration";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/toaster";

export default function Providers({ children }: { children: React.ReactNode }) {
  useStoreHydration();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}

      <Toaster />
    </ThemeProvider>
  );
}
{
  /* <ToastContainer position="bottom-right" theme={resolvedTheme} /> */
}
