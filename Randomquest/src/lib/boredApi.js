import axios from 'axios'

const BASE_URL = 'https://www.boredapi.com/api/activity'

export const fetchRandomActivity = async (categories = []) => {
  try {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const url = category ? `${BASE_URL}?type=${category}` : BASE_URL
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching activity:', error)
    return null
  }
}