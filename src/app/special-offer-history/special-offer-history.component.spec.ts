import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialOfferHistoryComponent } from './special-offer-history.component';

describe('SpecialOfferHistoryComponent', () => {
  let component: SpecialOfferHistoryComponent;
  let fixture: ComponentFixture<SpecialOfferHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialOfferHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialOfferHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
