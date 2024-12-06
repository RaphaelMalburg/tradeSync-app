import { ReactNode } from "react";

interface HeaderProps {
  title?: string;
  children?: ReactNode;
  className?: string;
}

export function Header({ title, children, className = "" }: HeaderProps) {
  return (
    <header className={`w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <div className="container flex h-14 items-center">
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
        {children}
      </div>
    </header>
  );
}
