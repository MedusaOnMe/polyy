import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Proxy /api/gamma to Polymarket Gamma API
app.use('/api/gamma', createProxyMiddleware({
  target: 'https://gamma-api.polymarket.com',
  changeOrigin: true,
  pathRewrite: { '^/api/gamma': '' },
}))

// Proxy /api/clob to Polymarket CLOB API
app.use('/api/clob', createProxyMiddleware({
  target: 'https://clob.polymarket.com',
  changeOrigin: true,
  pathRewrite: { '^/api/clob': '' },
}))

// OpenAI AI Analysis endpoint with web search
app.post('/api/ai-analysis', async (req, res) => {
  const { question, currentPrice } = req.body

  if (!question) {
    return res.status(400).json({ error: 'Question is required' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' })
  }

  try {
    // Use OpenAI Responses API with web search
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        tools: [{ type: 'web_search' }],
        input: `Analyze this prediction market: "${question}"
Current price: ${(currentPrice * 100).toFixed(1)}%

Search for latest news. Respond in this EXACT format only (no links, no markdown, no extra text):

NEWS: [1-2 sentences on recent developments]
AI ESTIMATE: [X]%
VERDICT: [Undervalued/Fair/Overvalued]
CONFIDENCE: [Low/Medium/High]`,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      return res.status(500).json({ error: 'Failed to get AI analysis' })
    }

    const data = await response.json()

    // Extract the text output from the response
    const output = data.output || []
    const textOutput = output.find(o => o.type === 'message')
    const content = textOutput?.content?.[0]?.text || 'Unable to generate analysis'

    res.json({ analysis: content })
  } catch (error) {
    console.error('AI Analysis error:', error)
    res.status(500).json({ error: 'Failed to generate analysis' })
  }
})

// Serve static files from dist
app.use(express.static(join(__dirname, 'dist')))

// SPA fallback - serve index.html for all other routes
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
