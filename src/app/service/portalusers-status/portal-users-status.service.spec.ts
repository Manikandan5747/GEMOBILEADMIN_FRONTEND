import { TestBed } from '@angular/core/testing';

import { PortalUsersStatusService } from './portal-users-status.service';

describe('PortalUsersStatusService', () => {
  let service: PortalUsersStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortalUsersStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
