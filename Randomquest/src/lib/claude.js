export const generateChallenges = async (categories) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Generate exactly one very specific, concrete challenge for EACH of these categories: ${categories.join(', ')}.

Examples of great challenges:
- Physical Activity → "Run a full mile outside without stopping"
- Cooking → "Make a meal from scratch using only what's already in your kitchen"
- Gaming → "Play a game genre you've never tried before for 30 minutes"
- Creativity → "Draw a portrait of someone you know from memory"
- Brain & Learning → "Watch a 20-minute documentary on a topic you know nothing about"

Return ONLY a valid JSON array with exactly ${categories.length} objects. Each object must have:
- "title": short action phrase, 3-6 words
- "description": 1-2 specific actionable sentences
- "category": the exact category name from the list above

No markdown, no code fences, no extra text.`
        }]
      })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'API error')
    return JSON.parse(data.content[0].text)
  } catch (error) {
    console.error('Error generating challenges:', error)
    return categories.map(cat => ({
      title: `${cat} Challenge`,
      description: `Do something fun and specific related to ${cat} today!`,
      category: cat,
    }))
  }
}
