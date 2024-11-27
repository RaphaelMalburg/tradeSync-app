import Link from "next/link";
import { LineChart, Info, Mail, Menu, ChartSpline, Star, SquareFunction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavbarDropdown } from "./NavbarDropdown";
import { usePathname } from "next/navigation";
import { MobileNav } from "./MobileNav";
import Image from "next/image";

export default function Navbar() {
  const navigationItems = [
    { label: "Features", href: "/features", icon: <SquareFunction className="h-5 w-5" /> },
    { label: "Pricing", href: "/pricing", icon: <LineChart className="h-5 w-5" /> },
    { label: "About", href: "/about", icon: <Info className="h-5 w-5" /> },
    { label: "Contact", href: "/contact", icon: <Mail className="h-5 w-5" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background shadow-md transition-shadow duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <MobileNav navigationItems={navigationItems} />
          <Link href="/" className="flex items-center">
            <Image src="/trade-tracker-logo.png" alt="Trader Tracker Logo" width={55} height={55} className="mr-2" />
            <span className="font-bold text-lg text-primary">Trader Tracker</span>
          </Link>
        </div>

        {/* Desktop Navigation */}

        <div className="hidden md:flex space-x-6 flex-1 justify-center">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground/60 transition-colors duration-300 hover:text-primary flex items-center gap-2">
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <NavbarDropdown />
        </div>
      </div>
    </nav>
  );
}
