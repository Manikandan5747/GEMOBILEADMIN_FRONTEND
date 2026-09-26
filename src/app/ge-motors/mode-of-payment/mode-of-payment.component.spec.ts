import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeOfPaymentComponent } from './mode-of-payment.component';

describe('ModeOfPaymentComponent', () => {
  let component: ModeOfPaymentComponent;
  let fixture: ComponentFixture<ModeOfPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeOfPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeOfPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
