import { useDrag } from "react-dnd";
import type { MixMatchOption } from "../../types";
import { DND_OPTION, type DragOptionItem } from "../../utils/dnd";

type OptionMark = "correct" | "wrong";

export default function MixMatchOptionChip(props: {
  option: MixMatchOption;
  disabled?: boolean; // used or locked
  used?: boolean;     // grey styling for used
  status?: OptionMark; // after submit
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DND_OPTION,
    item: { type: DND_OPTION, optionId: props.option.id } satisfies DragOptionItem,
    canDrag: () => !props.disabled,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const cls = [
    "mixMatchOpt",
    isDragging ? "mixMatchOptDragging" : "",
    props.used ? "mixMatchOptUsed" : "",
    props.status === "correct" ? "mixMatchOptCorrect" : "",
    props.status === "wrong" ? "mixMatchOptWrong" : "",
    props.disabled ? "mixMatchOptDisabled" : "",
  ].join(" ");

  return (
    <div
      ref={drag}
      className={cls}
      role="button"
      aria-label={`Drag option ${props.option.label}`}
      aria-disabled={props.disabled ? "true" : "false"}
    >
      {props.option.label}
    </div>
  );
}
