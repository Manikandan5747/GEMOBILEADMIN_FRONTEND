import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseAgreementComponent } from './purchase-agreement.component';

describe('PurchaseAgreementComponent', () => {
  let component: PurchaseAgreementComponent;
  let fixture: ComponentFixture<PurchaseAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseAgreementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
