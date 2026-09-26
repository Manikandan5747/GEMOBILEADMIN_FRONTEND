import { TestBed } from '@angular/core/testing';

import { AiReportService } from './ai-report.service';

describe('AiReportService', () => {
  let service: AiReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
