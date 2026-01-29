import type { Zone } from "../types";

/* =========================
   ZONES + ANSWERS (MASTER)
========================= */

export const ZONES = [
  // ===== GREEN DOTS (LOCATIONS) =====
  { id: "KUALA_LUMPUR", leftPct: 0.293, topPct: 0.238, widthPct: 0.085, heightPct: 0.056, answer: "KUALA LUMPUR" },
  { id: "MALACCA", leftPct: 0.355, topPct: 0.397, widthPct: 0.087, heightPct: 0.054, answer: "MALACCA" },
  { id: "BATU_PAHAT", leftPct: 0.535, topPct: 0.5, widthPct: 0.094, heightPct: 0.054, answer: "BATU PAHAT" },
  { id: "SENAI", leftPct: 0.622, topPct: 0.593, widthPct: 0.06, heightPct: 0.055, answer: "SENAI" },
  { id: "MERSING", leftPct: 0.604, topPct: 0.405, widthPct: 0.075, heightPct: 0.055, answer: "MERSING" },
  { id: "TIOMAN", leftPct: 0.672, topPct: 0.305, widthPct: 0.068, heightPct: 0.055, answer: "TIOMAN" },
  { id: "KUANTAN", leftPct: 0.613, topPct: 0.044, widthPct: 0.086, heightPct: 0.054, answer: "KUANTAN" },
  { id: "DUMAI", leftPct: 0.255, topPct: 0.625, widthPct: 0.06, heightPct: 0.057, answer: "DUMAI" },
  { id: "PEKANBARU", leftPct: 0.271, topPct: 0.933, widthPct: 0.094, heightPct: 0.054, answer: "PEKANBARU" },

  // ===== PINK ROUTES =====
  { id: "A457", leftPct: 0.449, topPct: 0.421, widthPct: 0.053, heightPct: 0.055, answer: "A457" },
  { id: "A464", leftPct: 0.384, topPct: 0.638, widthPct: 0.053, heightPct: 0.055, answer: "A464" },
  { id: "A576", leftPct: 0.461, topPct: 0.697, widthPct: 0.053, heightPct: 0.055, answer: "A576" },
  { id: "W401", leftPct: 0.556, topPct: 0.625, widthPct: 0.053, heightPct: 0.055, answer: "W401" },
  { id: "G219", leftPct: 0.724, topPct: 0.153, widthPct: 0.053, heightPct: 0.055, answer: "G219" },
  { id: "G580", leftPct: 0.887, topPct: 0.779, widthPct: 0.053, heightPct: 0.055, answer: "G580" },
  { id: "B469", leftPct: 0.641, topPct: 0.859, widthPct: 0.053, heightPct: 0.055, answer: "B469" },
  { id: "B470", leftPct: 0.75, topPct: 0.848, widthPct: 0.053, heightPct: 0.055, answer: "B470" },

  // ===== ORANGE ARROWS WSD / WMD =====
  { id: "WSD21", leftPct: 0.763, topPct: 0.32, widthPct: 0.055, heightPct: 0.12, answer: "WSD21" },
  { id: "WMD20", leftPct: 0.825, topPct: 0.32, widthPct: 0.055, heightPct: 0.12, answer: "WMD20" },
  { id: "WMD12", leftPct: 0.763, topPct: 0.452, widthPct: 0.056, heightPct: 0.121, answer: "WMD12" },
  { id: "D13", leftPct: 0.825, topPct: 0.452, widthPct: 0.053, heightPct: 0.121, answer: "D13" },
  { id: "WSD44", leftPct: 0.89, topPct: 0.452, widthPct: 0.064, heightPct: 0.123, answer: "WSD44" },
  { id: "WSD45", leftPct: 0.961, topPct: 0.452, widthPct: 0.064, heightPct: 0.121, answer: "WSD45" },
  { id: "WMD8", leftPct: 0.768, topPct: 0.586, widthPct: 0.046, heightPct: 0.126, answer: "WMD8" },
  { id: "WSD14", leftPct: 0.825, topPct: 0.589, widthPct: 0.053, heightPct: 0.125, answer: "WSD14" },
  { id: "WSD15", leftPct: 0.925, topPct: 0.589, widthPct: 0.135, heightPct: 0.124, answer: "WSD15" }
] as const;

/* =========================
   EXPORTS FOR EACH ITEM
========================= */

// typed zones without answer field (for your map rendering)
export const MAP_ZONES: Zone[] = ZONES.map(({ answer, ...z }) => z);

// answers lookup (keeps your existing logic working)
export const ANSWERS: Record<string, string> = Object.fromEntries(
  ZONES.map(z => [z.id, z.answer])
);

// options list (auto generated from zones)
export const OPTIONS = ZONES.map((z, i) => ({
  id: z.id,
  label: z.answer
}));
