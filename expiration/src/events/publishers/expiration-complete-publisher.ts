import { Subjects, Publisher, ExpirationCompleteEvent } from '@dttickets/common'

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete
}
