import { TestBed } from '@angular/core/testing';

import { RentShowroomCarService } from './rent-showroom-car.service';

describe('RentShowroomCarService', () => {
  let service: RentShowroomCarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentShowroomCarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
