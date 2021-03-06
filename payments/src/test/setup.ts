import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
// import request from 'supertest'
// import { app } from '../app'
import jwt from 'jsonwebtoken'

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[]
    }
  }
}

jest.setTimeout(30000)

let mongo: any

jest.mock('../nats-wrapper')

process.env.STRIPE_KEY =
  'sk_test_51HQEJMBQszSNQ9z1QyQ1p0BZcsLc2MdhZFQwG2OmyaU8NIwzVJt0jK4uB6THRaFkD1fpKUDagFQm3qOzJ4hSK785000WIEjHEW'

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf'

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async () => {
  jest.clearAllMocks()

  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signin = (id?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  }

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build session Object
  const session = { jwt: token }

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`]
}
