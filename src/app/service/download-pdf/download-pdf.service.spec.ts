import { TestBed } from '@angular/core/testing';

import { DownloadPdfService } from './download-pdf.service';

describe('DownloadPdfService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DownloadPdfService = TestBed.get(DownloadPdfService);
    expect(service).toBeTruthy();
  });
});
