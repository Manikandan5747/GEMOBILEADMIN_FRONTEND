import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePaymentFormComponent } from './advance-payment-form.component';

describe('AdvancePaymentFormComponent', () => {
  let component: AdvancePaymentFormComponent;
  let fixture: ComponentFixture<AdvancePaymentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancePaymentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancePaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
