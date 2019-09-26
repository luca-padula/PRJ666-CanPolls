import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EventComponent } from './event/event.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { ContentComponent } from './content/content.component';
import { FooterComponent } from './footer/footer.component';
import { SubmittedEventComponent } from './submitted-event/submitted-event.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    LoginComponent,
    RegisterComponent,
    EventComponent,
    PageNotFoundComponent,
    NavComponent,
    HomeComponent,
    ContentComponent,
    FooterComponent,
    SubmittedEventComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
