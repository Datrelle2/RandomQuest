import { useState } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'
import { CATEGORIES, POINTS_PER_CHALLENGE } from '../lib/constants'

export default function ChallengeCard({ challenge, isSaved, onComplete, onSave, onUnsave, onNewChallenge }) {
  const { user, profile, refreshProfile } = useAuth()
  const [busy, setBusy] = useState(null)

  const cat = CATEGORIES.find(
    c => c.id === challenge.category?.toLowerCase() ||
         c.label.toLowerCase() === challenge.category?.toLowerCase()
  )

  async function handleComplete() {
    setBusy('complete')
    await supabase.from('challenges').update({ status: 'completed' }).eq('id', challenge.id)
    await supabase.from('profiles').update({ points: (profile?.points || 0) + POINTS_PER_CHALLENGE }).eq('id', user.id)
    await refreshProfile()
    setBusy(null)
    onComplete?.()
  }

  async function handleSave() {
    setBusy('save')
    if (isSaved) {
      await supabase.from('saved_challenges').delete().eq('user_id', user.id).eq('challenge_id', challenge.id)
      onUnsave?.()
    } else {
      await supabase.from('saved_challenges').insert({ user_id: user.id, challenge_id: challenge.id })
      onSave?.()
    }
    setBusy(null)
  }

  async function handleNew() {
    setBusy('new')
    await supabase.from('challenges').update({ status: 'skipped' }).eq('id', challenge.id)
    setBusy(null)
    onNewChallenge?.()
  }

  return (
    <div className="challenge-card">
      <div className="challenge-category">
        {cat?.icon || '🎯'} {challenge.category || 'General'}
      </div>
      <h2 className="challenge-title">{challenge.title}</h2>
      <p className="challenge-description">{challenge.description}</p>
      <div className="challenge-actions">
        <button className="btn btn-success" onClick={handleComplete} disabled={!!busy}>
          {busy === 'complete' ? '...' : '✓ Complete (+10 pts)'}
        </button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={!!busy}>
          {busy === 'save' ? '...' : isSaved ? '🔖 Saved' : '🔖 Save'}
        </button>
        <button className="btn btn-secondary" onClick={handleNew} disabled={!!busy}>
          {busy === 'new' ? '...' : '🔀 New Challenge'}
        </button>
      </div>
    </div>
  )
}
