

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class ModeOfPaymentService {


  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getModeofpayment() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/modeofpayment",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createModeofPayment(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/modeofpayment", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateModeofPayment(params: any,id:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/modeofpayment/" + id, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getByIdStage(opportunityid:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/modeofpayment/"+opportunityid,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}
