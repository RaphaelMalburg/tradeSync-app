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

export const NavbarDropdown = () => {
  const { signOut } = useClerk();
  const user = useHydratedStore((state) => state.user);
  const hasHydrated = useHydratedStore((state) => state._hasHydrated);
  console.log(user);
  if (!hasHydrated) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />;
  }

  return (
    <div className="flex items-center gap-4">
      <ThemeSwitch />
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="outline">Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user.imageUrl} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n: string[]) => n[0].toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Hello, {user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/profile`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/api-settings`}>API Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/dashboard"}>Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => signOut()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SignedIn>
    </div>
  );
};
