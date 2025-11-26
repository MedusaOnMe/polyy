import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin for AI analysis endpoint in dev
function aiAnalysisPlugin() {
  return {
    name: 'ai-analysis',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/ai-analysis' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              const { question, currentPrice } = JSON.parse(body)
              const apiKey = process.env.OPENAI_API_KEY

              if (!apiKey) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: 'OpenAI API key not configured' }))
                return
              }

              const response = await fetch('https://api.openai.com/v1/responses', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'gpt-4o',
                  tools: [{ type: 'web_search' }],
                  input: `You are a prediction market analyst. Research and analyze this prediction market question:

"${question}"

Current market price: ${(currentPrice * 100).toFixed(1)}% probability

Search for the latest news and information about this topic. Then provide:
1. A brief summary of recent relevant news/developments (2-3 sentences)
2. Your probability assessment based on the research (as a percentage)
3. Whether the current market price seems fair, overvalued, or undervalued
4. A confidence level (low/medium/high) for your analysis

Keep the response concise and actionable for traders. Format with clear sections.`,
                }),
              })

              if (!response.ok) {
                const error = await response.text()
                console.error('OpenAI API error:', error)
                res.statusCode = 500
                res.end(JSON.stringify({ error: 'Failed to get AI analysis' }))
                return
              }

              const data = await response.json()
              const output = data.output || []
              const textOutput = output.find(o => o.type === 'message')
              const content = textOutput?.content?.[0]?.text || 'Unable to generate analysis'

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ analysis: content }))
            } catch (error) {
              console.error('AI Analysis error:', error)
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Failed to generate analysis' }))
            }
          })
          return
        }
        next()
      })
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.OPENAI_API_KEY = env.OPENAI_API_KEY

  return {
    plugins: [react(), aiAnalysisPlugin()],
    server: {
      proxy: {
        '/gamma-api': {
          target: 'https://gamma-api.polymarket.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/gamma-api/, ''),
        },
        '/clob-api': {
          target: 'https://clob.polymarket.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/clob-api/, ''),
        },
      },
    },
  }
})
