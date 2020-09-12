import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@dttickets/common'
import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { indexTicketRouter } from './routes/index'
import { updateTicketRouter } from './routes/update'

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

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

// Catch unhandled routes
app.all('*', async (req, res) => {
  throw new NotFoundError()
})

// Global error handler
app.use(errorHandler)

export { app }
