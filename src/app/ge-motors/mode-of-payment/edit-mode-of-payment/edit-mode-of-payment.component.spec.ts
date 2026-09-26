import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModeOfPaymentComponent } from './edit-mode-of-payment.component';

describe('EditModeOfPaymentComponent', () => {
  let component: EditModeOfPaymentComponent;
  let fixture: ComponentFixture<EditModeOfPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditModeOfPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModeOfPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
