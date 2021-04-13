import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Event } from 'src/data/Model/Event';
import { AuthService } from 'src/data/services/auth.service';
import { EventService } from 'src/data/services/event.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SubmittedEventComponent } from './submitted-event.component';

describe('SubmittedEventComponent', () => {
  let component: SubmittedEventComponent;
  let fixture: ComponentFixture<SubmittedEventComponent>;
  let authServiceSpy = jasmine.createSpyObj('AuthService', ['readToken', 'isAuthenticated']);
  let eventServiceSpy = jasmine.createSpyObj('EventService', ['getEventById']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmittedEventComponent ],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [ 
        { provide: AuthService, useValue: authServiceSpy},
        { provide: EventService, useValue: eventServiceSpy}
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

  describe('event testing', () => {
    let sampleEvent: Event = {
      event_id: 1,
      event_title: "A night with benny",
      event_description: "Join us for a nice evening with the cat",
      photo: 'fhewfgewfv',
      attendee_limit: 10,
      status: 'A',
      UserUserId: '1',
      date_from: '04/15/2021',
      time_from: '09:00',
      time_to: '11:00',
      createdAt: 'fjewfh',
      updatedAt: 'fhewgf'
    };
    it('should render an event', () => {
      
      let readTokenSpy = authServiceSpy.readToken.and.returnValue({ userId: 1 });
      let isAuthenticatedSpy = authServiceSpy.isAuthenticated.and.returnValue(true);
      let getEventSpy = eventServiceSpy.getEventById.and.returnValue( of(sampleEvent) )
      fixture.detectChanges();
      const eventTitleTag: HTMLElement = fixture.nativeElement.querySelector('.event-title');
      expect(eventTitleTag.textContent).toBe('A night with benny');
    })
  })
});
