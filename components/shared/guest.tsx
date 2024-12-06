import { ReactNode } from "react";

interface GuestProps {
  children: ReactNode;
}

export function Guest({ children }: GuestProps) {
  return <div className="min-h-screen flex items-center justify-center">{children}</div>;
}
