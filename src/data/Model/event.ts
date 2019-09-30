import { Location } from './location';

export class Event
{
    eventId: number;
    eventTitle: String;
    eventDescription: String;
    eventDate: Date;
    attendeeLimit: number;
    location: Location;
}