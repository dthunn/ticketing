import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signupRouter } from './routes/signup'
import { signoutRouter } from './routes/signout'
import { errorHandler, NotFoundError } from '@dttickets/common'

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

// Routes
app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

// Catch unhandled routes
app.all('*', async (req, res) => {
  throw new NotFoundError()
})

// Global error handler
app.use(errorHandler)

export { app }
