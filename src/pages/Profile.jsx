import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '' })
  const [passwords, setPasswords] = useState({ newPass: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [message, setMessage] = useState(null)
  const [stats, setStats] = useState({ total: 0, completed: 0, saved: 0 })

  useEffect(() => {
    if (profile) setForm({ fullName: profile.full_name || '', email: profile.email || '' })
  }, [profile])

  useEffect(() => {
    async function fetchStats() {
      const [r1, r2, r3] = await Promise.all([
        supabase.from('challenges').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('challenges').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'completed'),
        supabase.from('saved_challenges').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ])
      setStats({ total: r1.count || 0, completed: r2.count || 0, saved: r3.count || 0 })
    }
    fetchStats()
  }, [])

  async function handleProfileSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    await supabase.from('profiles').update({ full_name: form.fullName, email: form.email }).eq('id', user.id)
    await refreshProfile()
    setSaving(false)
    setMessage({ type: 'success', text: 'Profile updated!' })
  }

  async function handlePasswordSave(e) {
    e.preventDefault()
    setMessage(null)
    if (passwords.newPass !== passwords.confirm) { setMessage({ type: 'error', text: 'Passwords do not match' }); return }
    if (passwords.newPass.length < 6) { setMessage({ type: 'error', text: 'Password must be at least 6 characters' }); return }
    setSavingPw(true)
    const { error } = await supabase.auth.updateUser({ password: passwords.newPass })
    setSavingPw(false)
    if (error) { setMessage({ type: 'error', text: error.message }); return }
    setPasswords({ newPass: '', confirm: '' })
    setMessage({ type: 'success', text: 'Password updated!' })
  }

  async function handleDelete() {
    if (!window.confirm('Delete your account permanently? This cannot be undone.')) return
    await supabase.from('profiles').delete().eq('id', user.id)
    await supabase.auth.signOut()
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account and track your progress.</p>
      </div>

      <div className="stats-grid">
        <div className="profile-stat">
          <div className="profile-stat-value">⭐ {profile?.points || 0}</div>
          <div className="profile-stat-label">Total Points</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat-value">{stats.completed}</div>
          <div className="profile-stat-label">Completed</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat-value">{stats.saved}</div>
          <div className="profile-stat-label">Saved</div>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: '1.5rem' }}>
          {message.text}
        </div>
      )}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Account Info</h2>
        <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Change Password</h2>
        <form onSubmit={handlePasswordSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" value={passwords.newPass} onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))} placeholder="At least 6 characters" required />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" required />
          </div>
          <div>
            <button type="submit" className="btn btn-primary" disabled={savingPw}>
              {savingPw ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--danger)' }}>Danger Zone</h2>
        <p className="text-muted text-sm" style={{ marginBottom: '1rem' }}>
          Permanently delete your account and all of your data. This cannot be undone.
        </p>
        <button className="btn btn-danger" onClick={handleDelete}>Delete Account</button>
      </div>
    </Layout>
  )
}
