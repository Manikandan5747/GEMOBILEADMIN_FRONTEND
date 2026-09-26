import { TestBed } from '@angular/core/testing';

import { ShowroomCategoryService } from './showroom-category.service';

describe('ShowroomCategoryService', () => {
  let service: ShowroomCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowroomCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
