import { generateAIResponse } from '../gemini.js'
import herbs from '../utils.js'

function formatResponse(text) {
  if (text.includes('Only symptoms are allowed')) {
    return { disease: 'Only symptoms are allowed', ingredients: [] }
  }
  const response = text.split('\n')
  const disease = response[0]

  // Extract ingredients and their instructions
  const ingredients = []
  for (let i = 1; i < response.length; i++) {
    const line = response[i].trim()
    if (line) {
      const match = line.match(/^- (.+): (.+)$/)
      if (match) {
        ingredients.push({
          name: match[1].trim(),
          usage: match[2].trim(),
        })
      }
    }
  }

  return { disease, ingredients }
}

export const processChat = async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({
        error: 'Message is required',
        userMessage: 'Please provide a message to continue.',
      })
    }

    const prompt = `
    The following prompt will give you disease symptoms which you need to predict. After that, give a list of herbal ingredients that will remedy it, along with a very brief instruction on how to use each ingredient. The ingredients name should be how they are familiar in the indian subcontinent. Like neem, tulsi, etc. If the prompt is about something else other than symptoms, reply with "Only symptoms are allowed". You need to suggest herbs from this list: ${herbs}

    Output format:
    {Most probable disease}
    - {Ingredient 1}: {Brief usage instruction}
    - {Ingredient 2}: {Brief usage instruction}
    - {Ingredient 3}: {Brief usage instruction}

    If prompt is not a symptom:
    "Only symptoms are allowed"

    Example Prompt 1: 
    headache, runny nose
    Output:
    Common Cold
    - Ginger: Make tea with crushed ginger and honey
    - Tulsi: Chew 4-5 fresh leaves daily
    - Pepper: Add to warm water with honey

    Example Prompt 2:
    hello I am elon musk
    Output: 
    Only symptoms are allowed

    Prompt: ${message}`

    const text = await generateAIResponse(prompt)
    const { disease, ingredients } = formatResponse(text)

    res.json({ disease, ingredients })
  } catch (error) {
    console.error('Error:', error)

    let userMessage = 'An unexpected error occurred. Please try again later.'
    if (error.message.includes('503')) {
      userMessage =
        'The AI service is currently experiencing high load. Please try again in a few moments.'
    }

    res.status(503).json({
      error: error.message,
      userMessage,
    })
  }
}
