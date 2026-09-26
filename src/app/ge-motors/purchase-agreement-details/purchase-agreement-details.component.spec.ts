import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseAgreementDetailsComponent } from './purchase-agreement-details.component';

describe('PurchaseAgreementDetailsComponent', () => {
  let component: PurchaseAgreementDetailsComponent;
  let fixture: ComponentFixture<PurchaseAgreementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseAgreementDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseAgreementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
