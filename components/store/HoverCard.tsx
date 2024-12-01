"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export const HoverCard = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className={cn("relative", className)}>
      <div className="w-full h-full">{children}</div>
    </motion.div>
  );
};
