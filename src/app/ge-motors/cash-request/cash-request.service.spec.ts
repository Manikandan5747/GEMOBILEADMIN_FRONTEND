import { TestBed } from '@angular/core/testing';

import { CashRequestService } from './cash-request.service';

describe('CashRequestService', () => {
  let service: CashRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
