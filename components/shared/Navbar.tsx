import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"; // Import Clerk components
import Link from "next/link";
import { MoonIcon, BarChart2, BookOpen, PieChart, ChartSpline } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ThemeSwitch from "./ThemeSwitch";

// Start of Selection
export default function Navbar() {
  return (
    <nav className="border-b bg-background shadow-md transition-shadow duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <ChartSpline className="h-6 w-6 mr-2 text-primary transition-transform duration-300 hover:scale-110" />
          <span className="font-bold text-lg text-primary">cTrader Journal</span>
        </Link>
        <div className="hidden md:flex space-x-6 flex-1 justify-center">
          <Link href="/dashboard" className="text-sm font-medium transition-colors duration-300 hover:text-secondary">
            Dashboard
          </Link>
          <Link href="/trades" className="text-sm font-medium transition-colors duration-300 hover:text-secondary">
            Trades
          </Link>
          <Link href="/analytics" className="text-sm font-medium transition-colors duration-300 hover:text-secondary">
            Analytics
          </Link>
          <Link href="/insights" className="text-sm font-medium transition-colors duration-300 hover:text-secondary">
            Insights
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeSwitch />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <UserButton />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>API Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
        </div>
      </div>
      <div className="md:hidden">
        <div className="flex justify-around py-2 bg-gray-100 rounded-lg shadow-md">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <BarChart2 className="h-5 w-5 text-muted transition-colors duration-300 hover:text-secondary" />
              <span className="sr-only">Dashboard</span>
            </Button>
          </Link>
          <Link href="/trades">
            <Button variant="ghost" size="icon">
              <BookOpen className="h-5 w-5 text-muted transition-colors duration-300 hover:text-secondary" />
              <span className="sr-only">Trades</span>
            </Button>
          </Link>
          <Link href="/analytics">
            <Button variant="ghost" size="icon">
              <PieChart className="h-5 w-5 text-muted transition-colors duration-300 hover:text-secondary" />
              <span className="sr-only">Analytics</span>
            </Button>
          </Link>
          <Link href="/insights">
            <Button variant="ghost" size="icon">
              <MoonIcon className="h-5 w-5 text-muted transition-colors duration-300 hover:text-secondary" />
              <span className="sr-only">Insights</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
