"use client";
import { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({ words, className }: { words: string; className?: string }) => {
  const controls = useAnimationControls();
  const scope = useAnimationControls();

  useEffect(() => {
    controls.start({
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    });
  }, [controls, scope]);

  return (
    <motion.div className={cn("w-full", className)} animate={controls}>
      <motion.div animate={scope}>
        <span className="text-left font-normal">{words}</span>
      </motion.div>
    </motion.div>
  );
};
