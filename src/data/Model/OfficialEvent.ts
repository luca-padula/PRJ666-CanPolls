import { EventToCreate } from './EventToCreate';
import { Political } from './Political';
import { Category } from './Category';

export class OfficialEvent
{
    event: EventToCreate;
    source: Political;
    category: Category;
}