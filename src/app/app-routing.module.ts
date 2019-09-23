import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EventComponent} from './event/event.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
const routes: Routes = [
  {path: 'events', component: EventComponent},
  {path: '**', component: PageNotFoundComponent},
  {path: "", redirectTo:'/home', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
