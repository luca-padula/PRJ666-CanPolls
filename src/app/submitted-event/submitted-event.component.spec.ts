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
import { TestDataBuilder } from 'src/testing/test-data-builder';
import { DebugElement } from '@angular/core';

describe('SubmittedEventComponent', () => {

  // set up global variables used accross multiple tests

  let component: SubmittedEventComponent;
  let fixture: ComponentFixture<SubmittedEventComponent>;

  let authServiceSpy = jasmine.createSpyObj('AuthService', ['readToken', 'isAuthenticated']);
  let eventServiceSpy = jasmine.createSpyObj('EventService', [
    'getEventById', 'getLocationByEventId', 'getRegistration', 'getRegistrationCount',
    'getFeedbackByEventId'
  ]);
  let readTokenSpy;
  let isAuthenticatedSpy;
  let getEventSpy;
  let getLocationSpy;
  let getRegistrationSpy;
  let getRegistrationCountSpy;
  let getFeedbackSpy;

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

  let testDataBuilder = new TestDataBuilder();

  let [eventDate, eventStartTime, eventEndTime] = testDataBuilder.buildEventDate(24);
  const futureEvent: Event = {
    event_id: 1,
    event_title: "A night with benny",
    event_description: "Join us for a nice evening with the cat",
    photo: 'fhewfgewfv',
    attendee_limit: 10,
    status: 'A',
    UserUserId: '1',
    date_from: eventDate,
    time_from: eventStartTime,
    time_to: eventEndTime,
    createdAt: 'fjewfh',
    updatedAt: 'fhewgf'
  };
  const sampleLocation: Location = {
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

  [eventDate, eventStartTime, eventEndTime] = testDataBuilder.buildEventDate(-24);
  let expiredEvent: Event = {
    event_id: 1,
    event_title: "A night with benny",
    event_description: "Join us for a nice evening with the cat",
    photo: 'fhewfgewfv',
    attendee_limit: 10,
    status: 'A',
    UserUserId: '1',
    date_from: eventDate,
    time_from: eventStartTime,
    time_to: eventEndTime,
    createdAt: 'fjewfh',
    updatedAt: 'fhewgf'
  };

  // finish global test variable set up

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
    
    beforeEach(() => {

      readTokenSpy = authServiceSpy.readToken.and.returnValue({ userId: 1 });
      isAuthenticatedSpy = authServiceSpy.isAuthenticated.and.returnValue(true);
      getEventSpy = eventServiceSpy.getEventById.and.returnValue(of(futureEvent));
      getLocationSpy = eventServiceSpy.getLocationByEventId.and.returnValue(of(sampleLocation));
      getRegistrationSpy = eventServiceSpy.getRegistration.and.returnValue(of(null));
      getRegistrationCountSpy = eventServiceSpy.getRegistrationCount.and.returnValue(of(5));
      getFeedbackSpy = eventServiceSpy.getFeedbackByEventId.and.returnValue(of([]));
    });

    it('should show the event and location information', () => {
          
      fixture.detectChanges();      
      const eventTitleTag: HTMLElement = fixture.nativeElement.querySelector('.event-title');
      expect(eventTitleTag.textContent).toBe(futureEvent.event_title);
      const locationVenueTag: HTMLElement = fixture.nativeElement.querySelector('.location-venue');
      expect(locationVenueTag.textContent).toBe(sampleLocation.venue_name);
      expect(component.eventRegistrationCount).toBe(5);
      // checking if registration object is empty since comparing it to empty
      // object with toBe or toEqual does not work as expected
      expect(component.registration).toBeFalsy();     
    });

    it('should set the proper available actions for the user', () => {

      fixture.detectChanges();  
      expect(component.userCanRegister).toBe(false);
      expect(component.userCanCancel).toBe(false);
      expect(component.userCanEdit).toBe(true);

      // Debug element wraps and gives access to the platform-specific native element, allowing test
      // to work across all supported platforms. Going for the native html element directly
      // without debug element would mean the test would only work on browser platforms
      // that have a DOM, which may be fine most of the time.
      const compDe: DebugElement = fixture.debugElement;
      const compEl: HTMLElement = compDe.nativeElement;
      const editBtnEl = compEl.querySelector('#editBtn');
      expect(editBtnEl).toBeDefined();     
    })    
  });

  describe('viewing an expired event as event creator', () => {    

    beforeEach(() => {
      
      getEventSpy = eventServiceSpy.getEventById.and.returnValue( of(expiredEvent) );
    });

    it('should not let the user edit the event', () => {

      fixture.detectChanges();      
      expect(component.userCanEdit).toBe(false);
      expect(component.userCanRegister).toBe(false);
      expect(component.userCanCancel).toBe(false);   
      
      const compDe: DebugElement = fixture.debugElement;
      const compEl: HTMLElement = compDe.nativeElement;
      const editBtnEl = compEl.querySelector('#editBtn');
      expect(editBtnEl).toBeFalsy();
    });
  });

  describe('viewing future event as logged in user - not registered', () => {

    beforeEach(() => {

      readTokenSpy = authServiceSpy.readToken.and.returnValue({ userId: 2 });
      getEventSpy = eventServiceSpy.getEventById.and.returnValue(of(futureEvent));      
    });    

    it('should let the user register for the event', () => {

      fixture.detectChanges();
      expect(component.registration).toBeFalsy();      
      expect(component.userCanRegister).toBe(true, 'user cant register');
      expect(component.userCanEdit).toBe(false, 'user can edit'); 
      expect(component.userCanCancel).toBe(false, 'user can cancel');

      const compEl: HTMLElement = fixture.nativeElement;
      const regBtnEl: HTMLElement = compEl.querySelector('#registerBtn');
      expect(regBtnEl).toBeDefined();

      const editBtnEl = compEl.querySelector('#editBtn');
      expect(editBtnEl).toBeFalsy();  
    });
  });

  // TODO: more tests, make sure edit button shows, etc
});
