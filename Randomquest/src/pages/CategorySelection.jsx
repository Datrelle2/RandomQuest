import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = [
  'Physical Activity',
  'Gaming',
  'Creativity',
  'Brain & Learning',
  'Cooking',
  'Outdoor Activities',
  'Social',
  'Music',
  'Relaxation',
  'Chores',
]

export default function CategorySelection() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isNew = searchParams.get('new') === 'true'

  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isNew) return
    supabase
      .from('user_preferences')
      .select('category')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setSelected(data?.map(r => r.category) ?? [])
        setLoading(false)
      })
  }, [user.id, isNew])

  function toggle(cat) {
    setSelected(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  async function handleSave() {
    if (selected.length === 0) return
    setSaving(true)

    await supabase.from('user_preferences').delete().eq('user_id', user.id)
    await supabase.from('user_preferences').insert(
      selected.map(category => ({ user_id: user.id, category }))
    )

    navigate(isNew ? '/welcome' : '/dashboard')
  }

  if (loading) return <div className="loading-screen">Loading your preferences...</div>

  return (
    <div className="page-container">
      <div className="category-page">
        <h1>{isNew ? 'What are you into?' : 'Update Your Interests'}</h1>
        <p>Pick as many as you like — your challenges will be tailored around these.</p>
        <div className="category-grid">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => toggle(cat)}
              className={`category-chip ${selected.includes(cat) ? 'selected' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={handleSave}
          disabled={selected.length === 0 || saving}
          className="btn-primary btn-wide"
        >
          {saving ? 'Saving...' : isNew ? "Let's Go" : 'Save Preferences'}
        </button>
      </div>
    </div>
  )
}
