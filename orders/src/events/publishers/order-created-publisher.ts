import { Publisher, OrderCreatedEvent, Subjects } from '@dttickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}
