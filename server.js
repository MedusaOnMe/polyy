import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

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

// Serve static files from dist
app.use(express.static(join(__dirname, 'dist')))

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
