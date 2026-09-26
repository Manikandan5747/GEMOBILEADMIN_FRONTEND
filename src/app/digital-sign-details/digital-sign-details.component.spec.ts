import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSignDetailsComponent } from './digital-sign-details.component';

describe('DigitalSignDetailsComponent', () => {
  let component: DigitalSignDetailsComponent;
  let fixture: ComponentFixture<DigitalSignDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalSignDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalSignDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
