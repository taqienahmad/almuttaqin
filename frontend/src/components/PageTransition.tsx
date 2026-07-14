import { motion } from "motion/react";
import type { ReactNode } from "react";
import { pageVariants } from "../motionVariants";

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}
