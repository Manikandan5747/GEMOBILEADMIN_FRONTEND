import { TestBed } from '@angular/core/testing';

import { ErrorLoggingInterceptor } from './error-logging.interceptor';

describe('ErrorLoggingInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ErrorLoggingInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ErrorLoggingInterceptor = TestBed.inject(ErrorLoggingInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
