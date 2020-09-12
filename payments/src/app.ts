import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@dttickets/common'
import { createChargeRouter } from './routes/new'

// Initiate express and body parser
const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUser)

app.use(createChargeRouter)

// Catch unhandled routes
app.all('*', async (req, res) => {
  throw new NotFoundError()
})

// Global error handler
app.use(errorHandler)

export { app }
