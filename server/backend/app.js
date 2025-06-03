import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import chatRoutes from './routes/chatRoutes.js'
import healthRoutes from './routes/healthRoutes.js'
import infoRoutes from './routes/infoRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 8000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/chat', chatRoutes)
app.use('/health', healthRoutes)
app.use('/info', infoRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
