import { Check } from "lucide-react";
import { Icon, type IconName } from "./Icon";
import { parseHighlights } from "../utils/highlights";

interface Props {
  icon: IconName;
  title: string;
  rawDescription: string | null;
  maxHighlights?: number;
}

export function HighlightCard({ icon, title, rawDescription, maxHighlights = 4 }: Props) {
  const { description, highlights } = parseHighlights(rawDescription, maxHighlights);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md sm:p-8">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]">
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-[var(--color-text)]">{title}</h3>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{description}</p>
      )}
      {highlights.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
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
    </div>
  );
}
