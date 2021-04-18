import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Event } from 'src/data/Model/Event';
import { AuthService } from 'src/data/services/auth.service';
import { EventService } from 'src/data/services/event.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SubmittedEventComponent } from './submitted-event.component';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EditEventComponent } from '../edit-event/edit-event.component';
import { MatDialog } from '@angular/material';
import { Location } from 'src/data/Model/Location';
import { EventRegistration } from 'src/data/Model/EventRegistration';
import { EventDateBuilder } from 'src/testing/event-date-builder';

describe('SubmittedEventComponent', () => {
  let component: SubmittedEventComponent;
  let fixture: ComponentFixture<SubmittedEventComponent>;
  let authServiceSpy = jasmine.createSpyObj('AuthService', ['readToken', 'isAuthenticated']);
  let eventServiceSpy = jasmine.createSpyObj('EventService', [
    'getEventById', 'getLocationByEventId', 'getRegistration', 'getRegistrationCount',
    'getFeedbackByEventId'
  ]);
  let activatedRouteStub = {
    params: of( { id: 1 } )
  };
  class MatDialogMock {
    // When the component calls this.dialog.open(...) we'll return an object
    // with an afterClosed method that allows to subscribe to the dialog result observable.
    open() {
      return {
        afterClosed: () => of([])
      };
    }
  };
  let eventDateBuilder = new EventDateBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubmittedEventComponent,
        EditEventComponent
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'event/:id/edit', component: EditEventComponent },
        ])
      ],
      providers: [ 
        { provide: AuthService, useValue: authServiceSpy},
        { provide: EventService, useValue: eventServiceSpy},
        { provide: ActivatedRoute, useValue: activatedRouteStub},
        { provide: MatDialog, useClass: MatDialogMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittedEventComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Viewing a non-expired event while logged in as the event owner', () => {
    
    let dateAndTimes = eventDateBuilder.buildEventDate(24);
    let sampleEvent: Event = {
      event_id: 1,
      event_title: "A night with benny",
      event_description: "Join us for a nice evening with the cat",
      photo: 'fhewfgewfv',
      attendee_limit: 10,
      status: 'A',
      UserUserId: '1',
      date_from: dateAndTimes[0],
      time_from: dateAndTimes[1],
      time_to: dateAndTimes[2],
      createdAt: 'fjewfh',
      updatedAt: 'fhewgf'
    };
    let sampleLocation: Location = {
      location_id: '1',
      venue_name: 'Metro Convention Center',
      street_name: '230 Front Street W',
      city: 'Toronto',
      province: 'Ontario',
      postal_code: 'M4X 5LV',
      createdAt: 'sample',
      updatedAt: 'sample',
      EventEventId: '1'
    };
    let readTokenSpy = authServiceSpy.readToken.and.returnValue({ userId: 1 });
    let isAuthenticatedSpy = authServiceSpy.isAuthenticated.and.returnValue(true);
    let getEventSpy = eventServiceSpy.getEventById.and.returnValue( of(sampleEvent) );
    let getLocationSpy = eventServiceSpy.getLocationByEventId.and.returnValue( of(sampleLocation) );
    let getRegistrationSpy = eventServiceSpy.getRegistration.and.returnValue( of({}) );
    let getRegistrationCountSpy = eventServiceSpy.getRegistrationCount.and.returnValue( of(5) );
    let getFeedbackSpy = eventServiceSpy.getFeedbackByEventId.and.returnValue( of([]) );

    it('should show the event and location information', () => {
            
      fixture.detectChanges();      
      const eventTitleTag: HTMLElement = fixture.nativeElement.querySelector('.event-title');
      expect(eventTitleTag.textContent).toBe(sampleEvent.event_title);
      const locationVenueTag: HTMLElement = fixture.nativeElement.querySelector('.location-venue');
      expect(locationVenueTag.textContent).toBe(sampleLocation.venue_name);
      expect(component.eventRegistrationCount).toBe(5);
      // checking if registration object is empty since comparing it to empty
      // object with toBe or toEqual does not work as expected
      expect(component.registration.UserUserId).toBeFalsy();     
    });

    it('should set the proper available actions for the user', () => {

      fixture.detectChanges();  
      expect(component.userCanRegister).toBe(false);
      expect(component.userCanCancel).toBe(false);
      expect(component.userCanEdit).toBe(true);      
    })

    // TODO: more tests, make sure edit button shows, etc
  });
});
