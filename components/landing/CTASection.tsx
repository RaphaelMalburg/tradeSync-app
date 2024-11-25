"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <motion.div>
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="py-20">
        <div className="container mx-auto px-4">
          <div
            className="relative overflow-hidden bg-gradient-to-r
  from-blue-700 via-blue-600 to-blue-500
  dark:from-blue-900 dark:via-blue-800 dark:to-blue-700
  rounded-2xl p-12">
            {/* Animated background elements */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            />

            <div className="relative z-10 text-center">
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Trading?
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of traders who are already using AI-powered insights to improve their strategies
              </motion.p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/signup" className="flex items-center">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
