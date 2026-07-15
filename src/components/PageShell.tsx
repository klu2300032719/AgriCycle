"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOut } from "@/components/motion";

export default function PageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
