import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'
import { CATEGORIES } from '../lib/constants'

export default function History() {
  const { user } = useAuth()
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setChallenges(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  function getCat(categoryId) {
    return CATEGORIES.find(
      c => c.id === categoryId?.toLowerCase() || c.label.toLowerCase() === categoryId?.toLowerCase()
    )
  }

  function StatusBadge({ status }) {
    if (status === 'completed') return <span className="badge badge-success">✓ Completed</span>
    if (status === 'skipped') return <span className="badge badge-dim">Skipped</span>
    return <span className="badge badge-purple">Active</span>
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Challenge History</h1>
        <p>Every challenge you've received, newest first.</p>
      </div>

      {loading && <p className="text-muted">Loading...</p>}

      {!loading && challenges.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No history yet</h3>
          <p>Head to your dashboard and complete your first challenge.</p>
        </div>
      )}

      <div className="challenge-list">
        {challenges.map(c => {
          const cat = getCat(c.category)
          return (
            <div key={c.id} className="challenge-list-item">
              <div className="challenge-list-item-header">
                <div>
                  <span className="badge badge-purple" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>
                    {cat?.icon || '🎯'} {c.category}
                  </span>
                  <div className="challenge-list-item-title">{c.title}</div>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <p className="challenge-list-item-desc">{c.description}</p>
              <div className="challenge-date">
                {new Date(c.created_at).toLocaleDateString('en-US', {
                  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                })}
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
