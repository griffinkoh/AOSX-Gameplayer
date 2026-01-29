import { AnimatePresence, motion } from "framer-motion";
import type { Team } from "../../types";
import { sfx } from "../../utils/sfx";
import type { CategoryOptionKey, CategoryPhase } from "../../pages/Team/Category/categoryTypes";

// ✅ reuse the exact Bingo dropdown component
import TeamSelectDropdown from "../Team/TeamSelectDropdown";

type RevealState = {
  correct: CategoryOptionKey;
  chosen: CategoryOptionKey | null;
  wasCorrect: boolean;
  pointsAwarded: number;
  winnerTeamId: string | null;
  message: string;
};

export default function CategoryQuestionModel(props: {
  open: boolean;
  phase: Exclude<CategoryPhase, "board">; // "question" | "steal" | "reveal"
  teams: Team[];

  // question phase
  selectedTeamId: string;
  onSelectTeam: (teamId: string) => void;

  // steal phase
  armedTeamId: string | null;
  onArmTeam: (teamId: string) => void;

  // content
  category: string;
  value: number;
  question: string;
  answers: Record<CategoryOptionKey, string>;

  // actions
  onAnswer: (opt: CategoryOptionKey) => void;

  revealState: RevealState | null;
  onAcknowledgeReveal: () => void;

  onClose: () => void;
}) {
  const showTeamPicker = props.phase === "question" || props.phase === "steal";
  const inReveal = props.phase === "reveal";

  // ✅ which team the dropdown is controlling depends on phase
  const dropdownTeamId =
    props.phase === "steal" ? (props.armedTeamId ?? "") : props.selectedTeamId;

  const onChangeDropdownTeam = (teamId: string) => {
    if (props.phase === "steal") props.onArmTeam(teamId);
    else props.onSelectTeam(teamId);
  };

  // ✅ disable options until a team is chosen (steal requires armedTeamId)
  const canAnswer =
    props.phase === "question"
      ? !!props.selectedTeamId
      : props.phase === "steal"
        ? !!props.armedTeamId
        : false;

  return (
    <AnimatePresence>
      {props.open && (
        <motion.div
          className="modalBackdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {}} // do not close on backdrop click
        >
          <motion.div
            className="modal"
            initial={{ y: 20, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="modalHeader">
              <div className="modalPts">
                <div className="modalPtsNum">{props.value}</div>
                <div className="modalPtsLab">points</div>
              </div>

              <button
                className="btn ghost"
                type="button"
                onClick={() => {
                  sfx.tap();
                  props.onClose();
                }}
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="hint" style={{ marginTop: 8 }}>
              <b>{props.category}</b>
            </div>

            {/* ✅ Bingo dropdown reused */}
            {showTeamPicker && (
              <div className="modalTeamRow" style={{ marginTop: 14 }}>
                <div className="modalTeamLabel">
                  {props.phase === "steal" ? "Stealing team" : "Answering team"}
                </div>

                <TeamSelectDropdown
                  teams={props.teams}
                  selectedTeamId={dropdownTeamId}
                  onSelectTeam={onChangeDropdownTeam}
                  label="Select team"
                />
              </div>
            )}

            {/* Question */}
            <div className="modalQuestion" style={{ marginTop: 14 }}>
              {props.question}
            </div>

            {/* Options OR Reveal */}
            {!inReveal ? (
              <div className="catOptions" style={{ marginTop: 14 }}>
                {(["A", "B", "C", "D"] as CategoryOptionKey[]).map((k) => (
                  <button
                    key={k}
                    className="btn"
                    onClick={() => {
                      sfx.tap();
                      props.onAnswer(k);
                    }}
                    disabled={!canAnswer}
                    style={{
                      width: "100%",
                      justifyContent: "flex-start",
                      marginTop: 10,
                    }}
                  >
                    <b style={{ width: 28 }}>{k}.</b> {props.answers[k]}
                  </button>
                ))}
              </div>
            ) : (
              <div className="modalAnswerBlock" style={{ marginTop: 14 }}>
                <div className="modalAnswerLabel">Result</div>
                <div className="modalAnswerText">{props.revealState?.message ?? ""}</div>

                <div className="spacer" />

                <button
                  className="btn primary"
                  onClick={() => {
                    sfx.tap();
                    props.onAcknowledgeReveal();
                  }}
                >
                  OK
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
