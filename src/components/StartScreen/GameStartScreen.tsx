import GlowCard from "../GlowCard";

export default function GameStartScreen(props: {
  title: string;
  subtitle?: string;
  bullets: string[];
  tip?: string;
  onStart: () => void;
  startLabel?: string;
}) {
  return (
    <div className="appBg">
      <div className="landingCenter">
        <GlowCard>
          <div className="landingTitle">{props.title}</div>
          <div className="landingSub">{props.subtitle ?? "Instructions"}</div>

          <div className="card" style={{ padding: 60, paddingTop: 40, paddingBottom: 40, marginTop: 12 }}>
            <div className="cardTitle">How to play</div>

            <div className="hint" style={{ lineHeight: 1.7 }}>
              {props.bullets.map((b, i) => (
                <div key={i}>• {b}</div>
              ))}
            </div>

            {props.tip && (
              <>
                <div className="spacer" />
                <div className="hint">{props.tip}</div>
              </>
            )}

            <div className="encouragement">🛩️All the best🛩️</div>
          </div>

          <div className="landingActions" style={{ marginTop: 40 }}>
            <button className="btn-pill" onClick={props.onStart}>
              {props.startLabel ?? "Start"}
            </button>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
