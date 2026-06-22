import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Welcome() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-emoji">🎉</div>
        <h1>Hey {profile?.full_name?.split(' ')[0] ?? 'there'}, welcome!</h1>
        <p>
          We're so glad you're here. Based on the categories you picked, we've already lined
          up your first challenge — and trust us, it's a good one. Complete it, mark it done,
          and start racking up those points. This is going to be fun! ✨
        </p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary btn-wide">
          See My First Challenge
        </button>
      </div>
    </div>
  )
}
