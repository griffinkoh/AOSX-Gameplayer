type Props = {
  time: number;
  penalty: number;
  onAction: () => void;
  actionLabel: string;       
  title?: string;          
};

export default function ResultModal({
  time,
  penalty,
  onAction,
  actionLabel,
  title = "Exercise Completed"
}: Props) {
  const finalTime = time + penalty;

  return (
    <div className="result-modal">
      <div className="result-card">
        <h2>{title}</h2>

        <div className="result-row">
          <span>Time Taken</span>
          <span>{time}s</span>
        </div>

        <div className="result-row">
          <span>Penalty</span>
          <span className={penalty > 0 ? "penalty" : "ok"}>
            {penalty > 0 ? `+${penalty}s` : "None"}
          </span>
        </div>

        <div className="result-divider" />

        <div className="result-final">
          <span>Final Time</span>
          <span>{finalTime}s</span>
        </div>

        <button className="primary-btn" style={{marginTop: "20px"}} onClick={onAction}>
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
