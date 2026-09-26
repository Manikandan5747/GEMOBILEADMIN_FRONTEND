import { TestBed } from '@angular/core/testing';

import { ServiceAdvisorService } from './service-advisor.service';

describe('ServiceAdvisorService', () => {
  let service: ServiceAdvisorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceAdvisorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
