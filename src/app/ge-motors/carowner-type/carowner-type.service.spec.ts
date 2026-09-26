import { TestBed } from '@angular/core/testing';

import { CarownerTypeService } from './carowner-type.service';

describe('CarownerTypeService', () => {
  let service: CarownerTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarownerTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
