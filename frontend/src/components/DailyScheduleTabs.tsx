import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useState } from "react";
import type { ContentItem } from "../types";
import { parseHighlights } from "../utils/highlights";

interface Props {
  items: ContentItem[];
}

export function DailyScheduleTabs({ items }: Props) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? null);
  const active = items.find((item) => item.id === activeId) ?? items[0];

  if (!active) return null;

  const { description, highlights } = parseHighlights(active.description);

  return (
    <div className="rounded-3xl bg-[var(--color-bg)] p-4 sm:p-6">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive = item.id === active.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={`appearance-none whitespace-nowrap rounded-full border-0 px-4 py-2 text-sm font-semibold outline-none transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ${
                isActive
                  ? "scale-105 bg-[var(--color-primary)] text-white shadow-md"
                  : "scale-100 bg-neutral-100 text-neutral-600 hover:scale-105 hover:bg-neutral-200"
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      <motion.div
        key={active.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-5 rounded-3xl bg-white p-6 shadow-md sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary-dark)]">
          {active.title}
        </p>
        <h3 className="mt-1 text-xl font-bold text-[var(--color-text)]">{active.subtitle}</h3>
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">{description}</p>
        )}
        {highlights.length > 0 && (
          <ul className="mt-5 flex flex-col gap-2">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-sm text-[var(--color-text)]">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]">
                  <Check size={12} strokeWidth={3} />
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
