"use client";
import { useHydratedStore } from "@/lib/hooks/useHydratedStore";
import { useClerk } from "@clerk/nextjs";
import ThemeSwitch from "../shared/ThemeSwitch";
import { SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";
import React from "react";
import { AvatarFallback, AvatarImage, Avatar } from "../ui/avatar";
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";

const DropdownSkeleton = () => (
  <div className="flex items-center gap-4">
    <div className="h-9 w-9 animate-pulse rounded-md bg-muted" />
    <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
  </div>
);

export const NavbarDropdown = () => {
  const { signOut } = useClerk();
  const user = useHydratedStore((state) => state.user);
  const hasHydrated = useHydratedStore((state) => state._hasHydrated);

  if (!hasHydrated) {
    return <DropdownSkeleton />;
  }

  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#3A506B" },
      }}>
      <div className="flex items-center gap-4">
        <ThemeSwitch />
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" className="transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground">
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all duration-300">
                  <AvatarImage src={user.imageUrl} alt={user.name} />
                  <AvatarFallback className="bg-primary/10">
                    {user.name
                      .split(" ")
                      .map((n: string[]) => n[0].toUpperCase())
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2">
                <DropdownMenuLabel className="font-semibold px-2 py-1.5">Hello, {user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem className="transition-colors duration-200 hover:bg-primary/10 rounded-md cursor-pointer">
                  <Link href={`/profile`} className="flex w-full px-2 py-1.5">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="transition-colors duration-200 hover:bg-primary/10 rounded-md cursor-pointer">
                  <Link href={`/api-settings`} className="flex w-full px-2 py-1.5">
                    API Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="transition-colors duration-200 hover:bg-primary/10 rounded-md cursor-pointer">
                  <Link href={"/dashboard"} className="flex w-full px-2 py-1.5">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => signOut()} className="transition-colors duration-200 hover:bg-destructive/10 text-destructive rounded-md mt-1 cursor-pointer">
                  <span className="flex w-full px-2 py-1.5">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </SignedIn>
      </div>
    </ClerkProvider>
  );
};
