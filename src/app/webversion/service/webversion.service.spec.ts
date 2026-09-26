import { TestBed } from '@angular/core/testing';

import { WebversionService } from './webversion.service';

describe('WebversionService', () => {
  let service: WebversionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebversionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
