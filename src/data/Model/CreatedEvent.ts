import { EventToCreate } from './EventToCreate';
import { User } from './User';
import { Feedback } from './Feedback';
import { Admin } from './Admin';

export class CreatedEvent
{
    event: EventToCreate;
    creator: User;
    registeredUsers: User[];
    feedbackId: Feedback;
    status: String;
    approvedByAdmin: Admin;
}