import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import chatRoute from './routes/chat.js'
import assessRoute from './routes/assess.js'
import schemesRoute from './routes/schemes.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', service: 'Jarvis SME Backend' }))

// Routes
app.use('/api/chat', chatRoute)
app.use('/api/assess', assessRoute)
app.use('/api/schemes', schemesRoute)

app.listen(PORT, () => console.log(`🚀 Jarvis backend running on port ${PORT}`))
