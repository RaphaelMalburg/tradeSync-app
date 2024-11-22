import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/navbar/Navbar";
import Providers from "./providers";
import { checkUser } from "@/lib/checkUser";
import { UserStateHandler } from "@/lib/hooks/UserStateHandler";
import { UserStoreDTO } from "@/lib/dto/user.dto";
import "react-toastify/dist/ReactToastify.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TradeSync - Your Trading Assistant",
  description: "Track your trades and gain AI insights.",
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
        variables: { colorPrimary: "#3A506B" },
      }}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
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
