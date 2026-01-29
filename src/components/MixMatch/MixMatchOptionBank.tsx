import { useMemo } from "react";
import type { MixMatchOption } from "../../types";
import MixMatchOptionChip from "./MixMatchOptionChip";

type OptionMark = "correct" | "wrong";

export default function MixMatchOptionBank(props: {
  options: MixMatchOption[];
  started: boolean;

  // options currently placed on board
  placedOptionIds: Set<string>;

  // optionId -> correct/wrong (after submit)
  optionStatus?: Record<string, OptionMark>;
}) {
  const leftCount = useMemo(() => {
    let placed = 0;
    for (const o of props.options) if (props.placedOptionIds.has(o.id)) placed++;
    return props.options.length - placed;
  }, [props.options, props.placedOptionIds]);

  return (
    <div className="mixMatchBankWrap glow">
      <div className="cardTitle">Options ({leftCount} left)</div>

      <div className="mixMatchBank">
        {props.options.map((opt) => {
          const status = props.optionStatus?.[opt.id];
          const isPlaced = props.placedOptionIds.has(opt.id);

          // ✅ green is locked. used is greyed/disabled
          const locked = status === "correct";

          return (
            <MixMatchOptionChip
              key={opt.id}
              option={opt}
              disabled={isPlaced || locked}
              used={isPlaced}
              status={status}
            />
          );
        })}
      </div>

      <div className="hint" style={{ marginTop: 12 }}>
        Tip: Used options are greyed out. After submit, green options are locked.
      </div>
    </div>
  );
}
