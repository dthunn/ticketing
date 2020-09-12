import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

import { OrderStatus, ExpirationCompleteEvent } from '@dttickets/common'
import { Ticket } from '../../../models/ticket'
import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { ExpirationCompleteListener } from '../expiration-complete-listener'

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })

  await ticket.save()
  const order = Order.build({
    userId: 'asdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  })

  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { data, msg, listener, order, ticket }
}

it('updates the order status to cancelled', async () => {
  const { listener, order, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emit an OrderCancelled event', async () => {
  const { listener, order, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )

  expect(eventData.id).toEqual(order.id)
})

it('ack the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
