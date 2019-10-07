export class Location
{
	location_id:number;
	venue_name: String;
	street_name: String;
	city:String;
	province:String;
	postal_code:String;
	constructor(obj: any = null){
        if(obj != null){
            Object.assign(this, obj);
        }
    }
}