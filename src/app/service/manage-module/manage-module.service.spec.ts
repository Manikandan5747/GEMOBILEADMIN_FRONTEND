import { TestBed } from '@angular/core/testing';

import { ManageModuleService } from './manage-module.service';

describe('ManageModuleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageModuleService = TestBed.get(ManageModuleService);
    expect(service).toBeTruthy();
  });
});
