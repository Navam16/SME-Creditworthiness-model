import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = Router()
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

router.post('/', async (req, res) => {
  try {
    const { messages, system } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' })
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: system || `You are Jarvis, an expert AI assistant for Indian SMEs.
You help with credit scores, loan documentation, and government schemes.
Be concise, practical, and friendly. Support Hinglish if the user writes in it.
Always end with one actionable next step.`,
      messages: messages.slice(-10), // keep last 10 for context
    })

    const reply = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n')

    res.json({ reply })
  } catch (err) {
    console.error('Chat error:', err.message)
    res.status(500).json({ error: 'AI service error', reply: 'Sorry, I am having trouble connecting. Please try again in a moment.' })
  }
})

export default router
