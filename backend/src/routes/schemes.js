import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = Router()
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

router.post('/', async (req, res) => {
  try {
    const { profile, creditResult } = req.body

    const prompt = `You are a government scheme advisor for Indian SMEs.

SME Profile:
- Sector: ${profile?.sector || 'Not specified'}
- State: ${profile?.state || 'Not specified'}
- Annual Income: ₹${profile?.annual_income || 'Not specified'}
- Years in Business: ${profile?.years_operation || 'Not specified'}
- Income Verification: ${profile?.verification || 'Not Verified'}
- Credit Grade: ${creditResult?.grade || 'Not assessed'}
- Credit Index: ${creditResult?.credit_index || 'Not assessed'}

Based on this profile, list the TOP 3 most relevant government schemes for this SME.
For each scheme mention:
1. Scheme name
2. Why it's a perfect match for this profile
3. One specific action to apply

Be specific, practical and mention schemes like MUDRA, CGTMSE, PM SVANidhi, Startup India, NSIC, SIDBI, state-specific schemes.
Keep response under 300 words. Format as plain text, no markdown.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }]
    })

    const schemes = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n')

    res.json({ schemes })
  } catch (err) {
    console.error('Schemes error:', err.message)
    res.status(500).json({ error: 'Scheme discovery failed', schemes: '' })
  }
})

export default router
