import { AnimatePresence, motion } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import type { Screen, Team } from './types'
import LobbyPage from './pages/TeamLobbyPage'
import GamePage from './pages/Team/BingoPlayPage'
import EndPage from './pages/EndPage'
import LeaderboardPage from './pages/LeaderboardPage'

/**
 * This is the original game flow (Lobby -> Game -> End -> Leaderboard).
 * Kept intact so existing features remain unchanged.
 */
export default function GameHost(props: { defaultGameCode?: string; withBackground?: boolean }) {
  const [screen, setScreen] = useState<Screen>('lobby')
  const [game, setGame] = useState<string>(props.defaultGameCode ?? '')
  const [teams, setTeams] = useState<Team[]>([])

  const pageVariants = {
    initial: { opacity: 0, y: 10, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -10, filter: 'blur(6px)' },
  }

  const wrap = (children: ReactNode) =>
    props.withBackground === false ? <>{children}</> : <div className="appBg">{children}</div>

  return wrap(
    <AnimatePresence mode="wait">
        {screen === 'lobby' && (
          <motion.div key="lobby" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <LobbyPage
              onStart={(g, t) => {
                setGame(g)
                setTeams(t)
                setScreen('game')
              }}
            />
          </motion.div>
        )}

        {screen === 'game' && (
          <motion.div key="game" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <GamePage
              game={game}
              teams={teams}
              onEnd={(finalTeams) => {
                setTeams(finalTeams)
                setScreen('end')
              }}
            />
          </motion.div>
        )}

        {screen === 'end' && (
          <motion.div key="end" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <EndPage teams={teams} onRestart={() => setScreen('lobby')} onLeaderboard={() => setScreen('leaderboard')} />
          </motion.div>
        )}

        {screen === 'leaderboard' && (
          <motion.div key="leaderboard" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <LeaderboardPage teams={teams} onBack={() => setScreen('end')} />
          </motion.div>
        )}
    </AnimatePresence>,
  )
}
