import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSpecialOfferComponent } from './add-new-special-offer.component';

describe('AddNewSpecialOfferComponent', () => {
  let component: AddNewSpecialOfferComponent;
  let fixture: ComponentFixture<AddNewSpecialOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewSpecialOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewSpecialOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
