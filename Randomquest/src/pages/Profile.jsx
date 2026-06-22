import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    email: user?.email ?? '',
    password: '',
    confirm: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    setMessage('')
    setError('')
    if (form.password && form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    setSaving(true)

    await supabase.from('profiles').update({ full_name: form.full_name }).eq('id', user.id)

    const authUpdates = {}
    if (form.email !== user.email) authUpdates.email = form.email
    if (form.password) authUpdates.password = form.password
    if (Object.keys(authUpdates).length > 0) await supabase.auth.updateUser(authUpdates)

    await refreshProfile()
    setMessage('Profile updated!')
    setSaving(false)
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure? This will permanently delete your account and all data.')) return
    setDeleting(true)

    // Delete all user data — auth.users cascade will clean up profiles via trigger
    await supabase.from('saved_challenges').delete().eq('user_id', user.id)
    await supabase.from('challenge_history').delete().eq('user_id', user.id)
    await supabase.from('user_preferences').delete().eq('user_id', user.id)
    await supabase.from('profiles').delete().eq('id', user.id)
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1>Profile</h1>
        <div className="profile-points">
          <span className="points-big">{profile?.points ?? 0}</span>
          <span className="points-label">total points</span>
        </div>
        <form onSubmit={handleSave} className="auth-form profile-form">
          <label>Full Name</label>
          <input
            type="text"
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
          />
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <label>New Password <span className="optional">(leave blank to keep current)</span></label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <label>Confirm New Password</label>
          <input
            type="password"
            value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })}
          />
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
        <div className="danger-zone">
          <h3>Danger Zone</h3>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger">
            {deleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </>
  )
}
