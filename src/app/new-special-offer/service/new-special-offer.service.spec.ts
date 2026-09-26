import { TestBed } from '@angular/core/testing';

import { NewSpecialOfferService } from './new-special-offer.service';

describe('NewSpecialOfferService', () => {
  let service: NewSpecialOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewSpecialOfferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
