import { useState } from 'react'
import GlowCard from '../components/GlowCard'
import { supabase } from '../lib/supabase'

const USERNAME_DOMAIN = import.meta.env.VITE_ADMIN_DOMAIN

export default function InstructorLoginPage(props: {
  navigate: (to: string) => void
  onLogin: () => void
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password!')
      return
    }

    setLoading(true)
    setError(null)

    // Convert username -> internal email
    const email = `${username.toLowerCase()}@${USERNAME_DOMAIN}`

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError('Invalid username or password!')
      return
    }

    props.onLogin()
  }

  return (
    <div className="appBg">
      <div className="landingCenter">
        <GlowCard>
          <div className="landingTitle">Instructor Login</div>
          <div className="landingSub">
            Login for Instructor Dashboard
          </div>

          <div className="formGrid">
            <label className="formLabel">
              Username:
              <input
                id="username"
                className="formInput"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </label>

            <label className="formLabel">
              Password:
              <input
                id="password"
                className="formInput"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
          </div>

          {error && <div className="hint" style={{ marginTop: 10, color: "red", fontWeight: "500" }}>{error}</div>}

          <div className="landingActions" style={{ marginTop: 16 }}>
            <button className="btn loginButton" onClick={handleLogin} disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </div>
        </GlowCard>
      </div>
    </div>
  )
}
