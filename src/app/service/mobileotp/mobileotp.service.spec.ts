import { TestBed } from '@angular/core/testing';

import { MobileotpService } from './mobileotp.service';

describe('MobileotpService', () => {
  let service: MobileotpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobileotpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
