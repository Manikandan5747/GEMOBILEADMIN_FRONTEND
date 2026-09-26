import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCorporateSpecialOfferComponent } from './add-corporate-special-offer.component';

describe('AddCorporateSpecialOfferComponent', () => {
  let component: AddCorporateSpecialOfferComponent;
  let fixture: ComponentFixture<AddCorporateSpecialOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCorporateSpecialOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCorporateSpecialOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
