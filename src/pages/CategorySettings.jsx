import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'
import { CATEGORIES } from '../lib/constants'

export default function CategorySettings() {
  const { user } = useAuth()
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('user_categories')
        .select('category')
        .eq('user_id', user.id)
      setSelected(data?.map(c => c.category) || [])
      setLoading(false)
    }
    fetch()
  }, [])

  function toggle(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
    setSuccess(false)
  }

  async function handleSave() {
    if (selected.length === 0) return
    setSaving(true)
    await supabase.from('user_categories').delete().eq('user_id', user.id)
    await supabase.from('user_categories').insert(selected.map(cat => ({ user_id: user.id, category: cat })))
    setSaving(false)
    setSuccess(true)
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Category Settings</h1>
        <p>Update your preferences. New challenges will be generated from these categories.</p>
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <>
          {success && (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
              Preferences saved! Your next challenge will reflect these categories.
            </div>
          )}

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

          <div style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving || selected.length === 0}
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
            {selected.length === 0 && (
              <p className="text-sm text-muted">Select at least one category</p>
            )}
          </div>
        </>
      )}
    </Layout>
  )
}
