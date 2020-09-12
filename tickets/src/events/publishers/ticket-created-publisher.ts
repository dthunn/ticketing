import { Publisher, Subjects, TicketCreatedEvent } from '@dttickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
