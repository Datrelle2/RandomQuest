import axios from 'axios'

const TYPE_MAP = {
  household: 'diy',
  physical: 'recreational',
  gaming: 'recreational',
  creativity: 'music',
  learning: 'education',
  cooking: 'cooking',
  outdoor: 'recreational',
  social: 'social',
}

export async function getRandomActivity(categories = []) {
  try {
    const type = categories.length > 0
      ? TYPE_MAP[categories[Math.floor(Math.random() * categories.length)]]
      : null

    const url = type
      ? `https://bored-api.appbrewery.com/filter?type=${type}`
      : 'https://bored-api.appbrewery.com/random'

    const { data } = await axios.get(url, { timeout: 5000 })
    return Array.isArray(data) ? data[Math.floor(Math.random() * data.length)] : data
  } catch {
    return null
  }
}
