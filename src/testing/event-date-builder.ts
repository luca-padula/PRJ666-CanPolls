export class EventDateBuilder {

    constructor() { }
    
    // Helper function to generate event date, start time, and end time.
    // Parameter is used to generate the event for a certain amount of time
    // in the future or past i.e. supply a positive value for the future, negative
    // value for the past
    buildEventDate(hoursOffset: number): string[] {
        
        let date = new Date();
        date.setHours(date.getHours() + hoursOffset);
        let eventDate = date.toISOString().slice(0, 10);
        let hour = date.getHours();
        let eventStartTime = hour + ':00';
        let eventEndTime = (hour + 2) + ':00';        
        return [eventDate, eventStartTime, eventEndTime];
    }
}