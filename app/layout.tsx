import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/navbar/Navbar";
import Providers from "./providers";
import { checkUser } from "@/lib/checkUser";
import { UserStateHandler } from "@/lib/hooks/UserStateHandler";
import { UserStoreDTO } from "@/lib/dto/user.dto";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "TradeSync - Your Trading Assistant",
  description: "Track your trades and gain AI insights.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await checkUser();

  const userDTO: UserStoreDTO | null = user
    ? {
        id: user.id,
        clerkUserId: user.clerkUserId,
        name: user.name,
        imageUrl: user.imageUrl,
      }
    : null;

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#3A506B",
          colorBackground: "#ffffff",
          colorText: "#1a1a1a",
          colorDanger: "#FF4444",
          colorSuccess: "#00C853",
          fontFamily: GeistSans.style.fontFamily,
        },
        elements: {
          card: "shadow-xl rounded-xl border-0",
          navbar: "shadow-md",
        },
      }}>
      <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <body className="antialiased">
          <Providers>
            <UserStateHandler user={userDTO} />
            <Navbar />
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
