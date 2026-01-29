import { useDrag, useDrop } from "react-dnd";
import type { MixMatchTile as Tile } from "../../types";
import { DND_OPTION, type DragOptionItem } from "../../utils/dnd";

type OptionMark = "correct" | "wrong";
type DragPlacedItem = DragOptionItem & { fromTileId?: string };

export default function MixMatchTile(props: {
  tile: Tile;
  placedOptionIds: string[];

  submitted: boolean;

  optionStatus?: Record<string, OptionMark>;
  optionLabelById: Record<string, string>;

  onDropOption: (tileId: string, optionId: string) => void;
  onMoveOption: (fromTileId: string, toTileId: string, optionId: string) => void;
  onRemoveOption: (tileId: string, optionId: string) => void;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: DND_OPTION,
    drop: (item: DragPlacedItem) => {
      if (item.fromTileId && item.fromTileId !== props.tile.id) {
        props.onMoveOption(item.fromTileId, props.tile.id, item.optionId);
        return;
      }
      props.onDropOption(props.tile.id, item.optionId);
    },
    collect: (m) => ({ isOver: m.isOver(), canDrop: m.canDrop() }),
  }));

  return (
    <div
      ref={drop}
      className={[
        "mixMatchTile",
        isOver && canDrop ? "mixMatchTileHover" : "",
      ].join(" ")}
    >
      <div className="mixMatchTileHead">
        <div className="mixMatchTileTitle">{props.tile.title}</div>
      </div>

      <div className="mixMatchPlaced">
        {props.placedOptionIds.length === 0 ? (
          <div className="mixMatchPlaceholder">Drop here</div>
        ) : (
          props.placedOptionIds.map((optId) => {
            const mark = props.optionStatus?.[optId];
            const locked = props.submitted && mark === "correct";

            return (
              <PlacedChip
                key={optId}
                tileId={props.tile.id}
                optionId={optId}
                label={props.optionLabelById[optId] ?? optId}
                submitted={props.submitted}
                mark={mark}
                locked={locked}
                onRemove={() => props.onRemoveOption(props.tile.id, optId)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function PlacedChip(props: {
  tileId: string;
  optionId: string;
  label: string;

  submitted: boolean;
  mark?: "correct" | "wrong";
  locked: boolean;

  onRemove: () => void;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DND_OPTION,
    item: {
      type: DND_OPTION,
      optionId: props.optionId,
      fromTileId: props.tileId,
    } as DragPlacedItem,
    canDrag: () => {
      // ✅ lock green chips after submit
      if (!props.submitted) return true;
      return !props.locked;
    },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));

  const cls = [
    "mixMatchPlacedChip",
    isDragging ? "mixMatchPlacedChipDragging" : "",
    props.submitted && props.mark === "correct" ? "mixMatchPlacedChipCorrect" : "",
    props.submitted && props.mark === "wrong" ? "mixMatchPlacedChipWrong" : "",
  ].join(" ");

  return (
    <button
      ref={drag}
      type="button"
      className={cls}
      onClick={() => {
        // ✅ green cannot be removed
        if (props.locked) return;
        props.onRemove();
      }}
      title={props.locked ? "Locked (correct)" : "Click to remove"}
    >
      {/* ✅ show actual label */}
      {props.label}
    </button>
  );
}
