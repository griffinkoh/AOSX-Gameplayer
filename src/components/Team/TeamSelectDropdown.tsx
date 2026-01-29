import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Team } from "../../types";
import { sfx } from "../../utils/sfx";

export default function TeamSelectDropdown(props: {
  teams: Team[];
  selectedTeamId: string;
  onSelectTeam: (teamId: string) => void;
  label?: string;               // optional label shown on the left
  disabled?: boolean;           // disable opening/selection
}) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const selectedTeam = useMemo(
    () => props.teams.find((t) => t.id === props.selectedTeamId) ?? null,
    [props.teams, props.selectedTeamId]
  );

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!pickerRef.current?.contains(el)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // esc closes dropdown only
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="modalTeamRow">
      {props.label && <div className="modalTeamLabel">{props.label}</div>}

      <div className="teamPicker" ref={pickerRef}>
        <button
          type="button"
          className="teamSelectPro"
          onClick={() => {
            if (props.disabled) return;
            sfx.tap();
            setOpen((o) => !o);
          }}
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={props.disabled}
        >
          <span
            className="teamDot"
            style={{ background: selectedTeam?.color ?? "transparent" }}
            aria-hidden="true"
          />
          <span className="teamName">{selectedTeam?.name ?? "Select team"}</span>
          <span className="teamScore">{selectedTeam ? `${selectedTeam.score} pts` : ""}</span>
          <span className="teamArrow" aria-hidden="true">▾</span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              className="teamMenu"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              role="listbox"
            >
              {props.teams.map((t) => {
                const active = t.id === props.selectedTeamId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`teamOption ${active ? "active" : ""}`}
                    onClick={() => {
                      sfx.tap();
                      props.onSelectTeam(t.id);
                      setOpen(false);
                    }}
                    role="option"
                    aria-selected={active}
                  >
                    <span className="teamDot" style={{ background: t.color }} aria-hidden="true" />
                    <span className="teamName">{t.name}</span>
                    <span className="teamScore">{t.score} pts</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
