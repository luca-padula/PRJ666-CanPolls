import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialeventComponent } from './officialevent.component';

describe('OfficialeventComponent', () => {
  let component: OfficialeventComponent;
  let fixture: ComponentFixture<OfficialeventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficialeventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficialeventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
