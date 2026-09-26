import { TestBed } from '@angular/core/testing';

import { CorporatePartnersService } from './corporate-partners.service';

describe('CorporatePartnersService', () => {
  let service: CorporatePartnersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorporatePartnersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
