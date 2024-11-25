"use client";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function SignUpPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <SignUp
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
          elements: {
            rootBox: "mx-auto w-full max-w-[440px]",
            card: "shadow-2xl rounded-xl border-0 bg-card",
            headerTitle: "text-2xl font-bold text-foreground",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: "bg-background hover:bg-accent",
            socialButtonsBlockButtonText: "text-foreground font-medium",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground",
            formFieldLabel: "text-foreground",
            formFieldInput: "bg-background border-input",
            footerActionLink: "text-primary hover:text-primary/80",
            formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
            identityPreviewText: "text-foreground",
            identityPreviewEditButtonIcon: "text-muted-foreground",
          },
        }}
      />
    </div>
  );
}
