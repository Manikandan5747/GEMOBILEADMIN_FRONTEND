import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonConstants } from 'src/app/common/common.constant';
import { CookieService } from './service/cookie.service';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ErrorlogService implements ErrorHandler {

  private apiUrl = CommonConstants.WEBAPI_URL + '/api/appenderrorlogs';
  currentUser: any;
  userDetails: any;
  user_id: any;

  constructor(
    private http: HttpClient,
    private injector: Injector,
    private cookieService: CookieService
  ) {
    this.initUserDetails();
    this.setupResourceErrorListener();
    this.setupPromiseRejectionListener();
  }

  private initUserDetails() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.userDetails = this.currentUser ? JSON.parse(this.currentUser) : '';
    this.user_id = this.userDetails[0]?.login_id;
  }

  handleError(error: any): void {
    const http = this.injector.get(HttpClient);
    const logData = {
      user_id: this.user_id || 'unknown',
      app_type: 'GE Motor',
      endpoint: window.location.href,
      message: error?.message || error.toString(),
      session_id: '',
      device_info: navigator.userAgent,
      log_level: 'runtime-error',
      error_code: null,
      stack_trace: error?.stack || '',
      source: 'global-error-handler',
      http_status_code: null,
      created_by: this.user_id || 'unknown',
      app_version: '',
      err_response: error?.toString(),
      err_header: '',
      icreated_by: this.user_id || 'unknown'
    };

    http.post(this.apiUrl, logData, {
      headers: new HttpHeaders({
        'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
        'Content-Type': 'application/json'
      })
    }).subscribe();


    console.error('Caught by Angular ErrorHandler:', error);
  }

  private setupResourceErrorListener() {
    window.addEventListener('error', (event: any) => {
      if (event.target instanceof HTMLElement) {
        const logData = {
          user_id: this.user_id || 'unknown',
          app_type: 'GE Motor',
          endpoint: window.location.href + ' & Asset path:' + event.target?.href,
          message: 'Resource load error',
          session_id: '',
          device_info: navigator.userAgent,
          log_level: 'resource-load-error',
          error_code: null,
          stack_trace: '',
          source: 'resource',
          http_status_code: null,
          created_by: this.user_id || 'unknown',
          app_version: '',
          err_response: '',
          err_header: '',
          icreated_by: this.user_id || 'unknown'
        };

        this.sendLog(logData);
      }
    }, true);
  }

  private setupPromiseRejectionListener() {
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      const logData = {
        user_id: this.user_id || 'unknown',
        app_type: 'GE Motor',
        endpoint: window.location.href,
        message: event.reason?.message || event.reason?.toString() || 'Unknown promise rejection',
        session_id: '',
        device_info: navigator.userAgent,
        log_level: 'unhandled-promise-rejection',
        error_code: null,
        stack_trace: event.reason?.stack || '',
        source: 'promise',
        http_status_code: null,
        created_by: this.user_id || 'unknown',
        app_version: '',
        err_response: event.reason?.toString() || '',
        err_header: '',
        icreated_by: this.user_id || 'unknown'
      };

      this.sendLog(logData);
    });
  }

  private sendLog(data: any) {
    const http = this.injector.get(HttpClient);
    http.post(this.apiUrl, data, {
      headers: new HttpHeaders({
        'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
        'Content-Type': 'application/json'
      })
    }).subscribe({
      error: err => console.warn('Error logging failed', err)
    });
  }




  logFormErrors(form: FormGroup, formName: string = 'Unnamed Form'): void {
    const invalidFields: string[] = [];

    const findInvalidControls = (control: AbstractControl, path: string = '') => {
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(key => {
          const fullPath = path ? `${path}.${key}` : key;
          findInvalidControls(control.get(key)!, fullPath);
        });
      } else if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });

        if (control.invalid) {
          const errors = control.errors;
          const errorMessages = errors
            ? Object.entries(errors)
              .map(([key, val]) => {
                switch (key) {
                  case 'required':
                    return 'Field is required';
                  case 'email':
                    return 'Invalid email format';
                  case 'min':
                    return `Minimum value is ${val['min']}`;
                  case 'max':
                    return `Maximum value is ${val['max']}`;
                  case 'minlength':
                    return `Minimum length is ${val['requiredLength']}`;
                  case 'maxlength':
                    return `Maximum length is ${val['requiredLength']}`;
                  case 'pattern':
                    return `Invalid format`;
                  default:
                    return `${key}: ${JSON.stringify(val)}`;
                }
              })
              .join(', ')
            : 'Unknown error';

          invalidFields.push(`${path} => ${errorMessages}`);
        }
      }
    };

    findInvalidControls(form);

    if (invalidFields.length > 0) {
      const logMessage = `Validation errors in form "${formName}": ${invalidFields.join(', ')}`;

      const logData = {
        user_id: this.user_id || 'unknown',
        app_type: 'GE Motor',
        endpoint: window.location.href,
        message: logMessage,
        session_id: '',
        device_info: navigator.userAgent,
        log_level: 'form-validation-error',
        error_code: null,
        stack_trace: '',
        source: 'form',
        http_status_code: null,
        created_by: this.user_id || 'unknown',
        app_version: '',
        err_response: '',
        err_header: '',
        icreated_by: this.user_id || 'unknown'
      };

      this.sendLog(logData);
      console.error(logMessage);
    } else {
      console.log(`✅ ${formName} is valid`);
    }
  }


  logManualValidationError(message: string, context: string = 'manual-check'): void {
    const logData = {
      user_id: this.user_id || 'unknown',
      app_type: 'GE Motor',
      endpoint: window.location.href,
      message: message,
      session_id: '',
      device_info: navigator.userAgent,
      log_level: 'form-validation-error',
      error_code: null,
      stack_trace: '',
      source: context,
      http_status_code: null,
      created_by: this.user_id || 'unknown',
      app_version: '',
      err_response: '',
      err_header: '',
      icreated_by: this.user_id || 'unknown'
    };

    this.sendLog(logData);
    console.error(`[Manual Validation Error] ${message}`);
  }
}

