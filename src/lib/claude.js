import axios from 'axios'

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

const FALLBACKS = {
  household: { title: 'Deep Clean One Room', description: 'Pick any room and give it a thorough cleaning. Move furniture, dust every surface, and reorganize everything inside it. Leave it completely transformed.', category: 'Household Tasks' },
  physical: { title: 'Complete a 30-Minute Bodyweight Workout', description: 'Push through 30 minutes of exercise with no equipment — alternate between cardio bursts and strength moves. Track your reps so you have something to beat next time.', category: 'Physical Activity' },
  gaming: { title: 'Conquer That Challenge You\'ve Been Avoiding', description: 'Boot up a game and tackle the level, boss, or puzzle you\'ve been skipping. Commit to not closing the game until you push through it.', category: 'Gaming' },
  creativity: { title: 'Make Something From Scratch in 60 Minutes', description: 'Set a timer for one hour and create something — a drawing, short story, song, or craft. Don\'t aim for perfect. Start, build, finish.', category: 'Creativity' },
  learning: { title: 'Master One New Concept Today', description: 'Pick a topic you\'ve been curious about and spend 45 focused minutes on it. Read, watch, or listen — then write a 3-sentence summary of what you learned in your own words.', category: 'Brain & Learning' },
  cooking: { title: 'Cook a Meal Entirely From Scratch', description: 'Choose a recipe you\'ve never tried and make it from raw ingredients only — no shortcuts or premade sauces. Follow the full process and enjoy the result.', category: 'Cooking' },
  outdoor: { title: 'Explore a Route You\'ve Never Taken', description: 'Head outside and walk a path or area you\'ve never explored before. Stay out for at least 30 minutes and pay attention to things you\'d normally rush past.', category: 'Outdoor Activities' },
  social: { title: 'Reconnect With Someone You\'ve Been Meaning To', description: 'Think of someone you haven\'t reached out to in too long. Send a real message, make a call, or make concrete plans. Don\'t just like their post — actually connect.', category: 'Social' },
}

export async function generateChallenge(categories, boredActivity = null) {
  if (API_KEY) {
    try {
      return await callClaude(categories, boredActivity)
    } catch (err) {
      console.warn('Claude API error, using fallback:', err.message)
    }
  }
  const catId = categories[Math.floor(Math.random() * categories.length)]
  return FALLBACKS[catId] || FALLBACKS.physical
}

async function callClaude(categories, boredActivity) {
  const inspiration = boredActivity ? `\nSeed activity for inspiration: "${boredActivity.activity}"` : ''
  const prompt = `Generate one specific, engaging challenge for someone interested in: ${categories.join(', ')}.${inspiration}

Rules: completable in 1-3 hours, has a clear finish condition, written in a motivating tone.

Respond ONLY with valid JSON and nothing else:
{"title":"5-8 word catchy title","description":"2-3 sentences: what to do and why it's rewarding.","category":"most relevant category from the interest list"}`

  const { data } = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 250,
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
    }
  )

  return JSON.parse(data.content[0].text.trim())
}
