import { generateAIResponse } from '../gemini.js'

const cleanResponse = (response) => {
  return response.replace(/```json\n?|\n?```/g, '').trim()
}

const getInfo = async (req, res) => {
  try {
    const { herb } = req.body

    if (!herb) {
      return res.status(400).json({
        error: 'Herb name is required',
        userMessage: 'Please provide a herb name.',
      })
    }

    const prompt = `
    I am a herbalist. I am given a herb and I need to provide information about it.
    The herb is: ${herb}
    Please provide information about the herb in a JSON format with the following structure:
    {
      "scientificName": "Scientific name of the herb (only the most common name if there are multiple)",
      "description": "Brief description of the herb",
      "uses": "Common medicinal uses",
      "properties": "Medicinal properties",
      "precautions": "Any precautions or side effects"
    }
    Return ONLY the JSON, no additional text.
    `

    const rawInfo = await generateAIResponse(prompt)
    const cleanedInfo = cleanResponse(rawInfo)

    try {
      const parsedInfo = JSON.parse(cleanedInfo)
      res.status(200).json({
        info: parsedInfo,
      })
    } catch (parseError) {
      console.error('Failed to parse AI response:', rawInfo)
      res.status(500).json({
        error: 'Invalid response format',
        userMessage: 'Failed to process herb information. Please try again.',
      })
    }
  } catch (err) {
    console.error('Error in getInfo:', err)
    res.status(500).json({
      error: err.message,
      userMessage: 'An unexpected error occurred. Please try again later.',
    })
  }
}

export default getInfo
