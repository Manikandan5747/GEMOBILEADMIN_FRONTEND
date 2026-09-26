import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialOfferRegistrationComponent } from './special-offer-registration.component';

describe('SpecialOfferRegistrationComponent', () => {
  let component: SpecialOfferRegistrationComponent;
  let fixture: ComponentFixture<SpecialOfferRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialOfferRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialOfferRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
