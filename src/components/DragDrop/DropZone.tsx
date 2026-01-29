import { useDrop, useDrag } from "react-dnd";
import { Zone } from "../types";

type DragItem = { label: string; fromZoneId?: string };

type DropZoneProps = {
  zone: Zone;
  placedItem?: string;
  incorrect: boolean;
  correct: boolean; 
  onDrop: (zoneId: string, itemId: string, fromZoneId?: string) => void;
};

export default function DropZone({
  zone,
  placedItem,
  incorrect,
  correct,
  onDrop
}: DropZoneProps) {
  const [, drop] = useDrop<DragItem>(
    () => ({
      accept: "OPTION",
      drop: item => onDrop(zone.id, item.label, item.fromZoneId)
    }),
    [zone.id, onDrop]
  );

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(
    () => ({
      type: "OPTION",
      item: placedItem ? { label: placedItem, fromZoneId: zone.id } : undefined,
      canDrag: !!placedItem,
      collect: monitor => ({ isDragging: monitor.isDragging() })
    }),
    [placedItem, zone.id]
  );

  return (
    <div
      ref={drop}
      className="zone-hitbox"
      style={{
        position: "absolute",
        left: `${zone.leftPct * 100}%`,
        top: `${zone.topPct * 100}%`,
        width: `${zone.widthPct * 100}%`,
        height: `${zone.heightPct * 100}%`,
        transform: "translate(-50%, -50%)"
      }}
    >
      {placedItem && (
        <div
          key={placedItem}
          ref={drag}
          className={`zone-pill ${
            incorrect ? "zone-wrong" : correct ? "zone-correct" : ""
          }`}
          style={{ opacity: isDragging ? 0.5 : 1 }}
        >
          {placedItem}
        </div>
      )}
    </div>
  );
}
