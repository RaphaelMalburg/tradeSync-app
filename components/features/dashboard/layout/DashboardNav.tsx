"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardNavProps {
  items: NavItem[];
  mobile?: boolean;
}

export function DashboardNav({ items, mobile = false }: DashboardNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId");

  // Helper function to construct href with accountId
  const getHref = (baseHref: string) => {
    if (!accountId) return baseHref;
    return `${baseHref}?accountId=${accountId}`;
  };

  if (mobile) {
    return (
      <div className="grid grid-cols-4 px-2 py-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={getHref(item.href)}
            className={`flex flex-col items-center justify-center p-2 text-xs
              ${pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
            {item.icon}
            <span className="mt-1 text-[10px]">{item.label}</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <nav className="mt-5 flex-1 px-2 space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={getHref(item.href)}
          className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors
            ${pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent/50"}`}>
          {item.icon}
          <span className="ml-3">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
