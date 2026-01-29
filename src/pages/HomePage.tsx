import GlowCard from '../components/GlowCard'

export default function HomePage(props: { navigate: (to: string) => void }) {
  return (
    <div className="appBg">
      <div className="page">
        <div className="hero compact">
          <div className="brand">AOSX School</div>
          <h1 className="title">Welcome</h1>
          <div className="subtitle">Use the navigation bar to explore Map, Game, and WFE.</div>
        </div>

        <div className="grid1">
          <GlowCard>
            <div className="cardTitle">Getting Started</div>
            <div className="hint" style={{ marginTop: 10 }}>
              For leaderboard
            </div>
            <div className="spacer" />
          </GlowCard>
        </div>
      </div>
    </div>
  )
}
