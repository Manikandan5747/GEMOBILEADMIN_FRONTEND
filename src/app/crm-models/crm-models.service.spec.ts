import { TestBed } from '@angular/core/testing';

import { CrmModelsService } from './crm-models.service';

describe('CrmModelsService', () => {
  let service: CrmModelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrmModelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
