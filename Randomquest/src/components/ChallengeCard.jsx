import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// challenge: row from challenge_history { id, user_id, challenge, category, completed }
// isSaved: whether this challenge text exists in saved_challenges
export default function ChallengeCard({ challenge, isSaved, onUpdate }) {
  const { user, profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)

  async function markComplete() {
    if (challenge.completed || loading) return
    setLoading(true)

    await supabase
      .from('challenge_history')
      .update({ completed: true })
      .eq('id', challenge.id)

    // increment points with read-then-write
    const currentPoints = profile?.points ?? 0
    await supabase
      .from('profiles')
      .update({ points: currentPoints + 10 })
      .eq('id', user.id)

    await refreshProfile()
    onUpdate?.()
    setLoading(false)
  }

  async function toggleSave() {
    if (loading) return
    setLoading(true)

    if (isSaved) {
      await supabase
        .from('saved_challenges')
        .delete()
        .eq('user_id', user.id)
        .eq('challenge', challenge.challenge)
    } else {
      await supabase.from('saved_challenges').insert({
        user_id: user.id,
        challenge: challenge.challenge,
        category: challenge.category,
      })
    }

    onUpdate?.()
    setLoading(false)
  }

  return (
    <div className={`challenge-card ${challenge.completed ? 'completed' : ''}`}>
      <div className="challenge-category">{challenge.category}</div>
      <p className="challenge-description">{challenge.challenge}</p>
      <div className="challenge-actions">
        <button
          onClick={markComplete}
          disabled={challenge.completed || loading}
          className="btn-complete"
        >
          {challenge.completed ? 'Completed ✓' : 'Mark Complete'}
        </button>
        <button onClick={toggleSave} disabled={loading} className="btn-save">
          {isSaved ? 'Unsave' : 'Save'}
        </button>
      </div>
    </div>
  )
}
