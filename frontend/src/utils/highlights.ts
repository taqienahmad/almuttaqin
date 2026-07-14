/**
 * Convention for ContentItem.description wherever a card needs a long
 * description PLUS a few short checklist/highlight points (jadwal_harian,
 * kompetensi, etc): the first line is the paragraph, subsequent lines (up
 * to `maxHighlights`) become highlight bullets. Kept as plain
 * newline-separated text rather than a dedicated DB column - admin edits
 * it as one textarea.
 */
export interface ParsedHighlights {
  description: string;
  highlights: string[];
}

export function parseHighlights(raw: string | null, maxHighlights = 3): ParsedHighlights {
  const lines = (raw ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const [description, ...highlights] = lines;
  return { description: description ?? "", highlights: highlights.slice(0, maxHighlights) };
}
