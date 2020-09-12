import { Publisher, Subjects, TicketUpdatedEvent } from '@dttickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
