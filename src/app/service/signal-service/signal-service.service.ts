import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class SignalServiceService {
  currentUser: any;
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient,) { }

  // getCarModel() {
  //   return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/buycarmodel",{ headers: this.headers })
  //     .pipe(map(response => {
  //       return response;
  //     }));
  // }



  

}