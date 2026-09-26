import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSpecialOfferFormComponent } from './add-edit-special-offer-form.component';

describe('AddEditSpecialOfferFormComponent', () => {
  let component: AddEditSpecialOfferFormComponent;
  let fixture: ComponentFixture<AddEditSpecialOfferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSpecialOfferFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSpecialOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
