import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'
import { CATEGORIES } from '../lib/constants'

export default function SavedChallenges() {
  const { user } = useAuth()
  const [saved, setSaved] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSaved()
  }, [])

  async function fetchSaved() {
    const { data } = await supabase
      .from('saved_challenges')
      .select('*, challenges(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setSaved(data || [])
    setLoading(false)
  }

  async function handleRemove(savedId) {
    await supabase.from('saved_challenges').delete().eq('id', savedId)
    setSaved(prev => prev.filter(s => s.id !== savedId))
  }

  function getCat(categoryId) {
    return CATEGORIES.find(
      c => c.id === categoryId?.toLowerCase() || c.label.toLowerCase() === categoryId?.toLowerCase()
    )
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Saved Challenges</h1>
        <p>Challenges you've bookmarked to revisit later.</p>
      </div>

      {loading && <p className="text-muted">Loading...</p>}

      {!loading && saved.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔖</div>
          <h3>No saved challenges yet</h3>
          <p>Hit the save button on your dashboard challenge to bookmark it here.</p>
        </div>
      )}

      <div className="challenge-list">
        {saved.map(s => {
          const c = s.challenges
          if (!c) return null
          const cat = getCat(c.category)
          return (
            <div key={s.id} className="challenge-list-item">
              <div className="challenge-list-item-header">
                <div>
                  <span className="badge badge-purple" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>
                    {cat?.icon || '🎯'} {c.category}
                  </span>
                  <div className="challenge-list-item-title">{c.title}</div>
                </div>
              </div>
              <p className="challenge-list-item-desc">{c.description}</p>
              <div className="challenge-list-item-footer">
                <span className="text-sm text-muted">
                  Saved {new Date(s.created_at).toLocaleDateString()}
                </span>
                <button className="btn btn-danger btn-sm" onClick={() => handleRemove(s.id)}>
                  Remove
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
