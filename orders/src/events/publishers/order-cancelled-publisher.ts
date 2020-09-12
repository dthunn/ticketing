import { Publisher, OrderCancelledEvent, Subjects } from '@dttickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
