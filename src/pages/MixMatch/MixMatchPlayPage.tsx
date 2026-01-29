import { useEffect, useMemo, useState } from "react";
import MixMatchBoard from "../../components/MixMatch/MixMatchBoard";
import MixMatchOptionBank from "../../components/MixMatch/MixMatchOptionBank";
import MixMatchTopBar from "../../components/MixMatch/MixMatchTopBar";
import type { MixMatchPuzzle } from "../../types";
import { buildInitialState, evaluateSubmission } from "../../utils/mixMatch";
import { useMixMatchTimer } from "./useMixMatchTimer";
import { DEMO_MIXMATCH_5X5 } from "../../data/mixMatchData";

type OptionMark = "correct" | "wrong";

export default function MixMatchPlayPage(props: {
  navigate: (to: string) => void;
  gameId: "mixmatch";
}) {
  const puzzle: MixMatchPuzzle = DEMO_MIXMATCH_5X5;

  const [state, setState] = useState(() => buildInitialState(puzzle));
  const [submitted, setSubmitted] = useState(false);

  // optionId -> correct/wrong (only meaningful after submit)
  const [optionStatus, setOptionStatus] = useState<Record<string, OptionMark>>({});

  const timer = useMixMatchTimer();

  // optionId -> label (for showing "Apple" instead of id)
  const optionLabelById = useMemo(() => {
    const m: Record<string, string> = {};
    for (const o of puzzle.options) m[o.id] = o.label;
    return m;
  }, [puzzle.options]);

  // placed options (Set)
  const placedOptionIds = useMemo(() => {
    const s = new Set<string>();
    Object.values(state.placements).forEach((ids) => ids.forEach((id) => s.add(id)));
    return s;
  }, [state.placements]);

  // ✅ can submit only if ALL options are placed somewhere
  const canSubmit = placedOptionIds.size === puzzle.options.length;

  const evalResult = useMemo(() => {
    if (!submitted) return null;
    return evaluateSubmission(puzzle, state.placements);
  }, [submitted, puzzle, state.placements]);

  const allCorrect = !!evalResult?.allCorrect;

  useEffect(() => {
    if (allCorrect) timer.stop();
  }, [allCorrect, timer]);

  // keep green, clear red
  function clearWrongMarksOnly() {
    setOptionStatus((prev) => {
      const next: Record<string, OptionMark> = {};
      for (const [k, v] of Object.entries(prev)) if (v === "correct") next[k] = "correct";
      return next;
    });
  }

  function onDropOption(tileId: string, optionId: string) {
    timer.startIfNeeded();
    clearWrongMarksOnly();

    setState((prev) => {
      const cur = prev.placements[tileId] ?? [];
      if (cur.includes(optionId)) return prev;

      return {
        ...prev,
        placements: {
          ...prev.placements,
          [tileId]: [...cur, optionId],
        },
      };
    });
  }

  function onMoveOption(fromTileId: string, toTileId: string, optionId: string) {
    timer.startIfNeeded();
    clearWrongMarksOnly();

    setState((prev) => {
      const from = prev.placements[fromTileId] ?? [];
      const to = prev.placements[toTileId] ?? [];

      const nextFrom = from.filter((x) => x !== optionId);
      const nextTo = to.includes(optionId) ? to : [...to, optionId];

      return {
        ...prev,
        placements: {
          ...prev.placements,
          [fromTileId]: nextFrom,
          [toTileId]: nextTo,
        },
      };
    });
  }

  function removeFromTile(tileId: string, optionId: string) {
    timer.startIfNeeded();

    setState((prev) => {
      const cur = prev.placements[tileId] ?? [];
      return {
        ...prev,
        placements: {
          ...prev.placements,
          [tileId]: cur.filter((x) => x !== optionId),
        },
      };
    });
  }

  function resetAll() {
    setSubmitted(false);
    setOptionStatus({});
    timer.reset();
    setState(buildInitialState(puzzle));
  }

  function onSubmit() {
    timer.startIfNeeded();

    const result = evaluateSubmission(puzzle, state.placements);

    // +5s penalty if not all correct
    if (!result.allCorrect) {
      if ("addPenaltySeconds" in timer) (timer as any).addPenaltySeconds(5);
      else if ("addPenaltyMs" in timer) (timer as any).addPenaltyMs(5000);
    }

    // ✅ FIX: build optionStatus from result.tileOptionStatus (flatten)
    const next: Record<string, OptionMark> = {};
    for (const tileId of Object.keys(result.tileOptionStatus)) {
      const perTile = result.tileOptionStatus[tileId] ?? {};
      for (const [optId, mark] of Object.entries(perTile)) next[optId] = mark;
    }

    setOptionStatus(next);
    setSubmitted(true);
  }

  return (
    <div className="page">
      <MixMatchTopBar
        title="Mix & Match"
        subtitle={
          allCorrect
            ? `✅ Completed in ${timer.formatted}`
            : canSubmit
              ? "All options placed. Submit to check."
              : "Drag options onto tiles. Submit unlocks after all options are used."
        }
        canSubmit={canSubmit && !allCorrect}
        onSubmit={onSubmit}
        onReset={resetAll}
        submitted={submitted}
        allCorrect={allCorrect}
        timeLabel={timer.formatted}
      />

      <div className="mixMatchLayout">
        <div className="mixMatchLeft">
          <MixMatchOptionBank
            options={puzzle.options}
            started={timer.started}
            placedOptionIds={placedOptionIds}
            optionStatus={submitted ? optionStatus : undefined}
          />
        </div>

        <div className="mixMatchRight">
          <MixMatchBoard
            puzzle={puzzle}
            placements={state.placements}
            submitted={submitted}
            optionStatus={submitted ? optionStatus : undefined}
            optionLabelById={optionLabelById}
            onDropOption={onDropOption}
            onMoveOption={onMoveOption}
            onRemoveOption={removeFromTile}
          />
        </div>
      </div>

      {allCorrect && (
        <div className="hint" style={{ marginTop: 14 }}>
          Final time: <b>{timer.formatted}</b>
        </div>
      )}
    </div>
  );
}
