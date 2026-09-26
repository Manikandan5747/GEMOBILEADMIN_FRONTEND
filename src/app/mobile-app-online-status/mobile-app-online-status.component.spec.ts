import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAppOnlineStatusComponent } from './mobile-app-online-status.component';

describe('MobileAppOnlineStatusComponent', () => {
  let component: MobileAppOnlineStatusComponent;
  let fixture: ComponentFixture<MobileAppOnlineStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileAppOnlineStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAppOnlineStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
