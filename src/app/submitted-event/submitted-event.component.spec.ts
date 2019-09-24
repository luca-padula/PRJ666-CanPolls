import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedEventComponent } from './submitted-event.component';

describe('SubmittedEventComponent', () => {
  let component: SubmittedEventComponent;
  let fixture: ComponentFixture<SubmittedEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmittedEventComponent ]
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
