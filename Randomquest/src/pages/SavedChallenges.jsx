import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function SavedChallenges() {
  const { user } = useAuth()
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('saved_challenges')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setChallenges(data ?? [])
    setLoading(false)
  }

  async function unsave(id) {
    await supabase.from('saved_challenges').delete().eq('id', id)
    setChallenges(prev => prev.filter(c => c.id !== id))
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1>Saved Challenges</h1>
        {loading && <p>Loading...</p>}
        {!loading && challenges.length === 0 && (
          <p className="empty-state">No saved challenges yet. Save one from your dashboard!</p>
        )}
        <div className="challenge-list">
          {challenges.map(c => (
            <div key={c.id} className="challenge-card">
              <div className="challenge-category">{c.category}</div>
              <p className="challenge-description">{c.challenge}</p>
              <div className="challenge-actions">
                <button onClick={() => unsave(c.id)} className="btn-save">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
