import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSpecialOfferComponent } from './new-special-offer.component';

describe('NewSpecialOfferComponent', () => {
  let component: NewSpecialOfferComponent;
  let fixture: ComponentFixture<NewSpecialOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSpecialOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSpecialOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
