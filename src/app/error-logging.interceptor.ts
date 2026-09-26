import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonConstants } from 'src/app/common/common.constant';
import { CookieService } from './service/cookie.service';

@Injectable()
export class ErrorLoggingInterceptor implements HttpInterceptor {

  currentUser: any;
  userDetails: any;
  user_id: any;

  constructor(private http: HttpClient, 
    private cookieService: CookieService
  ) {
    this.initUserDetails();
  }

  private initUserDetails() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.userDetails = this.currentUser ? JSON.parse(this.currentUser) : '';
    this.user_id = this.userDetails[0]?.login_id;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const logEndpoint = CommonConstants.WEBAPI_URL + '/api/createerrorlogs';

    // 🚫 Prevent self-logging
    if (req.url.includes(logEndpoint)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const log = {
          user_id: this.user_id || 'unknown',
          app_type: 'GE Motor',
          endpoint: req.url,
          message: error.message || 'Unknown error',
          session_id: '', // set if available
          device_info: navigator.userAgent,
          log_level: 'error',
          error_code: error.status || null,
          stack_trace: error.error ? JSON.stringify(error.error) : null,
          source: 'interceptor',
          http_status_code: error.status || null,
          created_by: this.user_id || 'unknown',
          app_version: '', // set if available
          err_response: error.error ? JSON.stringify(error.error) : null,
          err_header: error.headers ? JSON.stringify(error.headers) : null,
          icreated_by: this.user_id || 'unknown'
        };

        this.http.post(logEndpoint, log, {
          headers: new HttpHeaders({
            'X-Skip-Logging': 'true',
            'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
            'Content-Type': 'application/json'
          })
        }).subscribe({
          error: () => console.warn('Failed to log error')
        });

        return throwError(() => error);
      })
    );
  }
}
