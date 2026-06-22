import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function History() {
  const { user } = useAuth()
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('challenge_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setChallenges(data ?? []); setLoading(false) })
  }, [])

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1>Challenge History</h1>
        {loading && <p>Loading...</p>}
        {!loading && challenges.length === 0 && (
          <p className="empty-state">No history yet — go get a challenge!</p>
        )}
        <div className="history-list">
          {challenges.map(c => (
            <div key={c.id} className={`history-item ${c.completed ? 'completed' : ''}`}>
              <div className="history-meta">
                <span className="history-category">{c.category}</span>
                <span className={`history-status ${c.completed ? 'completed' : ''}`}>
                  {c.completed ? '✓ Completed' : 'Pending'}
                </span>
              </div>
              <p className="history-title">{c.challenge}</p>
              <p className="history-date">{new Date(c.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
