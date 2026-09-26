import { TestBed } from '@angular/core/testing';

import { LuckDrawService } from './luck-draw.service';

describe('LuckDrawService', () => {
  let service: LuckDrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LuckDrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
