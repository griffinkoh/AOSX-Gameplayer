import type { MixMatchEval, MixMatchPuzzle, PlacementMap } from "../types";

export function buildInitialState(puzzle: MixMatchPuzzle): { placements: PlacementMap } {
  const placements: PlacementMap = {};
  puzzle.tiles.forEach((t) => (placements[t.id] = []));
  return { placements };
}

function setEq(a: string[], b: string[]) {
  const sa = new Set(a);
  const sb = new Set(b);
  if (sa.size !== sb.size) return false;
  for (const x of sa) if (!sb.has(x)) return false;
  return true;
}

/**
 * Rules:
 * - A tile is “correct” only if the placed option IDs match required exactly (order irrelevant).
 * - Options placed but not required => wrong (red)
 * - Missing required => just “not correct yet”
 *
 * ALSO RETURNS:
 * - correctOptionIds / wrongOptionIds globally (for OptionBank + locking behavior)
 */
export function evaluateSubmission(puzzle: MixMatchPuzzle, placements: PlacementMap): MixMatchEval {
  const tileOptionStatus: MixMatchEval["tileOptionStatus"] = {};
  const tileSummary: MixMatchEval["tileSummary"] = {};

  const correctOptionIdsSet = new Set<string>();
  const wrongOptionIdsSet = new Set<string>();

  let allCorrect = true;

  for (const tile of puzzle.tiles) {
    const required = tile.requiredOptionIds; // ✅ YOUR REAL FIELD
    const placed = placements[tile.id] ?? [];
    const requiredSet = new Set(required);

    const status: Record<string, "correct" | "wrong"> = {};

    for (const optId of placed) {
      const ok = requiredSet.has(optId);
      status[optId] = ok ? "correct" : "wrong";

      // global sets (for highlighting/locking)
      if (ok) correctOptionIdsSet.add(optId);
      else wrongOptionIdsSet.add(optId);
    }

    // tile correctness = exact set match
    const tileCorrect = setEq(required, placed);
    if (!tileCorrect) allCorrect = false;

    const correctCount = placed.filter((id) => requiredSet.has(id)).length;
    const wrongCount = placed.filter((id) => !requiredSet.has(id)).length;

    tileOptionStatus[tile.id] = status;
    tileSummary[tile.id] = {
      correctCount,
      wrongCount,
      requiredCount: required.length,
    };
  }

  return {
    allCorrect,
    tileOptionStatus,
    tileSummary,

    // ✅ NEW (global)
    correctOptionIds: Array.from(correctOptionIdsSet),
    wrongOptionIds: Array.from(wrongOptionIdsSet),
  };
}
