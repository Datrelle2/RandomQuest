import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { generateChallenges } from '../lib/claude'
import ChallengeCard from '../components/ChallengeCard'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const { user } = useAuth()
  const [challenges, setChallenges] = useState([])
  const [savedTexts, setSavedTexts] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => { loadCurrentBatch() }, [])

  async function loadCurrentBatch() {
    setLoading(true)

    // Find the most recent incomplete challenge to anchor the batch
    const { data: latest } = await supabase
      .from('challenge_history')
      .select('created_at')
      .eq('user_id', user.id)
      .eq('completed', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (latest) {
      // Load all incomplete challenges created within 60s of the most recent one
      const cutoff = new Date(new Date(latest.created_at).getTime() - 60000).toISOString()
      const { data } = await supabase
        .from('challenge_history')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .gte('created_at', cutoff)
        .order('created_at', { ascending: true })
      const batch = data ?? []
      setChallenges(batch)
      await checkSavedStatuses(batch)
    } else {
      await generateNewChallenges()
    }

    setLoading(false)
  }

  async function checkSavedStatuses(challengeList) {
    if (challengeList.length === 0) { setSavedTexts(new Set()); return }
    const { data } = await supabase
      .from('saved_challenges')
      .select('challenge')
      .eq('user_id', user.id)
      .in('challenge', challengeList.map(c => c.challenge))
    setSavedTexts(new Set(data?.map(r => r.challenge) ?? []))
  }

  async function generateNewChallenges() {
    setGenerating(true)
    try {
      const { data: prefData } = await supabase
        .from('user_preferences')
        .select('category')
        .eq('user_id', user.id)
      const categories = prefData?.map(r => r.category) ?? []

      if (categories.length === 0) return

      const generated = await generateChallenges(categories)

      const { data: inserted } = await supabase
        .from('challenge_history')
        .insert(generated.map(g => ({
          user_id: user.id,
          challenge: g.description || g.title,
          category: g.category,
        })))
        .select()

      setChallenges(inserted ?? [])
      setSavedTexts(new Set())
    } catch (error) {
      console.error('Error generating challenges:', error)
    } finally {
      setGenerating(false)
    }
  }

  async function handleUpdate() {
    const ids = challenges.map(c => c.id)
    if (ids.length === 0) return
    const { data } = await supabase
      .from('challenge_history')
      .select('*')
      .in('id', ids)
    const updated = data ?? []
    setChallenges(updated.filter(c => !c.completed))
    await checkSavedStatuses(updated.filter(c => !c.completed))
  }

  if (loading) return <><Navbar /><div className="loading-screen">Loading your challenges...</div></>

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="dashboard-header">
          <h1>Your Challenges</h1>
          <button
            onClick={generateNewChallenges}
            disabled={generating}
            className="btn-secondary"
          >
            {generating ? 'Generating...' : 'New Challenges'}
          </button>
        </div>
        {generating && <div className="loading-screen">Generating your challenges...</div>}
        {!generating && challenges.length === 0 && (
          <p className="empty-state">All done! Hit &ldquo;New Challenges&rdquo; to get your next set.</p>
        )}
        {!generating && challenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            isSaved={savedTexts.has(challenge.challenge)}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </>
  )
}
