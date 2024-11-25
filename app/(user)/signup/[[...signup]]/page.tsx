"use client";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function SignUpPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent opacity-30" />
      </div>
      <SignUp
        appearance={{
          // Start of Selection
          baseTheme: theme === "dark" ? dark : undefined,
          elements: {
            rootBox: "mx-auto w-full max-w-[440px] relative z-10",
            card: "backdrop-blur-md bg-glass border border-white/10 rounded-2xl shadow-card",
            headerTitle: "text-2xl font-bold text-white",
            headerSubtitle: "text-white/60",
            socialButtonsBlockButton: "bg-glass hover:bg-white/10 border border-white/10",
            socialButtonsBlockButtonText: "text-white font-medium",
            dividerLine: "bg-white/10",
            dividerText: "text-white/60",
            formFieldLabel: "text-white/80",
            formFieldInput: "bg-glass border-white/10 text-white",
            footerActionLink: "text-primary hover:text-primary/80",
            formButtonPrimary: "bg-primary text-black hover:bg-primary/90",
          },
        }}
      />
    </div>
  );
}
