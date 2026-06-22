import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className="navbar-brand">
        <span>🎯</span>
        <span className="navbar-brand-name">RandomQuest</span>
      </NavLink>

      <ul className="navbar-nav">
        <li><NavLink to="/dashboard">Dashboard</NavLink></li>
        <li><NavLink to="/saved">Saved</NavLink></li>
        <li><NavLink to="/history">History</NavLink></li>
        <li><NavLink to="/settings">Settings</NavLink></li>
        <li><NavLink to="/profile">Profile</NavLink></li>
      </ul>

      <div className="navbar-right">
        <div className="navbar-points">⭐ {profile?.points ?? 0} pts</div>
        <button className="navbar-signout" onClick={handleSignOut}>Sign Out</button>
      </div>
    </nav>
  )
}
