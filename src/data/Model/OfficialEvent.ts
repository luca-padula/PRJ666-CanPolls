import { Event } from './event';
import { Political } from './Political';
import { Category } from './Category';

export class OfficialEvent
{
    event: Event;
    source: Political;
    category: Category;
}