import { TestBed } from '@angular/core/testing';

import { ModeOfPaymentService } from './mode-of-payment.service';

describe('ModeOfPaymentService', () => {
  let service: ModeOfPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeOfPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
