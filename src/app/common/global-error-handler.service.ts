import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonConstants } from './common.constant';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
    constructor(private injector: Injector) { }
    headers = new HttpHeaders({
        'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    handleError(error: any): void {
        const http = this.injector.get(HttpClient);

        // Build error payload
        const errorPayload = {
            message: error?.message || error.toString(),
            status: 0, // you can set frontend errors to 0
            url: window.location.href,
            module_name: 'AngularClient',
            time: new Date().toISOString(),
            user: localStorage.getItem('username') || 'Anonymous',
            browser: navigator.userAgent,
            created_by: 0
        };

        // Send to backend
        http.post(CommonConstants.WEBAPI_URL +'/api/createerrorlogcreate', errorPayload,{ headers: this.headers })
            .subscribe({
                next: () => console.log('Client error logged to server.'),
                error: (err) => console.error('Error logging failed:', err)
            });

        // Optional: Log to console
        console.error('Client-side error:', error);
    }
}
