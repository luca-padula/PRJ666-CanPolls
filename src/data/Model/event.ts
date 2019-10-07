export class Event
{
    event_id: number;
    event_title: String;
    event_description: String;
    date_to: String;
    date_from: String;
    time_from: String;
    time_to: String;
    attendee_limit: number;
    location: Location;

    constructor(obj: any = null){
        if(obj != null){
            Object.assign(this, obj);
        }
    }
}