import { TestBed } from '@angular/core/testing';

import { CarCityService } from './car-city.service';

describe('CarCityService', () => {
  let service: CarCityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarCityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
