export default function MixMatchTopBar(props: {
  title: string;
  subtitle: string;
  timeLabel: string;

  submitted: boolean;
  allCorrect: boolean;
  canSubmit: boolean;

  onSubmit: () => void;
  onReset: () => void;
}) {
  return (
    <div className="topbar">
      <div className="topLeft">
        <div className="topTitle">{props.title}</div>
        <div className="topSub">{props.subtitle}</div>
      </div>

      <div className="topRight">
        <div className="mixMatchTimerPill">
          <div className="mixMatchTimerLabel">Time</div>
          <div className="mixMatchTimerValue">{props.timeLabel}</div>
        </div>

        <button className="btn ghost" onClick={props.onReset}>
          Reset
        </button>

        {!props.allCorrect && (
          <button className="btn primary" onClick={props.onSubmit} disabled={!props.canSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
