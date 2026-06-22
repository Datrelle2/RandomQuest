import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import ChallengeCard from '../components/ChallengeCard'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'
import { getRandomActivity } from '../services/boredApi'
import { generateChallenge } from '../lib/claude'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    const { data } = await supabase
      .from('challenges')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (data) {
      setChallenge(data)
      const { data: sv } = await supabase
        .from('saved_challenges')
        .select('id')
        .eq('user_id', user.id)
        .eq('challenge_id', data.id)
        .maybeSingle()
      setIsSaved(!!sv)
    } else {
      await createChallenge()
    }
  }

  async function createChallenge() {
    setGenerating(true)
    setError('')
    try {
      const { data: cats } = await supabase
        .from('user_categories')
        .select('category')
        .eq('user_id', user.id)

      if (!cats?.length) { navigate('/categories'); return }

      const categories = cats.map(c => c.category)
      const boredActivity = await getRandomActivity(categories)
      const generated = await generateChallenge(categories, boredActivity)

      const { data: newChallenge } = await supabase
        .from('challenges')
        .insert({
          user_id: user.id,
          title: generated.title,
          description: generated.description,
          category: generated.category,
          status: 'active',
        })
        .select()
        .single()

      setChallenge(newChallenge)
      setIsSaved(false)
    } catch (err) {
      setError('Could not generate a challenge. Please try again.')
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  async function handleComplete() {
    setChallenge(null)
    await createChallenge()
  }

  async function handleNewChallenge() {
    setChallenge(null)
    await createChallenge()
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const name = profile?.full_name?.split(' ')[0]

  return (
    <Layout>
      <div className="page-header">
        <h1>{greeting}{name ? `, ${name}` : ''}!</h1>
        <p>Here's your challenge for today.</p>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {generating && (
        <div className="generating-state">
          <div className="generating-spinner">⚡</div>
          <p>Generating your challenge...</p>
        </div>
      )}

      {!generating && challenge && (
        <ChallengeCard
          challenge={challenge}
          isSaved={isSaved}
          onComplete={handleComplete}
          onSave={() => setIsSaved(true)}
          onUnsave={() => setIsSaved(false)}
          onNewChallenge={handleNewChallenge}
        />
      )}
    </Layout>
  )
}
