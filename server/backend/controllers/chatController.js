import { generateAIResponse } from '../gemini.js'
import herbs from '../utils.js'

function formatResponse(text) {
  if (text.includes('Only symptoms are allowed')) {
    return { disease: 'Only symptoms are allowed', ingredientsArray: [] }
  }
  const response = text.split('\n')
  const disease = response[0]
  let ingredients = response[1]
  ingredients = ingredients.replace('[', '').replace(']', '')
  const ingredientsArray = ingredients.split(',').map((item) => item.trim())
  return { disease, ingredientsArray }
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
    The following prompt will give you disease symptoms which you need to predict. After that, give a list of herbal ingredients that will remedy it. The ingredients name should be how they are familiar in the indian subcontinent. Like neem, tulsi, etc. If the prompt is about something else other than symptoms, reply with "Only symptoms are allowed". You need to suggest herbs from this list: ${herbs}

    Output format:
    {Most probable disease}
    [Ingredient 1,Ingredient 2,Ingridient 3]

    If prompt is not a symptom:
    "Only symptoms are allowed"

    Example Prompt 1: 
    headache, runny nose
    Output:
    Common Cold
    [Ginger, Garlic, Honey]

    Example Prompt 2:
    hello I am elon musk
    Output: 
    Only symptoms are allowed

    Prompt: ${message}`

    const text = await generateAIResponse(prompt)
    const { disease, ingredientsArray } = formatResponse(text)

    res.json({ disease, ingredientsArray })
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
