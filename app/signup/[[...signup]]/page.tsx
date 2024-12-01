"use client";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function SignUpPage() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-gray-50/50 to-gray-100/50 dark:from-[#0A0F1C] dark:via-[#0A0F1C] dark:to-[#0A0F1C] p-4 ${
        theme === "dark" ? "text-white" : "text-black"
      }`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px] animate-blob" />
        <div className="absolute -bottom-8 -left-4 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>
      <SignUp
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
          elements: {
            rootBox: "mx-auto w-full max-w-[440px] relative z-10",
            card: "backdrop-blur-md bg-glass border border-white/10 rounded-2xl shadow-card",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-white/60",
            socialButtonsBlockButton: "bg-glass hover:bg-white/10 border border-white/10",
            socialButtonsBlockButtonText: "font-medium",
            dividerLine: "bg-white/10",
            dividerText: "text-white/60",
            formFieldLabel: "text-white/80",
            formFieldInput: "bg-glass border-white/10",
            footerActionLink: "text-primary hover:text-primary/80",
            formButtonPrimary: "bg-primary text-black hover:bg-primary/90",
          },
        }}
      />
    </div>
  );
}
