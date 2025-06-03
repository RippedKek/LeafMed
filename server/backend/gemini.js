import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const generateAIResponse = async (prompt, retryCount = 0) => {
  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    if (error.message.includes('503') && retryCount < MAX_RETRIES) {
      console.log(`Retry attempt ${retryCount + 1} of ${MAX_RETRIES}`)
      await sleep(RETRY_DELAY * (retryCount + 1))
      return generateAIResponse(prompt, retryCount + 1)
    }
    throw error
  }
}

export { generateAIResponse }
