import DraggableOption from "./DraggableOption";
import {OPTIONS} from "../../data/dragDropData";

type Props = {
  usedLabels: string[];
};

export default function OptionsPanel({ usedLabels }: Props) {
  return (
    <aside className="options-panel">
      <div className="options-title">OPTIONS</div>

      <div className="options-list">
        {OPTIONS.map(opt => {
          const isUsed = usedLabels.includes(opt.label);
          return (
            <DraggableOption
              key={opt.id}
              id={opt.id}
              label={opt.label}
              disabled={isUsed}
            />
          );
        })}
      </div>
    </aside>
  );
}
