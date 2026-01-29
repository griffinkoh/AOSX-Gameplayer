import { useEffect, useMemo, useState } from "react";
import type { Team } from "../../../types";
import type { CategoryOptionKey, CategoryPhase, CategoryTile } from "./categoryTypes";

export type RevealState = {
  correct: CategoryOptionKey;
  chosen: CategoryOptionKey | null;
  wasCorrect: boolean;
  pointsAwarded: number;
  winnerTeamId: string | null;
  message: string;
};

export function useCategoryGame(opts: {
  initialTeams: Team[];
  tiles: CategoryTile[]; // ✅ IMPORTANT: always take latest tiles from loader
}) {
  const [teams, setTeams] = useState<Team[]>(opts.initialTeams);

  // tiles come from loader; keep in state so we can mark used/solved
  const [tiles, setTiles] = useState<CategoryTile[]>(opts.tiles);

  // ✅ sync tiles whenever loader supplies new ones
  useEffect(() => {
    setTiles(opts.tiles);
  }, [opts.tiles]);

  // selected team (used for board drop and default answering team)
  const [selectedTeamId, setSelectedTeamId] = useState<string>(opts.initialTeams[0]?.id ?? "");

  // flow
  const [phase, setPhase] = useState<CategoryPhase>("board");
  const [activeTileId, setActiveTileId] = useState<number | null>(null);

  // steal flow
  const [armedTeamId, setArmedTeamId] = useState<string | null>(null);
  const [attemptedTeamIds, setAttemptedTeamIds] = useState<Set<string>>(new Set());

  // reveal
  const [revealState, setRevealState] = useState<RevealState | null>(null);

  const activeTile = useMemo(() => {
    if (activeTileId === null) return null;
    return tiles.find((t) => t.id === activeTileId) ?? null;
  }, [tiles, activeTileId]);

  const selectableTeams = useMemo(() => {
    if (phase !== "steal") return teams;
    return teams.filter((t) => !attemptedTeamIds.has(t.id));
  }, [teams, phase, attemptedTeamIds]);

  function award(teamId: string, points: number) {
    setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, score: t.score + points } : t)));
  }

  function lockTileSolved(tileId: number, solvedByTeamId: string) {
    setTiles((prev) =>
      prev.map((t) =>
        t.id === tileId
          ? {
              ...t,
              used: true,
              // optional field (recommended to add in categoryTypes)
              solvedByTeamId,
            }
          : t
      )
    );
  }

  /** Board pick (called by drop) */
  function pickTile(tileId: number, teamId: string) {
    const tile = tiles.find((t) => t.id === tileId);
    if (!tile || tile.used) return;

    setSelectedTeamId(teamId);
    setActiveTileId(tileId);

    // reset per-question state
    setAttemptedTeamIds(new Set([teamId]));
    setArmedTeamId(null);
    setRevealState(null);

    setPhase("question");
  }

  /** Steal: choose which other team is attempting */
  function armTeam(teamId: string) {
    if (phase !== "steal") return;
    if (attemptedTeamIds.has(teamId)) return;
    setArmedTeamId(teamId);
  }

  /** Submit answer from modal */
  function submitAnswer(chosen: CategoryOptionKey) {
    if (!activeTile) return;

    const correct = activeTile.question.correct;
    const isCorrect = chosen === correct;

    const answeringTeamId = phase === "steal" ? armedTeamId : selectedTeamId;
    if (!answeringTeamId) return;

    if (isCorrect) {
      award(answeringTeamId, activeTile.points);
      lockTileSolved(activeTile.id, answeringTeamId);

      const teamName = teams.find((t) => t.id === answeringTeamId)?.name ?? "Team";

      setRevealState({
        correct,
        chosen,
        wasCorrect: true,
        pointsAwarded: activeTile.points,
        winnerTeamId: answeringTeamId,
        message: `${teamName} +${activeTile.points}`,
      });

      setPhase("reveal");
      return;
    }

    // ❌ WRONG
    // Update attempted set using functional update so it’s never stale
    setAttemptedTeamIds((prev) => {
      const next = new Set(prev);
      next.add(answeringTeamId);

      // if first attempt wrong -> enter steal mode
      if (phase === "question") {
        setArmedTeamId(null);
        setPhase("steal");
        return next;
      }

      // steal wrong -> clear armed, continue steal unless everyone attempted
      setArmedTeamId(null);

      if (next.size >= teams.length) {
        setRevealState({
          correct,
          chosen,
          wasCorrect: false,
          pointsAwarded: 0,
          winnerTeamId: null,
          message: `No one got it. Correct answer: ${correct}`,
        });
        setPhase("reveal");
      } else {
        setPhase("steal");
      }

      return next;
    });
  }

  /** Close reveal and return to board */
  function acknowledgeReveal() {
    setRevealState(null);
    setActiveTileId(null);
    setAttemptedTeamIds(new Set());
    setArmedTeamId(null);
    setPhase("board");
  }

  /** Close modal (optional “X” button) */
  function closeModal() {
    // If you want to prevent closing during question/steal, remove this.
    setRevealState(null);
    setActiveTileId(null);
    setAttemptedTeamIds(new Set());
    setArmedTeamId(null);
    setPhase("board");
  }

  return {
    // state
    teams,
    tiles,
    phase,
    activeTile,

    // selection
    selectedTeamId,
    setSelectedTeamId,

    // steal
    armedTeamId,
    armTeam,
    selectableTeams,

    // actions
    pickTile,
    submitAnswer,

    // reveal
    revealState,
    acknowledgeReveal,

    // modal
    closeModal,
  };
}
