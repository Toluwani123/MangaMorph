import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageList({ pages, currentPageId, onSelect }) {
  const itemVariants = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.18, ease: "easeOut" } },
    exit: { opacity: 0, y: 6, transition: { duration: 0.12 } },
  };

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {pages.map((p, i) => {
          const selected = currentPageId === p.id;
          const label = p.page_number ?? p.index ?? p.id ?? i + 1;

          return (
            <motion.button
              key={p.id}
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(p.id)}
              className={[
                "w-full text-left px-3 py-2 rounded-lg transition-colors",
                "bg-white/60 backdrop-blur-sm border shadow-sm",
                selected
                  ? "border-amber-300 ring-2 ring-amber-200 text-slate-800"
                  : "border-slate-200/60 hover:bg-white text-slate-700",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "inline-flex items-center justify-center text-xs font-semibold",
                      "rounded-md px-2 py-0.5",
                      selected ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700",
                    ].join(" ")}
                  >
                    {label}
                  </span>
                  <span className="truncate">Page {label}</span>
                </div>
                {selected && (
                  <span className="text-amber-700 text-xs font-medium">Selected</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}