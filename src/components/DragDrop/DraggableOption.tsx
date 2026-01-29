import { useDrag } from "react-dnd";

type Props = {
  id: string;
  label: string;
  disabled: boolean;
};

export default function DraggableOption({ id, label, disabled }: Props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "OPTION",
    item: { label },
    canDrag: !disabled,
    collect: monitor => ({ isDragging: monitor.isDragging(), canDrag: monitor.canDrag()
    })
  }),
  [disabled, id, label] );


  return (
    <div
      ref={drag} 
      className={`option ${disabled ? "option-disabled" : "option-enabled"}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        touchAction: "none",
        cursor: disabled ? "not-allowed" : "grab"
      }}
    >
      {label}
    </div>
  );
}
