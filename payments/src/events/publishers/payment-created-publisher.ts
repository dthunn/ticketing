import { Subjects, Publisher, PaymentCreatedEvent } from '@dttickets/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
