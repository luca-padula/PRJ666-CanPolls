import { Event } from './Event';
import { Political } from './Political';
import { Category } from './Category';

export class OfficialEvent
{
    event: Event;
    source: Political;
    category: Category;
}