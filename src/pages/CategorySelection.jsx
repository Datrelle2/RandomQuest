import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'
import { CATEGORIES } from '../lib/constants'

export default function CategorySelection() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function toggle(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  async function handleSubmit() {
    if (selected.length === 0) { setError('Please select at least one category'); return }
    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('user_categories')
      .insert(selected.map(cat => ({ user_id: user.id, category: cat })))

    if (error) { setError(error.message); setLoading(false); return }
    navigate('/welcome')
  }

  return (
    <div className="cat-select-page">
      <div className="cat-select-container">
        <div className="auth-logo">⚡</div>
        <h1>What are you into?</h1>
        <p>Pick the categories you enjoy — your challenges will be built around these.</p>

        {error && <div className="alert alert-error" style={{ margin: '1rem 0' }}>{error}</div>}

        <div className="category-grid">
          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              className={`category-item ${selected.includes(cat.id) ? 'selected' : ''}`}
              onClick={() => toggle(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-label">{cat.label}</span>
            </div>
          ))}
        </div>

        <div className="cat-select-actions">
          {selected.length > 0 && (
            <p className="selected-count">
              {selected.length} {selected.length === 1 ? 'category' : 'categories'} selected
            </p>
          )}
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={loading || selected.length === 0}
          >
            {loading ? 'Saving...' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}
