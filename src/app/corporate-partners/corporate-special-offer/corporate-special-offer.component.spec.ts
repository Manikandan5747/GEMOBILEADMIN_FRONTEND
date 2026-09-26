import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateSpecialOfferComponent } from './corporate-special-offer.component';

describe('CorporateSpecialOfferComponent', () => {
  let component: CorporateSpecialOfferComponent;
  let fixture: ComponentFixture<CorporateSpecialOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateSpecialOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateSpecialOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
