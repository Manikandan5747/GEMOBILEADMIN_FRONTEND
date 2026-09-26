import { TestBed } from '@angular/core/testing';

import { ExportToPDFService } from './export-to-pdf.service';

describe('ExportToPDFService', () => {
  let service: ExportToPDFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportToPDFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
