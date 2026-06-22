import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <span className="navbar-brand">RandomQuest</span>
      <div className="navbar-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/saved">Saved</NavLink>
        <NavLink to="/history">History</NavLink>
        <NavLink to="/category-settings">Categories</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </div>
      <div className="navbar-right">
        <span className="points-badge">{profile?.points ?? 0} pts</span>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  )
}
