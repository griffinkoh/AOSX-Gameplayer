import { motion } from 'framer-motion'
import GlowCard from '../components/GlowCard'
import type { Team } from '../types'
import { TEAM_COLORS, clamp, uid } from '../utils/colors'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

type GameOption = { code: string; label: string }

export default function LobbyPage(props: {
  onStart: (game: string, teams: Team[]) => void
}) {
  const [game, setGame] = useState<string>('')

  const [teamCount, setTeamCount] = useState<number>(4)
  const [names, setNames] = useState<Record<number, string>>({})

  const [gameOptions, setGameOptions] = useState<GameOption[]>([])
  const [gamesLoading, setGamesLoading] = useState(true)
  const [gamesError, setGamesError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadGames() {
      setGamesLoading(true)
      setGamesError(null)

      const { data, error } = await supabase
        .from('questions')
        .select('game_code')

      if (cancelled) return

      if (error) {
        setGamesError(error.message)
        setGameOptions([])
        setGame('')
        setGamesLoading(false)
        return
      }

      const unique = Array.from(
        new Set((data ?? []).map((r: any) => String(r.game_code ?? '').trim()).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b))

      const opts: GameOption[] = unique.map((code) => ({
        code,
        // label: make it look nice in UI (you can change this)
        label: code.toUpperCase().replace(/_/g, ' '),
      }))

      setGameOptions(opts)
      setGame((prev) => (prev && unique.includes(prev) ? prev : (opts[0]?.code ?? '')))
      setGamesLoading(false)
    }

    loadGames()

    return () => {
      cancelled = true
    }
  }, [])

  const teams: Team[] = useMemo(() => {
    return Array.from({ length: teamCount }).map((_, i) => ({
      id: uid('team'),
      name: names[i] ?? `Team ${i + 1}`,
      color: TEAM_COLORS[i % TEAM_COLORS.length],
      score: 0,
    }))

  }, [teamCount, JSON.stringify(names)])

  function BouncyText({ text }: { text: string }) {
    return (
      <span className="letterBounce">
        {text.split('').map((char, i) => (
          <span key={i} className="bounceChar" style={{ animationDelay: `${i * 0.07}s` }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    )
  }

  const canStart = !gamesLoading && !gamesError && !!game && gameOptions.length > 0

  return (
    <div className="page">
      <div className="hero">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        >
          <div className="brand">AOSX School Game</div>
          <h1 className="title">
            <BouncyText text="Select Your Game" />
          </h1>
          <div className="subtitle">Database can will be implemented soon.</div>
        </motion.div>
      </div>

      <div className="grid2">
        <GlowCard>
          <div className="cardTitle">Game Type</div>

          <div className="segmented">
            {gamesLoading ? (
              <button className="segBtn" disabled>
                Loading…
              </button>
            ) : gameOptions.length === 0 ? (
              <button className="segBtn" disabled>
                No games found
              </button>
            ) : (
              gameOptions.map((g) => (
                <button
                  key={g.code}
                  className={`segBtn ${game === g.code ? 'segActive' : ''}`}
                  onClick={() => setGame(g.code)}
                >
                  {g.label}
                </button>
              ))
            )}
          </div>

          {gamesError && (
            <div className="hint" style={{ marginTop: 10 }}>
              Failed to load games: {gamesError}
            </div>
          )}

          <div className="spacer" />

          <div className="cardTitle">Number of Teams</div>
          <div className="row">
            <div className="teamCounter">
              <button className="teamBtn" onClick={() => setTeamCount((c) => clamp(c - 1, 2, 8))}>
                –
              </button>

              <div className="teamCount">{teamCount}</div>

              <button className="teamBtn" onClick={() => setTeamCount((c) => clamp(c + 1, 2, 8))}>
                +
              </button>
            </div>

            <div className="hint">2 to 8 teams</div>
          </div>

          <div className="spacer" />

          <button
            className="btn primary big"
            disabled={!canStart}
            onClick={() => props.onStart(game, teams)}
          >
            Start Game
          </button>
        </GlowCard>

        <GlowCard>
          <div className="cardTitle">Teams</div>
          <div className="teamList">
            {teams.map((t, i) => (
              <div key={`${t.id}-${i}`} className="teamRow">
                <div className="teamSwatch" style={{ background: t.color }} />
                <input
                  className="teamInput"
                  value={names[i] ?? t.name}
                  onChange={(e) => setNames((p) => ({ ...p, [i]: e.target.value }))}
                />
                <div className="teamMini">Score: 0</div>
              </div>
            ))}
          </div>

          <div className="hint" style={{ marginTop: 10 }}>
            Tip: You can drag team chips onto tiles during the game.
          </div>
        </GlowCard>
      </div>

      <div className="footerNote">
        Bonus points: +100 points for every completed row/column of the same team color.
      </div>
    </div>
  )
}
