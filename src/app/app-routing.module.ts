import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home.component';
import {EventComponent} from './event/event.component';
import {SubmittedEventComponent} from './submitted-event/submitted-event.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'events', component: EventComponent},
  {path: 'createEvent', component: SubmittedEventComponent},
  {path: "", redirectTo:'/home', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
