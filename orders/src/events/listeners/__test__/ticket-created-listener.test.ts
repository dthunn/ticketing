import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { TicketCreatedEvent } from '@dttickets/common'

import { Ticket } from '../../../models/ticket'
import { TicketCreatedListener } from '../ticket-created-listener'
import { natsWrapper } from '../../../nats-wrapper'

const setup = async () => {
  // create an instance of a listener
  const listener = new TicketCreatedListener(natsWrapper.client)

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
  const { listener, msg, data } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
})

it('acks the message', async () => {
  const { data, listener, msg } = await setup()
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // write assertions to make sure ack is called
  expect(msg.ack).toHaveBeenCalled()
})