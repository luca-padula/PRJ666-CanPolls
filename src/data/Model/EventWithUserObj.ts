import { User } from 'src/data/Model/User';
import {Location} from 'src/data/Model/Location';
export class EventWithUserObj
{
    event_id: number;
    event_title: string;
    event_description: string;
    photo: string;
   // date_to: string;
    date_from: string;
    time_from: string;
    time_to: string;
    attendee_limit: number;
    isApproved: string;
    UserUserId: string;
    createdAt: string;
    updatedAt: string;
    User: User;
    Location: Location;
}