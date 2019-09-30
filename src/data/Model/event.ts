import { Location } from './location';

export class Event
{
    eventId: number;
    eventDescription: String;
    eventDate: Date;
    attendeeLimit: number;
    location: Location;
}