import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditModeOfPaymentFormComponent } from './add-edit-mode-of-payment-form.component';

describe('AddEditModeOfPaymentFormComponent', () => {
  let component: AddEditModeOfPaymentFormComponent;
  let fixture: ComponentFixture<AddEditModeOfPaymentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditModeOfPaymentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditModeOfPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
