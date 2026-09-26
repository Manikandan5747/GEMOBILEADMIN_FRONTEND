import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class APIKEYInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const login = localStorage.getItem('login');
    var authReq:any={} ;
    if (login) {
        // Clone the request to add the new header.
     authReq = req.clone({
      setHeaders: {
        apikey:  'a4db08b7-5729-4ba9-8c08-f2df493465a1'
      }
    });

    }
  
    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
