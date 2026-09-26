import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianNotificationComponent } from './technician-notification.component';

describe('TechnicianNotificationComponent', () => {
  let component: TechnicianNotificationComponent;
  let fixture: ComponentFixture<TechnicianNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicianNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicianNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
