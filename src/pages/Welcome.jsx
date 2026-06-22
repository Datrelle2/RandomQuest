import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Welcome() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const name = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <span className="welcome-emoji">👋</span>
        <h1>Hey, {name}! Welcome to RandomQuest.</h1>
        <p>
          We're so glad you're here. Based on the categories you picked, we've already
          lined up your first challenge — and trust us, it's a good one. Complete it,
          mark it done, and start racking up those points. This is going to be fun! ✨
        </p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
          Start Questing 🚀
        </button>
      </div>
    </div>
  )
}
