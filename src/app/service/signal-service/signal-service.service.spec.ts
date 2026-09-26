import { TestBed } from '@angular/core/testing';

import { SignalServiceService } from './signal-service.service';

describe('SignalServiceService', () => {
  let service: SignalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
