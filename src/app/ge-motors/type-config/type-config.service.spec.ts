import { TestBed } from '@angular/core/testing';

import { TypeConfigService } from './type-config.service';

describe('TypeConfigService', () => {
  let service: TypeConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
