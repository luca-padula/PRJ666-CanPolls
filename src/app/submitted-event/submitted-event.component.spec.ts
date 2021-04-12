import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/data/services/auth.service';

import { SubmittedEventComponent } from './submitted-event.component';

describe('SubmittedEventComponent', () => {
  let component: SubmittedEventComponent;
  let fixture: ComponentFixture<SubmittedEventComponent>;
  let authServiceSpy = jasmine.createSpyObj('AuthService', ['readToken', 'isAuthenticated']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmittedEventComponent ],
      imports: [ FormsModule ],
      providers: [ { provide: AuthService, useValue: authServiceSpy} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittedEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
